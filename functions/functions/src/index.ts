import * as functions from 'firebase-functions/v1';
import axios, {isAxiosError} from 'axios';

const scheduledCompanyMasterUpdate = functions
  .runWith({secrets: ['COMPANY_UPDATE_SECRET'], timeoutSeconds: 120})
  .pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    const secret = process.env.COMPANY_UPDATE_SECRET;
    if (!secret) {
      throw new Error('Company update secret is unavailable');
    }
    try {
      const httpResponse = await axios.put(
        'https://f1c.biz/api/v1/companies/',
        undefined,
        {headers: {'X-Company-Update-Token': secret}, timeout: 45000},
      );
      functions.logger.info('Company image update completed', {
        status: httpResponse.status,
      });
    } catch (error) {
      // Axiosの例外には認証ヘッダーが含まれ得るため、そのままログに出さない。
      const status = isAxiosError(error) ? error.response?.status : undefined;
      functions.logger.error('Company image update failed', {status});
      // eslint-disable-next-line preserve-caught-error -- 認証ヘッダーを含み得るAxiosの例外をcauseとして記録させない
      throw new Error('Company image update failed');
    }
  });

export { scheduledCompanyMasterUpdate };
