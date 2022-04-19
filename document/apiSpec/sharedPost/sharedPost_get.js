// 投稿取得

// URI:/api/v1/shared-posts/:post-id
// method:GET

// 「post-id」が存在すればpost-idのレコードのみを取得
// prettier-ignore
const requestQuery = {
    "limit": 30,
    "offset": 61,
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
                "postingUserId": "cDYrCmleUFhpDok0klZxvCpZVJt1",
                "isReported": false,
                "remarks": "テスト備考1",
                "postDetails": [
                    {
                        "id": 1,
                        "no1Content": "xxx",
                        "no1Division": 1
                    },
                    {
                        "id": 2,
                        "no1Content": "yyy",
                        "no1Division": 2
                    }
                ]
            }
        ]
    }
};
