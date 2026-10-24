// 投稿の通報

// URI:/api/v1/reported-shared-posts/
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

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
