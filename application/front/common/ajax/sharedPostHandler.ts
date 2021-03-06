import { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import { PostDetail, SharedPost } from '@f/definition/common/sharedPost';
import { SelectItem } from '@f/definition/common/selectItem';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';
import { ApiSelectItem } from '@f/definition/common/apiSpec/selectItem';
import { BookmarkGetReponse } from '@f/definition/pages/bookmark/apiSpec/bookmarkGetResponse';

export class SharedPostHandler {
  static handleDivisionResponse(
    responseSelectItem: ApiSelectItem[] | null | undefined,
  ): SelectItem[] {
    if (ArrayUtil.isEmpty(responseSelectItem)) {
      return [];
    }

    return (responseSelectItem as ApiSelectItem[]).map<SelectItem>((x) => ({
      text: StringUtil.ifEmpty(x.text),
      value: StringUtil.ifEmpty(x.value),
    }));
  }

  static handleResponse(
    response: SharedPostGetReponse | BookmarkGetReponse | null,
  ): {
    sharedPosts: SharedPost[];
  } {
    if (response === null) {
      return { sharedPosts: [] };
    }

    const responsePosts = response.posts;
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

    return { sharedPosts };
  }

  /**
   * ???????????????????????????????????????????????????
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
