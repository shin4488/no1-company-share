import axios from 'axios';
import jsdom from 'jsdom';
import { lookup } from 'node:dns';
import http from 'node:http';
import https from 'node:https';
import { BlockList, isIP, type LookupFunction } from 'node:net';
import ipaddr from 'ipaddr.js';
import { injectable } from 'inversify';
import { OpenGraphLogic } from './interface/logic';
import { OpenGraphGetResult } from './definition/openGraphGetResult';
import { OpenGraphType } from './definition/openGraphType';
import { StringUtil } from '@c/util/stringUtil';

const maxHtmlBytes = 1_000_000;
const requestTimeoutMs = 5_000;
const maxRedirects = 3;
const blockedNat64 = new BlockList();
blockedNat64.addSubnet('64:ff9b:1::', 48, 'ipv6');

const publicOnlyLookup: LookupFunction = (hostname, options, callback) => {
  lookup(
    hostname,
    { all: true, family: options.family },
    (error, addresses) => {
      if (error) {
        callback(error, '');
        return;
      }
      // 接続時に解決されたすべてのアドレスを確認し、内部宛てを混ぜた応答も拒否する。
      let publicAddressesOnly = false;
      try {
        publicAddressesOnly =
          addresses.length > 0 &&
          addresses.every((item) => {
            const address = ipaddr.parse(item.address);
            return (
              address.range() === 'unicast' &&
              (address.kind() !== 'ipv6' ||
                !blockedNat64.check(item.address, 'ipv6'))
            );
          });
      } catch {
        publicAddressesOnly = false;
      }
      if (!publicAddressesOnly) {
        callback(new Error('A public address is required'), '');
        return;
      }
      if (options.all) {
        callback(null, addresses);
      } else {
        callback(null, addresses[0].address, addresses[0].family);
      }
    },
  );
};

function isAllowedPageUri(pageUri: string): boolean {
  try {
    const url = new URL(pageUri);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !isIP(url.hostname) &&
      url.hostname.includes('.') &&
      (!url.port || ['80', '443'].includes(url.port))
    );
  } catch {
    return false;
  }
}

@injectable()
export class OpenGraphLogicImpl implements OpenGraphLogic {
  public async getOpenGraph(
    pageUri: string,
    ogTypes: OpenGraphType[],
  ): Promise<OpenGraphGetResult> {
    if (StringUtil.isEmpty(pageUri) || !isAllowedPageUri(pageUri)) {
      return {
        image: '',
      };
    }

    // 存在しないURLが指定されているときは、エラーとはせずに空で結果を返却
    let htmlText = '';
    let currentUri = pageUri;
    try {
      for (let redirects = 0; redirects <= maxRedirects; redirects++) {
        if (!isAllowedPageUri(currentUri)) {
          break;
        }
        const axiosResponse = await axios.get<string>(currentUri, {
          timeout: requestTimeoutMs,
          maxRedirects: 0,
          maxContentLength: maxHtmlBytes,
          proxy: false,
          httpAgent: new http.Agent({ lookup: publicOnlyLookup }),
          httpsAgent: new https.Agent({ lookup: publicOnlyLookup }),
          validateStatus: (status) => status >= 200 && status < 400,
        });
        if (axiosResponse.status >= 300) {
          const location = axiosResponse.headers.location;
          if (!location) {
            break;
          }
          currentUri = new URL(location, currentUri).href;
          continue;
        }
        htmlText = axiosResponse.data;
        break;
      }
    } catch {
      // noop
    }

    if (StringUtil.isEmpty(htmlText)) {
      return {
        image: '',
      };
    }

    const appJsdom = new jsdom.JSDOM(htmlText);
    const parser = new appJsdom.window.DOMParser();
    const html = parser.parseFromString(htmlText, 'text/html');
    const htmlHead = html.head;
    const headElement = htmlHead.children;

    const headElements = Array.from(headElement);
    const openGraph: OpenGraphGetResult = this.extractTargetOpenGraph(
      currentUri,
      headElements,
      ogTypes,
    );

    return openGraph;
  }

  /**
   * headタグ内からog:img部分の抽出
   * @param headElements
   * @returns
   */
  private extractTargetOpenGraph(
    pageUri: string,
    headElements: Element[],
    ogTypes: OpenGraphType[],
  ): OpenGraphGetResult {
    // 画像以外のOGを取得する際は、以下の連想配列にターゲットとなるogの指定を増やす
    const propertyMap = {
      [OpenGraphType.IMAGE]: 'og:image',
    };
    const targetProperties: string[] = [];
    ogTypes.forEach((type) => {
      const targetProperty = propertyMap[type];
      targetProperties.push(targetProperty);
    });
    const openGraphResult = {
      image: '',
    };

    headElements.forEach((element) => {
      const property = element.getAttribute('property');
      if (property === null || !targetProperties.includes(property)) {
        return;
      }

      const content = element.getAttribute('content');
      const contentString = StringUtil.ifEmpty(content);
      switch (property) {
        case 'og:image':
          openGraphResult.image = contentString.startsWith('/')
            ? `${pageUri}${contentString}`
            : contentString;
          break;

        default:
          break;
      }
    });

    return openGraphResult;
  }
}
