const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIdx = (new Date().getDay() + 6) % 7;
let activeDay = DAYS[todayIdx];
let activeTab = "Today";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061";

const WEEK = {
  Mon: {
    breakfast: { name: "Cereal / Sandwich", img: FALLBACK_IMG, ingredients: ["milk","bread"] },
    lunch: { main: "Jollof Rice & Chicken", kids: "Jollof Rice & Chicken", office: "Leftovers", ingredients: ["rice","chicken"] },
    dinner: { name: "Salmon & Veg", img: FALLBACK_IMG, ingredients: ["fish","veggies"] }
  },
  Tue: {
    breakfast: { name: "Cereal / Sandwich", img: FALLBACK_IMG, ingredients: ["milk","bread"] },
    lunch: { main: "Fried Rice & Chicken", kids: "Fried Rice & Chicken", office: "Leftovers", ingredients: ["rice","chicken"] },
    dinner: { name: "Burger & Salad", img: FALLBACK_IMG, ingredients: ["beef","salad"] }
  },
  Wed: {
    breakfast: { name: "Cereal / Sandwich", img: FALLBACK_IMG, ingredients: ["milk","bread"] },
    lunch: { main: "Pasta Bolognese", kids: "Pasta", office: "Leftovers", ingredients: ["pasta","beef"] },
    dinner: { name: "Grilled Fish & Potatoes", img: FALLBACK_IMG, ingredients: ["fish","potato"] }
  },
  Thu: {
    breakfast: { name: "Cereal / Sandwich", img: FALLBACK_IMG, ingredients: ["milk","bread"] },
    lunch: { main: "Jollof Rice & Fish", kids: "Jollof Rice & Fish", office: "Leftovers", ingredients: ["rice","fish"] },
    dinner: { name: "Chicken Stir-fry", img: FALLBACK_IMG, ingredients: ["chicken","veggies"] }
  },
  Fri: {
    breakfast: { name: "Cereal / Sandwich", img: FALLBACK_IMG, ingredients: ["milk","bread"] },
    lunch: { main: "Fried Rice", kids: "Fried Rice", office: "Leftovers", ingredients: ["rice"] },
    dinner: { name: "Pizza", img: FALLBACK_IMG, ingredients: ["bread"] }
  },
  Sat: {
    breakfast: { name: "Yam & Egg", img: FALLBACK_IMG, ingredients: ["egg","yam"] },
    lunch: { main: "Jollof Rice", kids: "Jollof Rice", office: "Leftovers", ingredients: ["rice"] },
    dinner: { name: "Eba & Okra", img: FALLBACK_IMG, ingredients: ["veggies"] }
  },
  Sun: {
    breakfast: { name: "Akara", img: FALLBACK_IMG, ingredients: ["beans"] },
    lunch: { main: "Pasta", kids: "Pasta", office: "Leftovers", ingredients: ["pasta"] },
    dinner: { name: "Grilled Fish & Potatoes", img: FALLBACK_IMG, ingredients: ["fish","potato"] }
  }
};

function buildDays() {
  const el = document.getElementById("weekDays");
  el.innerHTML = "";
  DAYS.forEach(d => {
    const b = document.createElement("button");
    b.className = "day-btn" + (d === activeDay ? " active" : "");
    b.textContent = d;
    b.onclick = () => { activeDay = d; buildDays(); render(); };
    el.appendChild(b);
  });
}

function card(label, meal, isLunch) {
  return `
  <div class="meal-card">
    <img src="${meal.img}" />
    <div class="meal-body">
      <div class="meal-header">
        <div>
          <b>${label}</b>
          <div>${isLunch ? meal.main : meal.name}</div>
        </div>
        <span class="kcal">600 kcal</span>
      </div>
      <div class="dropdowns">
        <button class="pill dd-btn">Ingredients</button>
      </div>
    </div>
  </div>`;
}

function render() {
  const day = WEEK[activeDay];
  document.getElementById("app").innerHTML = `
    <div class="meal-row">
      ${card("Breakfast", day.breakfast, false)}
      ${card("Lunch", day.lunch, true)}
      ${card("Dinner", day.dinner, false)}
    </div>`;
}

document.getElementById("tabToday").onclick = () => { activeTab = "Today"; render(); };
document.getElementById("tabWeek").onclick = () => { activeTab = "Week"; render(); };
document.getElementById("tabShopping").onclick = () => { activeTab = "Shopping"; render(); };
document.getElementById("generateWeekBtn").onclick = () => alert("Next step: generator!");

buildDays();
render();
