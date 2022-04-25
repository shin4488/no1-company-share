import { injectable } from 'inversify';
import { SharedPostGetReponse } from './definition/sharedPostGetReponse';
import { SharedPostService } from './interface/sharedPostService';

@injectable()
export class SharedPostServiceImpl implements SharedPostService {
  public async getSharedPosts(): Promise<SharedPostGetReponse> {
    const response: SharedPostGetReponse = await {
      posts: [
        {
          id: 'testpost1',
          companyNumber: 'testcompany1',
          companyName: 'テスト株式会社1',
          companyHomepageUrl:
            'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
          companyImageUrl:
            'ttps://upload.wikimedia.org/wikipedia/commons/f/ff/Wikipedia_logo_593.jpg',
          postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
          postingUserName: 'S. U.',
          postingUserIcomImageUrl:
            'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
          isBookmarkedByLoginUser: false,
          numberOfBookmarks: 10,
          remarks: '2020年度3月期有価証券報告書',
          postDetails: [
            {
              id: 1,
              no1Content: '何かを作ること',
              no1Division: '1',
            },
          ],
        },
        {
          id: 'testpost2',
          companyNumber: 'testcompany2',
          companyName: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
          companyHomepageUrl: 'http://example.com/',
          companyImageUrl:
            'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
          postingUserId: 'testuser1',
          postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
          postingUserIcomImageUrl:
            'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
          isBookmarkedByLoginUser: true,
          numberOfBookmarks: 10,
          remarks:
            'http://example.com/ 2020年度3月期有価証券報告書テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト',
          postDetails: [
            {
              id: 1,
              no1Content:
                'テストテストテストテストテストテストテストテストテストテストテストテスト',
              no1Division: '1',
            },
            {
              id: 2,
              no1Content: 'テストテストテスト',
              no1Division: '2',
            },
          ],
        },
        {
          id: 'testpost3',
          companyNumber: 'testcompany3',
          companyName: 'テスト株式会社テスト株式会社テスト株式会社3',
          companyHomepageUrl: 'aaa',
          companyImageUrl: '',
          postingUserId: 'testuser1',
          postingUserName: '山田太郎',
          postingUserIcomImageUrl:
            'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
          isBookmarkedByLoginUser: false,
          numberOfBookmarks: 0,
          remarks: '',
          postDetails: [
            {
              id: 1,
              no1Content: 'テストテストテスト',
              no1Division: '1',
            },
          ],
        },
        {
          id: 'testpost4',
          companyNumber: 'testcompany4',
          companyName: 'テスト株式会社4',
          companyHomepageUrl:
            'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
          companyImageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/f/ff/Wikipedia_logo_593.jpg',
          postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
          postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
          postingUserIcomImageUrl:
            'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
          isBookmarkedByLoginUser: true,
          numberOfBookmarks: 100000,
          remarks: '2020年度3月期有価証券報告書',
          postDetails: [
            {
              id: 1,
              no1Content: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
              no1Division: '1',
            },
            {
              id: 2,
              no1Content: "<script>alert('okok')</script>",
              no1Division: '1',
            },
          ],
        },
      ],
      no1Divisions: [
        {
          text: '世界一',
          value: '1',
        },
        {
          text: '日本一',
          value: '2',
        },
        {
          text: '福井一',
          value: '3',
        },
      ],
    };
    return response;
  }
}
