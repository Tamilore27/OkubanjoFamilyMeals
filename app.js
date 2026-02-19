// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────

const $ = id => document.getElementById(id);

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m]);
}

function getMondayOfCurrentWeek(d = new Date()) {
  const day = d.getDay();
  const offset = (day === 0 ? -6 : 1 - day);
  const m = new Date(d);
  m.setDate(d.getDate() + offset);
  m.setHours(0,0,0,0);
  return m;
}

function weekdayIndexMondayFirst(date = new Date()) {
  return (date.getDay() + 6) % 7; // Mon=0 ... Sun=6
}

// ────────────────────────────────────────────────
// STATE
// ────────────────────────────────────────────────

let currentWeekIndex = 0; // 0..3

function loadWeek() {
  return MONTH_PLAN[currentWeekIndex];
}

function saveWeekIndex() {
  localStorage.setItem("familyMealWeek", currentWeekIndex);
}

function loadSavedWeekIndex() {
  const saved = localStorage.getItem("familyMealWeek");
  return saved ? parseInt(saved, 10) : 0;
}

// ────────────────────────────────────────────────
// UI TABS
// ────────────────────────────────────────────────

const views = {
  today: $("view-today"),
  week:  $("view-week"),
  month: $("view-month"),
  shop:  $("view-shop")
};

const tabs = {
  today: $("tab-today"),
  week:  $("tab-week"),
  month: $("tab-month"),
  shop:  $("tab-shop")
};

function setActiveTab(which) {
  Object.entries(tabs).forEach(([k, el]) => el.classList.toggle("active", k === which));
  Object.entries(views).forEach(([k, el]) => el.classList.toggle("hidden", k !== which));

  if (which === "today" || which === "week") renderCurrentWeek();
  if (which === "month") renderMonthView();
  if (which === "shop")  renderShopping();
}

tabs.today.onclick = () => setActiveTab("today");
tabs.week.onclick  = () => setActiveTab("week");
tabs.month.onclick = () => setActiveTab("month");
tabs.shop.onclick  = () => setActiveTab("shop");

// ────────────────────────────────────────────────
// RANDOMIZE (cycle weeks)
// ────────────────────────────────────────────────

$("randBtn").onclick = () => {
  currentWeekIndex = (currentWeekIndex + 1) % MONTH_PLAN.length;
  saveWeekIndex();
  renderCurrentWeek();
  if (!views.month.classList.contains("hidden")) renderMonthView();
  if (!views.shop.classList.contains("hidden")) renderShopping();
  setActiveTab("week");
};

// ────────────────────────────────────────────────
// RENDER TODAY
// ────────────────────────────────────────────────

function renderToday() {
  const todayIdx = weekdayIndexMondayFirst(new Date());
  const week = loadWeek();
  const day = week.days[todayIdx];

  $("todayTitle").textContent = "Today";
  $("todayPill").textContent = `${day.day} • ${new Date().toLocaleDateString(undefined, { weekday:"long", month:"short", day:"numeric" })}`;

  const wrap = $("todayCards");
  wrap.innerHTML = "";

  const totalKcal = renderDayCards(wrap, day, true);

  $("todayCalTotal").innerHTML = `<strong>Estimated daily calories (family):</strong> ≈ ${totalKcal} kcal`;
}

// ────────────────────────────────────────────────
// RENDER WEEK
// ────────────────────────────────────────────────

function renderWeek() {
  const week = loadWeek();
  $("weekNumber").textContent = week.week;

  const tabsWrap = $("dayTabs");
  tabsWrap.innerHTML = "";

  let activeIdx = weekdayIndexMondayFirst(new Date());

  week.days.forEach((d, i) => {
    const b = document.createElement("button");
    b.className = "dayTab" + (i === activeIdx ? " active" : "");
    b.textContent = d.day.slice(0,3);
    b.onclick = () => {
      activeIdx = i;
      [...tabsWrap.children].forEach((x,j) => x.classList.toggle("active", j===activeIdx));
      renderWeekCards(activeIdx);
    };
    tabsWrap.appendChild(b);
  });

  renderWeekCards(activeIdx);
}

function renderWeekCards(idx) {
  const week = loadWeek();
  const day = week.days[idx];
  const wrap = $("weekCards");
  wrap.innerHTML = "";

  const totalKcal = renderDayCards(wrap, day, false);

  $("weekCalTotals").innerHTML = `<strong>${day.day} total:</strong> ≈ ${totalKcal} kcal`;
}

// Common card renderer (used by today & week)
function renderDayCards(container, day, isToday = false) {
  let totalKcal = 0;

  const makeCard = (type, title, hasKids = false) => {
    const kcal = MEAL_KCAL[title] || 550;
    totalKcal += kcal;

    const img = MEAL_IMAGES[title] || MEAL_IMAGES.default;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="imgWrap">
        <img class="mealImg" src="${img}" alt="${escapeHtml(title)}" loading="lazy">
      </div>
      <div class="cardTop">
        <div>
          <div class="mealType">${type}</div>
          <div class="mealName">${escapeHtml(title)}</div>
        </div>
        <div class="kcal">${kcal} kcal</div>
      </div>
      <div class="details">
        <h3>Ingredients</h3>
        <p>(Click to see estimated ingredients — edit in data.js)</p>
      </div>
    `;

    if (hasKids && day.kidsLunch) {
      const kidsBtn = document.createElement("button");
      kidsBtn.className = "kids-btn";
      kidsBtn.textContent = "Kids Lunch ↓";
      kidsBtn.onclick = (e) => {
        e.stopPropagation();
        alert(`Kids lunch for ${day.day}: ${day.kidsLunch}`);
      };
      card.querySelector(".cardTop").appendChild(kidsBtn);
    }

    card.onclick = () => card.classList.toggle("expanded");
    container.appendChild(card);
  };

  makeCard("Breakfast", day.breakfast);
  makeCard("Lunch",    day.lunch, true);
  makeCard("Dinner",   day.dinner);

  return totalKcal;
}

// ────────────────────────────────────────────────
// MONTH VIEW (small tiles)
// ────────────────────────────────────────────────

function renderMonthView() {
  const grid = $("monthGrid");
  grid.innerHTML = "";

  MONTH_PLAN.forEach(w => {
    const weekDiv = document.createElement("div");
    weekDiv.className = "month-week";

    const title = document.createElement("div");
    title.className = "month-week-title";
    title.textContent = `Week ${w.week}`;
    weekDiv.appendChild(title);

    w.days.forEach(d => {
      const tile = document.createElement("div");
      tile.className = "month-tile";
      tile.innerHTML = `
        <div class="tile-day">${d.day}</div>
        <div class="tile-meal">${escapeHtml(d.dinner || "—")}</div>
      `;
      tile.onclick = () => {
        currentWeekIndex = w.week - 1;
        saveWeekIndex();
        setActiveTab("week");
      };
      weekDiv.appendChild(tile);
    });

    grid.appendChild(weekDiv);
  });
}

// ────────────────────────────────────────────────
// SHOPPING LIST (simple aggregation + staples)
// ────────────────────────────────────────────────

function renderShopping() {
  const week = loadWeek();
  $("shopWeekNum").textContent = week.week;

  const counts = {};

  week.days.forEach(d => {
    [d.breakfast, d.lunch, d.dinner, d.kidsLunch].forEach(meal => {
      if (!meal) return;
      counts[meal] = (counts[meal] || 0) + 1;
    });
  });

  const tbody = $("shopBody");
  tbody.innerHTML = "";

  // Staples first
  STAPLES.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escapeHtml(item.name)}</strong></td>
      <td>${escapeHtml(item.qty)}</td>
      <td>${escapeHtml(item.note)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Meals
  Object.entries(counts).forEach(([meal, count]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(meal)}</td>
      <td>${count}×</td>
      <td>—</td>
    `;
    tbody.appendChild(tr);
  });
}

// ────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────

currentWeekIndex = loadSavedWeekIndex() % MONTH_PLAN.length;

renderToday();
renderWeek();
renderShopping();
setActiveTab("today");
