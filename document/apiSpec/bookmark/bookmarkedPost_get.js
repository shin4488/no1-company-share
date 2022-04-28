// 投稿取得

// URI:/api/v1/bookmarked-posts/:post-id
// method:GET
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 「post-id」が存在すればpost-idのレコードのみを取得
// prettier-ignore
const requestQuery = {
    "limit": 30,
    "baseDateTime": '2022-04-28 10:30:59.999'
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
                "postingUserName": "Taro Yamada",
                "postingUserIcomImageUrl": "http://i1.example.com",
                "numberOfBookmarks": 10,
                "remarks": "テスト備考1",
                "baseDateTime": '2022-04-27 10:30:59.999',
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
        ],
        "no1Divisions": [
            {
                "text": "世界一",
                "value": "1"
            },
            {
                "text": "日本一",
                "value": "2"
            },
            {
                "text": "福井一",
                "value": "3"
            }
        ]
    }
};
