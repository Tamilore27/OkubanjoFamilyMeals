let currentWeek = 0;
let currentView = "week";

const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

/* ================================
   🔽 IMAGE PLACEHOLDER SECTION
   Replace URLs below with your own images later
   ================================ */
// const mealImages = {
//   breakfast: "img/breakfast.jpg",
//   lunch: "img/lunch.jpg",
//   dinner: "img/dinner.jpg"
// };
/* ================================ */

const data = {
  Week1: {
    breakfast: "Sandwich / Cereal / Pancakes & Eggs",
    lunch: "Jollof rice & chicken (650 cal)",
    dinner: "Salmon & stir-fry veggies (550 cal)",
    kids: "Pancakes, eggs & sausages",
    calories: 1200
  },
  Week2: {
    breakfast: "Sandwich / Cereal / Pancakes & Eggs",
    lunch: "Fried rice & shrimp (700 cal)",
    dinner: "Pasta & chicken (680 cal)",
    kids: "Kids fried rice",
    calories: 1380
  },
  Week3: {
    breakfast: "Sandwich / Cereal / Pancakes & Eggs",
    lunch: "White rice & chicken stew (640 cal)",
    dinner: "Grilled fish & veggies (520 cal)",
    kids: "Jollof pasta",
    calories: 1160
  },
  Week4: {
    breakfast: "Sandwich / Cereal / Pancakes & Eggs",
    lunch: "White rice & beans (620 cal)",
    dinner: "Rice & beef stir-fry (750 cal)",
    kids: "White rice & butter chicken",
    calories: 1370
  }
};

function render() {
  const weekKey = `Week${currentWeek + 1}`;
  const w = data[weekKey];

  document.getElementById("viewTitle").innerText = weeks[currentWeek];

  document.querySelector("#breakfast .meal-content").innerText = w.breakfast;
  document.querySelector("#lunch .meal-content").innerText = w.lunch;
  document.querySelector("#dinner .meal-content").innerText = w.dinner;
  document.getElementById("kidsMenu").innerText = w.kids;

  document.getElementById("calorieTotal").innerText =
    `Approx total today: ${w.calories} calories`;
}

document.getElementById("randomizeBtn").onclick = () => {
  currentWeek = (currentWeek + 1) % 4;
  render();
};

document.getElementById("monthBtn").onclick = () => {
  const tiles = document.getElementById("monthTiles");
  tiles.innerHTML = "";
  weeks.forEach((w, i) => {
    const div = document.createElement("div");
    div.innerText = w;
    div.onclick = () => {
      currentWeek = i;
      render();
    };
    tiles.appendChild(div);
  });
  tiles.classList.toggle("hidden");
};

document.getElementById("weekBtn").onclick = () => render();

document.getElementById("todayBtn").onclick = () => {
  const today = new Date().getDay(); // 0-6
  document.getElementById("viewTitle").innerText += ` (Today: ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][today]})`;
};

document.getElementById("kidsMenuBtn").onclick = () => {
  document.getElementById("kidsMenu").classList.toggle("hidden");
};

document.getElementById("shoppingBtn").onclick = () => {
  document.getElementById("shoppingList").classList.toggle("hidden");
  const list = document.getElementById("shoppingItems");
  list.innerHTML = `
    <li>Eggs (Superstore/Walmart)</li>
    <li>Milk (Superstore/Walmart)</li>
    <li>Bread (Superstore/Walmart)</li>
    <li>Chicken breast</li>
    <li>Salmon</li>
    <li>Rice</li>
    <li>Veggies</li>
  `;
};

render();
