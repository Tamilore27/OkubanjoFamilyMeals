const demoWeek = [
  {
    day: "Mon",
    breakfast: "Cereal / Sandwich",
    lunch: "Kids: Jollof + chicken | Office: Leftovers",
    dinner: "Salmon + stir-fry veg + potatoes",
    images: {
      breakfast: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      lunch: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      dinner: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
    }
  }
];

function renderWeek() {
  const container = document.getElementById("weekView");
  container.innerHTML = `
    <h3>Monday</h3>
    <div class="meal-row">
      <div class="meal-card">
        <img src="${demoWeek[0].images.breakfast}" />
        <div class="meal-body"><strong>Breakfast</strong><br/>${demoWeek[0].breakfast}</div>
      </div>

      <div class="meal-card">
        <img src="${demoWeek[0].images.lunch}" />
        <div class="meal-body"><strong>Lunch</strong><br/>${demoWeek[0].lunch}</div>
      </div>

      <div class="meal-card">
        <img src="${demoWeek[0].images.dinner}" />
        <div class="meal-body"><strong>Dinner</strong><br/>${demoWeek[0].dinner}</div>
      </div>
    </div>
  `;
}

renderWeek();
