// @vitest-environment node
import 'reflect-metadata';
import express, { json } from 'express';
import { appContainer } from '../../server/common/dependencyInjection/inversify.config';
import { types } from '../../server/common/dependencyInjection/types';
import { ApiResponseHandlerImpl } from '../../server/common/apiResponse/apiResponseHandler';
import { catchError } from '../../server/common/middleware/appErrorHandler';
import { sharedPostRouter } from '../../server/feature/sharedPost/controller';

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: () => Promise.resolve({ uid: 'user-a' }),
  }),
}));
vi.mock('../../server/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: vi.fn() },
}));

// ルート、入力検査、エラー変換は本物を使い、DBを使うサービスだけを差し替える
const service = {
  insertSharedPosts: vi.fn(),
  getAliveSharedPosts: vi.fn(),
};
let server;
let base;

beforeAll(async () => {
  const app = express();
  app.use(json());
  app.use('/api/v1', sharedPostRouter);
  app.use(catchError);
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});
beforeEach(() => {
  vi.clearAllMocks();
  service.insertSharedPosts.mockResolvedValue({ posts: [] });
  service.getAliveSharedPosts.mockResolvedValue({ posts: [] });
  appContainer.get.mockImplementation((type) => {
    if (type === types.ApiResponseHandler) {
      return new ApiResponseHandlerImpl();
    }
    if (type === types.LogHandler) {
      return { error: vi.fn() };
    }
    if (type === types.SharedPostService) {
      return service;
    }
    throw new Error(`Unexpected dependency ${String(type)}`);
  });
});
afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const validPost = () => ({
  companyNumber: '1234567890123',
  companyName: '株式会社テスト',
  companyHomepageUrl: '',
  remarks: '',
  postDetails: [{ no1Content: '県内1位', no1Division: '1' }],
});
async function postSharedPost(post) {
  const response = await fetch(`${base}/shared-posts/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer test-token',
    },
    body: JSON.stringify({ posts: [post] }),
  });
  return {
    status: response.status,
    messages: (await response.json()).messages,
  };
}
const accepted = { status: 200, messages: [] };
const rejected = (message) => ({ status: 400, messages: [{ message }] });

describe('共有投稿の入力契約', () => {
  test('任意のURL・詳細が空でも有効な投稿を受け付ける', async () => {
    expect(await postSharedPost(validPost())).toEqual(accepted);
    expect(service.insertSharedPosts).toHaveBeenCalledTimes(1);
  });

  test.each([12, 14])('法人番号%d桁を拒否する', async (length) => {
    expect(
      await postSharedPost({
        ...validPost(),
        companyNumber: '1'.repeat(length),
      }),
    ).toEqual(rejected('法人番号:13文字で入力してください。'));
    expect(service.insertSharedPosts).not.toHaveBeenCalled();
  });

  test.each([
    [100, accepted],
    [101, rejected('法人名:100文字以下で入力してください。')],
  ])('法人名%d文字の境界を守る', async (length, expected) => {
    expect(
      await postSharedPost({
        ...validPost(),
        companyName: '会'.repeat(length),
      }),
    ).toEqual(expected);
  });

  test.each([
    ['https://example.com/company', accepted],
    [
      'not a URL',
      rejected('会社ホームページURL:有効なURLを入力してください。'),
    ],
    [
      'javascript:alert(1)',
      rejected('会社ホームページURL:有効なURLを入力してください。'),
    ],
  ])('会社URL %s の扱いを維持する', async (url, expected) => {
    expect(
      await postSharedPost({ ...validPost(), companyHomepageUrl: url }),
    ).toEqual(expected);
  });

  test('詳細のない投稿を拒否する', async () => {
    expect(await postSharedPost({ ...validPost(), postDetails: [] })).toEqual(
      rejected('投稿詳細:必須項目です。'),
    );
    expect(service.insertSharedPosts).not.toHaveBeenCalled();
  });

  test('省略された検索条件を許可する', async () => {
    const response = await fetch(`${base}/shared-posts/`);
    expect(response.status).toBe(200);
    expect(service.getAliveSharedPosts).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['limit', 'abc', '取得件数上限:数字を入力してください。'],
    ['baseDateTime', 'invalid', '取得基準日時:日時形式で入力してください。'],
    [
      'isMyPostOnly',
      'maybe',
      'ログインユーザの投稿のみ:真理値を入力してください。',
    ],
  ])('不正な検索条件 %s を拒否する', async (key, value, message) => {
    const response = await fetch(
      `${base}/shared-posts/?${new URLSearchParams({ [key]: value })}`,
    );
    expect(response.status).toBe(400);
    expect((await response.json()).messages).toEqual([{ message }]);
    expect(service.getAliveSharedPosts).not.toHaveBeenCalled();
  });
});
