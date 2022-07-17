import * as functions from 'firebase-functions';
import axios from 'axios';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const scheduledCompanyMasterUpdate = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (_context) => {
    const httpResponse = await axios.put(
      'https://f1c.jp.net/api/v1/companies/',
    );
    functions.logger.info(httpResponse);
  });

export { scheduledCompanyMasterUpdate };
