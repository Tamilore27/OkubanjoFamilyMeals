// app.js - okubizzy Family Meal Planner
// ────────────────────────────────────────────────

const $ = id => document.getElementById(id);

// ────────────────────────────────────────────────
// STATE
// ────────────────────────────────────────────────

let currentWeekIndex = 0; // 0 = Week 1, 1 = Week 2, etc.

// Load saved week preference
function loadSavedWeek() {
  const saved = localStorage.getItem('okubizzyCurrentWeek');
  return saved !== null ? parseInt(saved, 10) : 0;
}

function saveCurrentWeek() {
  localStorage.setItem('okubizzyCurrentWeek', currentWeekIndex);
}

// ────────────────────────────────────────────────
// UI TABS / PAGE SWITCHING
// ────────────────────────────────────────────────

const views = {
  today:  $("view-today"),
  week:   $("view-week"),
  month:  $("view-month"),
  shop:   $("view-shop")
};

const tabs = {
  today:  $("tab-today"),
  week:   $("tab-week"),
  month:  $("tab-month"),
  shop:   $("tab-shop")
};

function setActiveTab(which) {
  // Update tab styles
  Object.keys(tabs).forEach(key => {
    tabs[key].classList.toggle('active', key === which);
  });

  // Show/hide views
  Object.keys(views).forEach(key => {
    views[key].classList.toggle('hidden', key !== which);
  });

  // Re-render content when switching to certain views
  if (which === 'today' || which === 'week') renderCurrentWeekContent();
  if (which === 'month') renderMonthOverview();
  if (which === 'shop')  renderShoppingList();
}

// Tab click handlers
tabs.today.onclick = () => setActiveTab('today');
tabs.week.onclick  = () => setActiveTab('week');
tabs.month.onclick = () => setActiveTab('month');
tabs.shop.onclick  = () => setActiveTab('shop');

// ────────────────────────────────────────────────
// WEEK CYCLING ("Next Week" button)
// ────────────────────────────────────────────────

$("randBtn").onclick = () => {
  currentWeekIndex = (currentWeekIndex + 1) % MONTH_PLAN.length;
  saveCurrentWeek();
  
  // Refresh visible views
  if (!views.today.classList.contains('hidden') || !views.week.classList.contains('hidden')) {
    renderCurrentWeekContent();
  }
  if (!views.month.classList.contains('hidden')) {
    renderMonthOverview();
  }
  if (!views.shop.classList.contains('hidden')) {
    renderShoppingList();
  }

  // Switch to week view after changing
  setActiveTab('week');
};

// ────────────────────────────────────────────────
// RENDER TODAY & WEEK CARDS
// ────────────────────────────────────────────────

function getTodayDayIndex() {
  const today = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return (today === 0 ? 6 : today - 1); // Mon=0, Tue=1, ..., Sun=6
}

function renderMealCard(type, mealName, isKids = false, kidsLunchName = '') {
  const kcal = MEAL_KCAL[mealName] || 550;
  const imgSrc = MEAL_IMAGES[mealName] || MEAL_IMAGES.default;

  const card = document.createElement('div');
  card.className = 'card';

  let kidsHtml = '';
  if (isKids && kidsLunchName) {
    kidsHtml = `
      <button type="button" class="kids-btn">Kids Lunch ▼</button>
      <div class="kids-dropdown hidden">
        <select class="kids-select">
          <option selected disabled>Kids: ${escapeHtml(kidsLunchName)}</option>
          <option>— same as family —</option>
          <option>Extra ${escapeHtml(kidsLunchName)}</option>
        </select>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="imgWrap">
      <img class="mealImg" src="${imgSrc}" alt="${escapeHtml(mealName)}" loading="lazy">
    </div>
    <div class="cardTop">
      <div>
        <div class="mealType">${type}</div>
        <div class="mealName">${escapeHtml(mealName)}</div>
      </div>
      <div class="kcal">${kcal} kcal</div>
    </div>
    ${kidsHtml}
    <div class="details">
      <h3>Ingredients (estimated)</h3>
      <p>→ Customize this section in data.js later</p>
    </div>
  `;

  // Expand/collapse on card click (except when clicking kids button)
  card.addEventListener('click', e => {
    if (!e.target.closest('.kids-btn') && !e.target.closest('.kids-select')) {
      card.classList.toggle('expanded');
    }
  });

  // Toggle kids dropdown
  const kidsBtn = card.querySelector('.kids-btn');
  if (kidsBtn) {
    kidsBtn.addEventListener('click', e => {
      e.stopPropagation();
      const dropdown = card.querySelector('.kids-dropdown');
      dropdown.classList.toggle('hidden');
    });
  }

  return { element: card, kcal };
}

function renderDayCards(container, dayPlan) {
  let totalKcal = 0;

  // Breakfast
  const bf = renderMealCard('Breakfast', dayPlan.breakfast);
  container.appendChild(bf.element);
  totalKcal += bf.kcal;

  // Lunch + kids
  const lunch = renderMealCard('Lunch', dayPlan.lunch, true, dayPlan.kidsLunch);
  container.appendChild(lunch.element);
  totalKcal += lunch.kcal;

  // Dinner
  const dinner = renderMealCard('Dinner', dayPlan.dinner);
  container.appendChild(dinner.element);
  totalKcal += dinner.kcal;

  return totalKcal;
}

function renderCurrentWeekContent() {
  const week = MONTH_PLAN[currentWeekIndex];
  const todayIdx = getTodayDayIndex();
  const todayPlan = week.days[todayIdx];

  // Today view
  $("todayPill").textContent = `${todayPlan.day} • ${new Date().toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })}`;

  const todayWrap = $("todayCards");
  todayWrap.innerHTML = '';
  const todayTotal = renderDayCards(todayWrap, todayPlan);
  $("todayCalTotal").textContent = `Estimated daily total: ≈ ${todayTotal} kcal`;

  // Week view
  $("weekNumber").textContent = week.week;

  const dayTabs = $("dayTabs");
  dayTabs.innerHTML = '';

  let activeDay = todayIdx;

  week.days.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'dayTab' + (i === activeDay ? ' active' : '');
    btn.textContent = d.day.slice(0,3);
    btn.onclick = () => {
      activeDay = i;
      [...dayTabs.children].forEach((b, idx) => b.classList.toggle('active', idx === activeDay));
      renderWeekDayCards(activeDay);
    };
    dayTabs.appendChild(btn);
  });

  renderWeekDayCards(activeDay);
}

function renderWeekDayCards(dayIndex) {
  const week = MONTH_PLAN[currentWeekIndex];
  const dayPlan = week.days[dayIndex];

  const wrap = $("weekCards");
  wrap.innerHTML = '';

  const dayTotal = renderDayCards(wrap, dayPlan);
  $("weekCalTotals").textContent = `${dayPlan.day} estimated total: ≈ ${dayTotal} kcal`;
}

// ────────────────────────────────────────────────
// MONTH OVERVIEW (small tiles)
// ────────────────────────────────────────────────

function renderMonthOverview() {
  const grid = $("monthGrid");
  grid.innerHTML = '';

  MONTH_PLAN.forEach(week => {
    const weekBlock = document.createElement('div');
    weekBlock.className = 'month-week';

    const title = document.createElement('div');
    title.className = 'month-week-title';
    title.textContent = `Week ${week.week}`;
    weekBlock.appendChild(title);

    week.days.forEach((day, idx) => {
      const tile = document.createElement('div');
      tile.className = 'month-tile';
      tile.innerHTML = `
        <div class="tile-day">${day.day}</div>
        <div class="tile-meal">${escapeHtml(day.dinner || '—')}</div>
      `;
      tile.onclick = () => {
        currentWeekIndex = week.week - 1;
        saveCurrentWeek();
        setActiveTab('week');
      };
      weekBlock.appendChild(tile);
    });

    grid.appendChild(weekBlock);
  });
}

// ────────────────────────────────────────────────
// SHOPPING LIST
// ────────────────────────────────────────────────

function renderShoppingList() {
  const week = MONTH_PLAN[currentWeekIndex];
  $("shopWeekNum").textContent = week.week;

  const mealCounts = {};

  week.days.forEach(day => {
    [day.breakfast, day.lunch, day.dinner, day.kidsLunch].forEach(meal => {
      if (meal) {
        mealCounts[meal] = (mealCounts[meal] || 0) + 1;
      }
    });
  });

  const tbody = $("shopBody");
  tbody.innerHTML = '';

  // Staples first
  STAPLES.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(item.name)}</strong></td>
      <td>${escapeHtml(item.qty)}</td>
      <td>${escapeHtml(item.note)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Meals
  Object.entries(mealCounts).sort().forEach(([meal, count]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(meal)}</td>
      <td>${count}×</td>
      <td>—</td>
    `;
    tbody.appendChild(tr);
  });
}

// ────────────────────────────────────────────────
// UTILITIES
// ────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ────────────────────────────────────────────────
// INITIALIZATION
// ────────────────────────────────────────────────

currentWeekIndex = loadSavedWeek() % MONTH_PLAN.length;

// Initial render
renderCurrentWeekContent();
renderShoppingList();
setActiveTab('today');
