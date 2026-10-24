// 投稿更新

// URI:/api/v1/shared-posts/:post-id
// method:PUT
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 「post-id」が存在すればpost-idのレコードのみを更新
// 投稿の会社は変更できないため、「companyNumber」には投稿の法人番号を指定する。削除・通報された投稿は更新できない
// prettier-ignore
const requestBody = {
    "posts": [
        {
            "id": "C000000000001cDYrCmleUFhpDok0klZxvCpZVJt120220515103059999",
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
                "updatedAt": "2022-05-15T01:30:59.999Z"
            }
        ]
    }
};

// prettier-ignore
const errorResponseBody = {
    "messages": [
        // 投稿が存在しないとき、または削除・通報されているとき
        {
            "message": "存在する投稿の投稿No.を入力してください。"
        },
        // 「companyNumber」が投稿の法人番号と異なるとき
        {
            "message": "投稿の会社は変更できません。"
        },
        // 投稿したユーザ以外が更新しようとしたとき
        {
            "message": "投稿したユーザのみが編集できます。"
        }
    ],
    "data": null
};
