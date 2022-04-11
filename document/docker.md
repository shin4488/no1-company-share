# PostgreSQL
```
The files belonging to this database system will be owned by user “postgres”.
This user must also own the server process.
```

```
# psql
perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
        LANGUAGE = (unset),
        LC_ALL = (unset),
        LANG = "ja_JP.utf8"
    are supported and installed on your system.
```



https://stackoverflow.com/questions/41956994/initdb-bin-invalid-locale-settings-check-lang-and-lc-environment-variables

```
initdb: error: invalid locale settings; check LANG and LC_* environment variables
```
解決法：環境変数でエンコーディング・ロケール指定する
https://www.ikkitang1211.site/entry/docker_postgres_initdb_args

```dockerfile
ENV POSTGRES_INITDB_ARGS "--encoding=UTF-8 --locale=C"
```

## node.js
```
CMD ["yarn", "dev"]
```

```
error Couldn't find a package.json file in "/"
```

https://qiita.com/yakamazu/items/9d8bcba02f48a2ae022e#cmd

```
permission denied: unknown
```


```
 => ERROR [8/8] RUN yarn install                                                               102.5s
------
 > [8/8] RUN yarn install:
#12 7.135 yarn install v1.22.18
#12 8.146 [1/4] Resolving packages...
#12 10.91 [2/4] Fetching packages...
#12 100.5 error webpack-dev-middleware@4.3.0: The engine "node" is incompatible with this module. Expected version ">= v10.23.3". Got "10.19.0"
#12 100.6 error Found incompatible module.
#12 100.6 info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
```

dockerコンテにインストールしたnode.jsのバージョンが古いとこうなる？
https://github.com/nodesource/distributions


```
 => ERROR [ 7/11] RUN apt install -y npm                                                         3.9s
------
 > [ 7/11] RUN apt install -y npm:
#10 0.664
#10 0.664 WARNING: apt does not have a stable CLI interface. Use with caution in scripts.
#10 0.664
#10 0.733 Reading package lists...
#10 2.850 Building dependency tree...
#10 3.149 Reading state information...
#10 3.606 Some packages could not be installed. This may mean that you have
#10 3.606 requested an impossible situation or if you are using the unstable
#10 3.606 distribution that some required packages have not yet been created
#10 3.606 or been moved out of Incoming.
#10 3.606 The following information may help to resolve the situation:
#10 3.606
#10 3.606 The following packages have unmet dependencies:
#10 3.796  npm : Depends: nodejs (>= 6.11~)
#10 3.796        Depends: node-abbrev (>= 1.1.1~) but it is not going to be installed
#10 3.796        Depends: node-ajv but it is not going to be installed
#10 3.796        Depends: node-ansi but it is not going to be installed
#10 3.796        Depends: node-ansi-regex (>= 3.0~) but it is not going to be installed
#10 3.798        Depends: node-ansi-styles but it is not going to be installed
#10 3.798        Depends: node-ansistyles but it is not going to be installed
#10 3.799        Depends: node-aproba but it is not going to be installed
#10 3.799        Depends: node-archy (>= 1.0~) but it is not going to be installed
#10 3.799        Depends: node-are-we-there-yet but it is not going to be installed
#10 3.799        Depends: node-asap but it is not going to be installed
#10 3.799        Depends: node-asn1 but it is not going to be installed
#10 3.799        Depends: node-assert-plus but it is not going to be installed
#10 3.799        Depends: node-asynckit but it is not going to be installed
#10 3.799        Depends: node-aws4 but it is not going to be installed
#10 3.799        Depends: node-aws-sign2 but it is not going to be installed
#10 3.799        Depends: node-balanced-match but it is not going to be installed
#10 3.799        Depends: node-bcrypt-pbkdf but it is not going to be installed
#10 3.799        Depends: node-bl but it is not going to be installed
#10 3.799        Depends: node-bluebird but it is not going to be installed
#10 3.799        Depends: node-boxen but it is not going to be installed
#10 3.799        Depends: node-brace-expansion but it is not going to be installed
#10 3.799        Depends: node-builtin-modules but it is not going to be installed
#10 3.799        Depends: node-builtins but it is not going to be installed
#10 3.799        Depends: node-cacache but it is not going to be installed
#10 3.799        Depends: node-call-limit but it is not going to be installed
#10 3.799        Depends: node-camelcase but it is not going to be installed
#10 3.799        Depends: node-caseless but it is not going to be installed
#10 3.799        Depends: node-chalk but it is not going to be installed
#10 3.799        Depends: node-chownr but it is not going to be installed
#10 3.799        Depends: node-ci-info but it is not going to be installed
#10 3.800        Depends: node-cli-boxes but it is not going to be installed
#10 3.800        Depends: node-cliui but it is not going to be installed
#10 3.800        Depends: node-clone but it is not going to be installed
#10 3.800        Depends: node-co but it is not going to be installed
#10 3.800        Depends: node-color-convert but it is not going to be installed
#10 3.800        Depends: node-color-name but it is not going to be installed
#10 3.800        Depends: node-colors but it is not going to be installed
#10 3.800        Depends: node-columnify but it is not going to be installed
#10 3.800        Depends: node-combined-stream but it is not going to be installed
#10 3.800        Depends: node-concat-map but it is not going to be installed
#10 3.800        Depends: node-concat-stream but it is not going to be installed
#10 3.800        Depends: node-config-chain but it is not going to be installed
#10 3.800        Depends: node-configstore but it is not going to be installed
#10 3.800        Depends: node-console-control-strings but it is not going to be installed
#10 3.800        Depends: node-copy-concurrently but it is not going to be installed
#10 3.800        Depends: node-core-util-is but it is not going to be installed
#10 3.800        Depends: node-cross-spawn but it is not going to be installed
#10 3.800        Depends: node-crypto-random-string but it is not going to be installed
#10 3.800        Depends: node-cyclist but it is not going to be installed
#10 3.800        Depends: node-dashdash but it is not going to be installed
#10 3.800        Depends: node-debug but it is not going to be installed
#10 3.800        Depends: node-decamelize but it is not going to be installed
#10 3.800        Depends: node-deep-extend but it is not going to be installed
#10 3.800        Depends: node-defaults but it is not going to be installed
#10 3.800        Depends: node-define-properties but it is not going to be installed
#10 3.800        Depends: node-delayed-stream but it is not going to be installed
#10 3.800        Depends: node-delegates but it is not going to be installed
#10 3.800        Depends: node-detect-indent but it is not going to be installed
#10 3.800        Depends: node-detect-newline but it is not going to be installed
#10 3.800        Depends: node-dot-prop but it is not going to be installed
#10 3.800        Depends: node-duplexer3 but it is not going to be installed
#10 3.800        Depends: node-duplexify but it is not going to be installed
#10 3.800        Depends: node-ecc-jsbn but it is not going to be installed
#10 3.800        Depends: node-editor but it is not going to be installed
#10 3.800        Depends: node-encoding but it is not going to be installed
#10 3.800        Depends: node-end-of-stream but it is not going to be installed
#10 3.800        Depends: node-err-code but it is not going to be installed
#10 3.800        Depends: node-errno but it is not going to be installed
#10 3.800        Depends: node-es6-promise but it is not going to be installed
#10 3.800        Depends: node-escape-string-regexp but it is not going to be installed
#10 3.800        Depends: node-execa but it is not going to be installed
#10 3.800        Depends: node-extend but it is not going to be installed
#10 3.800        Depends: node-extsprintf but it is not going to be installed
#10 3.800        Depends: node-fast-deep-equal but it is not going to be installed
#10 3.800        Depends: node-find-up but it is not going to be installed
#10 3.800        Depends: node-flush-write-stream but it is not going to be installed
#10 3.800        Depends: node-forever-agent but it is not going to be installed
#10 3.800        Depends: node-form-data but it is not going to be installed
#10 3.805        Depends: node-from2 but it is not going to be installed
#10 3.805        Depends: node-fs.realpath but it is not going to be installed
#10 3.805        Depends: node-fs-vacuum but it is not going to be installed
#10 3.805        Depends: node-fs-write-stream-atomic but it is not going to be installed
#10 3.805        Depends: node-function-bind but it is not going to be installed
#10 3.805        Depends: node-gauge but it is not going to be installed
#10 3.805        Depends: node-genfun but it is not going to be installed
#10 3.805        Depends: node-get-caller-file but it is not going to be installed
#10 3.805        Depends: node-getpass but it is not going to be installed
#10 3.805        Depends: node-glob (>= 7.1.2~) but it is not going to be installed
#10 3.805        Depends: node-got but it is not going to be installed
#10 3.805        Depends: node-graceful-fs (>= 4.1.11~) but it is not going to be installed
#10 3.805        Depends: node-gyp (>= 3.6.2~) but it is not going to be installed
#10 3.805        Depends: node-har-schema but it is not going to be installed
#10 3.805        Depends: node-har-validator but it is not going to be installed
#10 3.805        Depends: node-has-flag but it is not going to be installed
#10 3.805        Depends: node-has-unicode but it is not going to be installed
#10 3.805        Depends: node-hosted-git-info (>= 2.6~) but it is not going to be installed
#10 3.805        Depends: node-http-signature but it is not going to be installed
#10 3.805        Depends: node-iconv-lite but it is not going to be installed
#10 3.805        Depends: node-iferr but it is not going to be installed
#10 3.805        Depends: node-import-lazy but it is not going to be installed
#10 3.805        Depends: node-imurmurhash but it is not going to be installed
#10 3.805        Depends: node-inflight but it is not going to be installed
#10 3.805        Depends: node-inherits (>= 2.0.3~) but it is not going to be installed
#10 3.805        Depends: node-ini (>= 1.3.5~) but it is not going to be installed
#10 3.805        Depends: node-invert-kv but it is not going to be installed
#10 3.805        Depends: node-ip but it is not going to be installed
#10 3.805        Depends: node-ip-regex but it is not going to be installed
#10 3.805        Depends: node-isarray but it is not going to be installed
#10 3.805        Depends: node-isexe but it is not going to be installed
#10 3.805        Depends: node-is-npm but it is not going to be installed
#10 3.805        Depends: node-is-obj but it is not going to be installed
#10 3.805        Depends: node-is-path-inside but it is not going to be installed
#10 3.805        Depends: node-is-retry-allowed but it is not going to be installed
#10 3.805        Depends: node-is-stream but it is not going to be installed
#10 3.805        Depends: node-isstream but it is not going to be installed
#10 3.805        Depends: node-is-typedarray but it is not going to be installed
#10 3.805        Depends: node-jsbn but it is not going to be installed
#10 3.805        Depends: node-jsonparse but it is not going to be installed
#10 3.805        Depends: node-json-parse-better-errors but it is not going to be installed
#10 3.805        Depends: node-json-schema but it is not going to be installed
#10 3.805        Depends: node-json-schema-traverse but it is not going to be installed
#10 3.805        Depends: node-jsonstream (>= 1.3.2~) but it is not going to be installed
#10 3.805        Depends: node-json-stringify-safe but it is not going to be installed
#10 3.805        Depends: node-jsprim but it is not going to be installed
#10 3.805        Depends: node-latest-version but it is not going to be installed
#10 3.805        Depends: node-lazy-property but it is not going to be installed
#10 3.805        Depends: node-lcid but it is not going to be installed
#10 3.805        Depends: node-libnpx but it is not going to be installed
#10 3.805        Depends: node-locate-path but it is not going to be installed
#10 3.805        Depends: node-lodash but it is not going to be installed
#10 3.805        Depends: node-lockfile (>= 1.0.3~) but it is not going to be installed
#10 3.805        Depends: node-lowercase-keys but it is not going to be installed
#10 3.805        Depends: node-lru-cache (>= 4.1.1~) but it is not going to be installed
#10 3.805        Depends: node-make-dir but it is not going to be installed
#10 3.805        Depends: node-mem but it is not going to be installed
#10 3.805        Depends: node-mime but it is not going to be installed
#10 3.805        Depends: node-mime-types but it is not going to be installed
#10 3.805        Depends: node-mimic-fn but it is not going to be installed
#10 3.805        Depends: node-minimatch but it is not going to be installed
#10 3.805        Depends: node-minimist but it is not going to be installed
#10 3.805        Depends: node-mississippi but it is not going to be installed
#10 3.805        Depends: node-mkdirp (>= 0.5.1~) but it is not going to be installed
#10 3.805        Depends: node-move-concurrently but it is not going to be installed
#10 3.805        Depends: node-ms but it is not going to be installed
#10 3.805        Depends: node-mute-stream but it is not going to be installed
#10 3.805        Depends: node-nopt but it is not going to be installed
#10 3.805        Depends: node-normalize-package-data (>= 2.4~) but it is not going to be installed
#10 3.805        Depends: node-npm-bundled but it is not going to be installed
#10 3.805        Depends: node-npm-package-arg (>= 6.1.1) but it is not going to be installed
#10 3.805        Depends: node-npmlog (>= 4.1.2~) but it is not going to be installed
#10 3.805        Depends: node-number-is-nan but it is not going to be installed
#10 3.805        Depends: node-oauth-sign but it is not going to be installed
#10 3.805        Depends: node-object-assign but it is not going to be installed
#10 3.805        Depends: node-once (>= 1.4~) but it is not going to be installed
#10 3.805        Depends: node-opener but it is not going to be installed
#10 3.805        Depends: node-osenv (>= 0.1.5~) but it is not going to be installed
#10 3.805        Depends: node-os-locale but it is not going to be installed
#10 3.805        Depends: node-os-tmpdir but it is not going to be installed
#10 3.805        Depends: node-package-json but it is not going to be installed
#10 3.805        Depends: node-parallel-transform but it is not going to be installed
#10 3.805        Depends: node-path-exists but it is not going to be installed
#10 3.805        Depends: node-path-is-absolute but it is not going to be installed
#10 3.805        Depends: node-path-is-inside but it is not going to be installed
#10 3.805        Depends: node-promise-inflight but it is not going to be installed
#10 3.805        Depends: node-promise-retry but it is not going to be installed
#10 3.805        Depends: node-promzard but it is not going to be installed
#10 3.805        Depends: node-performance-now but it is not going to be installed
#10 3.805        Depends: node-p-finally but it is not going to be installed
#10 3.805        Depends: node-p-is-promise but it is not going to be installed
#10 3.805        Depends: node-pify but it is not going to be installed
#10 3.805        Depends: node-p-limit but it is not going to be installed
#10 3.805        Depends: node-p-locate but it is not going to be installed
#10 3.805        Depends: node-prepend-http but it is not going to be installed
#10 3.805        Depends: node-process-nextick-args but it is not going to be installed
#10 3.805        Depends: node-proto-list but it is not going to be installed
#10 3.805        Depends: node-prr but it is not going to be installed
#10 3.805        Depends: node-pseudomap but it is not going to be installed
#10 3.805        Depends: node-psl but it is not going to be installed
#10 3.805        Depends: node-pump but it is not going to be installed
#10 3.805        Depends: node-pumpify but it is not going to be installed
#10 3.805        Depends: node-punycode but it is not going to be installed
#10 3.805        Depends: node-qs but it is not going to be installed
#10 3.805        Depends: node-qw but it is not going to be installed
#10 3.805        Depends: node-rc but it is not going to be installed
#10 3.805        Depends: node-read (>= 1.0.7~) but it is not going to be installed
#10 3.805        Depends: node-readable-stream but it is not going to be installed
#10 3.805        Depends: node-read-package-json (>= 2.0.13~) but it is not going to be installed
#10 3.805        Depends: node-registry-auth-token but it is not going to be installed
#10 3.805        Depends: node-registry-url but it is not going to be installed
#10 3.805        Depends: node-request (>= 2.83~) but it is not going to be installed
#10 3.805        Depends: node-require-main-filename but it is not going to be installed
#10 3.805        Depends: node-require-directory but it is not going to be installed
#10 3.805        Depends: node-resolve-from (>= 4.0~) but it is not going to be installed
#10 3.805        Depends: node-retry (>= 0.10.1~) but it is not going to be installed
#10 3.805        Depends: node-rimraf (>= 2.6.2~) but it is not going to be installed
#10 3.805        Depends: node-run-queue but it is not going to be installed
#10 3.805        Depends: node-safe-buffer but it is not going to be installed
#10 3.805        Depends: node-semver (>= 5.5~) but it is not going to be installed
#10 3.805        Depends: node-set-blocking but it is not going to be installed
#10 3.805        Depends: node-sha (>= 2.0.1~) but it is not going to be installed
#10 3.805        Depends: node-shebang-command but it is not going to be installed
#10 3.805        Depends: node-shebang-regex but it is not going to be installed
#10 3.805        Depends: node-signal-exit but it is not going to be installed
#10 3.805        Depends: node-slide (>= 1.1.6~) but it is not going to be installed
#10 3.805        Depends: node-sorted-object but it is not going to be installed
#10 3.805        Depends: node-slash but it is not going to be installed
#10 3.805        Depends: node-semver-diff but it is not going to be installed
#10 3.805        Depends: node-spdx-correct but it is not going to be installed
#10 3.805        Depends: node-spdx-exceptions but it is not going to be installed
#10 3.805        Depends: node-spdx-expression-parse but it is not going to be installed
#10 3.805        Depends: node-spdx-license-ids but it is not going to be installed
#10 3.805        Depends: node-sshpk but it is not going to be installed
#10 3.805        Depends: node-ssri but it is not going to be installed
#10 3.805        Depends: node-stream-each but it is not going to be installed
#10 3.805        Depends: node-stream-iterate but it is not going to be installed
#10 3.805        Depends: node-stream-shift but it is not going to be installed
#10 3.805        Depends: node-strict-uri-encode but it is not going to be installed
#10 3.805        Depends: node-string-decoder but it is not going to be installed
#10 3.805        Depends: node-string-width but it is not going to be installed
#10 3.805        Depends: node-strip-ansi (>= 4.0~) but it is not going to be installed
#10 3.805        Depends: node-strip-json-comments but it is not going to be installed
#10 3.805        Depends: node-strip-eof but it is not going to be installed
#10 3.805        Depends: node-supports-color but it is not going to be installed
#10 3.805        Depends: node-tar (>= 4.4~) but it is not going to be installed
#10 3.805        Depends: node-term-size but it is not going to be installed
#10 3.805        Depends: node-text-table but it is not going to be installed
#10 3.805        Depends: node-through but it is not going to be installed
#10 3.805        Depends: node-through2 but it is not going to be installed
#10 3.805        Depends: node-timed-out but it is not going to be installed
#10 3.805        Depends: node-tough-cookie but it is not going to be installed
#10 3.805        Depends: node-tunnel-agent but it is not going to be installed
#10 3.805        Depends: node-tweetnacl but it is not going to be installed
#10 3.805        Depends: node-typedarray but it is not going to be installed
#10 3.805        Depends: node-uid-number but it is not going to be installed
#10 3.805        Depends: node-unique-filename but it is not going to be installed
#10 3.805        Depends: node-unique-string but it is not going to be installed
#10 3.805        Depends: node-unpipe but it is not going to be installed
#10 3.805        Depends: node-url-parse-lax but it is not going to be installed
#10 3.805        Depends: node-util-deprecate but it is not going to be installed
#10 3.805        Depends: node-uuid but it is not going to be installed
#10 3.805        Depends: node-validate-npm-package-name but it is not going to be installed
#10 3.805        Depends: node-verror but it is not going to be installed
#10 3.805        Depends: node-which (>= 1.3~) but it is not going to be installed
#10 3.805        Depends: node-which-module but it is not going to be installed
#10 3.805        Depends: node-wide-align but it is not going to be installed
#10 3.805        Depends: node-widest-line but it is not going to be installed
#10 3.805        Depends: node-wrap-ansi but it is not going to be installed
#10 3.805        Depends: node-wrappy but it is not going to be installed
#10 3.805        Depends: node-wcwidth.js but it is not going to be installed
#10 3.805        Depends: node-write-file-atomic but it is not going to be installed
#10 3.805        Depends: node-xdg-basedir but it is not going to be installed
#10 3.805        Depends: node-xtend but it is not going to be installed
#10 3.805        Depends: node-yargs but it is not going to be installed
#10 3.805        Depends: node-yargs-parser but it is not going to be installed
#10 3.805        Depends: node-yallist but it is not going to be installed
#10 3.805        Depends: node-y18n but it is not going to be installed
#10 3.832 E: Unable to correct problems, you have held broken packages.
------
```

解決策：以下を削除（Node.jsインストールした時点でnpmもインストールされる）
```
RUN apt install -y npm
```

yarn install遅い問題
https://tkkm.tokyo/post-495/
