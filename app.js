const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
let activeDay = days[(new Date().getDay() + 6) % 7];
let activeTab = "Today";

const foodPool = {
  breakfast: [
    { name: "Cereal / Sandwich", kcal: 420, ingredients: ["Milk","Bread","Cereal"] },
    { name: "Yam & Egg", kcal: 520, ingredients: ["Yam","Eggs","Oil"] }
  ],
  lunch: [
    { main: "Fried Rice", kids: "Fried Rice + Chicken", office: "Chicken Salad", kcal: 600, ingredients: ["Rice","Chicken","Veggies"] },
    { main: "Jollof Rice", kids: "Jollof + Chicken", office: "Jollof + Beef", kcal: 650, ingredients: ["Rice","Tomato","Chicken","Beef"] }
  ],
  dinner: [
    { name: "Porridge (Fish)", kcal: 780, ingredients: ["Yam","Fish","Pepper"] },
    { name: "Salmon & Veggies", kcal: 700, ingredients: ["Salmon","Veggies","Potatoes"] }
  ]
};

let weekPlan = {};

function generateWeek() {
  weekPlan = {};
  days.forEach(d => {
    weekPlan[d] = {
      breakfast: pick(foodPool.breakfast),
      lunch: pick(foodPool.lunch),
      dinner: pick(foodPool.dinner)
    };
  });
  render();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderDays() {
  const el = document.getElementById("weekDays");
  el.innerHTML = "";
  days.forEach(d => {
    const b = document.createElement("button");
    b.className = "day-btn" + (d === activeDay ? " active" : "");
    b.textContent = d;
    b.onclick = () => { activeDay = d; renderDays(); render(); };
    el.appendChild(b);
  });
}

function card(label, meal, isLunch) {
  return `
  <div class="meal-card">
    <img src="https://source.unsplash.com/600x400/?food,${meal.name || meal.main}" />
    <div class="meal-body">
      <div class="meal-header">
        <div>
          <div class="meal-title">${label}</div>
          <div class="meal-name">${meal.name || meal.main}</div>
        </div>
        <span class="kcal">${meal.kcal} kcal</span>
      </div>

      <div class="dropdowns">
        <button class="pill" onclick="toggleDrop(this)">Ingredients</button>
        ${isLunch ? `<button class="pill" onclick="toggleDrop(this)">Kids Lunch</button>
                     <button class="pill" onclick="toggleDrop(this)">Office Lunch</button>` : ``}
      </div>

      <div class="dropdown-panel hidden"></div>
    </div>
  </div>`;
}

function toggleDrop(btn) {
  btn.classList.toggle("active");
  const panel = btn.closest(".meal-body").querySelector(".dropdown-panel");
  panel.classList.toggle("hidden");

  const meal = weekPlan[activeDay].lunch;
  if (btn.innerText === "Ingredients") panel.innerHTML = meal.ingredients.join(", ");
  if (btn.innerText === "Kids Lunch") panel.innerHTML = meal.kids;
  if (btn.innerText === "Office Lunch") panel.innerHTML = meal.office;
}

function render() {
  const d = weekPlan[activeDay];
  const app = document.getElementById("app");

  if (activeTab === "Today") {
    app.innerHTML = `
      <div class="meal-row">
        ${card("Breakfast", d.breakfast)}
        ${card("Lunch", d.lunch, true)}
        ${card("Dinner", d.dinner)}
      </div>`;
  }

  if (activeTab === "Week") {
    app.innerHTML = `
      <div class="week-view">
        ${card("Breakfast", d.breakfast)}
        ${card("Lunch", d.lunch, true)}
        ${card("Dinner", d.dinner)}
      </div>`;
  }

  if (activeTab === "Shopping") {
    const items = new Set();
    Object.values(weekPlan).forEach(day => {
      [...day.breakfast.ingredients, ...day.lunch.ingredients, ...day.dinner.ingredients].forEach(i => items.add(i));
    });
    items.add("Milk");
    items.add("Eggs");

    app.innerHTML = `<h3>Monthly Shopping List</h3><ul>${[...items].map(i=>`<li>${i}</li>`).join("")}</ul>`;
  }
}

document.getElementById("tabToday").onclick = () => { activeTab="Today"; render(); };
document.getElementById("tabWeek").onclick = () => { activeTab="Week"; render(); };
document.getElementById("tabShopping").onclick = () => { activeTab="Shopping"; render(); };
document.getElementById("generateWeekBtn").onclick = () => generateWeek();

generateWeek();
renderDays();
render();
