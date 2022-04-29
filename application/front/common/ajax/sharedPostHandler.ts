import { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import { PostDetail, SharedPost } from '@f/definition/common/sharedPost';
import { SelectItem } from '@f/definition/common/selectItem';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';

export class SharedPostHandler {
  static handleResponse(response: SharedPostGetReponse | null): {
    sharedPosts: SharedPost[];
    no1Divisions: SelectItem[];
  } {
    if (response === null) {
      return {
        sharedPosts: [],
        no1Divisions: [],
      };
    }

    const responsePosts = response.posts;
    const responseDivisions = response.no1Divisions;

    const sharedPosts: SharedPost[] = responsePosts.map((x) => ({
      postId: StringUtil.ifEmpty(x.id),
      companyNumber: StringUtil.ifEmpty(x.companyNumber),
      companyName: StringUtil.ifEmpty(x.companyName),
      companyHomepageUrl: StringUtil.ifEmpty(x.companyHomepageUrl),
      companyImageUrl: StringUtil.ifEmpty(x.companyImageUrl),
      postingUserId: StringUtil.ifEmpty(x.postingUserId),
      postingUserName: StringUtil.ifEmpty(x.postingUserName),
      postingUserIcomImageUrl: StringUtil.ifEmpty(x.postingUserIcomImageUrl),
      isBookmarkedByLoginUser: x.isBookmarkedByLoginUser || false,
      numberOfBookmarks: x.numberOfBookmarks || 0,
      remarks: StringUtil.ifEmpty(x.remarks),
      updatedAt: StringUtil.ifEmpty(x.updatedAt),
      postDetails: x.postDetails.map<PostDetail>((y, index) => ({
        postDetailId: y.id || index,
        no1Content: StringUtil.ifEmpty(y.no1Content),
        no1Division: StringUtil.ifEmpty(y.no1Division),
      })),
    }));

    const no1Divisions: SelectItem[] = responseDivisions?.map((x) => ({
      text: StringUtil.ifEmpty(x.text),
      value: StringUtil.ifEmpty(x.value),
    }));

    return {
      sharedPosts,
      no1Divisions,
    };
  }

  /**
   * 投稿リスト内の更新日時の最後を取得
   */
  public static getOldBaseDateTime(sharedPosts: SharedPost[]): string | null {
    if (ArrayUtil.isEmpty(sharedPosts)) {
      return null;
    }

    const lastPostIndex = sharedPosts.length - 1;
    const lastPost = sharedPosts[lastPostIndex];
    return lastPost.updatedAt;
  }
}
