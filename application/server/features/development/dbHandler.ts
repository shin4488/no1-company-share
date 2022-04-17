import express from 'express';
import { FirebaseAuth } from '@s/commons/middleware/firebaseAuth';
import CompanyMaster from '@s/commons/sequelize/models/companyMaster';

export const [dbHandlerEndpoint, handleDatabase] = [
  '/api/v1/development1',
  async (_req: express.Request, res: express.Response) => {
    const instance = new FirebaseAuth('ccdd');
    const result = instance.validateToken();
    console.log(result);

    try {
      console.log('会社取得（findAll）');
      const records = await CompanyMaster.findAll();
      console.log(records);

      console.log('会社作成（create）');
      const user1 = await CompanyMaster.create({
        companyNumber: `alice${records.length}`,
        companyName: 'husigi',
        homepageUrl: '23fghh',
      });
      console.log(user1);

      console.log('会社取得（findOne）');
      const company = await CompanyMaster.findOne({
        where: { companyNumber: `alice${records.length}` },
      });
      if (company !== null) {
        company.homepageUrl = `20qwer.com${records.length}`;
        await company.save();
      }
      console.log(company);

      console.log('会社取得（findAll）');
      const records2 = await CompanyMaster.findAll<CompanyMaster>();
      console.log(records2);
      res.send({ companies: records2 });
    } catch (e) {
      console.log(e);
    }
  },
];
