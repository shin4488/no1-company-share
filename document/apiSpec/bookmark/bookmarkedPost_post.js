// お気に入り登録

// URI:/api/v1/bookmarked-posts/:post-id
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 「post-id」が存在すればpost-idのレコードのみをお気に入り
// prettier-ignore
const requestBody = {
    "posts": [
        {
            "id": "C000000000001cDYrCmleUFhpDok0klZxvCpZVJt120220515103059999"
        }
    ]
};

// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのレスポンスボディ
// prettier-ignore
const responseBody = {
    "messages": [],
    "data": null
};

// prettier-ignore
const errorResponseBody = {
    "messages": [
        // base.js記載の「Authorization」にログインユーザIDトークンが無効なとき
        {
            "message": "お気に入り登録するにはログインしてください。"
        },
        // お気に入り対象の投稿が存在しないとき
        {
            "message": "お気に入り対象の投稿が存在しません。"
        }
    ],
    "data": null
};
