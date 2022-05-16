// 投稿お気に入り

// URI:/api/v1/bookmarked-posts/:post-id
// method:DELETE
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
            "message": "お気に入り削除対象の投稿が存在しません。"
        }
    ],
    "data": null
};
