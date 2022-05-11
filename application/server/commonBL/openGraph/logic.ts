import axios from 'axios';
import jsdom from 'jsdom';
import { injectable } from 'inversify';
import { OpenGraphLogic } from './interface/logic';
import { OpenGraphGetResult } from './definition/openGraphGetResult';
import { OpenGraphType } from './definition/openGraphType';
import { StringUtil } from '@c/util/stringUtil';

@injectable()
export class OpenGraphLogicImpl implements OpenGraphLogic {
  public async getOpenGraph(
    pageUri: string,
    ogTypes: OpenGraphType[],
  ): Promise<OpenGraphGetResult> {
    if (StringUtil.isEmpty(pageUri)) {
      return {
        image: '',
      };
    }

    // 存在しないURLが指定されているときは、エラーとはせずに空で結果を返却
    let htmlText = '';
    try {
      const axiosResponse = await axios.get<string>(pageUri);
      htmlText = axiosResponse.data;
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
      pageUri,
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
