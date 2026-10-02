const { readFile } = require('node:fs/promises');
const { isIP } = require('node:net');
const { createPrivateKey } = require('node:crypto');
const { generate } = require('selfsigned');

async function resolveCertificate(input) {
  const options = typeof input === 'object' && input !== null ? input : {};
  if (options.key && options.cert) {
    const readPem = (value) =>
      value.startsWith('--') ? value : readFile(value, 'utf8');
    return {
      key: await readPem(options.key),
      cert: await readPem(options.cert),
      passphrase: options.passphrase,
    };
  }
  if (options.pfx) {
    // Node's OpenSSL parser handles PKCS#12 directly, including its certificate
    // chain. Never parse attacker-controlled ASN.1 with node-forge.
    return { pfx: await readFile(options.pfx), passphrase: options.passphrase };
  }

  const attributes = [
    { name: 'commonName', value: options.commonName || 'localhost' },
    { name: 'countryName', value: options.countryCode || 'US' },
    { name: 'ST', value: options.state || 'Michigan' },
    { name: 'localityName', value: options.locality || 'Berkley' },
    { name: 'organizationName', value: options.organization || 'Testing Corp' },
    {
      name: 'OU',
      value: options.organizationalUnit || 'IT department',
    },
  ];
  if (options.emailAddress) {
    attributes.push({
      name: '1.2.840.113549.1.9.1',
      value: options.emailAddress,
    });
  }
  const notBeforeDate = new Date();
  const notAfterDate = new Date(notBeforeDate);
  notAfterDate.setDate(notAfterDate.getDate() + (options.validityDays ?? 1));
  const common = {
    keySize: options.bits ?? 2048,
    algorithm: 'sha256',
    notBeforeDate,
    notAfterDate,
  };
  const ca = await generate(attributes, {
    ...common,
    passphrase: options.signingKeyPassphrase,
    extensions: [
      { name: 'basicConstraints', cA: true, critical: true },
      { name: 'keyUsage', keyCertSign: true, critical: true },
    ],
  });
  const caKey = createPrivateKey({
    key: ca.private,
    passphrase: options.signingKeyPassphrase,
  }).export({ format: 'pem', type: 'pkcs8' });
  const domains = Array.isArray(options.domains)
    ? options.domains
    : ['localhost', '127.0.0.1', '::1'];
  const leaf = await generate(attributes, {
    ...common,
    ca: { key: caKey, cert: ca.cert },
    passphrase: options.passphrase,
    extensions: [
      { name: 'basicConstraints', cA: false, critical: true },
      {
        name: 'keyUsage',
        digitalSignature: true,
        keyEncipherment: true,
        critical: true,
      },
      { name: 'extKeyUsage', serverAuth: true, clientAuth: true },
      {
        name: 'subjectAltName',
        altNames: domains.map((domain) =>
          isIP(domain) ? { type: 7, ip: domain } : { type: 2, value: domain },
        ),
      },
    ],
  });
  return { key: leaf.private, cert: leaf.cert, passphrase: options.passphrase };
}

module.exports = { resolveCertificate };
