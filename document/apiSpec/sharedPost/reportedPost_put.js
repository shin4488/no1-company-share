// 投稿報告

// URI:/api/v1/reported-posts/:post-id
// method:PUT
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 「post-id」が存在すればpost-idのレコードのみを更新
// prettier-ignore
const requestBody = {
    "posts": [
        {
            "id": "C000000000001cDYrCmleUFhpDok0klZxvCpZVJt120220515103059999",
            "reportDetail": "虚偽記載"
        }
    ]
};

// prettier-ignore
const responseBody = {
    "messages": [],
    "data": null
};
