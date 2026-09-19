const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createRequire } = require("node:module");
const { test } = require("node:test");

const fromCli = createRequire(require.resolve("firebase-tools"));
const { parse } = fromCli("csv-parse");

const fromPubsub = createRequire(fromCli.resolve("@google-cloud/pubsub"));
const telemetryApi = fromPubsub("@opentelemetry/api");
const { W3CBaggagePropagator } = fromPubsub("@opentelemetry/core");

test("incoming baggage retains normal entries and bounds oversized input", () => {
  const propagator = new W3CBaggagePropagator();
  const extract = (baggage) => {
    const context = propagator.extract(
      telemetryApi.ROOT_CONTEXT,
      { baggage },
      telemetryApi.defaultTextMapGetter
    );
    return telemetryApi.propagation.getBaggage(context)?.getAllEntries() ?? [];
  };
  assert.deepEqual(extract("company=example,region=jp"), [
    ["company", { value: "example" }],
    ["region", { value: "jp" }],
  ]);
  for (const input of [
    Array.from({ length: 1000 }, (_, i) => `k${i}=v`).join(","),
    `company=${"x".repeat(100000)}`,
  ]) {
    const entries = extract(input);
    assert.ok(entries.length <= 180);
    assert.ok(
      entries.every(
        ([key, entry]) => key.length + entry.value.length + 1 <= 4096
      )
    );
    assert.ok(
      entries.reduce(
        (sum, [key, entry]) => sum + key.length + entry.value.length + 2,
        0
      ) <= 8193
    );
  }
});

test("Firebase PubSub still propagates trace context without network access", (t) => {
  const pubsub = fromCli("@google-cloud/pubsub");
  const tracing = fromPubsub("./telemetry-tracing.js");
  const enabled = tracing.isEnabled();
  tracing.setGloballyEnabled(true);
  t.after(() => tracing.setGloballyEnabled(enabled));
  const spanContext = {
    traceId: "1234567890abcdef1234567890abcdef",
    spanId: "1234567890abcdef",
    traceFlags: 1,
  };
  const message = { attributes: { company: "example" } };
  tracing.injectSpan({ spanContext: () => spanContext }, message);
  assert.equal(
    message.attributes.googclient_traceparent,
    "00-1234567890abcdef1234567890abcdef-1234567890abcdef-01"
  );
  assert.equal(message.attributes.company, "example");
  assert.equal(
    typeof new pubsub.PubSub({ projectId: "demo-test" }).topic("test")
      .publishMessage,
    "function"
  );
});

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

test("PubSub publishes and reports RPC failures with the updated telemetry core", async (t) => {
  const { PubSub } = fromCli("@google-cloud/pubsub");
  const tracing = fromPubsub("./telemetry-tracing.js");
  const enabled = tracing.isEnabled();
  tracing.setGloballyEnabled(true);
  const client = new PubSub({ projectId: "demo-test" });
  t.after(async () => {
    tracing.setGloballyEnabled(Boolean(enabled));
    await client.close();
  });
  const topic = client.topic("test", { batching: { maxMessages: 1 } });
  const requests = [];
  // 最後のRPC境界のみ差し替え、公開APIからバッチ・トレース・コールバックを通す。
  t.mock.method(topic, "request", (options, callback) => {
    requests.push(options);
    if (requests.length === 2) callback(new Error("RPC unavailable"));
    else callback(null, { messageIds: ["message-1"] });
  });
  const messageId = await topic.publishMessage({
    data: Buffer.from("日本語"),
    attributes: { company: "example" },
  });
  assert.equal(messageId, "message-1");
  assert.equal(requests[0].method, "publish");
  assert.equal(requests[0].reqOpts.topic, "projects/demo-test/topics/test");
  assert.equal(requests[0].reqOpts.messages[0].data.toString(), "日本語");
  assert.equal(requests[0].reqOpts.messages[0].attributes.company, "example");
  await assert.rejects(topic.publishMessage({ data: Buffer.from("retry") }), {
    message: "RPC unavailable",
  });
});

test("PubSub extracts valid trace context and rejects invalid incoming IDs", (t) => {
  const tracing = fromPubsub("./telemetry-tracing.js");
  const enabled = tracing.isEnabled();
  tracing.setGloballyEnabled(true);
  t.after(() => tracing.setGloballyEnabled(Boolean(enabled)));
  // 受信スパンを作る直前のコンテキストを観測し、外部トレース送信はしない。
  let captured;
  t.mock.method(
    tracing.PubsubSpans,
    "createReceiveSpan",
    (_message, _name, context) => {
      captured = context;
      return {};
    }
  );
  tracing.extractSpan(
    {
      attributes: {
        googclient_traceparent:
          "00-1234567890abcdef1234567890abcdef-1234567890abcdef-01",
        googclient_tracestate: "vendor=value",
      },
    },
    "projects/demo-test/subscriptions/test"
  );
  const parent = telemetryApi.trace.getSpanContext(captured);
  assert.equal(parent.traceId, "1234567890abcdef1234567890abcdef");
  assert.equal(parent.spanId, "1234567890abcdef");
  assert.equal(parent.traceFlags, 1);
  assert.equal(parent.traceState.get("vendor"), "value");
  assert.equal(parent.isRemote, true);
  for (const invalid of [
    "garbage",
    "00-00000000000000000000000000000000-1234567890abcdef-01",
  ]) {
    tracing.extractSpan(
      { attributes: { googclient_traceparent: invalid } },
      "test"
    );
    assert.equal(telemetryApi.trace.getSpanContext(captured), undefined);
  }
});
