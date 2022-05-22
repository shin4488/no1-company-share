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
        // すでにこの会社が投稿されているか
        "isRegistered": true
      },
      {
        "number": "C000000000002",
        "name": "テスト2株式会社",
        "isRegistered": false
      }
    ]
  }
};
