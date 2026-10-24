// @vitest-environment node

import CompanyMaster from '../../server/common/sequelize/models/companyMaster';
import DivisionMaster from '../../server/common/sequelize/models/divisionMaster';
import SharedPost from '../../server/common/sequelize/models/sharedPost';
import { BadParameterErrorHandlerImpl } from '../../server/common/error/handler/badParameterErrorHandler';
import { CompanyLogicImpl } from '../../server/feature/company/logic';
import { CompanyServiceImpl } from '../../server/feature/company/service';
import { SharedPostComplexValidatorImpl } from '../../server/feature/sharedPost/complexValidator';

vi.mock('../../server/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: () => new BadParameterErrorHandlerImpl() },
}));

// 実際のDAOと同じく、指定したユーザー・企業の投稿だけを返す
const postsOf = (posts) => ({
  getNonReportedAliveByUserAndCompanyNumbers: vi.fn((userId, companyNumbers) =>
    Promise.resolve(
      posts.filter(
        (x) => x.userId === userId && companyNumbers.includes(x.companyNumber),
      ),
    ),
  ),
});
const postedByA = [{ userId: 'user-a', companyNumber: '1000000000001' }];

describe('会社検索', () => {
  const searchAs = async (userId, dao) => {
    const externalCompanyLogic = {
      getExternalCompany: () =>
        Promise.resolve({
          companies: [
            { companyNumber: '1000000000001', japaneseName: '株式会社Ａ' },
            { companyNumber: '1000000000002', japaneseName: '株式会社Ｂ' },
          ],
        }),
    };
    const service = new CompanyServiceImpl(
      new CompanyLogicImpl(dao),
      externalCompanyLogic,
      {},
    );
    const response = await service.getCompanies({ companyName: '', userId });
    return response.companies.map((x) => [x.number, x.isPostedByLoginUser]);
  };

  test('自分の投稿がある企業だけを投稿済みにする', async () => {
    const dao = postsOf(postedByA);
    expect(await searchAs('user-a', dao)).toEqual([
      ['1000000000001', true],
      ['1000000000002', false],
    ]);
    expect(await searchAs('user-b', dao)).toEqual([
      ['1000000000001', false],
      ['1000000000002', false],
    ]);
  });

  test('ログインしていなければ、どの企業も投稿済みにしない', async () => {
    const dao = postsOf(postedByA);
    expect(await searchAs('', dao)).toEqual([
      ['1000000000001', false],
      ['1000000000002', false],
    ]);
    expect(dao.getNonReportedAliveByUserAndCompanyNumbers).not.toBeCalled();
  });
});

const post = (companyNumber) => ({
  companyNumber,
  postDetails: [{ no1Content: '県内1位', no1Division: '1' }],
});

describe('投稿の検査', () => {
  const insertAs = (userId, companyNumbers = ['1000000000001']) =>
    new SharedPostComplexValidatorImpl(postsOf(postedByA)).validateForInsert({
      userId,
      posts: companyNumbers.map(post),
    });

  beforeEach(() => {
    vi.spyOn(DivisionMaster, 'findOne').mockResolvedValue({ id: 1 });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('ほかのユーザーの投稿がある企業にも投稿できる', async () => {
    await expect(insertAs('user-b')).resolves.toBeUndefined();
  });

  test('自分の投稿がある企業への2件目の投稿を拒否する', async () => {
    await expect(insertAs('user-a')).rejects.toMatchObject({
      errorMessages: ['同じ企業に関する自分の投稿がすでに存在します。'],
    });
  });

  test('1回の投稿に同じ企業が2件あると拒否する', async () => {
    await expect(
      insertAs('user-b', ['1000000000002', '1000000000002']),
    ).rejects.toMatchObject({
      errorMessages: ['同じ企業に関する投稿が複数含まれています。'],
    });
  });
});

describe('投稿の更新の検査', () => {
  // user-aの投稿 post-1 は企業 1000000000001 のもの
  const stored = {
    id: 'post-1',
    userId: 'user-a',
    companyNumber: '1000000000001',
    isDeleted: false,
    isReported: false,
  };
  const updateWith = (state, companyNumber = '1000000000001') => {
    const record = { ...stored, ...state };
    vi.spyOn(SharedPost, 'findByPk').mockResolvedValue(record);
    vi.spyOn(SharedPost, 'findOne').mockImplementation(({ where }) =>
      Promise.resolve(
        Object.entries(where).every(([key, value]) => record[key] === value)
          ? record
          : null,
      ),
    );
    return new SharedPostComplexValidatorImpl(postsOf([])).validateForUpdate({
      userId: 'user-a',
      posts: [{ id: 'post-1', ...post(companyNumber) }],
    });
  };

  beforeEach(() => {
    vi.spyOn(DivisionMaster, 'findOne').mockResolvedValue({ id: 1 });
    vi.spyOn(CompanyMaster, 'findByPk').mockResolvedValue({});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('会社を変えない更新を受け付ける', async () => {
    await expect(updateWith({})).resolves.toBeUndefined();
  });

  test('投稿の会社の変更を拒否する', async () => {
    await expect(updateWith({}, '1000000000002')).rejects.toMatchObject({
      errorMessages: ['投稿の会社は変更できません。'],
    });
  });

  test.each([
    ['削除された', { isDeleted: true }],
    ['通報された', { isReported: true }],
  ])('%s投稿の更新を、存在しない投稿と同じく拒否する', async (_, state) => {
    await expect(updateWith(state)).rejects.toMatchObject({
      errorMessages: ['存在する投稿の投稿No.を入力してください。'],
    });
  });
});
