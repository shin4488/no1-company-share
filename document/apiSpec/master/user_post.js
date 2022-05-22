// ユーザ登録

// URI:/api/v1/users
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 「Authorization」ヘッダから取得されるIDトークンに紐づくユーザIDを登録するため、
// prettier-ignore
const requestBody = {
    "iconImageUrl": "http://example.com",
    "displayedName": "Taro Yamada"
};

// prettier-ignore
const responseBody = {
    "messages": [],
    "data": null
};
