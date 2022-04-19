// 共通仕様

// prettier-ignore
const requestHeader = {
    "Authorization": "firebaseのログインユーザIDトークン"
};

// prettier-ignore
const response = {
    // エラーメッセージを送信する際に使用する
    // 複数メッセージを送信可能とする
    "messages": [
        {
            "message": ""
        }
    ],
    // 「responseBodyObject」の中身は各API側で定義する
    "data": "responseBodyObject"
}
