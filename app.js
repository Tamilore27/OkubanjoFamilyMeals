const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
let activeDay = days[todayIndex];
let activeTab = "Today";

const meals = {
  Wed: {
    breakfast: { title: "Cereal / Sandwich", kcal: 420, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    lunch: { title: "Kids: Fried Rice • Office: Chicken Salad", kcal: 600, img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Porridge (Fish)", kcal: 780, img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }
  }
};

function renderDays() {
  const container = document.getElementById("weekDays");
  container.innerHTML = "";
  days.forEach(d => {
    const btn = document.createElement("button");
    btn.className = "day-btn" + (d === activeDay ? " active" : "");
    btn.textContent = d;
    btn.onclick = () => {
      activeDay = d;
      setActiveDay();
      render();
    };
    container.appendChild(btn);
  });
}

function setActiveDay() {
  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === activeDay);
  });
}

function setActiveTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function render() {
  const app = document.getElementById("app");
  const d = meals[activeDay];

  if (activeTab === "Today") {
    app.innerHTML = `
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
          ${pill("Ingredients")}
          ${isLunch ? pill("Kids Lunch") + pill("Office Lunch") : ""}
        </div>

        <div class="dropdown-panel hidden"></div>
      </div>
    </div>
  `;
}

function stackedCard(label, item, isLunch) {
  return card(label, item, isLunch);
}

function pill(label) {
  return `<button class="pill" onclick="toggleDrop(this)">${label}</button>`;
}

function toggleDrop(btn) {
  document.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const panel = btn.closest(".meal-body").querySelector(".dropdown-panel");
  panel.classList.toggle("hidden");

  if (btn.textContent === "Ingredients") {
    panel.innerHTML = `<ul><li>Rice</li><li>Chicken</li><li>Vegetables</li></ul>`;
  } else if (btn.textContent === "Kids Lunch") {
    panel.innerHTML = `<ul><li>Small portion</li><li>Fruit snack</li></ul>`;
  } else {
    panel.innerHTML = `<ul><li>Adult portion</li><li>Extra protein</li></ul>`;
  }
}

document.getElementById("tabToday").onclick = () => {
  activeTab = "Today";
  setActiveTab("tabToday");
  render();
};

document.getElementById("tabWeek").onclick = () => {
  activeTab = "Week";
  setActiveTab("tabWeek");
  render();
};

document.getElementById("tabShopping").onclick = () => {
  activeTab = "Shopping";
  setActiveTab("tabShopping");
  render();
};

document.getElementById("generateWeekBtn").onclick = () => {
  document.getElementById("generateWeekBtn").classList.toggle("active");
};

renderDays();
render();
