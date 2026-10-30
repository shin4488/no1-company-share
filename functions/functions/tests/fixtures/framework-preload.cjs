const axios = require('axios');

// The real Functions Framework loads this stub before loading the deployed entry point.
// Requests stop at the Axios adapter, so no external API is called.
axios.defaults.adapter = async (config) => {
  const request = {
    method: config.method,
    url: config.url,
    hasToken:
      config.headers.get('X-Company-Update-Token') === 'framework-test-secret',
  };
  console.log(`FRAMEWORK_TEST_API_CALL ${JSON.stringify(request)}`);
  if (process.env.FRAMEWORK_TEST_OUTCOME === 'reject') {
    // Axios errors keep the sent headers, including the secret.
    throw new axios.AxiosError(
      'Request failed with status code 503',
      axios.AxiosError.ERR_BAD_RESPONSE,
      config,
      null,
      { status: 503, data: '', headers: {}, config },
    );
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
  console.log('FRAMEWORK_TEST_API_FINISHED');
  return { status: 200, data: '', headers: {}, config };
};
