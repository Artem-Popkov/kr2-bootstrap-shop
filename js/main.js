"use strict";

// Все страницы подключают этот файл, но каждый блок запускается только там,
// где найден нужный элемент. Цены хранятся в js/karts.js.
const karts = window.TURBOKART_KARTS;
const query = new URLSearchParams(window.location.search);
const formatPrice = (price) => new Intl.NumberFormat("ru-RU").format(price) + " ₽";
const findKart = (id) => karts.find((kart) => kart.id === id);

// Страница одного карта: ?kart=lr6, rt10 или sport. Неизвестный id → RT10.
// Цены на карточках и в таблице тоже обновляются из общего справочника.
document.querySelectorAll("[data-price-kart]").forEach((node) => {
  const kart = findKart(node.dataset.priceKart);
  node.textContent = formatPrice(kart.prices[node.dataset.priceDuration]);
});

const productImage = document.querySelector("#kart-image");
if (productImage) {
  const kart = findKart(query.get("kart")) || findKart("rt10");
  document.title = kart.name + " — TurboKart";
  document.querySelectorAll("[data-kart-name]").forEach((node) => {
    node.textContent = kart.name;
  });
  productImage.src = "images/sodi-" + kart.id + ".png";
  productImage.alt = kart.name + ", прокатный карт";
  document.querySelector("#kart-audience").textContent = kart.audience;
  document.querySelector("#kart-description").textContent = kart.description;
  document.querySelector("#kart-price").textContent = formatPrice(kart.prices["10"]);
  document.querySelector("#kart-order").href = "order.html?kart=" + kart.id;
  ["audience", "age", "height", "engine", "power", "speed", "feature", "track"].forEach((field) => {
    document.querySelector("#spec-" + field).textContent = kart[field];
  });
  const tariffs = document.querySelector("#kart-tariffs");
  Object.entries(kart.prices).forEach(([duration, price]) => {
    const link = document.createElement("a");
    link.className = "tariff-choice d-flex justify-content-between align-items-center";
    link.href = "order.html?kart=" + kart.id + "&duration=" + duration;
    const label = document.createElement("span");
    label.textContent = duration + " минут";
    const amount = document.createElement("strong");
    amount.textContent = formatPrice(price) + " ↗";
    link.append(label, amount);
    tariffs.append(link);
  });
}

const form = document.querySelector("#booking-form");
if (form) {
  const model = form.querySelector("#booking-kart");
  const duration = form.querySelector("#booking-duration");
  const people = form.querySelector("#booking-people");
  const date = form.querySelector("#booking-date");
  const track = form.querySelector("#booking-track");
  const error = document.querySelector("#booking-error");
  const submit = document.querySelector("#booking-submit");
  const outdoorOption = track.querySelector('[value="outdoor"]');

  // Локальная дата браузера: не используем UTC, чтобы минимум не сдвигался ночью.
  const today = new Date();
  const localDate = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  date.min = localDate;

  if (findKart(query.get("kart"))) model.value = query.get("kart");
  if (["10", "15", "20"].includes(query.get("duration"))) duration.value = query.get("duration");
  if (query.get("track") === "outdoor") {
    model.value = "rt10";
    track.value = "outdoor";
  }
  if (query.get("event") === "group") {
    people.value = "6";
    model.value = "rt10";
    form.querySelector("#booking-comment").value = "Хочу обсудить заезд для команды.";
  }

  function updateBooking() {
    const kart = findKart(model.value);
    const count = Number(people.value);
    const validCount = Number.isInteger(count) && count >= 1 && count <= 6;
    const price = kart.prices[duration.value];
    // Дети катаются на крытой трассе; для взрослых открытую можно запросить летом.
    outdoorOption.disabled = kart.id === "lr6";
    if (outdoorOption.disabled) track.value = "indoor";
    document.querySelector("#track-hint").textContent = kart.id === "lr6"
      ? "Детские сессии проходят на крытой трассе отдельно от взрослых."
      : "Открытая трасса доступна с июня по август, в сухую погоду.";
    document.querySelector("#summary-kart").textContent = kart.name;
    document.querySelector("#summary-conditions").textContent = kart.age + " · рост " + kart.height;
    document.querySelector("#summary-duration").textContent = duration.value + " минут";
    document.querySelector("#summary-price").textContent = formatPrice(price);
    document.querySelector("#summary-people").textContent = validCount ? count : "—";
    document.querySelector("#summary-total").textContent = validCount ? formatPrice(price * count) : "—";
    let message = "";
    if (!validCount) message = "Укажите от 1 до 6 пилотов.";
    if (track.value === "outdoor" && date.value) {
      const month = Number(date.value.split("-")[1]);
      if (month < 6 || month > 8) message = "Открытая трасса работает с июня по август. Выберите летнюю дату или крытую трассу.";
    }
    if (date.value && date.value < localDate) message = "Выберите сегодняшнюю или будущую дату.";
    if (date.value === localDate && form.elements.time.value) {
      const selectedStart = new Date(date.value + "T" + form.elements.time.value);
      if (selectedStart <= new Date()) message = "Это время уже прошло. Выберите более поздний заезд.";
    }
    error.textContent = message;
    submit.disabled = Boolean(message);
    return !message;
  }

  form.addEventListener("input", updateBooking);
  form.addEventListener("change", updateBooking);
  form.addEventListener("reset", () => {
    // reset сначала вызывает событие и лишь затем сбрасывает поля.
    window.setTimeout(updateBooking, 0);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Демонстрация: никакой сети и передачи персональных данных.
    if (!updateBooking() || !form.reportValidity()) return;
    const kart = findKart(model.value);
    const total = kart.prices[duration.value] * Number(people.value);
    const readableDate = date.value.split("-").reverse().join(".");
    const result = `${kart.name} · ${duration.value} минут · пилотов: ${people.value}. Желаемое начало: ${readableDate}, ${form.elements.time.value}. Трасса: ${track.value === "indoor" ? "крытая" : "открытая"}. Расчётная стоимость: ${formatPrice(total)}.`;
    // textContent не интерпретирует введённый текст как HTML.
    document.querySelector("#booking-result").textContent = result;
    bootstrap.Modal.getOrCreateInstance(document.querySelector("#bookingModal")).show();
  });
  updateBooking();
}
