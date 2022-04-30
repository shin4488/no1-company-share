import axios from 'axios';
import jsdom from 'jsdom';
import { injectable } from 'inversify';
import { OpenGraphLogic } from './interface/logic';
import { ArrayUtil } from '@c/util/arrayUtil';
import { StringUtil } from '@c/util/stringUtil';

@injectable()
export class OpenGraphLogicImpl implements OpenGraphLogic {
  public async getOpenGraphImageUri(pageUri: string): Promise<string> {
    const axiosResponse = await axios.get<string>(pageUri);
    const htmlText = axiosResponse.data;
    const appJsdom = new jsdom.JSDOM(htmlText);
    const parser = new appJsdom.window.DOMParser();
    const html = parser.parseFromString(htmlText, 'text/html');
    const htmlHead = html.head;
    const headElement = htmlHead.children;

    const headElements = Array.from(headElement);
    // TODO:画像以外のOG取得となった際にOGデータ用のオブジェクトを配列を返却するようにする
    const ogImageUris: string[] = this.extractOpenGraphImage(headElements);

    return ArrayUtil.isNotEmpty(ogImageUris) ? ogImageUris[0] : '';
  }

  /**
   * headタグ内からog:img部分の抽出
   * @param headElements
   * @returns
   */
  private extractOpenGraphImage(headElements: Element[]): string[] {
    return headElements
      .filter((element) => {
        const property = element.getAttribute('property');
        return property === 'og:image';
      })
      .map((element) => {
        const content = element.getAttribute('content');
        return StringUtil.ifEmpty(content);
      });
  }
}
