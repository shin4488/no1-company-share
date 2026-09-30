/** @jest-environment node */

import CompanyMaster from '../../server/common/sequelize/models/companyMaster';
import { CompanyServiceImpl } from '../../server/feature/company/service';

test('画像取得が成功した企業だけを更新しDB書き込みの完了を待つ', async () => {
  const rows = [
    { companyNumber: '1', homepageUrl: 'https://one.example' },
    { companyNumber: '2', homepageUrl: 'https://two.example' },
  ];
  const findAll = jest.spyOn(CompanyMaster, 'findAll').mockResolvedValue(rows);
  let finish;
  const bulkCreate = jest.spyOn(CompanyMaster, 'bulkCreate').mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const openGraphLogic = {
    getOpenGraph: jest
      .fn()
      .mockResolvedValueOnce({ image: 'https://one.example/og.png' })
      .mockResolvedValueOnce({ image: '' }),
  };
  try {
    const service = new CompanyServiceImpl({}, {}, openGraphLogic);
    let completed = false;
    const running = service.updateCompanies().then(() => {
      completed = true;
    });
    await new Promise((resolve) => setImmediate(resolve));
    expect(bulkCreate).toHaveBeenCalledWith(
      [{ ...rows[0], imageUrl: 'https://one.example/og.png' }],
      { updateOnDuplicate: ['imageUrl', 'updatedAt'] },
    );
    expect(completed).toBe(false);
    finish();
    await running;
    expect(completed).toBe(true);
  } finally {
    findAll.mockRestore();
    bulkCreate.mockRestore();
  }
});
