"use strict";

const themeButton = document.querySelector("#theme-switch");
function applyTheme(theme) {
  document.documentElement.dataset.bsTheme = theme;
  themeButton.setAttribute("aria-checked", String(theme === "dark"));
  themeButton.title = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему";
}
function readPreference(key) {
  try { return localStorage.getItem("turbokart-" + key); } catch { return null; }
}
function savePreference(key, value) {
  try { localStorage.setItem("turbokart-" + key, value); return true; } catch { return false; }
}
applyTheme(readPreference("theme") || "light");
themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.bsTheme === "dark" ? "light" : "dark";
  applyTheme(next);
  savePreference("theme", next);
});

document.querySelectorAll("[data-panel]").forEach(button => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.panel);
    dialog.showModal();
    dialog.querySelector("input:not([hidden])")?.focus();
  });
});

const destinations = [
  ["Кабинет пилота", "pilot.html", "профиль заявки архив история вход"],
  ["Главная · TurboKart", "index.html", "картинг центр"],
  ["Трассы", "tracks.html", "крытая открытая схема длина"],
  ["Первый визит", "index.html#first-visit", "инструктаж новички"],
  ["Командные заезды", "index.html#events", "корпоратив группы"],
  ["Отзывы пилотов", "index.html#reviews", "впечатления"],
  ["Карты и цены", "catalog.html#prices", "каталог стоимость тарифы длительность"],
  ["Характеристики картов", "product.html", "двигатель мощность скорость"],
  ["Заявка на заезд", "order.html", "бронирование запись дата расчет"],
  ["Контакты", "contacts.html", "телефон почта звонки вк vk telegram"],
  ["Часы работы", "contacts.html#schedule", "время расписание"],
  ["Правила посещения", "contacts.html#rules", "одежда безопасность"],
  ["Вопросы перед стартом", "index.html#race-faq", "FAQ частые вопросы ответы перед первым кругом"],
  ["Как добраться", "contacts.html#location", "адрес карта Москва Дежнева метро машина велосипед самокат остановка"]
];
for (const kart of window.TURBOKART_KARTS) destinations.push([kart.name, "catalog.html#kart-" + kart.id, kart.audience]);
const questionLinks = [
  [
    "Когда приехать?",
    "index.html#question-1",
    "За 20 минут до старта, чтобы подобрать экипировку и пройти инструктаж."
  ],
  [
    "Что надеть?",
    "index.html#question-2",
    "Закрытую обувь и удобную одежду. Длинные волосы собери перед заездом."
  ],
  [
    "С какой модели начать?",
    "index.html#question-3",
    "Для первого взрослого заезда подойдёт RT10. Детская модель — LR6."
  ],
  [
    "Как узнать результат?",
    "index.html#question-4",
    "В кабинете пилота открой «Результаты заездов». В примере доступны времена пяти кругов."
  ],
  [
    "С какого возраста можно за руль?",
    "index.html#question-5",
    "Для LR6 — от 7 лет при росте от 130 см."
  ],
  [
    "Можно ли ребёнку приехать без взрослого?",
    "index.html#question-6",
    "Ребёнок должен приехать со взрослым. Взрослый остаётся в центре до конца заезда. На крытой трассе дети 7–13 лет ездят самостоятельно в отдельной сессии."
  ],
  [
    "Сколько длится заезд?",
    "index.html#question-7",
    "Можно выбрать 10, 15 или 20 минут."
  ],
  [
    "Как посчитать цену для компании?",
    "index.html#question-8",
    "В заявке укажи модель, длительность и число пилотов. Итог обновится сразу."
  ],
  [
    "Когда открыта уличная трасса?",
    "index.html#question-9",
    "С июня по август в сухую погоду."
  ],
  [
    "Какой длины круг?",
    "index.html#question-10",
    "Крытая трасса — 420 м, открытая — 680 м."
  ],
  [
    "Где найти мою заявку?",
    "index.html#question-11",
    "Войди в кабинет до оформления, затем открой «Мои заезды» на том же устройстве."
  ],
  [
    "Нужен ли опыт вождения?",
    "index.html#question-12",
    "Нет. Для первого визита выбирайте RT10. До заезда инструктор объяснит управление и сигналы на трассе."
  ],
  [
    "Что взять с собой?",
    "index.html#question-13",
    "Удобную одежду и закрытую обувь. Длинные волосы необходимо убрать, свободные шарфы и украшения снять. Шлем и экипировку выдадут перед стартом."
  ],
  [
    "Можно ли приехать с ребёнком?",
    "index.html#question-14",
    "Да. Для детей 7–13 лет проводятся отдельные заезды на крытой трассе. С 14 лет можно участвовать в общих заездах при росте от 145 см и допуске инструктора. После инструктажа ребёнок самостоятельно управляет одноместным картом. Совместного заезда в одном карте с инструктором у нас нет. Условия по моделям: \n \n  SODI LR6  — 7–13 лет, рост от 130 см. \n  SODI RT10  — от 14 лет, рост от 145 см. \n  SODI Sport  — от 16 лет, рост от 150 см; для пилотов с опытом. \n \n Название модели открывает её карточку в каталоге. Окончательный допуск определяет инструктор после проверки посадки. Сопровождающий взрослый остаётся в центре, а не едет в карте вместе с ребёнком."
  ],
  [
    "Что делать, если пойдёт дождь?",
    "index.html#question-15",
    "Крытая трасса работает в любую погоду. Открытая — только летом в сухую погоду. Если заезд на открытой трассе отменён из-за погоды, вы можете выбрать перенос на другое время или возврат оплаты."
  ]
];
destinations.push(...questionLinks);
const searchBox = document.querySelector("#search-query");
function searchText(text) {
  return text.toLocaleLowerCase("ru").replaceAll("ё", "е");
}
function showMatches() {
  const term = searchText(searchBox.value.trim());
  const words = term.match(/[а-яa-z0-9]+/g) || [];
  const list = document.querySelector("#search-results");
  list.replaceChildren();
  const found = destinations.filter(([label, url, keywords]) =>
    words.every(word => searchText(label + " " + keywords).includes(word)))
    .sort((a, b) => Number(searchText(b[0]).includes(term)) - Number(searchText(a[0]).includes(term)));
  const visible = term ? found : [destinations[0], destinations[2], destinations[6], destinations[8]];
  for (const [label, url, keywords] of visible) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = url;
    const title = document.createElement("strong");
    const desc = document.createElement("small");
    for (const [node, value] of [[title, label], [desc, keywords.length > 140 ? keywords.slice(0, 137).trimEnd() + "…" : keywords]]) {
      const word = words.find(w => searchText(value).includes(w));
      if (!word) node.textContent = value;
      else {
        const index = searchText(value).indexOf(word);
        const mark = document.createElement("mark");
        mark.textContent = value.slice(index, index + word.length);
        node.append(value.slice(0, index), mark, value.slice(index + word.length));
      }
    }
    const category = document.createElement("span");
    category.textContent = url.includes("#question-") ? "Вопрос перед стартом" : url.startsWith("catalog") ? "Каталог" : url.startsWith("pilot") ? "Профиль" : url.startsWith("order") ? "Запись" : "Раздел";
    link.append(title, category, desc);
    item.append(link);
    list.append(item);
  }
  document.querySelector("#search-caption").textContent = term ? (found.length ? "Найдено: " + found.length : "Совпадений нет. Попробуй «трасса» или «тариф».") : "Популярные разделы";
}
destinations.push(["Школа пилотов", "school.html", "Инструкторы, вводные занятия и детская группа"], ["Программа заездов", "index.html#calendar", "Школа пилотов, расписание, занятия с инструктором"], ["Лучшие круги", "tracks.html#leaderboard", "Рейтинг пилотов на двух трассах"], ["Абонементы", "catalog.html#passes", "Четыре старта на RT10"], ["Детский карт LR6", "product.html?kart=lr6", "Детский заезд на крытой трассе"]);
searchBox.addEventListener("input", showMatches);
showMatches();

const pilotForm = document.querySelector("#pilot-form");
const phoneInput = document.querySelector("#pilot-phone");
const statusLine = document.querySelector("#pilot-status");
function readJSON(key, fallback) {
  try { return JSON.parse(readPreference(key)) ?? fallback; } catch { return fallback; }
}
let pilot = readJSON("pilot-session", null);
function renderProfile() {
  if (!pilotForm) return;
  document.querySelector("#pilot-login").hidden = Boolean(pilot);
  document.querySelector("#pilot-dashboard").hidden = !pilot;
  if (!pilot) return;
  document.querySelector("#pilot-info").textContent = pilot.name;
  document.querySelector("#pilot-contact").textContent = pilot.phone;
  const upcoming = document.querySelector("#pilot-upcoming");
  const archive = document.querySelector("#pilot-archive");
  document.querySelector("#pilot-avatar").textContent = pilot.name.slice(0, 1).toUpperCase();
  upcoming.replaceChildren();
  archive.replaceChildren();
  const rides = readJSON("rides-" + pilot.phone, []).sort((a, b) => a.start.localeCompare(b.start));
  let nextRide;
  for (const ride of rides) {
    const start = new Date(ride.start);
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    heading.textContent = start.toLocaleString("ru-RU", {day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"});
    const detail = document.createElement("p");
    detail.textContent = ride.reference ? ride.reference + " · " + ride.result : ride.result;
    item.append(heading, detail);
    if (start.getTime() + (ride.minutes || 0) * 60000 <= Date.now()) {
      archive.prepend(item);
    } else {
      nextRide ??= ride;
      upcoming.append(item);
    }
  }
  document.querySelector("#upcoming-count").textContent = upcoming.children.length;
  document.querySelector("#archive-count").textContent = archive.children.length;
  document.querySelector("#pilot-next").textContent = nextRide?.result || "Пока нет ближайшего заезда. Выбери трассу и удобное время.";
  for (const list of [upcoming, archive]) {
    if (!list.children.length) {
      const item = document.createElement("li");
      item.textContent = list === upcoming ? "Пока нет заявок" : "Пока нет прошедших заездов";
      list.append(item);
    }
  }
}
function selectRides(period) {
  for (const button of document.querySelectorAll("[data-rides]")) {
    const active = button.dataset.rides === period;
    button.setAttribute("aria-pressed", String(active));
    document.getElementById(button.getAttribute("aria-controls")).hidden = !active;
  }
}
for (const button of document.querySelectorAll("[data-rides]")) {
  button.addEventListener("click", () => selectRides(button.dataset.rides));
}
const bookingName = document.querySelector("#booking-name");
if (bookingName && pilot) bookingName.value = pilot.name;
phoneInput?.addEventListener("input", () => phoneInput.setCustomValidity(""));
pilotForm?.addEventListener("submit", event => {
  event.preventDefault();
  const digits = phoneInput.value.replace(/[^0-9]/g, "");
  if (!/^[78][0-9]{10}$/.test(digits)) {
    phoneInput.setCustomValidity("Введите 11 цифр российского номера, начиная с 7 или 8.");
    phoneInput.reportValidity();
    return;
  }
  const name = document.querySelector("#pilot-name").value.trim();
  if (!name) return;
  pilot = {name, phone: "+7" + digits.slice(1)};
  const stored = savePreference("pilot-session", JSON.stringify(pilot));
  statusLine.textContent = stored ? "" : "Профиль доступен до закрытия страницы.";
  if (bookingName) bookingName.value = name;
  renderProfile();
});
document.querySelector("#pilot-logout")?.addEventListener("click", () => {
  pilot = null;
  savePreference("pilot-session", "null");
  pilotForm.reset();
  selectRides("upcoming");
  if (bookingName) bookingName.value = "";
  statusLine.textContent = "";
  renderProfile();
});
document.addEventListener("booking-prepared", event => {
  const notice = document.querySelector("#booking-profile-status");
  if (!pilot) {
    notice.textContent = "Чтобы сохранять заявки, войдите в кабинет пилота перед оформлением.";
    return;
  }
  const key = "rides-" + pilot.phone;
  const rides = readJSON(key, []);
  rides.unshift(event.detail);
  notice.textContent = savePreference(key, JSON.stringify(rides))
    ? "Заявка сохранена в кабинете пилота."
    : "Браузеру не удалось сохранить заявку в кабинете.";
  renderProfile();
});
renderProfile();
window.addEventListener("storage", event => {
  if (event.key === "turbokart-pilot-session" || event.key === null) {
    pilot = readJSON("pilot-session", null);
    if (bookingName) bookingName.value = pilot?.name || "";
  }
  renderProfile();
});

const feed = document.querySelector(".race-feed");
if (feed) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  setInterval(() => {
    if (motion.matches || document.hidden || feed.matches(":hover, :focus-within")) return;
    const step = feed.children[1].offsetLeft - feed.children[0].offsetLeft;
    const end = feed.scrollLeft + feed.clientWidth >= feed.scrollWidth - 2;
    feed.scrollTo({left: end ? 0 : feed.scrollLeft + step, behavior: "smooth"});
  }, 3600);
}
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (const stat of document.querySelectorAll(".hero-stats strong")) {
    const original = stat.textContent;
    let start;
    const duration = original.includes("680") ? 1600 : 850;
    function countUp(now) {
      start ??= now;
      const elapsed = Math.min(1, (now - start) / duration);
      const progress = 1 - (1 - elapsed) ** 3;
      stat.textContent = original.replace(/\d+/g, digits =>
        String(Math.floor(Number(digits) * progress)).padStart(digits.startsWith("0") ? digits.length : 1, "0"));
      if (elapsed < 1) requestAnimationFrame(countUp);
      else stat.classList.remove("counting");
    }
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect(); stat.classList.add("counting"); requestAnimationFrame(countUp);
      });
      observer.observe(stat);
    }
  }
}

const eventsPanel = document.querySelector("#event-cards");
if (eventsPanel) {
  const dates = window.TURBOKART_EVENTS.map(event => ({event, date: nextEventDate(event)})).sort((a,b) => a.date - b.date);
  for (const {event, date} of dates) {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const when = document.createElement("strong");
    const detail = document.createElement("p");
    const link = document.createElement("a");
    title.textContent = event.title;
    when.textContent = date.toLocaleDateString("ru-RU", {weekday:"short", day:"numeric", month:"long"}) + " · " + event.time;
    detail.textContent = event.description;
    link.href = "order.html?event=" + event.id;
    link.textContent = "Выбрать старт ";
    link.append(createLinkWheel());
    const photo = document.createElement("img");
    const eventPhotos = {school: 2, junior: 6, team: 1};
    photo.src = "images/race-gallery-" + eventPhotos[event.id] + ".jpg";
    photo.loading = "lazy";
    photo.alt = "";
    card.append(photo, when, title, detail);
    if (event.id === "school" || event.id === "junior") {
      const program = document.createElement("a");
      program.href = "school.html#" + (event.id === "school" ? "adult" : "junior");
      program.textContent = "Программа занятия ";
    program.append(createLinkWheel());
      card.append(program);
    }
    card.append(link);
    eventsPanel.append(card);
  }
  const first = dates[0];
  document.querySelector("#next-title").textContent = first.event.title;
  document.querySelector("#next-time").textContent = first.date.toLocaleDateString("ru-RU", {weekday:"long", day:"numeric", month:"long"}) + " · " + first.event.time;
}
const grid = document.querySelector("#kart-grid");
if (grid) {
  const filter = document.querySelector("#catalog-filter");
  const sort = document.querySelector("#catalog-sort");
  function filterKarts() {
    const ordered = [...karts].sort((a,b) => Number(sort.value) * (a.prices[10] - b.prices[10]));
    for (const kart of ordered) {
      const card = document.getElementById("kart-" + kart.id).parentElement;
      card.hidden = filter.value !== "all" && kart.id !== filter.value;
      grid.append(card);
    }
  }
  filter.onchange = sort.onchange = filterKarts;
}
document.querySelector("#review-filter")?.addEventListener("change", event => {
  for (const card of document.querySelectorAll("[data-review]")) card.hidden = !["all",card.dataset.review].includes(event.target.value);
});
const faqInput = document.querySelector("#faq-query");
if (faqInput) {
  const topic = document.querySelector("#faq-topic");
  function filterQuestions() {
    let count = 0;
    for (const item of document.querySelectorAll("[data-topic]")) {
      item.hidden = !(topic.value === "Все темы" || topic.value === item.dataset.topic) || !searchText(faqInput.value.trim()).split(/\s+/).every(word => searchText(item.textContent).includes(word));
      if (!item.hidden) count++;
    }
    document.querySelector("#faq-empty").hidden = count > 0;
  }
  function openQuestion() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target?.matches("details[data-topic]")) return;
    faqInput.value = "";
    topic.value = "Все темы";
    filterQuestions();
    target.open = true;
    target.scrollIntoView({block:"start"});
  }
  window.addEventListener("hashchange", openQuestion);
  document.querySelector("#search-results").addEventListener("click", event => {
    const link = event.target.closest("a");
    if (link) {
      document.querySelector("#site-search").close();
      if (link.hash === location.hash) openQuestion();
    }
  });
  openQuestion();
  faqInput.oninput = topic.onchange = filterQuestions;
  filterQuestions();
}
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  function reveal(entries, observer) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in-frame");
      observer.unobserve(entry.target);
    }
  }
  const observer = new IntersectionObserver(reveal, {threshold: 0.06});
  const kartObserver = new IntersectionObserver(reveal, {threshold: .25, rootMargin: "0px 0px -64px 0px"});
  const targets = document.querySelectorAll("main section h2, .kart-card, .track-panel, .guide-layout, .tk-cards article, .pilot-review, .contact-channel, .visit-card, .driver-metrics");
  for (const el of targets) {
    if (el.parentElement.closest(".scroll-frame")) continue;
    el.classList.add("scroll-frame");
    const cell = el.closest(".row > div");
    if (cell) el.style.setProperty("--delay", (Array.from(cell.parentElement.children).indexOf(cell) % 3) * 90 + "ms");
    (el.matches(".kart-card") ? kartObserver : observer).observe(el);
  }
}
const header = document.querySelector(".site-header");
if (header && "ResizeObserver" in window) {
  new ResizeObserver(() => document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px")).observe(header);
}

const reviewForm = document.querySelector("#write-review");
if (reviewForm) {
  const list = document.querySelector(".review-list .row");
  const filter = document.querySelector("#review-filter");
  const examples = list.children.length;
  function showReviews() {
    list.querySelectorAll("[data-local-review]").forEach(el => el.remove());
    const saved = readJSON("reviews", []);
    let total = examples * 5;
    for (const review of saved) {
      const card = document.createElement("div");
      card.dataset.localReview = "";
      card.dataset.review = review.category;
      const figure = document.createElement("figure");
      figure.className = "pilot-review";
      const stars = document.createElement("div");
      stars.setAttribute("role","img");
      stars.setAttribute("aria-label",review.score + " из 5");
      stars.textContent = "★".repeat(review.score) + "☆".repeat(5-review.score);
      const quote = document.createElement("blockquote");
      quote.textContent = review.body;
      const author = document.createElement("figcaption");
      author.textContent = review.author;
      figure.append(stars,quote,author); card.append(figure); list.prepend(card);
      total += review.score;
    }
    const average = total / (examples + saved.length);
    document.querySelector(".review-score strong").textContent = average.toFixed(1).replace(".",",");
    const stars = document.querySelector(".review-score b");
    stars.textContent = "★".repeat(Math.round(average)) + "☆".repeat(5-Math.round(average));
    stars.setAttribute("aria-label",average.toFixed(1) + " из 5");
    filter.dispatchEvent(new Event("change"));
  }
  reviewForm.onsubmit = event => {
    event.preventDefault();
    const fields = new FormData(reviewForm);
    const review = {author:fields.get("author").trim(),body:fields.get("body").trim(),score:Number(fields.get("score")),category:fields.get("category")};
    const status = document.querySelector("#review-status");
    if (!review.author || !review.body) {status.textContent="Введи имя и текст отзыва.";return;}
    if (!savePreference("reviews",JSON.stringify([...readJSON("reviews",[]),review]))) {status.textContent="Не удалось сохранить отзыв.";return;}
    filter.value="all"; reviewForm.reset(); showReviews();
    status.textContent="Отзыв сохранён.";
  };
  showReviews();
  window.addEventListener("storage",e=>{if(e.key==="turbokart-reviews" || e.key===null) showReviews();});
}
