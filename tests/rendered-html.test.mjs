import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Russian conversion landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html lang="ru"/i);
  assert.match(html, /Ремонт квартир под ключ/);
  assert.match(html, /Предварительный расчёт/);
  assert.match(html, /Шаг 1 из 3/);
  assert.match(html, /Какой ремонт нужно рассчитать/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /НЕВА-ремонт/);
  assert.match(html, /по данным компании/i);
  assert.doesNotMatch(html, /фиксированная смета|безупречное качество|ремонт мечты/i);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("server-renders an intent-specific service route", async () => {
  const response = await render("/remont-starogo-fonda-spb");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Капитальный ремонт квартиры в старом фонде/);
  assert.match(html, /от 45 000/);
  assert.match(html, /\"@type\":\"Service\"/);
});
