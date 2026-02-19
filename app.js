// app.js - Shared helpers

const $ = id => document.getElementById(id);

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[m]);
}

function getCurrentWeekIndex() {
  return parseInt(localStorage.getItem('okubizzyWeek') || '0');
}

function setCurrentWeekIndex(idx) {
  localStorage.setItem('okubizzyWeek', idx % 4);
}

function getTodayIndex() {
  const day = new Date().getDay();
  return (day === 0 ? 6 : day - 1);
}

function renderMealCard(type, meal, kidsLunch = '') {
  const kcal = MEAL_KCAL[meal] || 550;
  const img = MEAL_IMAGES[meal] || MEAL_IMAGES.default;
  const ingredients = getIngredients(meal);

  const card = document.createElement('div');
  card.className = 'card';

  let kidsHtml = '';
  if (kidsLunch) {
    kidsHtml = `
      <details class="dropdown">
        <summary>Kids Menu</summary>
        <p>${escapeHtml(kidsLunch)}</p>
      </details>
    `;
  }

  let ingredientsHtml = `
    <details class="dropdown">
      <summary>Ingredients</summary>
      <ul>
        ${ingredients.map(i => `<li>${i.qty} ${i.unit} ${escapeHtml(i.name)}</li>`).join('')}
      </ul>
    </details>
  `;

  card.innerHTML = `
    <div class="imgWrap">
      <img class="mealImg" src="${img}" alt="${escapeHtml(meal)}">
    </div>
    <div class="cardTop">
      <div>
        <div class="mealType">${type}</div>
        <div class="mealName">${escapeHtml(meal)}</div>
      </div>
      <div class="kcal">${kcal} kcal</div>
    </div>
    ${kidsHtml}
    ${ingredientsHtml}
  `;

  return card;
}
