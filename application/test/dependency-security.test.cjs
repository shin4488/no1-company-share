const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const Vue = require('vue');
const { createRenderer } = require('vue-server-renderer');
const { JSDOM } = require('jsdom');

const fromNuxtWebpack = createRequire(require.resolve('@nuxt/webpack'));
const fromTerser = createRequire(
  fromNuxtWebpack.resolve('terser-webpack-plugin'),
);
const serialize = fromTerser('serialize-javascript');

test('SSR embeds state without allowing a posted value to close its script', async () => {
  const state = {
    title: '</script><script>globalThis.injected = true</script>',
  };
  const renderer = createRenderer({
    template: '<html><body><!--vue-ssr-outlet--></body></html>',
  });
  const html = await renderer.renderToString(
    new Vue({ render: (h) => h('main', '企業一覧') }),
    { state },
  );
  assert.match(html, /企業一覧/);
  const dom = new JSDOM(html);
  const scripts = dom.window.document.querySelectorAll('script');
  assert.equal(scripts.length, 1);
  const sandbox = { window: {} };
  vm.runInNewContext(scripts[0].textContent, sandbox);
  dom.window.close();
  assert.equal(
    JSON.stringify(sandbox.window.__INITIAL_STATE__),
    JSON.stringify(state),
  );
  assert.equal(sandbox.injected, undefined);
});

test('Terser serialization preserves regular expressions, dates and functions', () => {
  const value = {
    pattern: /company/gi,
    date: new Date('2026-01-01T00:00:00Z'),
    transform: (value) => value + 1,
  };
  const restored = vm.runInNewContext(`(${serialize(value)})`);
  assert.equal(restored.pattern.source, 'company');
  assert.equal(restored.pattern.flags, 'gi');
  assert.equal(restored.date.toISOString(), '2026-01-01T00:00:00.000Z');
  assert.equal(restored.transform(2), 3);
});

for (const kind of ['RegExp', 'Date']) {
  test(`serialization cannot execute code from spoofed ${kind} values`, () => {
    const payload = '"+(globalThis.injected=true)+"';
    const value = Object.create(
      kind === 'RegExp' ? RegExp.prototype : Date.prototype,
    );
    value.toJSON = () => 'placeholder';
    if (kind === 'RegExp') {
      Object.defineProperties(value, {
        source: { value: 'x' },
        flags: { value: payload },
      });
    } else {
      value.toISOString = () => payload;
    }
    const sandbox = {};
    try {
      vm.runInNewContext(`(${serialize({ value })})`, sandbox);
    } catch (error) {
      // Rejecting a spoofed value is also safe; evaluation must not run its code.
      assert.ok(
        ['TypeError', 'SyntaxError', 'RangeError'].includes(error.name),
      );
    }
    assert.equal(sandbox.injected, undefined);
  });
}

test('Nuxt build cache still writes and reads content', async (t) => {
  const cache = fromTerser('cacache');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'no1-cache-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  await cache.put(dir, 'asset.js', 'console.log("cached")');
  assert.equal(
    (await cache.get(dir, 'asset.js')).data.toString(),
    'console.log("cached")',
  );
});

test('the tar dependency supports archive creation and extraction', async (t) => {
  const fromCache = createRequire(fromTerser.resolve('cacache'));
  const tar = fromCache('tar');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'no1-tar-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const source = path.join(dir, 'source');
  const destination = path.join(dir, 'destination');
  fs.mkdirSync(source);
  fs.mkdirSync(destination);
  fs.writeFileSync(path.join(source, 'asset.txt'), '企業情報');
  const file = path.join(dir, 'assets.tgz');
  await tar.c({ cwd: source, file, gzip: true }, ['asset.txt']);
  await tar.x({ cwd: destination, file });
  assert.equal(
    fs.readFileSync(path.join(destination, 'asset.txt'), 'utf8'),
    '企業情報',
  );
});

test('external-editor can create, read and clean up its temporary file', () => {
  const { ExternalEditor } = require('external-editor');
  const editor = new ExternalEditor('企業情報', {
    prefix: 'no1-editor-',
    mode: 0o600,
  });
  try {
    assert.equal(fs.readFileSync(editor.tempFile, 'utf8'), '企業情報');
    assert.equal(fs.statSync(editor.tempFile).mode & 0o777, 0o600);
  } finally {
    editor.cleanup();
  }
  assert.equal(fs.existsSync(editor.tempFile), false);
});

test('Youch cookie parsing remains compatible and invalid cookie names are rejected', () => {
  const cookie = createRequire(require.resolve('@nuxtjs/youch'))('cookie');
  assert.equal(
    cookie.parse('session=abc; name=%E4%BC%81%E6%A5%AD').name,
    '企業',
  );
  assert.equal(cookie.parse('session=abc').session, 'abc');
  assert.throws(
    () => cookie.serialize('name; injected=value', 'test'),
    TypeError,
  );
});
