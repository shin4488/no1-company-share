// 企業検索

// URI:/api/v1/companies
// method:GET

// prettier-ignore
const requestQueryParameter = {
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
