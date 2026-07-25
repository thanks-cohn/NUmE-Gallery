import assert from "node:assert/strict";
import test from "node:test";

test("renders the NUME gallery shell and metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>NUME — Visual Index<\/title>/i);
  assert.match(html, /aria-label="NUME image gallery"/i);
  assert.match(html, /aria-label="Move row 1 left"/i);
  assert.match(html, /aria-label="Move row 1 right"/i);
});
