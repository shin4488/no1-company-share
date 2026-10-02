const { createHash } = require('node:crypto');
const { readFileSync, writeFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');
const tar = require('tar');

// Reconstruct the unmodified upstream package offline, then replace ONLY its
// TLS implementation. Do not accept a different tarball or silently skip a patch.
const archive = join(__dirname, 'upstream.tgz');
const expected =
  '6nt/86SkqUQSLW1ofz8MxC6RhRMqOl3ONISe6qqvJ3xj09aJWQx6DhgSZpugs3PX4PXdOas/WD6A9jx6J2N19A==';
if (
  createHash('sha512').update(readFileSync(archive)).digest('base64') !==
  expected
) {
  throw new Error('Unexpected listhen upstream archive');
}
const allowed = (name) => /^package\/(dist|bin|lib)\//.test(name);
tar.x({ file: archive, cwd: __dirname, strip: 1, sync: true, filter: allowed });

function patchDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      patchDirectory(path);
    } else if (/\.(mjs|cjs)$/.test(entry.name)) {
      let source = readFileSync(path, 'utf8');
      if (source.includes('async function resolveCertificate(options)')) {
        const start = source.indexOf(
          'async function resolveCertificate(options)',
        );
        const end = source.indexOf('async function listen(handle,', start);
        if (end < start) {
          throw new Error('Unexpected listhen TLS implementation');
        }
        const replacement = entry.name.endsWith('.mjs')
          ? "import { resolveCertificate } from '../../native-tls.cjs';\n\n"
          : "const { resolveCertificate } = require('../../native-tls.cjs');\n\n";
        source = source.slice(0, start) + replacement + source.slice(end);
      }
      source = source.replace(
        /^.*(?:from 'node-forge'|import 'node-forge'|require\('node-forge'\)|_interopDefaultCompat\(forge\)).*\n/gm,
        '',
      );
      if (/\bforge(?:__default)?\b/.test(source)) {
        throw new Error('Unpatched node-forge reference');
      }
      writeFileSync(path, source);
    }
  }
}
patchDirectory(join(__dirname, 'dist'));
