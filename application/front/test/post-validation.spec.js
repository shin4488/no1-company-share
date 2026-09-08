import { validationResult } from 'express-validator';
import {
  sharedPostPostSimpleValidators,
  sharedPostGetSimpleValidators,
} from '@s/feature/sharedPost/simpleValidator';

const validPost = () => ({
  companyNumber: '1234567890123',
  companyName: '株式会社テスト',
  companyHomepageUrl: '',
  remarks: '',
  postDetails: [{ no1Content: '県内1位', no1Division: '1' }],
});
async function errors(validators, request) {
  for (const validator of validators) {
    await validator.run(request);
  }
  return validationResult(request).array();
}

describe('共有投稿の入力契約', () => {
  test('任意のURL・詳細が空でも有効な投稿を受け付ける', async () => {
    expect(
      await errors(sharedPostPostSimpleValidators, {
        body: { posts: [validPost()] },
      }),
    ).toEqual([]);
  });
  test.each([12, 14])('法人番号%d桁を拒否する', async (length) => {
    const post = { ...validPost(), companyNumber: '1'.repeat(length) };
    expect(
      (
        await errors(sharedPostPostSimpleValidators, {
          body: { posts: [post] },
        })
      ).some((x) => x.param === 'posts[0].companyNumber'),
    ).toBe(true);
  });
  test.each([
    [100, true],
    [101, false],
  ])('法人名%d文字の境界を守る', async (length, valid) => {
    const post = { ...validPost(), companyName: '会'.repeat(length) };
    expect(
      (
        await errors(sharedPostPostSimpleValidators, {
          body: { posts: [post] },
        })
      ).length === 0,
    ).toBe(valid);
  });
  test.each([
    ['https://example.com/company', true],
    ['not a URL', false],
    ['javascript:alert(1)', false],
  ])('会社URL %s の扱いを維持する', async (url, valid) => {
    const post = { ...validPost(), companyHomepageUrl: url };
    expect(
      (
        await errors(sharedPostPostSimpleValidators, {
          body: { posts: [post] },
        })
      ).length === 0,
    ).toBe(valid);
  });
  test('詳細のない投稿を拒否する', async () => {
    const post = { ...validPost(), postDetails: [] };
    expect(
      (
        await errors(sharedPostPostSimpleValidators, {
          body: { posts: [post] },
        })
      ).length,
    ).toBeGreaterThan(0);
  });
  test('省略された検索条件を許可する', async () => {
    expect(await errors(sharedPostGetSimpleValidators, { query: {} })).toEqual(
      [],
    );
  });
  test.each([
    ['limit', 'abc'],
    ['baseDateTime', 'invalid'],
    ['isMyPostOnly', 'maybe'],
  ])('不正な検索条件 %s を拒否する', async (key, value) => {
    expect(
      (
        await errors(sharedPostGetSimpleValidators, { query: { [key]: value } })
      ).some((x) => x.param === key),
    ).toBe(true);
  });
});
