"use strict";

// Учебный хронометраж. Время каждого круга хранится в миллисекундах.
const races = [
  { date: "08.11.2026", track: "Крытая", kart: "RT10", format: "На дистанцию", drivers: [
    { name: "Лера", laps: [41820, 40710, 40250, 40950, 40600] },
    { name: "Никита", laps: [42420, 41300, 39810, 40990, 40850] },
    { name: "Антон", laps: [42850, 41500, 41110, 41610, 41200] }
  ] },
  { date: "02.08.2026", track: "Открытая", kart: "Sport", format: "На лучший круг", drivers: [
    { name: "Лера", laps: [58100, 56980, 56430] },
    { name: "Антон", laps: [57800, 57120, 56720] }
  ] }
];
// Дополнительные результаты учебных сессий; LR6 допускается только на крытую трассу.
const boardSessions = [
  ["Крытая","RT10",[40790,42370,43710,44200,45060]],
  ["Крытая","Sport",[34800,35120,35780,36190,37230]],
  ["Крытая","LR6",[52110,52730,53650,53980,54770]],
  ["Открытая","RT10",[62810,63290,64110,65520,66340]],
  ["Открытая","Sport",[49600,50910,52300,52880,53420]]
];
const boardNames = ["Артём","Саша","Даша","Кира","Максим"];
const medals = ["🥇", "🥈", "🥉"];
const lapTime = ms => (ms / 1000).toFixed(3).replace(".", ",");
const totalTime = driver => driver.laps.reduce((sum, lap) => sum + lap, 0);
const bestLap = driver => Math.min(...driver.laps);
function standings(race) {
  return [...race.drivers].sort((a, b) => race.format === "На дистанцию"
    ? b.laps.length - a.laps.length || totalTime(a) - totalTime(b)
    : bestLap(a) - bestLap(b));
}
function raceTable(headers, rows) {
  const wrap = document.createElement("div");
  wrap.className = "protocol-scroll";
  const table = document.createElement("table");
  table.className = "table mb-0";
  const head = table.createTHead().insertRow();
  for (const title of headers) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = title;
    head.append(cell);
  }
  const body = table.createTBody();
  for (const values of rows) {
    const row = body.insertRow();
    for (const value of values) {
      const cell = row.insertCell();
      if (value instanceof Node) cell.append(value);
      else cell.textContent = value;
    }
  }
  wrap.append(table);
  return wrap;
}
function finishComparison(drivers) {
  const panel = document.querySelector("#finish-template").content.firstElementChild.cloneNode(true);
  const selects = [...panel.querySelectorAll("select")];
  const lanes = [...panel.querySelectorAll(".finish-lanes > div")];
  const result = panel.querySelector(".finish-result");
  for (const [index, select] of selects.entries()) {
    drivers.forEach((driver, i) => select.add(new Option(driver.name, i)));
    select.selectedIndex = index;
  }
  let playback = [];
  function compare() {
    playback.forEach(animation => animation.cancel());
    playback = [];
    const pair = selects.map(select => drivers[select.selectedIndex]);
    const laps = pair.map(driver => driver.laps.at(-1));
    const gap = Math.abs(laps[0] - laps[1]);
    const message = pair.map((driver, i) => driver.name + " · " + lapTime(laps[i]) + " с").join(" / ")
      + (gap ? ". Быстрее: " + pair[Number(laps[1] < laps[0])].name + ". Разрыв +" + lapTime(gap) + " с." : ". Одинаковое время.");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      result.textContent = message;
      return;
    }
    result.textContent = "";
    playback = lanes.map((lane, i) => lane.animate(
      [{transform:"translateX(0)"}, {transform:"translateX(100%)"}],
      {duration:3200 * laps[i] / Math.max(...laps), easing:"linear", fill:"forwards"}
    ));
    playback[laps[0] >= laps[1] ? 0 : 1].onfinish = () => { result.textContent = message; };
  }
  selects.forEach((select, i) => select.onchange = () => {
    const other = selects[1-i];
    if (other.selectedIndex === select.selectedIndex) other.selectedIndex = (select.selectedIndex + 1) % drivers.length;
    compare();
  });
  panel.querySelector("button").onclick = compare;
  return panel;
}
function protocol(race) {
  const details = document.createElement("details");
  details.className = "tk-detail";
  const summary = document.createElement("summary");
  summary.textContent = race.date + " · " + race.track + " · " + race.kart + " · " + race.format;
  const count = Math.max(...race.drivers.map(d => d.laps.length));
  const labels = Array.from({length: count}, (_, i) => "Круг " + (i + 1));
  details.append(summary, raceTable(["Место", "Пилот", ...labels, "Сумма, с"], standings(race).map((d, i) => {
    const cells = labels.map((_, n) => {
      if (d.laps[n] === undefined) return "—";
      if (d.laps[n] !== bestLap(d)) return lapTime(d.laps[n]);
      const best = document.createElement("mark");
      best.title = "Лучший круг пилота";
      best.textContent = lapTime(d.laps[n]);
      return best;
    });
    return [medals[i] || i + 1, d.name, ...cells, lapTime(totalTime(d))];
  })));
  if (race.drivers.length >= 2) details.append(finishComparison(race.drivers));
  return details;
}
function updateBoard() {
  const track = document.querySelector("#rank-track").value;
  const kartSelect = document.querySelector("#rank-kart");
  kartSelect.querySelector('option[value="LR6"], option:last-child').disabled = track === "Открытая";
  if (track === "Открытая" && kartSelect.value === "LR6") kartSelect.value = "RT10";
  const kart = kartSelect.value;
  const times = new Map();
  for (const race of races.filter(r => r.track === track && r.kart === kart)) {
    for (const driver of race.drivers) times.set(driver.name, Math.min(times.get(driver.name) ?? Infinity, bestLap(driver)));
  }
  const session = boardSessions.find(([surface,model]) => surface === track && model === kart);
  session?.[2].forEach((time,i) => times.set(boardNames[i],Math.min(times.get(boardNames[i]) ?? Infinity,time)));
  const list = [...times].sort((a,b) => a[1] - b[1]).slice(0,5);
  const podium = document.querySelector("#podium");
  podium.replaceChildren();
  for (const place of [2,1,3]) {
    const step = document.createElement("div");
    step.className = "step place-" + place;
    const cup = document.createElement("span");
    cup.className = "cup"; cup.textContent = "🏆"; cup.setAttribute("aria-hidden","true");
    const label = document.createElement("strong"); label.textContent = list[place-1][0];
    const time = document.createElement("small"); time.textContent = lapTime(list[place-1][1]) + " с";
    const base = document.createElement("b"); base.textContent = place;
    step.append(cup,label,time,base); podium.append(step);
  }
  const output = document.querySelector("#track-ranking");
  output.replaceChildren(list.length ? raceTable(["Место", "Пилот", "Лучший круг, с"], list.map(([name, time], i) => [i + 1, name, lapTime(time)])) : "Для этой трассы и класса ещё нет результатов.");
}
if (document.querySelector("#track-ranking")) {
  for (const select of document.querySelectorAll("#leaderboard select")) select.addEventListener("change", updateBoard);
  updateBoard();
}
if (pilotForm) {
  const preview = query.get("preview") === "1";
  function updateDriver() {
    const output = document.querySelector("#driver-results");
    const name = preview ? "Лера" : pilot?.name;
    if (!name) return;
    const owner = !preview && pilot.phone === "+79532735586";
    const filled = preview || owner;
    const history = owner ? races.map(r => ({...r, drivers:r.drivers.map(d => d.name === "Лера" ? {...d,name} : d)})) : races;
    const sampleLabel = document.querySelector("#sample-history");
    sampleLabel.hidden = !filled;
    document.querySelector("#preview-results").hidden = preview;
    if (preview) {
      document.querySelector("#pilot-login").hidden = true;
      document.querySelector("#pilot-dashboard").hidden = false;
      document.querySelector("#pilot-info").textContent = name;
      document.querySelector("#pilot-contact").textContent = "Пример кабинета пилота";
      document.querySelector("#pilot-avatar").textContent = "Л";
      document.querySelector("#pilot-next").textContent = "Ближайших заявок нет. Выбери следующий старт в расписании.";
      document.querySelector("#pilot-logout").textContent = "Закрыть пример";
      document.querySelector("#pilot-upcoming").textContent = "Ближайших заявок нет";
      document.querySelector("#upcoming-count").textContent = "0";
    }
    if (filled) {
      const archive = document.querySelector("#pilot-archive");
      if (preview || !Number(document.querySelector("#archive-count").textContent)) archive.replaceChildren();
      archive.querySelectorAll("[data-sample]").forEach(item => item.remove());
      history.forEach(r => {
        const item = document.createElement("li");
        item.dataset.sample = "true";
        const link = document.createElement("button");
        link.className = "btn btn-outline-dark";
        link.textContent = r.date + " · " + r.kart + " · Посмотреть результаты";
        link.onclick = () => {
          document.querySelector('[data-view="results"]').click();
          output.children[history.indexOf(r)].open = true;
        };
        item.append(link); archive.append(item);
      });
      document.querySelector("#archive-count").textContent = String(archive.children.length);
    }
    const entries = filled ? history.map((r,i) => r.drivers[races[i].drivers.findIndex(d => d.name === "Лера")]) : [];
    const laps = entries.flatMap(d => d.laps);
    const metrics = {visits: entries.length, laps: laps.length, best: laps.length ? lapTime(Math.min(...laps)) + " с" : "—", time: Math.round(entries.reduce((s,d) => s + totalTime(d), 0) / 60000) + " мин"};
    for (const [key,value] of Object.entries(metrics)) document.querySelector("#metric-" + key).textContent = value;
    output.replaceChildren(...(filled ? history.map(protocol) : ["Подтверждённых результатов пока нет."]));
    document.querySelector("#driver-awards").textContent = entries.length ? ["🏁 Первый финиш", ...history.filter((r,i) => standings(r)[0] === entries[i]).map(r => "🏆 Победа · " + r.track + " трасса")].join(" / ") : "Достижения появятся после первого заезда с результатом.";
    const passRequested = !preview && readJSON("rides-" + pilot.phone, []).some(r => r.plan === "pass");
    document.querySelector("#driver-pass").textContent = filled ? "Учебный абонемент RT10 · Осталось 3 заезда из 4" : passRequested ? "Заявка на абонемент RT10 сохранена. Ожидает подтверждения." : "Активного абонемента пока нет.";
    document.querySelector("#driver-name").value = name;
    document.querySelector("#driver-name").readOnly = preview;
    document.querySelector("#rename-driver button").disabled = preview;
  }
  for (const tab of document.querySelectorAll("[data-view]")) tab.onclick = () => {
    for (const other of document.querySelectorAll("[data-view]")) {
      document.getElementById(other.getAttribute("aria-controls")).hidden = other !== tab;
      other.setAttribute("aria-pressed", String(other === tab));
    }
  };
  if (preview) document.querySelector("#pilot-logout").addEventListener("click", e => {
    e.stopImmediatePropagation(); location.href = "pilot.html";
  }, true);
  document.querySelector("#rename-driver").onsubmit = event => {
    event.preventDefault();
    const name = document.querySelector("#driver-name").value.trim();
    if (preview || !pilot || !name) return;
    pilot = {...pilot, name};
    const saved = savePreference("pilot-session", JSON.stringify(pilot));
    renderProfile(); updateDriver();
    statusLine.textContent = saved ? "Имя обновлено." : "Имя обновлено до закрытия страницы.";
  };
  pilotForm.addEventListener("submit", updateDriver);
  window.addEventListener("storage", updateDriver);
  updateDriver();
  if (preview && location.hash === "#view-results") {
    document.querySelector('[data-view="results"]').click();
    document.querySelector("#driver-results details").open = true;
  }
}

const traces = [...document.querySelectorAll(".lap-trace")];
if (traces.length) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  function drawTraces() {
    frame = 0;
    for (const trace of traces) {
      const bounds = trace.getBoundingClientRect();
      const progress = (innerHeight - bounds.top) / Math.max(1, innerHeight - (document.querySelector(".site-header")?.offsetHeight || 0));
      trace.style.setProperty("--remaining", reducedMotion.matches ? 0 : 1 - Math.min(1, Math.max(0, progress)));
    }
  }
  function scheduleDraw() {
    if (!frame) frame = requestAnimationFrame(drawTraces);
  }
  window.addEventListener("scroll", scheduleDraw, {passive:true});
  window.addEventListener("resize", scheduleDraw);
  reducedMotion.addEventListener("change", scheduleDraw);
  drawTraces();
}
