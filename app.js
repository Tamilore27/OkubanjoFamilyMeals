/********************
 * OKUBIZZY APP.JS
 ********************/

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIdx = (new Date().getDay() + 6) % 7;
let activeDay = DAYS[todayIdx];
let activeTab = "Today";

// Rice themes (one per week)
const RICE_THEMES = ["Jollof Rice", "Fried Rice", "White Rice", "White Rice & Beans"];

// Images (local + fallback)
const IMG_MAP = {
  "Jollof Rice & Chicken": "images/JollofRice.jpg",
  "Jollof Rice & Fish": "images/JollofRice.jpg",
  "Jollof Rice & Beef": "images/JollofRice.jpg",
  "Fried Rice & Chicken": "images/FriedRice.jpg",
  "White Rice & Stew": "https://images.unsplash.com/photo-1604908177522-040f7b8d3f35",
  "White Rice & Beans": "https://images.unsplash.com/photo-1603133872878-684f6d2f9b45",
};
const FALLBACK_IMG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061";

// Calories (rough)
const CAL = {
  rice: 260, chicken: 220, beef: 250, fish: 200, eggs: 140, milk: 120,
  veggies: 80, tomato: 40, pasta: 320, potato: 160, salad: 120, beans: 220,
  plantain: 280, bread: 180, lamb: 300, stew: 180, oil: 120, egusi: 300
};

const POOL = {
  breakfastWeekday: [
    { name: "Cereal / Sandwich", ingredients: ["milk","bread"], img: FALLBACK_IMG }
  ],
  breakfastWeekend: [
    { name: "Yam & Egg", ingredients: ["eggs","oil"], img: FALLBACK_IMG },
    { name: "Moi Moi", ingredients: ["beans","oil"], img: FALLBACK_IMG },
    { name: "Akara", ingredients: ["beans","oil"], img: FALLBACK_IMG },
    { name: "Potatoes & Egg", ingredients: ["potato","eggs"], img: FALLBACK_IMG }
  ],
  lunch: [
    { main: "Jollof Rice & Chicken", kids: "Jollof Rice & Chicken", office: "Jollof Rice & Chicken", ingredients: ["rice","tomato","chicken"], carbHeavy: true },
    { main: "Jollof Rice & Fish", kids: "Jollof Rice & Fish", office: "Jollof Rice & Fish", ingredients: ["rice","tomato","fish"], carbHeavy: true },
    { main: "Jollof Rice & Beef", kids: "Jollof Rice & Beef", office: "Jollof Rice & Beef", ingredients: ["rice","tomato","beef"], carbHeavy: true },
    { main: "Fried Rice & Chicken", kids: "Fried Rice & Chicken", office: "Fried Rice & Chicken", ingredients: ["rice","chicken","veggies"], carbHeavy: true },
    { main: "Pasta Bolognese", kids: "Pasta Bolognese", office: "Pasta Bolognese", ingredients: ["pasta","beef","tomato"], carbHeavy: true },
    { main: "White Rice & Stew", kids: "White Rice & Stew", office: "White Rice & Stew", ingredients: ["rice","stew","beef"], carbHeavy: true },
    { main: "White Rice & Beans", kids: "White Rice & Beans", office: "White Rice & Beans", ingredients: ["rice","beans"], carbHeavy: true }
  ],
  kidsOnly: [
    { name: "White Rice & Butter Chicken", ingredients: ["rice","chicken","oil"] }
  ],
  dinnerProtein: [
    { name: "Salmon + Stir-fry Veg + Potatoes", ingredients: ["fish","veggies","potato"] },
    { name: "Chicken + Stir-fry Veg + Potatoes", ingredients: ["chicken","veggies","potato"] },
    { name: "Grilled Fish & Potatoes", ingredients: ["fish","potato"] },
    { name: "Lamb Chops & Potatoes", ingredients: ["lamb","potato"] },
    { name: "Burger & Salad", ingredients: ["beef","salad","bread"] }
  ],
  dinnerRice: [
    { name: "White Rice & Stew", ingredients: ["rice","stew","beef"] },
    { name: "White Rice & Efo", ingredients: ["rice","veggies","beef"] },
    { name: "Rice & Beef Stir-fry", ingredients: ["rice","beef","veggies"] },
    { name: "White Rice & Pepper Soup", ingredients: ["rice","fish","tomato"] }
  ],
  dinnerSwallow: [
    { name: "Eba & Okra", ingredients: ["veggies","oil"] },
    { name: "Amala & Efo", ingredients: ["veggies","oil"] },
    { name: "Poundo & Egusi", ingredients: ["egusi","oil"] }
  ],
  fridayFun: [
    { name: "Pizza", ingredients: ["bread","oil"] },
    { name: "Burger & Salad", ingredients: ["beef","salad","bread"] },
    { name: "Grilled Fish & Potatoes", ingredients: ["fish","potato"] },
    { name: "Rice & Beef Stir-fry", ingredients: ["rice","beef","veggies"] }
  ],
  saladProteins: ["chicken","beef","fish","shrimp"]
};

function randPick(a){ return a[Math.floor(Math.random()*a.length)]; }
function approxCalories(ings){ return (ings||[]).reduce((s,k)=>s+(CAL[k]||120),0); }
function getImg(key){ return IMG_MAP[key] || FALLBACK_IMG; }

function loadLastWeekMeta(){
  try { return JSON.parse(localStorage.getItem("okubizzy_last_week_meta")); } catch { return null; }
}
function saveLastWeekMeta(m){ localStorage.setItem("okubizzy_last_week_meta", JSON.stringify(m)); }

function loadWeek(){
  try { return JSON.parse(localStorage.getItem("okubizzy_week")); } catch { return null; }
}
function saveWeek(w){ localStorage.setItem("okubizzy_week", JSON.stringify(w)); }

function generateNewWeek(){
  const last = loadLastWeekMeta();
  let riceTheme = randPick(RICE_THEMES);
  if (last?.riceTheme === riceTheme) {
    riceTheme = RICE_THEMES.find(t => t !== riceTheme) || riceTheme;
  }

  const week = {};
  let swallowUsed = 0;
  let lastDinner = null, streak = 0;

  DAYS.forEach((d, i) => {
    const isWeekend = d === "Sat" || d === "Sun";
    const breakfast = isWeekend ? randPick(POOL.breakfastWeekend) : randPick(POOL.breakfastWeekday);

    let lunchPool = POOL.lunch.filter(m => {
      if (riceTheme === "Jollof Rice") return m.main.startsWith("Jollof");
      if (riceTheme === "Fried Rice") return m.main.startsWith("Fried Rice");
      if (riceTheme === "White Rice") return m.main.startsWith("White Rice");
      if (riceTheme === "White Rice & Beans") return m.main.includes("Rice & Beans");
      return true;
    });
    let lunch = randPick(lunchPool);

    let dinnerPool = POOL.dinnerProtein.concat(POOL.dinnerRice);
    if (d === "Fri") dinnerPool = POOL.fridayFun;
    if (lunch.carbHeavy) dinnerPool = POOL.dinnerProtein;

    if (d === "Sun") dinnerPool = dinnerPool.filter(m => !m.name.toLowerCase().includes("rice"));

    if (Math.random() < 0.25 && swallowUsed < 1) {
      dinnerPool = POOL.dinnerSwallow;
    }

    let dinner = randPick(dinnerPool);
    if (lastDinner === dinner.name) {
      streak++;
      if (streak >= 2) {
        dinner = randPick(dinnerPool.filter(x => x.name !== lastDinner));
        streak = 1;
      }
    } else {
      streak = 1;
    }
    if (POOL.dinnerSwallow.find(x => x.name === dinner.name)) swallowUsed++;
    lastDinner = dinner.name;

    week[d] = { breakfast, lunch, dinner };
  });

  saveLastWeekMeta({ riceTheme, dinners: Object.values(week).map(x=>x.dinner.name) });
  saveWeek(week);
  return week;
}

let weekPlan = loadWeek() || generateNewWeek();

/************
 * UI Render
 ************/
function card(label, meal, isLunch){
  const title = isLunch ? meal.main : meal.name;
  const kcal = approxCalories(meal.ingredients);
  const img = getImg(title);
  return `
  <div class="meal-card">
    <img src="${img}" onerror="this.src='${FALLBACK_IMG}'"/>
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
        ${isLunch ? `<button class="pill dd-btn" data-dd="kids">Kids Lunch</button>
        <button class="pill dd-btn" data-dd="office">Office Lunch</button>` : ``}
      </div>
      <div class="dropdown-panel hidden"></div>
    </div>
  </div>`;
}

function render(){
  const app = document.getElementById("app");
  const day = weekPlan[activeDay];

  if (activeTab === "Today") {
    app.innerHTML = `<div class="meal-row">
      ${card("Breakfast", day.breakfast, false)}
      ${card("Lunch", day.lunch, true)}
      ${card("Dinner", day.dinner, false)}
    </div>`;
  }
}

document.getElementById("generateWeekBtn").onclick = () => {
  weekPlan = generateNewWeek();
  render();
};

render();
