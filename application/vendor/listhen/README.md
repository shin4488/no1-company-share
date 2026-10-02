# listhen native TLS patch

Nuxt CLI and Nitro currently require listhen 1.10.1, which depends on node-forge 1.4.0. GHSA-86w9-cpqp-85rv affects that version and has no published fix. The application resolves listhen to this local package to remove the vulnerable dependency rather than suppressing the alert.

`upstream.tgz` is the original MIT-licensed [listhen 1.10.1 npm archive](https://registry.npmjs.org/listhen/-/listhen-1.10.1.tgz). `patch.cjs` verifies its published SHA-512 integrity, extracts its runtime and declarations offline, and replaces the certificate helper in both ESM and CommonJS entry points. The package version remains the actual upstream version; this is a maintained local patch, not an upstream release. Listener, CLI, watcher and WebSocket code remain upstream code.

PEM and PFX files use Node's TLS/OpenSSL implementation. Generated development certificates use selfsigned 5.5.0 (Node WebCrypto and @peculiar/x509) with RSA/SHA-256, the existing validity and SAN options, and optional encrypted keys. Production continues to use the existing HTTP listener behind its proxy.

Run `yarn install --frozen-lockfile` with install scripts enabled (or run `yarn prepare:tls` after an install with `--ignore-scripts`), then `yarn test:dependencies`, `yarn lint`, `yarn test` and `yarn build`. The tests exercise HTTP, HTTPS, PEM and PFX inputs, invalid keys, ESM/CommonJS exports, and confirm node-forge is absent. Remove this override when upstream listhen offers equivalent functionality without the vulnerable dependency; regenerate the lockfile and rerun those checks.
