const assert = require('node:assert/strict');
const axios = require('axios');

// The real Functions Framework loads this stub before loading the deployed entry point.
// All company updates stay in this process; no external API is called.
axios.put = async (url, body, options) => {
  assert.equal(url, 'https://f1c.biz/api/v1/companies/');
  assert.equal(body, undefined);
  assert.equal(options.headers['X-Company-Update-Token'], 'framework-test-secret');
  assert.equal(options.timeout, 45000);
  console.log('FRAMEWORK_TEST_API_CALL');
  if (process.env.FRAMEWORK_TEST_OUTCOME === 'reject') {
    throw new Error('framework-test-secret must not appear in the response or logs');
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
  console.log('FRAMEWORK_TEST_API_FINISHED');
  return {status: 200};
};
