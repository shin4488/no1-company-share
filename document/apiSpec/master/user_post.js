// ユーザ登録

// URI:/api/v1/users
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 「Authorization」ヘッダから取得されるIDトークンに紐づくユーザIDを登録するため、
// リクエストボディなし

// prettier-ignore
const responseBody = {
    "messages": [],
    "data": null
};
