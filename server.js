const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for now
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Sample AI data
const ais = [
    {
        id: "chatgpt",
        name: "ChatGPT",
        price: "free-trial",
        description: "Advanced conversational AI by OpenAI",
        link: "https://chat.openai.com",
        functions: ["text-generation", "coding-assistance"],
        rating: 4.8
    },
    {
        id: "midjourney",
        name: "MidJourney",
        price: "10+",
        description: "AI image generation",
        link: "https://midjourney.com",
        functions: ["image-generation"],
        rating: 4.6
    }
];

// API Routes
app.get('/api/ais', (req, res) => {
    const { search, func, price, sort, page = 1, limit = 12 } = req.query;
    let results = [...ais];
    
    // Filter by function
    if (func) {
        results = results.filter(ai => ai.functions.includes(func));
    }
    
    // Filter by price
    if (price && price !== 'all') {
        results = results.filter(ai => ai.price === price);
    }
    
    // Search
    if (search) {
        const searchLower = search.toLowerCase();
        results = results.filter(ai => 
            ai.name.toLowerCase().includes(searchLower) ||
            ai.description.toLowerCase().includes(searchLower)
        );
    }
    
    // Sort
    if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'name') {
        results.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = results.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        total: results.length,
        page: parseInt(page),
        totalPages: Math.ceil(results.length / limit),
        ais: paginatedResults
    });
});

app.post('/api/rate', (req, res) => {
    const { aiId, rating } = req.body;
    
    if (!aiId || !rating) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing aiId or rating' 
        });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
            success: false, 
            error: 'Rating must be between 1 and 5' 
        });
    }
    
    // In a real app, save to database
    res.json({
        success: true,
        message: 'Rating saved successfully',
        aiId,
        rating
    });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/ais`);
});