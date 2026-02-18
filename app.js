const weekData = {
  Mon: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2" },
    lunch: { title: "Kids: Jollof + Chicken | Office: Leftovers", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Salmon + Stir-fry Veg + Potatoes", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" }
  },
  Tue: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" },
    lunch: { title: "Kids: Pasta Bolognese | Office: Leftovers", img: "https://images.unsplash.com/photo-1603133872878-684f6d2f9b45" },
    dinner: { title: "White Rice + Efo + Chicken", img: "https://images.unsplash.com/photo-1625944526184-fb0cfe19c56d" }
  },
  Wed: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    lunch: { title: "Kids: Fried Rice | Office: Chicken Salad", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Porridge (Fish)", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }
  },
  Thu: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" },
    lunch: { title: "Kids: Jollof + Fish | Office: Leftovers", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Eba + Okra", img: "https://images.unsplash.com/photo-1625944526184-fb0cfe19c56d" }
  },
  Fri: {
    breakfast: { title: "Cereal / Sandwich", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
    lunch: { title: "Kids: Fried Rice | Office: Shrimp Salad", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" },
    dinner: { title: "Grilled Fish + Potatoes", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" }
  }
};

let activeTab = "Today";
let activeDay = getTodayShort();

function getTodayShort() {
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
}

function render() {
  const container = document.getElementById("weekView");
  const d = weekData[activeDay] || weekData["Mon"];
  container.innerHTML = "";

  if (activeTab === "Today") {
    container.innerHTML = `
      <h3>Today (${activeDay})</h3>
      <div class="meal-row">
        ${card("Breakfast", d.breakfast)}
        ${card("Lunch", d.lunch)}
        ${card("Dinner", d.dinner)}
      </div>
    `;
  }

  if (activeTab === "Week") {
    container.innerHTML = `
      <h3>${activeDay}</h3>
      ${stackedCard("Breakfast", d.breakfast)}
      ${stackedCard("Lunch", d.lunch)}
      ${stackedCard("Dinner", d.dinner)}
    `;
  }
}

function card(label, item) {
  return `
    <div class="meal-card">
      <img src="${item.img}" onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061'"/>
      <div class="meal-body"><strong>${label}</strong><br/>${item.title}</div>
    </div>
  `;
}

function stackedCard(label, item) {
  return `
    <div class="meal-card" style="margin-bottom:16px;">
      <img src="${item.img}" onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061'"/>
      <div class="meal-body"><strong>${label}</strong><br/>${item.title}</div>
    </div>
  `;
}

// Tabs
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
  document.getElementById("weekView").innerHTML = "<h3>Shopping List (coming next)</h3>";
  setActiveTab("tabShopping");
};

function setActiveTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Day buttons
document.querySelectorAll(".day-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeDay = btn.innerText;
    render();
  };
});

// Initial render (default to today)
render();
