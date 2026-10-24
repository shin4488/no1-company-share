// 投稿登録

// URI:/api/v1/shared-posts/
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能
// 同じユーザーが同じ企業について持てる投稿（削除・通報されていないもの）は1件。同じ企業を1回の要求に2件以上含めることもできない

// prettier-ignore
const requestBody = {
    "posts": [
        {
            // 外部システムにとっての投稿を識別するキー項目
            "key": "C0001",
            // postingUserIdは「Authorization」ヘッダから取得可能であるためリクエストボディでは送ってもらわない
            "companyNumber": "C000000000001",
            "companyName": "テスト1株式会社",
            "companyHomepageUrl": "http://1.example.com",
            "remarks": "テスト備考1",
            "postDetails": [
                {
                    "key": "1",
                    "no1Content": "xxx",
                    "no1Division": 1
                },
                {
                    "key": "2",
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
                "key": "C0001",
                "id": "C000000000001cDYrCmleUFhpDok0klZxvCpZVJt120220515103059999",
                "updatedAt": "2022-05-15T01:30:59.999Z",
            }
        ]
    }
};

// prettier-ignore
const errorResponseBody = {
    "messages": [
        // 同じ企業について、自分の投稿（削除・通報されていないもの）がすでにあるとき
        {
            "message": "同じ企業に関する自分の投稿がすでに存在します。"
        },
        // 「posts」に同じ法人番号が2件以上あるとき
        {
            "message": "同じ企業に関する投稿が複数含まれています。"
        }
    ],
    "data": null
};
