// ユーザ登録

// URI:/api/v1/users
// method:POST
// base.js記載の「Authorization」にログインユーザIDトークンが有効なときのみ使用可能

// 登録するユーザIDは「Authorization」ヘッダのIDトークンから取得するため、リクエストボディには含めない
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
