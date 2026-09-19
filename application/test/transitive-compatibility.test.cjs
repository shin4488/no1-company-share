const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { createRequire } = require('node:module');
const { test } = require('node:test');

test('Nuxt loading screen merges custom settings with defaults in development', async () => {
  const hooks = {};
  const options = {
    dev: true,
    build: { loadingScreen: { colors: { primary: '#123456' } } },
    router: { base: '/company/' },
    serverMiddleware: [],
  };
  const nuxt = { options, hook: (name, callback) => (hooks[name] = callback) };
  require('@nuxt/loading-screen').call({ options, nuxt });
  assert.equal(options.build.loadingScreen.baseURL, '/company/_loading');
  assert.equal(options.build.loadingScreen.altPort, false);
  assert.deepEqual(options.build.loadingScreen.colors, { primary: '#123456' });
  assert.equal(options.serverMiddleware[0].path, '/_loading');
  await hooks.close();
});

test('defu preserves nested defaults and ignores prototype pollution input', () => {
  const defu = createRequire(require.resolve('@nuxt/loading-screen'))('defu');
  assert.deepEqual(
    defu(
      { colors: { primary: 'blue' } },
      { colors: { primary: 'red', text: 'black' } },
    ),
    {
      colors: { primary: 'blue', text: 'black' },
    },
  );
  const result = defu(JSON.parse('{"__proto__":{"isAdmin":true}}'), {
    isAdmin: false,
  });
  assert.equal(result.isAdmin, false);
  assert.equal({}.isAdmin, undefined);
});

test('Vue scoped CSS compilation preserves selectors, keyframes and source maps', () => {
  const { compileStyle } = require('@vue/component-compiler-utils');
  const result = compileStyle({
    source:
      '.card:hover { animation: fade 1s; color: red } @keyframes fade { to { opacity: 1 } }',
    filename: 'Card.vue',
    id: 'data-v-test',
    scoped: true,
    postcssOptions: { map: { inline: false, annotation: false } },
  });
  assert.deepEqual(result.errors, []);
  assert.match(result.code, /\.card\[data-v-test\]:hover/);
  assert.match(result.code, /animation: fade-data-v-test 1s/);
  assert.match(result.code, /@keyframes fade-data-v-test/);
  assert.ok(result.map.sources.includes('Card.vue'));
  const invalid = compileStyle({
    source: '.card {',
    filename: 'Invalid.vue',
    id: 'data-v-test',
  });
  assert.equal(invalid.errors.length, 1);
});

test('Webpack preserves side-effectful files selected by globs', () => {
  const {
    moduleHasSideEffects,
  } = require('webpack/lib/optimize/SideEffectsFlagPlugin');
  assert.equal(moduleHasSideEffects('./style.css', '*.css'), true);
  assert.equal(moduleHasSideEffects('./nested/style.css', '*.css'), true);
  assert.equal(
    moduleHasSideEffects('./entry.js', ['*.css', './entry.js']),
    true,
  );
  assert.equal(
    moduleHasSideEffects('./unused.js', ['*.css', './entry.js']),
    false,
  );
  assert.equal(
    moduleHasSideEffects('./nested/view.vue', '**/*.{js,vue}'),
    true,
  );
});

test(
  'legacy watcher expands globs, excludes ignored paths and detects edits',
  { timeout: 10000 },
  async (t) => {
    const fromWatchpack = createRequire(require.resolve('watchpack-chokidar2'));
    const chokidar = fromWatchpack('chokidar');
    const dir = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'no1-watch-test-')),
    );
    fs.mkdirSync(path.join(dir, 'ignored'));
    for (const name of ['a.js', 'b.vue', 'c.ts', 'ignored/d.js']) {
      fs.writeFileSync(path.join(dir, name), 'initial');
    }
    const watcher = chokidar.watch('**/*.{js,vue}', {
      cwd: dir,
      ignored: '**/ignored/**',
      usePolling: true,
      interval: 20,
    });
    t.after(async () => {
      await watcher.close();
      fs.rmSync(dir, { recursive: true, force: true });
    });
    const found = [];
    watcher.on('add', (name) => found.push(name));
    await once(watcher, 'ready', { signal: AbortSignal.timeout(5000) });
    assert.deepEqual(found.sort(), ['a.js', 'b.vue']);
    const changed = once(watcher, 'change', {
      signal: AbortSignal.timeout(5000),
    });
    fs.writeFileSync(path.join(dir, 'b.vue'), 'updated content');
    assert.equal((await changed)[0], 'b.vue');
  },
);

test('Sequelize keeps generating valid v1 and v4 UUID defaults', () => {
  const { Utils, DataTypes } = require('sequelize');
  const uuid = createRequire(require.resolve('sequelize'))('uuid');
  for (const [Type, version] of [
    [DataTypes.UUIDV1, 1],
    [DataTypes.UUIDV4, 4],
  ]) {
    const values = Array.from({ length: 20 }, () =>
      Utils.toDefaultValue(new Type()),
    );
    assert.equal(new Set(values).size, values.length);
    for (const value of values) {
      assert.equal(uuid.validate(value), true);
      assert.equal(uuid.version(value), version);
    }
  }
  assert.throws(
    () => uuid.v5('company', uuid.v5.DNS, new Uint8Array(8)),
    RangeError,
  );
});

test('Gaxios builds multipart requests without changing UUID boundaries', async () => {
  const { Gaxios } = require('gaxios');
  let captured;
  const client = new Gaxios({
    adapter: async (options) => {
      let body = '';
      for await (const chunk of options.body) {
        body += chunk;
      }
      captured = { headers: options.headers, body };
      return {
        config: options,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: 'ok',
      };
    },
  });
  await client.request({
    url: 'https://example.invalid/upload',
    method: 'POST',
    multipart: [
      { headers: { 'Content-Type': 'text/plain' }, content: 'company' },
    ],
  });
  const boundary = captured.headers['Content-Type'].split('boundary=')[1];
  assert.match(boundary, /^[0-9a-f-]{36}$/);
  assert.ok(captured.body.includes(`--${boundary}\r\n`));
  assert.ok(captured.body.includes('company'));
  assert.ok(captured.body.includes(`--${boundary}--`));
});
