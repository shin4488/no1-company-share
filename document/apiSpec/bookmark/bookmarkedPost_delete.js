// お気に入り削除

// URI:/api/v1/bookmarked-posts/:post-id
// method:DELETE
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

// エラーなしのとき
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
        // 削除対象の投稿が存在しないとき
        {
            "message": "存在する投稿の投稿No.を入力してください。"
        },
        // 削除対象の投稿をお気に入り登録していないとき
        {
            "message": "指定した投稿はお気に入り未登録です。"
        }
    ],
    "data": null
};
