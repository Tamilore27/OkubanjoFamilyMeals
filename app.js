const meals = {
  Mon: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2" },
    lunch: { title: "Kids: Jollof + Chicken • Office: Leftovers", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Salmon + Stir-fry Veg + Potatoes", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" }
  },
  Tue: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" },
    lunch: { title: "Kids: Pasta Bolognese • Office: Leftovers", img: "https://images.unsplash.com/photo-1603133872878-684f6d2f9b45" },
    dinner: { title: "White Rice + Efo + Chicken", img: "https://images.unsplash.com/photo-1625944526184-fb0cfe19c56d" }
  },
  Wed: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    lunch: { title: "Kids: Fried Rice • Office: Chicken Salad", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Porridge (Fish)", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }
  },
  Thu: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" },
    lunch: { title: "Kids: Jollof + Fish • Office: Leftovers", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Eba + Okra", img: "https://images.unsplash.com/photo-1625944526184-fb0cfe19c56d" }
  },
  Fri: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    lunch: { title: "Kids: Fried Rice • Office: Shrimp Salad", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Grilled Fish + Potatoes", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" }
  },
  Sat: {
    breakfast: { title: "Akara + Pap", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" },
    lunch: { title: "Leftovers", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Fried Rice + Chicken", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" }
  },
  Sun: {
    breakfast: { title: "Yam & Egg", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    lunch: { title: "Light Snacks", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Jollof Rice + Beef", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" }
  }
};

const app = document.getElementById("app");
let activeTab = "Today";
let activeDay = getToday();

function getToday() {
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
}

function render() {
  app.innerHTML = "";

  const dayMeals = meals[activeDay];

  if (activeTab === "Today") {
    app.innerHTML = `
      <h2>Today (${activeDay})</h2>
      <div class="meal-row">
        ${card("Breakfast", dayMeals.breakfast)}
        ${card("Lunch", dayMeals.lunch)}
        ${card("Dinner", dayMeals.dinner)}
      </div>
    `;
  }

  if (activeTab === "Week") {
    app.innerHTML = `
      <h2>${activeDay}</h2>
      ${stackedCard("Breakfast", dayMeals.breakfast)}
      ${stackedCard("Lunch", dayMeals.lunch)}
      ${stackedCard("Dinner", dayMeals.dinner)}
    `;
  }

  if (activeTab === "Shopping") {
    app.innerHTML = `<h2>Shopping List</h2><p>Coming next…</p>`;
  }
}

function card(label, item) {
  return `
    <div class="meal-card">
      <img src="${item.img}" />
      <div class="meal-body">
        <div class="meal-header">
          <div>
            <div class="meal-title">${label}</div>
            <div class="meal-name">${item.title}</div>
          </div>
          <span class="kcal">${item.kcal || 600} kcal</span>
        </div>
      </div>
    </div>
  `;
}

function stackedCard(label, item) {
  return `
    <div class="meal-card" style="margin-bottom:16px;">
      <img src="${item.img}" />
      <div class="meal-body">
        <div class="meal-header">
          <div>
            <div class="meal-title">${label}</div>
            <div class="meal-name">${item.title}</div>
          </div>
          <span class="kcal">${item.kcal || 600} kcal</span>
        </div>

        <div class="dropdowns">
          <button class="pill">Ingredients</button>
          <button class="pill">Kids Lunch</button>
          <button class="pill">Office Lunch</button>
        </div>
      </div>
    </div>
  `;
}



/* Tabs */
document.getElementById("tabToday").onclick = () => {
  setActiveTab("Today");
};
document.getElementById("tabWeek").onclick = () => {
  setActiveTab("Week");
};
document.getElementById("tabShopping").onclick = () => {
  setActiveTab("Shopping");
};

function setActiveTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(`tab${tab}`).classList.add("active");
  render();
}

/* Day buttons */
document.querySelectorAll(".day-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeDay = btn.innerText;
    render();
  };
});

/* Generate New Week (placeholder for now) */
document.getElementById("generateWeekBtn").onclick = () => {
  alert("Generate New Week logic comes next 🙂");
};

/* Initial render */
render();
