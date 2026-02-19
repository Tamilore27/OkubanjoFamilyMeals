// ... (keep most of previous app.js)

// Update renderDayCards to use dropdown for kids lunch
function renderDayCards(container, day, isToday = false) {
  let totalKcal = 0;

  const makeCard = (type, title, hasKids = false) => {
    const kcal = MEAL_KCAL[title] || 550;
    totalKcal += kcal;

    const img = MEAL_IMAGES[title] || MEAL_IMAGES.default;

    const card = document.createElement("div");
    card.className = "card";

    let kidsHtml = "";
    if (hasKids && day.kidsLunch) {
      kidsHtml = `
        <div class="kids-dropdown hidden" id="kids-${type.toLowerCase()}">
          <select class="kids-select">
            <option selected disabled>Kids Lunch: ${escapeHtml(day.kidsLunch)}</option>
            <option>— same as family —</option>
            <option>Extra portion of ${escapeHtml(day.kidsLunch)}</option>
          </select>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="imgWrap">
        <img class="mealImg" src="${img}" alt="${escapeHtml(title)}" loading="lazy">
      </div>
      <div class="cardTop">
        <div>
          <div class="mealType">${type}</div>
          <div class="mealName">${escapeHtml(title)}</div>
        </div>
        <div class="kcal">${kcal} kcal</div>
      </div>
      ${kidsHtml}
      <div class="details">
        <h3>Ingredients (estimated)</h3>
        <p>Customize this list in data.js later</p>
      </div>
    `;

    if (hasKids && day.kidsLunch) {
      const kidsBtn = document.createElement("button");
      kidsBtn.className = "kids-btn";
      kidsBtn.textContent = "Kids Lunch ▼";
      kidsBtn.onclick = (e) => {
        e.stopPropagation();
        const dropdown = card.querySelector(".kids-dropdown");
        dropdown.classList.toggle("hidden");
      };
      card.querySelector(".cardTop").appendChild(kidsBtn);
    }

    card.onclick = (e) => {
      if (!e.target.closest(".kids-btn") && !e.target.closest(".kids-select")) {
        card.classList.toggle("expanded");
      }
    };

    container.appendChild(card);
  };

  makeCard("Breakfast", day.breakfast);
  makeCard("Lunch",    day.lunch, true);
  makeCard("Dinner",   day.dinner);

  return totalKcal;
}

// ... rest of app.js remains mostly the same
