// @vitest-environment node

import DivisionMaster from '../../server/common/sequelize/models/divisionMaster';
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

describe('投稿の検査', () => {
  const insertAs = (userId) =>
    new SharedPostComplexValidatorImpl(postsOf(postedByA)).validateForInsert({
      userId,
      posts: [
        {
          companyNumber: '1000000000001',
          postDetails: [{ no1Content: '県内1位', no1Division: '1' }],
        },
      ],
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
});
