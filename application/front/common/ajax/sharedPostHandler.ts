import { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import { PostDetail, SharedPost } from '@f/definition/common/sharedPost';
import { SelectItem } from '@f/definition/common/selectItem';
import { StringUtil } from '@c/util/stringUtil';

export class SharedPostHandler {
  static handleResponse(response: SharedPostGetReponse | null): {
    sharedCompanyPosts: SharedPost[];
    no1Divisions: SelectItem[];
  } {
    if (response === null) {
      return {
        sharedCompanyPosts: [],
        no1Divisions: [],
      };
    }

    const responsePosts = response.posts;
    const responseDivisions = response.no1Divisions;

    const sharedCompanyPosts: SharedPost[] = responsePosts.map((x) => ({
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
      sharedCompanyPosts,
      no1Divisions,
    };
  }
}
