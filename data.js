// ────────────────────────────────────────────────
// SETTINGS & DATA
// ────────────────────────────────────────────────

const FAMILY = { size: 4, location: "Ottawa" };

// Rough kcal estimates — tune these later
const MEAL_KCAL = {
  "Sandwich": 480,
  "Cereal": 380,
  "Pancakes & eggs & sausages": 620,
  "Pancakes, eggs & sausages": 620,
  "Bread & egg": 450,
  "Yam & egg": 580,
  "Jollof rice & chicken": 780,
  "Fried rice & chicken": 760,
  "White rice & chicken stew": 740,
  "White rice & beans": 720,
  "Chicken salad": 520,
  "Shrimp salad": 480,
  "Beef salad": 550,
  "Rice & chicken stir-fry": 710,
  "Fried rice & shrimp": 740,
  "White rice & grilled fish": 680,
  "Healthy tuna wrap": 560,
  "Healthy veggie wrap": 480,
  "Salmon & stir-fry veggies": 650,
  "Grilled fish & veggies": 620,
  "Pizza": 880,
  "Pasta (special)": 760,
  "Beef pepper soup": 580,
  "Chicken pepper soup": 560,
  "Light veggie bowl": 420,
  "Light salad & grilled fish": 510,
  "Light salad & grilled chicken": 490,
  "Eba & Egusi": 820,
  "Eba & Okra": 780,
  "Leftover pasta & shrimp": 680,
  "Leftover pasta & chicken": 700,
  // Kids lunches
  "Jollof rice": 520,
  "Pancakes, eggs & sausages": 580,
  "Pasta & sauce": 550,
  "Bread, butter & jam / sandwiches": 480,
  "Kids fried rice": 600,
  "Jollof pasta": 580,
  "White rice & stew": 540,
  "White rice & butter chicken": 620
};

// ────────────────────────────────────────────────
// 4-WEEK STRUCTURE (from your Excel)
// day order: Mon → Sun
// ────────────────────────────────────────────────

const MONTH_PLAN = [
  // Week 1
  {
    week: 1,
    days: [
      { day: "Mon", breakfast: "Sandwich",         lunch: "Jollof rice & chicken",     dinner: "Salmon & stir-fry veggies", kidsLunch: "Jollof rice" },
      { day: "Tue", breakfast: "Cereal",           lunch: "Chicken salad",            dinner: "Beef pepper soup",          kidsLunch: "Pancakes, eggs & sausages" },
      { day: "Wed", breakfast: "Sandwich",         lunch: "Rice & chicken stir-fry",  dinner: "Grilled fish & veggies",    kidsLunch: "Pasta & sauce" },
      { day: "Thu", breakfast: "Cereal",           lunch: "Jollof rice & fish",       dinner: "Pasta & shrimp",            kidsLunch: "Kids fried rice" },
      { day: "Fri", breakfast: "Sandwich",         lunch: "Healthy tuna wrap",        dinner: "Pizza",                     kidsLunch: "Bread, butter & jam / sandwiches" },
      { day: "Sat", breakfast: "Pancakes & eggs",  lunch: "Puff puff / samosa",       dinner: "Leftover pasta & shrimp",   kidsLunch: "" },
      { day: "Sun", breakfast: "Bread & egg",      lunch: "Light veggie bowl",        dinner: "Eba & Egusi",               kidsLunch: "" }
    ]
  },
  // Week 2
  {
    week: 2,
    days: [
      { day: "Mon", breakfast: "Sandwich",         lunch: "Fried rice & chicken",     dinner: "Salmon & stir-fry veggies", kidsLunch: "Kids fried rice" },
      { day: "Tue", breakfast: "Cereal",           lunch: "Shrimp salad",             dinner: "Chicken pepper soup",       kidsLunch: "Pancakes, eggs & sausages" },
      { day: "Wed", breakfast: "Sandwich",         lunch: "Rice & chicken stir-fry",  dinner: "Grilled fish & veggies",    kidsLunch: "Jollof pasta" },
      { day: "Thu", breakfast: "Cereal",           lunch: "Fried rice & shrimp",      dinner: "Pasta & chicken",           kidsLunch: "Jollof rice" },
      { day: "Fri", breakfast: "Sandwich",         lunch: "Healthy veggie wrap",      dinner: "Pasta (special)",           kidsLunch: "Bread, butter & jam / sandwiches" },
      { day: "Sat", breakfast: "Yam & egg",        lunch: "Meat pie / sausage roll",  dinner: "Leftover pasta",            kidsLunch: "" },
      { day: "Sun", breakfast: "Pancakes & eggs",  lunch: "Light salad & grilled fish", dinner: "Beef pepper soup",       kidsLunch: "" }
    ]
  },
  // Week 3
  {
    week: 3,
    days: [
      { day: "Mon", breakfast: "Sandwich",         lunch: "White rice & chicken stew", dinner: "Salmon & stir-fry veggies", kidsLunch: "White rice & stew" },
      { day: "Tue", breakfast: "Cereal",           lunch: "Beef salad",               dinner: "Chicken pepper soup",       kidsLunch: "Pancakes, eggs & sausages" },
      { day: "Wed", breakfast: "Sandwich",         lunch: "Rice & chicken stir-fry",  dinner: "Grilled fish & veggies",    kidsLunch: "Jollof pasta" },
      { day: "Thu", breakfast: "Cereal",           lunch: "White rice & grilled fish", dinner: "Pasta & shrimp",           kidsLunch: "Kids fried rice" },
      { day: "Fri", breakfast: "Sandwich",         lunch: "Healthy tuna wrap",        dinner: "Grilled chicken + veggies & potatoes", kidsLunch: "White rice & butter chicken" },
      { day: "Sat", breakfast: "Pancakes & eggs",  lunch: "Puff puff / samosa",       dinner: "Leftover pasta & shrimp",   kidsLunch: "" },
      { day: "Sun", breakfast: "Bread & egg",      lunch: "Light veggie bowl",        dinner: "Eba & Okra",                kidsLunch: "" }
    ]
  },
  // Week 4
  {
    week: 4,
    days: [
      { day: "Mon", breakfast: "Sandwich",         lunch: "White rice & beans",       dinner: "Salmon & stir-fry veggies", kidsLunch: "White rice & stew" },
      { day: "Tue", breakfast: "Cereal",           lunch: "Chicken salad",            dinner: "Beef pepper soup",          kidsLunch: "Pancakes, eggs & sausages" },
      { day: "Wed", breakfast: "Sandwich",         lunch: "Rice & chicken stir-fry",  dinner: "Grilled fish & veggies",    kidsLunch: "Jollof pasta" },
      { day: "Thu", breakfast: "Cereal",           lunch: "White rice & beans + plantain", dinner: "Pasta & chicken",     kidsLunch: "Kids fried rice" },
      { day: "Fri", breakfast: "Sandwich",         lunch: "Healthy veggie wrap",      dinner: "Rice & beef stir-fry",      kidsLunch: "Jollof rice" },
      { day: "Sat", breakfast: "Yam & egg",        lunch: "Meat pie / sausage roll",  dinner: "Leftover pasta & chicken",  kidsLunch: "" },
      { day: "Sun", breakfast: "Pancakes & eggs",  lunch: "Light salad & grilled chicken", dinner: "Chicken pepper soup", kidsLunch: "" }
    ]
  }
];

// Placeholder images — replace with your own later
// Format: https://images.unsplash.com/... or pexels.com/...
const MEAL_IMAGES = {
  "Sandwich":                "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
  "Cereal":                  "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800",
  "Pancakes & eggs":         "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800",
  "Yam & egg":               "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  "Bread & egg":             "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800",
  "Jollof rice & chicken":   "https://images.unsplash.com/photo-1604908554069-6d7e0a6a5d47?w=800",
  "Fried rice & chicken":    "https://images.unsplash.com/photo-1604908177453-7462950a6b94?w=800",
  "White rice & chicken stew":"https://images.unsplash.com/photo-1604908554162-18cf3f1a09a6?w=800",
  "White rice & beans":      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
  default:                   "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800"
};

// Must-have staples
const STAPLES = [
  { name: "Eggs (dozen)", qty: "2", note: "Always keep in stock" },
  { name: "Milk (4L)",    qty: "1", note: "For cereal & cooking" },
  { name: "Bread (loaf)", qty: "2–3", note: "Sandwiches & toast" }
];
