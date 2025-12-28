// Configuration
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://YOUR-RAILWAY-URL.up.railway.app'; // Replace with your Railway URL

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const functionButtons = document.getElementById("functionButtons");
const functionSection = document.getElementById("functionSection");
const functionTitle = document.getElementById("functionTitle");
const functionDescription = document.getElementById("functionDescription");
const aiList = document.getElementById("aiList");
const loadMoreBTN = document.getElementById("loadMore");
const priceFilter = document.getElementById("priceFilter");
const sortFilter = document.getElementById("sortFilter");
const backHome = document.getElementById("backHome");
const resultsCount = document.getElementById("resultsCount");
const searchBtn = document.querySelector('.search-btn');
const featuredAIs = document.getElementById("featuredAIs");

// State
let currentFunction = "";
let currentPage = 1;
let currentAIList = [];
let allFunctionsData = [];

// Function categories with icons and descriptions
const functionCategories = [
    {
        id: "text-generation",
        name: "Text Generation",
        icon: "fas fa-keyboard",
        description: "AI writing assistants, content creators, and text completion tools"
    },
    {
        id: "image-generation",
        name: "Image Generation",
        icon: "fas fa-palette",
        description: "Create images, art, and graphics from text descriptions"
    },
    {
        id: "coding-assistance",
        name: "Coding Assistance",
        icon: "fas fa-code",
        description: "Code completion, debugging, and programming help"
    },
    {
        id: "video-generation",
        name: "Video Generation",
        icon: "fas fa-video",
        description: "Create and edit videos with AI"
    },
    {
        id: "voice-generation",
        name: "Voice Generation",
        icon: "fas fa-microphone",
        description: "Text-to-speech, voice cloning, and audio synthesis"
    },
    {
        id: "research-assistant",
        name: "Research Assistant",
        icon: "fas fa-search",
        description: "Academic research, data analysis, and summarization"
    },
    {
        id: "finance",
        name: "Finance AI",
        icon: "fas fa-chart-line",
        description: "Financial analysis, trading, and investment tools"
    },
    {
        id: "3d-models",
        name: "3D Models",
        icon: "fas fa-cube",
        description: "Create and modify 3D models with AI"
    },
    {
        id: "presentations",
        name: "Presentations",
        icon: "fas fa-chart-pie",
        description: "AI-powered presentation creators and designers"
    },
    {
        id: "automation",
        name: "Automation",
        icon: "fas fa-robot",
        description: "Workflow automation and process optimization"
    },
    {
        id: "game-assets",
        name: "Game Assets",
        icon: "fas fa-gamepad",
        description: "Create game characters, environments, and assets"
    },
    {
        id: "podcast-generation",
        name: "Podcast Generation",
        icon: "fas fa-podcast",
        description: "AI-generated podcasts and audio content"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initFunctionButtons();
    loadFeaturedAIs();
    setupEventListeners();
    
    // Show toast on load
    setTimeout(() => {
        showToast("✨ Welcome to AI Finder! Discover amazing AI tools.");
    }, 1000);
});

// Setup event listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener("input", handleSearch);
    searchBtn.addEventListener("click", () => handleSearch());
    
    // Filter changes
    priceFilter.addEventListener("change", () => {
        currentPage = 1;
        loadAIsForFunction();
    });
    
    sortFilter.addEventListener("change", () => {
        currentPage = 1;
        loadAIsForFunction();
    });
    
    // Back button
    backHome.addEventListener("click", () => {
        functionSection.classList.add("hidden");
        document.getElementById("home").classList.remove("hidden");
        searchInput.value = "";
        searchResults.innerHTML = "";
        showToast("Returned to homepage");
    });
    
    // Load more
    loadMoreBTN.addEventListener("click", () => {
        currentPage++;
        loadAIsForFunction(true);
    });
    
    // Quick filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            searchInput.value = e.target.textContent;
            handleSearch();
        });
    });
}

// Initialize function buttons
function initFunctionButtons() {
    functionButtons.innerHTML = "";
    functionCategories.forEach(func => {
        const card = document.createElement("div");
        card.className = "category-card";
        card.onclick = () => openFunction(func.id);
        card.innerHTML = `
            <div class="category-icon">
                <i class="${func.icon}"></i>
            </div>
            <h3>${func.name}</h3>
            <p>${func.description}</p>
            <div class="category-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        `;
        functionButtons.appendChild(card);
    });
}

// Handle search
function handleSearch() {
    const query = searchInput.value.trim();
    searchResults.innerHTML = "";
    
    if (!query) {
        searchResults.classList.remove('active');
        return;
    }
    
    if (query.length < 2) {
        showToast("Please enter at least 2 characters");
        return;
    }
    
    // Show loading
    searchResults.innerHTML = '<div class="loading">Searching...</div>';
    searchResults.classList.add('active');
    
    // In a real app, you would fetch from backend
    // For demo, we'll use mock data
    setTimeout(() => {
        const mockResults = getMockSearchResults(query);
        displaySearchResults(mockResults);
    }, 500);
}

// Get mock search results (replace with actual API call)
function getMockSearchResults(query) {
    const mockAIs = [
        {
            id: "chatgpt",
            name: "ChatGPT",
            price: "free-trial",
            description: "Advanced conversational AI by OpenAI with multimodal capabilities",
            link: "https://chat.openai.com",
            functions: ["text-generation", "coding-assistance"],
            rating: 4.8
        },
        {
            id: "midjourney",
            name: "MidJourney",
            price: "10+",
            description: "AI image generation through Discord with artistic styles",
            link: "https://midjourney.com",
            functions: ["image-generation"],
            rating: 4.6
        },
        {
            id: "claude",
            name: "Claude",
            price: "free-trial",
            description: "Anthropic's AI assistant focused on safety and helpfulness",
            link: "https://claude.ai",
            functions: ["text-generation", "research-assistant"],
            rating: 4.5
        },
        {
            id: "dalle",
            name: "DALL-E 3",
            price: "free-trial",
            description: "OpenAI's advanced image generation model",
            link: "https://openai.com/dall-e",
            functions: ["image-generation"],
            rating: 4.7
        },
        {
            id: "elevenlabs",
            name: "ElevenLabs",
            price: "6-10",
            description: "Realistic AI voice synthesis and text-to-speech",
            link: "https://elevenlabs.io",
            functions: ["voice-generation"],
            rating: 4.4
        }
    ];
    
    const queryLower = query.toLowerCase();
    return mockAIs.filter(ai => 
        ai.name.toLowerCase().includes(queryLower) ||
        ai.description.toLowerCase().includes(queryLower) ||
        ai.functions.some(f => f.toLowerCase().includes(queryLower))
    );
}

// Display search results
function displaySearchResults(results) {
    searchResults.innerHTML = "";
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h4>No results found</h4>
                <p>Try different keywords or browse categories</p>
            </div>
        `;
        return;
    }
    
    results.forEach(ai => {
        const resultItem = document.createElement("div");
        resultItem.className = "search-result-item";
        resultItem.innerHTML = `
            <div class="result-content">
                <h4>${ai.name}</h4>
                <p>${ai.description}</p>
                <div class="result-meta">
                    <span class="price-tag">${getPriceLabel(ai.price)}</span>
                    <span class="rating-tag">⭐ ${ai.rating}</span>
                </div>
            </div>
            <button class="view-btn" onclick="openAI('${ai.id}')">
                View <i class="fas fa-arrow-right"></i>
            </button>
        `;
        searchResults.appendChild(resultItem);
    });
}

// Open function page
function openFunction(funcId) {
    const func = functionCategories.find(f => f.id === funcId);
    if (!func) return;
    
    currentFunction = funcId;
    currentPage = 1;
    
    // Update UI
    functionTitle.textContent = func.name;
    functionDescription.textContent = func.description;
    document.getElementById("home").classList.add("hidden");
    functionSection.classList.remove("hidden");
    
    // Load AI tools for this function
    aiList.innerHTML = '<div class="loading">Loading AI tools...</div>';
    loadAIsForFunction();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast(`Browsing ${func.name} tools`);
}

// Load AI tools for current function
async function loadAIsForFunction(append = false) {
    try {
        if (!append) {
            aiList.innerHTML = '<div class="loading">Loading AI tools...</div>';
        }
        
        // In a real app, fetch from backend
        // const response = await fetch(`${BACKEND_URL}/api/ais?func=${currentFunction}&page=${currentPage}&price=${priceFilter.value}&sort=${sortFilter.value}`);
        // const data = await response.json();
        
        // Mock data for demo
        const mockAIs = getMockAIsForFunction(currentFunction);
        
        // Apply filters
        let filteredAIs = mockAIs;
        
        // Price filter
        if (priceFilter.value !== 'all') {
            filteredAIs = filteredAIs.filter(ai => ai.price === priceFilter.value);
        }
        
        // Sort filter
        if (sortFilter.value === 'rating') {
            filteredAIs.sort((a, b) => b.rating - a.rating);
        } else if (sortFilter.value === 'name') {
            filteredAIs.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        // Pagination
        const startIndex = (currentPage - 1) * 6;
        const endIndex = startIndex + 6;
        const pageAIs = filteredAIs.slice(startIndex, endIndex);
        
        if (!append) {
            aiList.innerHTML = "";
        }
        
        if (pageAIs.length === 0 && !append) {
            aiList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-robot"></i>
                    <h4>No AI tools found</h4>
                    <p>Try adjusting your filters or check back later</p>
                </div>
            `;
            loadMoreBTN.classList.add("hidden");
            return;
        }
        
        pageAIs.forEach(ai => displayAICard(ai));
        
        // Update results count
        resultsCount.textContent = filteredAIs.length;
        
        // Show/hide load more button
        if (endIndex < filteredAIs.length) {
            loadMoreBTN.classList.remove("hidden");
        } else {
            loadMoreBTN.classList.add("hidden");
        }
        
    } catch (error) {
        console.error('Error loading AI tools:', error);
        aiList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Failed to load AI tools</h4>
                <p>Please try again later</p>
            </div>
        `;
        showToast("Error loading data", "error");
    }
}

// Get mock AIs for function (replace with actual API call)
function getMockAIsForFunction(funcId) {
    const allMockAIs = [
        {
            id: "chatgpt",
            name: "ChatGPT",
            price: "free-trial",
            description: "Advanced conversational AI by OpenAI with multimodal capabilities",
            link: "https://chat.openai.com",
            functions: ["text-generation", "coding-assistance"],
            rating: 4.8,
            tags: ["Popular", "Multimodal", "Conversational"]
        },
        {
            id: "midjourney",
            name: "MidJourney",
            price: "10+",
            description: "AI image generation through Discord with artistic styles",
            link: "https://midjourney.com",
            functions: ["image-generation"],
            rating: 4.6,
            tags: ["Images", "Art", "Discord"]
        },
        {
            id: "claude",
            name: "Claude",
            price: "free-trial",
            description: "Anthropic's AI assistant focused on safety and helpfulness",
            link: "https://claude.ai",
            functions: ["text-generation", "research-assistant"],
            rating: 4.5,
            tags: ["Safe", "Helpful", "Writing"]
        },
        {
            id: "dalle",
            name: "DALL-E 3",
            price: "free-trial",
            description: "OpenAI's advanced image generation model",
            link: "https://openai.com/dall-e",
            functions: ["image-generation"],
            rating: 4.7,
            tags: ["OpenAI", "Images", "Advanced"]
        },
        {
            id: "elevenlabs",
            name: "ElevenLabs",
            price: "6-10",
            description: "Realistic AI voice synthesis and text-to-speech",
            link: "https://elevenlabs.io",
            functions: ["voice-generation"],
            rating: 4.4,
            tags: ["Voice", "Audio", "Realistic"]
        },
        {
            id: "runway",
            name: "Runway ML",
            price: "free-trial",
            description: "Creative suite for AI-powered video editing and generation",
            link: "https://runwayml.com",
            functions: ["video-generation", "image-generation"],
            rating: 4.3,
            tags: ["Video", "Creative", "Editing"]
        },
        {
            id: "github-copilot",
            name: "GitHub Copilot",
            price: "10+",
            description: "AI pair programmer for code completion and suggestions",
            link: "https://github.com/features/copilot",
            functions: ["coding-assistance"],
            rating: 4.6,
            tags: ["Code", "Programming", "Developer"]
        },
        {
            id: "stablediffusion",
            name: "Stable Diffusion",
            price: "free",
            description: "Open-source image generation model with local deployment",
            link: "https://stability.ai",
            functions: ["image-generation"],
            rating: 4.2,
            tags: ["Open Source", "Local", "Images"]
        }
    ];
    
    return allMockAIs.filter(ai => ai.functions.includes(funcId));
}

// Display AI card
function displayAICard(ai) {
    const card = document.createElement("div");
    card.className = "ai-card";
    
    // Get user rating from localStorage
    const userRating = localStorage.getItem(`rating_${ai.id}`) || 0;
    
    card.innerHTML = `
        <div class="ai-card-header">
            <h3>${ai.name}</h3>
            <span class="ai-price">${getPriceLabel(ai.price)}</span>
        </div>
        <p class="ai-description">${ai.description}</p>
        
        <div class="ai-tags">
            ${ai.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        
        <div class="ai-actions">
            <a href="${ai.link}" target="_blank" class="ai-link">
                <i class="fas fa-external-link-alt"></i> Visit Website
            </a>
            <button class="save-btn" onclick="saveTool('${ai.id}')">
                <i class="far fa-bookmark"></i> Save
            </button>
        </div>
        
        <div class="ai-rating">
            <div class="rating-header">
                <span class="rating-value">⭐ ${ai.rating}/5</span>
                <span class="rating-count">(${Math.floor(Math.random() * 1000) + 100} reviews)</span>
            </div>
            <div class="stars" id="stars-${ai.id}">
                ${[1, 2, 3, 4, 5].map(star => `
                    <span class="star" onclick="rateAI('${ai.id}', ${star})" 
                          data-rating="${star}">
                        ${star <= userRating ? '★' : '☆'}
                    </span>
                `).join('')}
            </div>
            <p class="rating-text">Rate this tool</p>
        </div>
    `;
    
    aiList.appendChild(card);
}

// Load featured AIs
function loadFeaturedAIs() {
    const featured = [
        {
            id: "chatgpt",
            name: "ChatGPT",
            price: "free-trial",
            description: "The most advanced conversational AI with multimodal capabilities",
            link: "https://chat.openai.com",
            rating: 4.8
        },
        {
            id: "midjourney",
            name: "MidJourney",
            price: "10+",
            description: "Create stunning AI-generated art and images from text",
            link: "https://midjourney.com",
            rating: 4.6
        },
        {
            id: "runway",
            name: "Runway ML",
            price: "free-trial",
            description: "Professional AI video editing and generation tools",
            link: "https://runwayml.com",
            rating: 4.3
        }
    ];
    
    featuredAIs.innerHTML = "";
    featured.forEach(ai => {
        const card = document.createElement("div");
        card.className = "featured-card";
        card.innerHTML = `
            <div class="featured-card-header">
                <h3>${ai.name}</h3>
                <span class="price-badge">${getPriceLabel(ai.price)}</span>
            </div>
            <p>${ai.description}</p>
            <div class="featured-tags">
                <span class="tag">Featured</span>
                <span class="tag">⭐ ${ai.rating}</span>
                <span class="tag">Popular</span>
            </div>
            <a href="${ai.link}" target="_blank" class="ai-link">
                <i class="fas fa-external-link-alt"></i> Explore Tool
            </a>
        `;
        featuredAIs.appendChild(card);
    });
}

// Helper functions
function getPriceLabel(price) {
    const labels = {
        "free": "Free",
        "free-trial": "Free Trial",
        "1-5": "$1-5",
        "6-10": "$6-10", 
        "10+": "$10+"
    };
    return labels[price] || price;
}

function rateAI(aiId, rating) {
    localStorage.setItem(`rating_${aiId}`, rating);
    
    // Update stars display
    const starsContainer = document.getElementById(`stars-${aiId}`);
    if (starsContainer) {
        starsContainer.querySelectorAll('.star').forEach((star, index) => {
            star.textContent = index < rating ? '★' : '☆';
        });
    }
    
    showToast(`Rated ${rating} stars!`, "success");
}

function saveTool(aiId) {
    const saved = JSON.parse(localStorage.getItem('saved_tools') || '[]');
    if (!saved.includes(aiId)) {
        saved.push(aiId);
        localStorage.setItem('saved_tools', JSON.stringify(saved));
        showToast("Tool saved to favorites!", "success");
    } else {
        showToast("Already saved", "info");
    }
}

function openAI(aiId) {
    showToast(`Opening ${aiId} details...`);
    // In a real app, you would open a detailed view
}

// Toast notification
function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast";
    
    if (type === "error") {
        toast.style.background = "var(--danger)";
    } else if (type === "success") {
        toast.style.background = "var(--success)";
    } else {
        toast.style.background = "var(--primary-blue)";
    }
    
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}