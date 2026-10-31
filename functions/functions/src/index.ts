import {logger} from 'firebase-functions';
import {defineSecret} from 'firebase-functions/params';
import {onSchedule} from 'firebase-functions/v2/scheduler';
import axios, {isAxiosError} from 'axios';

const companyUpdateSecret = defineSecret('COMPANY_UPDATE_SECRET');

const scheduledCompanyMasterUpdate = onSchedule(
  {
    schedule: '0 0 * * *',
    timeZone: 'Asia/Tokyo',
    secrets: [companyUpdateSecret],
    timeoutSeconds: 120,
  },
  async () => {
    const secret = companyUpdateSecret.value();
    if (!secret) {
      throw new Error('Company update secret is unavailable');
    }
    try {
      const httpResponse = await axios.put(
        'https://f1c.biz/api/v1/companies/',
        undefined,
        {headers: {'X-Company-Update-Token': secret}, timeout: 45000},
      );
      logger.info('Company image update completed', {
        status: httpResponse.status,
      });
    } catch (error) {
      // Axiosの例外には認証ヘッダーが含まれ得るため、そのままログに出さない。
      const status = isAxiosError(error) ? error.response?.status : undefined;
      logger.error('Company image update failed', {status});
      // eslint-disable-next-line preserve-caught-error -- 認証ヘッダーを含み得るAxiosの例外をcauseとして記録させない
      throw new Error('Company image update failed');
    }
  },
);

export { scheduledCompanyMasterUpdate };
