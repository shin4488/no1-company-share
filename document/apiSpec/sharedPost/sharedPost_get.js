// 投稿取得

// URI:/api/v1/shared-posts/:post-id
// method:GET

// 「post-id」が存在すればpost-idのレコードのみを取得
// prettier-ignore
const requestQuery = {
    "limit": 30,
    // この時刻以前のデータを取得（これがないとページング時に取得結果のデータが1ページ目の2ページ目で整合性合わなくなる時あり）
    "baseDateTime": "2022-04-31 10:30:59.999",
    // base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能
    "isMyPostOnly": false
};

// prettier-ignore
const responseBody = {
    "messages": [],
    "data": {
        "posts": [
            {
                "id": "C000000000001cDYrCmleUFhpDok0klZxvCpZVJt120220515103059999",
                "companyNumber": "C000000000001",
                "companyName": "テスト1株式会社",
                "companyHomepageUrl": "http://1.example.com",
                "companyImageUrl": "http://11.example.com",
                "postingUserId": "cDYrCmleUFhpDok0klZxvCpZVJt1",
                "postingUserName": "Taro Yamada",
                "postingUserIcomImageUrl": "http://i1.example.com",
                "isBookmarkedByLoginUser": false,
                "numberOfBookmarks": 10,
                "remarks": "テスト備考1",
                "updatedAt": '2022-04-27 10:30:59.999',
                "postDetails": [
                    {
                        "id": 1,
                        "no1Content": "xxx",
                        "no1Division": "1"
                    },
                    {
                        "id": 2,
                        "no1Content": "yyy",
                        "no1Division": "2"
                    }
                ]
            }
        ]
    }
};
