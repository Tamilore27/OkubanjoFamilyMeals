const meals = {
  Wed: {
    breakfast: { title: "Cereal / Sandwich", kcal: 420, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    lunch: { title: "Kids: Fried Rice • Office: Chicken Salad", kcal: 600, img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Porridge (Fish)", kcal: 780, img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }
  }
};

let activeTab = "Today";
let activeDay = "Wed";

function render() {
  const app = document.getElementById("app");
  const d = meals[activeDay];

  if (activeTab === "Today") {
    app.innerHTML = `
      <h2>Today (${activeDay})</h2>
      <div class="meal-row">
        ${card("Breakfast", d.breakfast, false)}
        ${card("Lunch", d.lunch, true)}
        ${card("Dinner", d.dinner, false)}
      </div>
    `;
  }

  if (activeTab === "Week") {
    app.innerHTML = `
      <div class="week-view">
        ${stackedCard("Breakfast", d.breakfast, false)}
        ${stackedCard("Lunch", d.lunch, true)}
        ${stackedCard("Dinner", d.dinner, false)}
      </div>
    `;
  }

  if (activeTab === "Shopping") {
    app.innerHTML = `<h2>Shopping List (coming next)</h2>`;
  }
}

function card(label, item, isLunch) {
  return `
    <div class="meal-card">
      <img src="${item.img}" />
      <div class="meal-body">
        <div class="meal-header">
          <div>
            <div class="meal-title">${label}</div>
            <div class="meal-name">${item.title}</div>
          </div>
          <span class="kcal">${item.kcal} kcal</span>
        </div>

        <div class="dropdowns">
          <button class="pill" onclick="toggleDrop(this)">Ingredients</button>
          ${isLunch ? `<button class="pill" onclick="toggleDrop(this)">Kids Lunch</button>
                       <button class="pill" onclick="toggleDrop(this)">Office Lunch</button>` : ``}
        </div>

        <div class="dropdown-panel hidden">
          <div class="drop-content"></div>
        </div>
      </div>
    </div>
  `;
}

function stackedCard(label, item, isLunch) {
  return card(label, item, isLunch);
}

function toggleDrop(btn) {
  const panel = btn.closest(".meal-body").querySelector(".dropdown-panel");
  panel.classList.toggle("hidden");

  const label = btn.innerText;
  const content = panel.querySelector(".drop-content");

  if (label === "Ingredients") {
    content.innerHTML = `<ul><li>Rice</li><li>Chicken</li><li>Vegetables</li></ul>`;
  }
  if (label === "Kids Lunch") {
    content.innerHTML = `<ul><li>Smaller portion</li><li>Fruit snack</li></ul>`;
  }
  if (label === "Office Lunch") {
    content.innerHTML = `<ul><li>Adult portion</li><li>Extra protein</li></ul>`;
  }
}

document.getElementById("tabToday").onclick = () => { activeTab = "Today"; setTab("tabToday"); render(); };
document.getElementById("tabWeek").onclick = () => { activeTab = "Week"; setTab("tabWeek"); render(); };
document.getElementById("tabShopping").onclick = () => { activeTab = "Shopping"; setTab("tabShopping"); render(); };

function setTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

render();
