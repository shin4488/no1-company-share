import * as functions from 'firebase-functions/v1';
import axios from 'axios';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const scheduledCompanyMasterUpdate = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    const httpResponse = await axios.put(
      'https://f1c.jp.net/api/v1/companies/',
    );
    functions.logger.info(httpResponse);
  });

export { scheduledCompanyMasterUpdate };
