// 企業検索

// URI:/api/v1/companies
// method:GET

// prettier-ignore
const requestQueryParameter = {
  // 入力欄が空のときも空文字で指定する
  "companyName": "テス"
};

// prettier-ignore
const responseBody = {
  "messages": [],
  "data": {
    "companies": [
      {
        // 法人番号
        "number": "C000000000001",
        "name": "テスト1株式会社",
        // base.js記載の「Authorization」のログインユーザが、この会社の投稿（通報・削除されていないもの）をすでに持っているか。未ログイン時はfalse
        "isPostedByLoginUser": true
      },
      {
        "number": "C000000000002",
        "name": "テスト2株式会社",
        "isPostedByLoginUser": false
      }
    ]
  }
};

// prettier-ignore
const errorResponseBody = {
  "messages": [
    // 「companyName」がないとき、または複数あるとき
    {
      "message": "会社名は文字を入力してください。"
    }
  ],
  "data": null
};
