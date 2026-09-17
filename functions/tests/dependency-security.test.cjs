const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createRequire } = require("node:module");
const { test } = require("node:test");

const fromCli = createRequire(require.resolve("firebase-tools"));
const { parse } = fromCli("csv-parse");

test("Firebase auth CSV import preserves quoted fields and batching without contacting Firebase", async (t) => {
  const importer = require("firebase-tools/lib/accountImporter");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "no1-csv-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, "users.csv");
  const records = Array.from(
    { length: 1001 },
    (_, index) =>
      `user-${index},user${index}@example.invalid,true,,,"企業, ${index}"`
  );
  fs.writeFileSync(file, records.join("\r\n"));
  let captured;
  t.mock.method(
    importer,
    "serialImportUsers",
    async (project, hashOptions, batches) => {
      captured = { project, batches };
      return { imported: 1001 };
    }
  );
  const { command } = require("firebase-tools/lib/commands/auth-import");
  const result = await command.actionFn(file, { project: "demo-test" });
  assert.deepEqual(result, { imported: 1001 });
  assert.equal(captured.project, "demo-test");
  assert.deepEqual(
    captured.batches.map((batch) => batch.length),
    [1000, 1]
  );
  assert.equal(captured.batches[0][0].displayName, "企業, 0");
  assert.equal(captured.batches[0][0].emailVerified, true);
  assert.equal(captured.batches[1][0].localId, "user-1000");
});

test("duplicate __proto__ CSV headers cannot replace record prototypes", async () => {
  const records = [];
  const parser = parse({ columns: true, group_columns_by_name: true });
  parser.end("__proto__,__proto__,name\na,b,company\n");
  for await (const record of parser) {
    records.push(record);
  }
  assert.equal(Object.getPrototypeOf(records[0]), Object.prototype);
  assert.equal(records[0].name, "company");
  assert.deepEqual(records[0].__proto__, ["a", "b"]);
});

test("Firebase analytics creates a v4 client ID without sending events", () => {
  const analytics = require("universal-analytics");
  const uuid = createRequire(require.resolve("universal-analytics"))("uuid");
  const visitor = analytics("UA-0-0");
  assert.equal(uuid.validate(visitor.cid), true);
  assert.equal(uuid.version(visitor.cid), 4);
});

test("CLI Gaxios UUID generation supports v4 and rejects short v5 output buffers", () => {
  const uuid = createRequire(fromCli.resolve("gaxios"))("uuid");
  assert.equal(uuid.version(uuid.v4()), 4);
  assert.throws(
    () => uuid.v5("company", uuid.v5.DNS, new Uint8Array(8)),
    RangeError
  );
});
