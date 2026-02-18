// ---------- Constants ----------
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0 ... Sun=6
let activeDay = DAYS[todayIdx];
let activeTab = "Today";

// Local images you have in repo
const IMG_MAP = {
  "Jollof Rice": "images/JollofRice.jpg",
  "Fried Rice": "images/FriedRice.jpg"
};

// Safe fallback image (always works)
const FALLBACK_IMG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061";

// Ingredient calorie estimates (rough)
const CAL = {
  rice: 260, chicken: 220, beef: 250, fish: 200, eggs: 140, milk: 120,
  veggies: 80, tomato: 40, pasta: 320, potato: 160, salad: 120, beans: 220,
  plantain: 280, bread: 180
};

// ---------- Meal Pools ----------
const POOL = {
  breakfast: [
    { name: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", ingredients: ["milk","bread"] },
    { name: "Yam & Egg", img: "https://images.unsplash.com/photo-1584270354949-1a98fbb0d4e7", ingredients: ["eggs","veggies"] }
  ],
  lunch: [
    {
      main: "Jollof Rice",
      kids: "Jollof + Chicken",
      office: "Jollof + Beef",
      ingredients: ["rice","tomato","chicken","beef"]
    },
    {
      main: "Fried Rice",
      kids: "Fried Rice + Chicken",
      office: "Chicken Salad",
      ingredients: ["rice","chicken","veggies","salad"]
    }
  ],
  dinner: [
    { name: "Porridge (Fish)", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092", ingredients: ["fish","veggies","tomato"] },
    { name: "Salmon & Veggies", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2", ingredients: ["fish","veggies","potato"] }
  ]
};

// ---------- State ----------
let weekPlan = loadWeek() || generateNewWeek();

// ---------- Helpers ----------
function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function approxCalories(ingredients) {
  if (!ingredients || !ingredients.length) return 600;
  return ingredients.reduce((sum, key) => sum + (CAL[key] || 120), 0);
}

function getMealImage(meal) {
  // Lunch uses local files by main name
  const key = meal.main || meal.name;
  if (IMG_MAP[key]) return IMG_MAP[key];
  return meal.img || FALLBACK_IMG;
}

function saveWeek() {
  localStorage.setItem("okubizzy_week", JSON.stringify(weekPlan));
}

function loadWeek() {
  try {
    const raw = localStorage.getItem("okubizzy_week");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function generateNewWeek() {
  const newWeek = {};
  let swallowUsed = false;

  DAYS.forEach(d => {
    const breakfast = randPick(POOL.breakfast);

    const lunch = randPick(POOL.lunch);

    let dinner = randPick(POOL.dinner);
    // Example constraint placeholder (swallow max once) – can expand later
    if ((dinner.name || "").toLowerCase().includes("eba") || (dinner.name || "").toLowerCase().includes("amala")) {
      if (swallowUsed) dinner = randPick(POOL.dinner);
      swallowUsed = true;
    }

    newWeek[d] = { breakfast, lunch, dinner };
  });

  return newWeek;
}

// ---------- UI Builders ----------
function buildDays() {
  const el = document.getElementById("weekDays");
  el.innerHTML = "";
  DAYS.forEach(d => {
    const b = document.createElement("button");
    b.className = "day-btn" + (d === activeDay ? " active" : "");
    b.textContent = d;
    b.onclick = () => {
      activeDay = d;
      setActiveDayUI();
      render();
    };
    el.appendChild(b);
  });
}

function setActiveDayUI() {
  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === activeDay);
  });
}

function setActiveTabUI(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function card(label, meal, isLunch) {
  const img = getMealImage(meal);

  const title = isLunch ? meal.main : meal.name;
  const ingredients = meal.ingredients || [];
  const kcal = approxCalories(ingredients);

  // Build dropdown buttons
  const buttons = [
    `<button class="pill dd-btn" data-dd="ingredients">Ingredients</button>`
  ];

  if (isLunch) {
    buttons.push(`<button class="pill dd-btn" data-dd="kids">Kids Lunch</button>`);
    buttons.push(`<button class="pill dd-btn" data-dd="office">Office Lunch</button>`);
  }

  // Dropdown panel starts hidden
  return `
    <div class="meal-card">
      <img src="${img}" onerror="this.src='${FALLBACK_IMG}'" />
      <div class="meal-body">
        <div class="meal-header">
          <div>
            <div class="meal-title">${label}</div>
            <div class="meal-name">${escapeHtml(title)}</div>
          </div>
          <span class="kcal">${kcal} kcal</span>
        </div>

        <div class="dropdowns">
          ${buttons.join("")}
        </div>

        <div class="dropdown-panel hidden"></div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}

// ---------- Rendering ----------
function render() {
  const app = document.getElementById("app");
  const dayData = weekPlan[activeDay];

  if (!dayData) {
    app.innerHTML = `<p>Week plan missing. Click Generate New Week.</p>`;
    return;
  }

  if (activeTab === "Today") {
    app.innerHTML = `
      <div class="meal-row">
        ${card("Breakfast", dayData.breakfast, false)}
        ${card("Lunch", dayData.lunch, true)}
        ${card("Dinner", dayData.dinner, false)}
      </div>
    `;
    wireDropdowns();
    return;
  }

  if (activeTab === "Week") {
    app.innerHTML = `
      <div class="week-view">
        ${card("Breakfast", dayData.breakfast, false)}
        ${card("Lunch", dayData.lunch, true)}
        ${card("Dinner", dayData.dinner, false)}
      </div>
    `;
    wireDropdowns();
    return;
  }

  if (activeTab === "Shopping") {
    const list = buildShoppingList(weekPlan);
    app.innerHTML = `
      <div class="shop-wrap">
        <h2>Shopping List</h2>
        <div class="shop-grid">
          ${list.map(i => `<div class="shop-item"><b>${i.item}</b><div style="color:#777;font-size:12px;">${i.count}x</div></div>`).join("")}
        </div>
      </div>
    `;
    return;
  }
}

function buildShoppingList(week) {
  // Aggregate ingredients from all days / meals
  const counts = {};

  // monthly constants (always)
  ["milk","eggs"].forEach(k => counts[k] = (counts[k] || 0) + 4);

  Object.values(week).forEach(d => {
    [d.breakfast, d.lunch, d.dinner].forEach(meal => {
      const ing = meal.ingredients || [];
      ing.forEach(x => counts[x] = (counts[x] || 0) + 1);
    });
  });

  // Pretty label map
  const label = {
    rice: "Rice",
    chicken: "Chicken",
    beef: "Beef",
    fish: "Fish",
    eggs: "Eggs",
    milk: "Milk",
    veggies: "Vegetables",
    tomato: "Tomatoes",
    pasta: "Pasta",
    potato: "Potatoes",
    salad: "Salad Mix",
    beans: "Beans",
    plantain: "Plantain",
    bread: "Bread"
  };

  return Object.entries(counts)
    .sort((a,b) => b[1]-a[1])
    .map(([k,v]) => ({ item: label[k] || k, count: v }));
}

function wireDropdowns() {
  // For each card: attach click logic to dropdown buttons
  document.querySelectorAll(".meal-card").forEach(cardEl => {
    const panel = cardEl.querySelector(".dropdown-panel");
    const buttons = cardEl.querySelectorAll(".dd-btn");

    buttons.forEach(btn => {
      btn.onclick = () => {
        // toggle active style
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // show panel
        panel.classList.remove("hidden");

        // decide content based on dd type and which card it is
        const dd = btn.getAttribute("data-dd");

        // Determine which meal this card represents by reading title label
        const label = cardEl.querySelector(".meal-title")?.textContent || "";
        const day = weekPlan[activeDay];

        let mealObj = null;
        if (label === "Breakfast") mealObj = day.breakfast;
        if (label === "Lunch") mealObj = day.lunch;
        if (label === "Dinner") mealObj = day.dinner;

        if (!mealObj) {
          panel.innerHTML = "No details.";
          return;
        }

        if (dd === "ingredients") {
          const ing = mealObj.ingredients || [];
          panel.innerHTML = `
            <b>Ingredients</b>
            <ul>
              ${ing.map(i => `<li>${escapeHtml(i)}</li>`).join("")}
            </ul>
          `;
          return;
        }

        if (dd === "kids") {
          panel.innerHTML = `<b>Kids Lunch</b><div>${escapeHtml(mealObj.kids || "—")}</div>`;
          return;
        }

        if (dd === "office") {
          panel.innerHTML = `<b>Office Lunch</b><div>${escapeHtml(mealObj.office || "—")}</div>`;
          return;
        }
      };
    });
  });
}

// ---------- Events ----------
document.getElementById("tabToday").onclick = () => {
  activeTab = "Today";
  setActiveTabUI("tabToday");
  render();
};

document.getElementById("tabWeek").onclick = () => {
  activeTab = "Week";
  setActiveTabUI("tabWeek");
  render();
};

document.getElementById("tabShopping").onclick = () => {
  activeTab = "Shopping";
  setActiveTabUI("tabShopping");
  render();
};

document.getElementById("generateWeekBtn").onclick = () => {
  // Active purple state
  const btn = document.getElementById("generateWeekBtn");
  btn.classList.add("active");

  weekPlan = generateNewWeek();
  saveWeek();

  // Re-render current view
  render();

  // remove active after short delay for nice feedback
  setTimeout(() => btn.classList.remove("active"), 700);
};

// ---------- Init ----------
buildDays();
setActiveDayUI();
render();
