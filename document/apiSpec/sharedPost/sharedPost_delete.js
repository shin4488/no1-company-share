// 投稿削除

// URI:/api/v1/shared-posts/:post-id
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

// prettier-ignore
const responseBody = {
    "messages": [],
    "data": null
};
