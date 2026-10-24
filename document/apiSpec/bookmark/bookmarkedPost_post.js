// お気に入り登録

// URI:/api/v1/bookmarked-posts/:post-id
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// URIに「post-id」があれば、リクエストボディよりもURIの投稿IDを優先する
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
            "message": "ログインしてください。"
        },
        // お気に入り対象の投稿が存在しないとき
        {
            "message": "存在する投稿の投稿No.を入力してください。"
        },
        // すでにお気に入り登録しているとき
        {
            "message": "指定した投稿はすでにお気に入り登録済みです。"
        }
    ],
    "data": null
};
