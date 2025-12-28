const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const functionButtons = document.getElementById("functionButtons");
const functionSection = document.getElementById("functionSection");
const functionTitle = document.getElementById("functionTitle");
const aiList = document.getElementById("aiList");
const loadMoreBTN = document.getElementById("loadMore");
const priceFilter = document.getElementById("priceFilter");

let allAIs = [];
let currentFunction = null;
let displayedCount = 0;
const PAGE_SIZE = 12; // Load 12 per "page"

const allFunctions = [
  "text generation", "coding assistance", "image generation", "video generation",
  "voice generation", "research assistant", "finance", "agents", "3D models",
  "game assets", "motion capture", "podcast generation", "meeting transcription",
  "presentations", "automation"
];

// Load data
fetch('ais.json')
  .then(res => res.json())
  .then(data => {
    allAIs = data;
    buildFunctionButtons();
  });

// Build category buttons
function buildFunctionButtons() {
  allFunctions.forEach(func => {
    const btn = document.createElement("div");
    btn.className = "function-btn";
    btn.textContent = func.charAt(0).toUpperCase() + func.slice(1);
    btn.onclick = () => openFunction(func);
    functionButtons.appendChild(btn);
  });
}

// Open category
function openFunction(func) {
  currentFunction = func;
  functionTitle.textContent = func.charAt(0).toUpperCase() + func.slice(1);
  document.getElementById("home").classList.add("hidden");
  functionSection.classList.remove("hidden");
  aiList.innerHTML = "";
  displayedCount = 0;
  priceFilter.value = "all";
  loadAIsForCurrent();
}

// Load/display AIs (with pagination and filter)
function loadAIsForCurrent() {
  let filtered = allAIs.filter(ai => ai.functions.includes(currentFunction));
  
  if (priceFilter.value !== "all") {
    filtered = filtered.filter(ai => ai.price === priceFilter.value);
  }

  const start = displayedCount;
  const end = start + PAGE_SIZE;
  const pageAIs = filtered.slice(start, end);

  pageAIs.forEach(ai => displayCard(ai, aiList));

  displayedCount += pageAIs.length;

  if (displayedCount < filtered.length) {
    loadMoreBTN.classList.remove("hidden");
  } else {
    loadMoreBTN.classList.add("hidden");
  }
}

loadMoreBTN.onclick = loadAIsForCurrent;
priceFilter.onchange = () => {
  displayedCount = 0;
  aiList.innerHTML = "";
  loadAIsForCurrent();
};

// Global search
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();
  searchResults.innerHTML = "";
  if (!q) return;

  const results = allAIs.filter(ai => 
    ai.name.toLowerCase().includes(q) ||
    ai.description.toLowerCase().includes(q) ||
    ai.functions.some(f => f.toLowerCase().includes(q))
  );

  results.forEach(ai => displayCard(ai, searchResults));
});

// Display card
function displayCard(ai, container) {
  const avg = calculateAvgRating(ai);
  const card = document.createElement("div");
  card.className = "ai-card";
  card.innerHTML = `
    <h3>${ai.name}</h3>
    <p class="price">${ai.price.toUpperCase().replace("-", " ")}</p>
    <p>${ai.description}</p>
    <div class="stars">${getStarDisplay(avg)}</div>
    <p>Average Rating: ${avg.toFixed(1)} ★</p>
    <p><a href="${ai.link}" target="_blank">Visit Website →</a></p>
    <div class="rating">${getInteractiveStars(ai.name)}</div>
  `;
  container.appendChild(card);
}

function getStarDisplay(rating) {
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
}

function getInteractiveStars(name) {
  const current = getStoredRating(name);
  return [1,2,3,4,5].map(i => 
    `<span class="star \( {i <= current ? '' : 'inactive-star'}" onclick="rateAI(' \){name}', ${i})">★</span>`
  ).join('');
}

function rateAI(name, val) {
  localStorage.setItem(`rating-${name}`, val);
  // Refresh the card (simple way: reload section if in category, or page)
  if (currentFunction) {
    displayedCount = 0;
    aiList.innerHTML = "";
    loadAIsForCurrent();
  } else {
    // If in search, just re-run search
    searchInput.dispatchEvent(new Event('input'));
  }
}

function getStoredRating(name) {
  return parseInt(localStorage.getItem(`rating-${name}`)) || 0;
}

function calculateAvgRating(ai) {
  let all = [];
  for (let func in ai.ratings) all.push(...ai.ratings[func]);
  const stored = getStoredRating(ai.name);
  if (stored) all.push(stored);
  if (!all.length) return 0;
  return all.reduce((a,b) => a+b, 0) / all.length;
}

// Back button
document.getElementById("backHome").onclick = () => {
  functionSection.classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
  searchInput.value = "";
  searchResults.innerHTML = "";
};