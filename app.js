const defaultWeek = [
  {
    day: "Mon",
    breakfast: "Cereal / Sandwich",
    kidsLunch: "Jollof + chicken",
    officeLunch: "Leftovers",
    dinner: "Salmon + stir-fry veg + potatoes",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    day: "Tue",
    breakfast: "Cereal / Sandwich",
    kidsLunch: "Butter chicken + rice",
    officeLunch: "Leftovers",
    dinner: "White rice + efo + chicken",
    image: "https://images.unsplash.com/photo-1604908177522-040f7b8d3f35"
  },
  {
    day: "Wed",
    breakfast: "Cereal / Sandwich",
    kidsLunch: "Pasta bolognese",
    officeLunch: "Leftovers",
    dinner: "Porridge (with fish)",
    image: "https://images.unsplash.com/photo-1603133872878-684f6d2f9b45"
  },
  {
    day: "Thu",
    breakfast: "Cereal / Sandwich",
    kidsLunch: "Jollof + fish",
    officeLunch: "Leftovers",
    dinner: "Eba + okra",
    image: "https://images.unsplash.com/photo-1625944526184-fb0cfe19c56d"
  },
  {
    day: "Fri",
    breakfast: "Cereal / Sandwich",
    kidsLunch: "Fried rice",
    officeLunch: "Chicken salad",
    dinner: "Grilled fish + potatoes",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
  }
];


const themes = ["jollof", "swallow", "fried-rice", "white-rice-efo"];
const saladRotation = ["chicken", "beef", "shrimp"];

let saladIndex = Number(localStorage.getItem("saladIndex") || 0);

const meals = {
  kidsLunchAllowed: [
    "Jollof + chicken",
    "Fried rice",
    "White rice + efo",
    "Butter chicken + rice",
    "Pasta bolognese"
  ],
  dinners: [
    "Salmon + stir-fry veg + potatoes",
    "Grilled chicken + veggies",
    "White rice + pepper soup (fish)",
    "Rice & beef stir-fry",
    "Boiled plantain + veggies + fish",
    "Porridge (with fish)",
    "Eba + okra",
    "Poundo + efo/egusi"
  ]
};

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateWeek() {
  const theme = randomPick(themes);
  const saladProtein = saladRotation[saladIndex % saladRotation.length];
  saladIndex++;
  localStorage.setItem("saladIndex", saladIndex);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  let swallowUsed = false;

  const week = days.map((day, i) => {
    let dinner = randomPick(meals.dinners);

    if (dinner.includes("Eba") || dinner.includes("Poundo")) {
      if (swallowUsed) {
        dinner = "Salmon + stir-fry veg + potatoes";
      } else {
        swallowUsed = true;
      }
    }

    return {
      day,
      breakfast: "Cereal / Sandwich",
      kidsLunch: randomPick(meals.kidsLunchAllowed),
      officeLunch: i === 4
        ? `${saladProtein} salad`
        : "Leftovers",
      dinner
    };
  });

  localStorage.setItem("currentWeek", JSON.stringify(week));
  renderWeek(week, theme);
}

function renderWeek(week, theme) {
  const container = document.getElementById("weekView");
  container.innerHTML = `<h3>Theme: ${theme.replace("-", " ").toUpperCase()}</h3>`;

  week.forEach(d => {
    container.innerHTML += `
      <div class="day-card">
        <strong>${d.day}</strong><br/>
        🍳 Breakfast: ${d.breakfast}<br/>
        🍱 Kids Lunch: ${d.kidsLunch}<br/>
        👔 Office Lunch: ${d.officeLunch}<br/>
        🍽️ Dinner: ${d.dinner}
      </div>
    `;
  });
}

document.getElementById("generateWeekBtn")
  .addEventListener("click", generateWeek);

const saved = localStorage.getItem("currentWeek");

if (saved) {
  renderWeek(JSON.parse(saved), "saved");
} else {
  renderWeek(defaultWeek, "default");
}

