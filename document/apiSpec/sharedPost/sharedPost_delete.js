// 投稿削除

// URI:/api/v1/shared-posts/:post-id
// method:DELETE
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 「post-id」が存在すればpost-idのレコードのみを削除
// prettier-ignore
const requestBody = {
    "posts": [
        {
            "id": "C000000000001cDYrCmleUFhpDok0klZxvCpZVJt120220515103059999"
        }
    ]
};

// prettier-ignore
const responseBody = {
    "messages": [],
    "data": null
};
