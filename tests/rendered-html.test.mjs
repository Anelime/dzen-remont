import assert from "node:assert/strict";
import test from "node:test";

const publicRoutes = [
  "/",
  "/remont-kvartir-v-novostroyke-spb",
  "/remont-starogo-fonda-spb",
  "/remont-kommercheskih-pomeshcheniy-spb",
  "/kosmeticheskiy-remont-spb",
  "/remont-po-dizayn-proektu-spb",
  "/zavershit-remont-posle-podryadchika",
  "/projects",
  "/projects/salon-karpovka",
  "/projects/chernaya-rechka",
  "/projects/neva-haus",
  "/privacy",
];

const outsiderVoice =
  /по данным (?:компании|сайта)|на (?:текущем )?сайте компании|компания (?:заявляет|описывает|указывает)|опубликованные цены|карточк[ае] проекта|портфолио компании|черновик для предпросмотра|\[добавить /i;

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
  assert.match(html, /class="route-progress"/);
  assert.match(html, /class="route-stage"/);
  assert.match(html, /Ремонт помещений/);
  assert.match(html, /Предварительный расчёт/);
  assert.match(html, /Шаг 1 из 2/);
  assert.match(html, /Какое помещение ремонтируем/);
  assert.match(html, /Цена за метр — только начало расчёта/);
  assert.doesNotMatch(html, /Есть ли дизайн-проект|Шаг 1 из 3/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /Дзен Ремонт/);
  assert.match(html, /ИП Свентий Евгений Анатольевич/);
  assert.match(html, /Lake_of_fire@list\.ru/);
  assert.match(html, /Написать на почту/);
  assert.match(html, /DZEN/);
  assert.match(html, /REMONT/);
  assert.match(html, /С 2012 года/);
  assert.match(html, /Коммерческий ремонт — от 15 000/);
  assert.match(html, /гарантия 6 месяцев/i);
  assert.match(html, /6 месяцев.*гарантия на выполненные работы/s);
  assert.match(html, /Изменения вносим после согласования с заказчиком/);
  assert.match(html, /5–7 бригад/);
  assert.match(html, /партнёрскими дизайнерами/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/neva-remont-redesign\.rick-ai\.chatgpt\.site\/og-dzen-remont-v1\.jpg"/,
  );
  assert.match(html, /property="og:image:type" content="image\/jpeg"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /property="og:image:alt" content="Дзен Ремонт/);
  assert.match(
    html,
    /property="og:url" content="https:\/\/neva-remont-redesign\.rick-ai\.chatgpt\.site"/,
  );
  assert.match(
    html,
    /name="twitter:image" content="https:\/\/neva-remont-redesign\.rick-ai\.chatgpt\.site\/og-dzen-remont-v1\.jpg"/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/neva-remont-redesign\.rick-ai\.chatgpt\.site"/,
  );
  assert.doesNotMatch(html, /localhost:3000/);
  assert.doesNotMatch(html, /НЕВА-ремонт|NEVA РЕМОНТ|ZEN-ремонт|(?<!D)ZEN REMONT/);
  assert.doesNotMatch(html, outsiderVoice);
  assert.doesNotMatch(html, /фиксированная смета|безупречное качество|ремонт мечты/i);
  assert.doesNotMatch(html, /смета не изменится|гарантия на материалы/i);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("commercial services and case are presented first", async () => {
  const response = await render();
  const html = await response.text();
  assert.ok(html.indexOf("Коммерческие помещения") < html.indexOf("Новостройка"));
  assert.ok(html.indexOf("Салон красоты на Карповке") < html.indexOf("Квартира на Чёрной речке"));
  assert.match(html, /href="\/projects\/salon-karpovka"/);
  assert.match(html, /href="\/projects\/chernaya-rechka"/);
  assert.match(html, /href="\/projects\/neva-haus"/);
});

test("all project cards open detailed case pages", async () => {
  const response = await render("/projects");
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const path of [
    "/projects/salon-karpovka",
    "/projects/chernaya-rechka",
    "/projects/neva-haus",
  ]) {
    assert.match(html, new RegExp(`href="${path}"`));
  }
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /"@type":"ItemList"/);
  assert.match(
    html,
    /property="og:url" content="https:\/\/neva-remont-redesign\.rick-ai\.chatgpt\.site\/projects"/,
  );
});

test("case pages contain proof, navigation, SEO metadata, and a relevant calculator", async () => {
  const expected = [
    ["/projects/salon-karpovka", "Ремонт салона красоты на Карповке", "70 м²", "5 недель"],
    ["/projects/chernaya-rechka", "Капитальный ремонт квартиры на Чёрной речке", "150 м²", "1,5 года"],
    ["/projects/neva-haus", "Капитальный ремонт квартиры в ЖК Neva Haus", "78 м²", "2"],
  ];

  for (const [path, heading, fact, secondFact] of expected) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} should render`);
    const html = await response.text();
    assert.match(html, new RegExp(heading));
    assert.match(html, new RegExp(fact));
    assert.match(html, new RegExp(secondFact));
    assert.match(html, /Состав работ/);
    assert.match(html, /Рассчитать похожий объект/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, /"@type":"Article"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, new RegExp(`rel="canonical" href="https:\\/\\/neva-remont-redesign\\.rick-ai\\.chatgpt\\.site${path}"`));
  }
});

test("server-renders an intent-specific service route", async () => {
  const response = await render("/remont-starogo-fonda-spb");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Капитальный ремонт квартиры в старом фонде/);
  assert.match(html, /от 45 000/);
  assert.match(html, /\"@type\":\"Service\"/);
  assert.match(html, /Смета, гарантия и команда/);
  assert.match(html, /На выполненные работы действует гарантия 6 месяцев/);
  assert.doesNotMatch(html, /Какие коммерческие помещения вы ремонтируете/);
});

test("design-project route explains both supported starting points", async () => {
  const response = await render("/remont-po-dizayn-proektu-spb");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Если проект уже готов/);
  assert.match(html, /Если дизайнера ещё нет/);
  assert.match(html, /несколько партнёрских дизайнеров на выбор/);
});

test("privacy page contains the verified application contacts", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Контакты исполнителя/);
  assert.match(html, /ИП Свентий Евгений Анатольевич/);
  assert.match(html, /Lake_of_fire@list\.ru/);
});

test("all public routes use the first-party voice", async () => {
  for (const path of publicRoutes) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} should render`);
    const html = await response.text();
    assert.doesNotMatch(html, outsiderVoice, `${path} contains outsider or draft copy`);
    assert.doesNotMatch(html, /НЕВА-ремонт|NEVA РЕМОНТ|ZEN-ремонт|(?<!D)ZEN REMONT/, `${path} contains the previous brand`);
  }
});
