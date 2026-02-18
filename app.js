// ---------- Constants ----------
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0 ... Sun=6
let activeDay = DAYS[todayIdx];
let activeTab = "Today";

// Local images (you already added these)
const IMG_MAP = {
  "Jollof Rice": "images/JollofRice.jpg",
  "Fried Rice": "images/FriedRice.jpg"
};
const FALLBACK_IMG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061";

// Approx calories by ingredient (rough)
const CAL = {
  rice: 260, chicken: 220, beef: 250, fish: 200, eggs: 140, milk: 120,
  veggies: 80, tomato: 40, pasta: 320, potato: 160, salad: 120, beans: 220,
  plantain: 280, bread: 180, lamb: 300, stew: 180, oil: 120
};

// ---------- Meal Pools (respecting your rules) ----------
const POOL = {
  breakfastWeekday: [
    { name: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", ingredients: ["milk","bread"] }
  ],
  breakfastWeekend: [
    { name: "Yam & Egg", img: "https://images.unsplash.com/photo-1584270354949-1a98fbb0d4e7", ingredients: ["eggs","oil"] },
    { name: "Moi Moi", img: "https://images.unsplash.com/photo-1617191518104-4a2c3a3aad0c", ingredients: ["beans","oil"] },
    { name: "Akara", img: "https://images.unsplash.com/photo-1617191518104-4a2c3a3aad0c", ingredients: ["beans","oil"] },
    { name: "Potatoes & Egg", img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc", ingredients: ["potato","eggs"] }
  ],
  lunch: [
    { main: "Jollof Rice", kids: "Jollof + Chicken", office: "Jollof + Beef", ingredients: ["rice","tomato","chicken","beef"], carbHeavy: true },
    { main: "Fried Rice", kids: "Fried Rice + Chicken", office: "Chicken Salad", ingredients: ["rice","chicken","veggies","salad"], carbHeavy: true },
    { main: "White Rice & Butter Chicken", kids: "White Rice + Butter Chicken", office: "White Rice + Chicken", ingredients: ["rice","chicken","oil"], carbHeavy: true },
    { main: "Pasta Bolognese", kids: "Pasta Bolognese", office: "Pasta Bolognese", ingredients: ["pasta","beef","tomato"], carbHeavy: true }
  ],
  dinnerProtein: [
    { name: "Salmon & Stir-fry Veg + Potatoes", ingredients: ["fish","veggies","potato"] },
    { name: "Grilled Fish & Potatoes", ingredients: ["fish","potato"] },
    { name: "Lamb Chops & Potatoes", ingredients: ["lamb","potato"] },
    { name: "Burger & Salad", ingredients: ["beef","salad","bread"] }
  ],
  dinnerRice: [
    { name: "White Rice & Stew", ingredients: ["rice","stew","beef"] },
    { name: "White Rice & Efo", ingredients: ["rice","veggies","beef"] },
    { name: "Rice & Beef Stir-fry", ingredients: ["rice","beef","veggies"] },
    { name: "Rice & Beans", ingredients: ["rice","beans"] },
    { name: "White Rice & Pepper Soup", ingredients: ["rice","fish","tomato"] }
  ],
  dinnerSwallow: [
    { name: "Eba & Okra", ingredients: ["veggies","oil"] },
    { name: "Amala & Efo", ingredients: ["veggies","oil"] },
    { name: "Poundo & Egusi", ingredients: ["veggies","oil"] }
  ],
  fridayFun: [
    { name: "Pizza", ingredients: ["bread","oil","cheese"] },
    { name: "Burger & Salad", ingredients: ["beef","salad","bread"] },
    { name: "Grilled Fish & Potatoes", ingredients: ["fish","potato"] },
    { name: "Rice & Beef Stir-fry", ingredients: ["rice","beef","veggies"] }
  ],
  saladProteins: ["chicken","beef","fish","shrimp"]
};

// ---------- State ----------
let weekPlan = loadWeek() || generateNewWeek();

// ---------- Helpers ----------
function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function approxCalories(ingredients) {
  return ingredients.reduce((s, k) => s + (CAL[k] || 120), 0);
}
function getMealImage(meal) {
  const key = meal.main || meal.name;
  return IMG_MAP[key] || meal.img || FALLBACK_IMG;
}
function saveWeek() { localStorage.setItem("okubizzy_week", JSON.stringify(weekPlan)); }
function loadWeek() {
  try { return JSON.parse(localStorage.getItem("okubizzy_week")); } catch { return null; }
}

// ---------- Generator (Rules enforced) ----------
function generateNewWeek() {
  const week = {};
  let swallowUsed = 0;
  let saladProteinIdx = Math.floor(Math.random() * POOL.saladProteins.length);

  DAYS.forEach((d, idx) => {
    const isWeekend = d === "Sat" || d === "Sun";

    const breakfast = isWeekend
      ? randPick(POOL.breakfastWeekend)
      : randPick(POOL.breakfastWeekday);

    const lunch = randPick(POOL.lunch);

    let dinner;

    // Friday fun rotation
    if (d === "Fri") {
      dinner = randPick(POOL.fridayFun);
    } else if (lunch.carbHeavy) {
      // Carb-heavy lunch -> protein-forward dinner
      dinner = randPick(POOL.dinnerProtein);
    } else {
      // Mix rice + protein dinners
      const mix = Math.random() < 0.6 ? POOL.dinnerRice : POOL.dinnerProtein;
      dinner = randPick(mix);
    }

    // Swallow max once per week
    if (Math.random() < 0.25 && swallowUsed < 1) {
      dinner = randPick(POOL.dinnerSwallow);
      swallowUsed++;
    }

    // One salad office lunch per week
    if (idx === 2) { // midweek salad
      const protein = POOL.saladProteins[saladProteinIdx % POOL.saladProteins.length];
      lunch.office = `${protein.charAt(0).toUpperCase() + protein.slice(1)} Salad`;
      lunch.ingredients = Array.from(new Set([...lunch.ingredients, "salad", protein]));
      saladProteinIdx++;
    }

    week[d] = { breakfast, lunch, dinner };
  });

  saveWeek();
  return week;
}

// ---------- UI + Rendering ----------
function buildDays() {
  const el = document.getElementById("weekDays");
  el.innerHTML = "";
  DAYS.forEach(d => {
    const b = document.createElement("button");
    b.className = "day-btn" + (d === activeDay ? " active" : "");
    b.textContent = d;
    b.onclick = () => { activeDay = d; setActiveDayUI(); render(); };
    el.appendChild(b);
  });
}
function setActiveDayUI() {
  document.querySelectorAll(".day-btn").forEach(btn =>
    btn.classList.toggle("active", btn.textContent === activeDay)
  );
}
function setActiveTabUI(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function card(label, meal, isLunch) {
  const title = isLunch ? meal.main : meal.name;
  const kcal = approxCalories(meal.ingredients || []);
  const img = getMealImage(meal);

  return `
    <div class="meal-card">
      <img src="${img}" onerror="this.src='${FALLBACK_IMG}'" />
      <div class="meal-body">
        <div class="meal-header">
          <div>
            <div class="meal-title">${label}</div>
            <div class="meal-name">${title}</div>
          </div>
          <span class="kcal">${kcal} kcal</span>
        </div>
        <div class="dropdowns">
          <button class="pill dd-btn" data-dd="ingredients">Ingredients</button>
          ${isLunch ? `
            <button class="pill dd-btn" data-dd="kids">Kids Lunch</button>
            <button class="pill dd-btn" data-dd="office">Office Lunch</button>
          ` : ``}
        </div>
        <div class="dropdown-panel hidden"></div>
      </div>
    </div>
  `;
}

function wireDropdowns() {
  document.querySelectorAll(".meal-card").forEach(cardEl => {
    const panel = cardEl.querySelector(".dropdown-panel");
    const buttons = cardEl.querySelectorAll(".dd-btn");
    buttons.forEach(btn => {
      btn.onclick = () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        panel.classList.remove("hidden");

        const label = cardEl.querySelector(".meal-title").textContent;
        const meal = weekPlan[activeDay][label.toLowerCase()];

        if (btn.dataset.dd === "ingredients") {
          panel.innerHTML = `<b>Ingredients</b><ul>${(meal.ingredients||[]).map(i=>`<li>${i}</li>`).join("")}</ul>`;
        }
        if (btn.dataset.dd === "kids") panel.innerHTML = `<b>Kids Lunch</b><div>${meal.kids}</div>`;
        if (btn.dataset.dd === "office") panel.innerHTML = `<b>Office Lunch</b><div>${meal.office}</div>`;
      };
    });
  });
}

function buildShoppingList(week) {
  const counts = { milk: 4, eggs: 4 }; // constants
  Object.values(week).forEach(d => {
    [d.breakfast, d.lunch, d.dinner].forEach(m => {
      (m.ingredients || []).forEach(i => counts[i] = (counts[i] || 0) + 1);
    });
  });
  return Object.entries(counts).map(([k,v]) => `${k}: ${v}`);
}

function render() {
  const app = document.getElementById("app");
  const day = weekPlan[activeDay];

  if (activeTab === "Today") {
    app.innerHTML = `
      <div class="meal-row">
        ${card("Breakfast", day.breakfast, false)}
        ${card("Lunch", day.lunch, true)}
        ${card("Dinner", day.dinner, false)}
      </div>
    `;
    wireDropdowns();
  }

  if (activeTab === "Week") {
    app.innerHTML = `
      <div class="week-view">
        ${card("Breakfast", day.breakfast, false)}
        ${card("Lunch", day.lunch, true)}
        ${card("Dinner", day.dinner, false)}
      </div>
    `;
    wireDropdowns();
  }

  if (activeTab === "Shopping") {
    const items = buildShoppingList(weekPlan);
    app.innerHTML = `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
  }
}

// ---------- Events ----------
document.getElementById("tabToday").onclick = () => { activeTab = "Today"; setActiveTabUI("tabToday"); render(); };
document.getElementById("tabWeek").onclick = () => { activeTab = "Week"; setActiveTabUI("tabWeek"); render(); };
document.getElementById("tabShopping").onclick = () => { activeTab = "Shopping"; setActiveTabUI("tabShopping"); render(); };

document.getElementById("generateWeekBtn").onclick = () => {
  const btn = document.getElementById("generateWeekBtn");
  btn.classList.add("active");
  weekPlan = generateNewWeek();
  saveWeek();
  render();
  setTimeout(() => btn.classList.remove("active"), 600);
};

// ---------- Init ----------
buildDays();
setActiveDayUI();
render();
