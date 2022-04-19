// 投稿登録

// URI:/api/v1/shared-posts/
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// prettier-ignore
const requestBody = {
    "posts": [
        {
            // postingUserIdは「Authorization」ヘッダから取得可能であるためリクエストボディでは送ってもらわない
            "companyNumber": "C000000000001",
            "companyName": "テスト1株式会社",
            "companyHomepageUrl": "http://1.example.com",
            "remarks": "テスト備考1",
            "postDetails": [
                {
                    "no1Content": "xxx",
                    "no1Division": 1
                },
                {
                    "no1Content": "yyy",
                    "no1Division": 2
                }
            ]
        }
    ]
};

// prettier-ignore
const responseBody = {
    "messages": [],
    "data": {
        "posts": [
            {
                "id": "C000000000001cDYrCmleUFhpDok0klZxvCpZVJt120220515103059999",
                "postDetails": [
                    {
                        "id": 1
                    },
                    {
                        "id": 2
                    }
                ]
            }
        ]
    }
};
