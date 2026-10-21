const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// On Vercel, requests may reach Express with the /api prefix stripped or
// collapsed, so normalize the URL to always contain the full /api/... path.
if (process.env.VERCEL) {
    app.use((req, _res, next) => {
        const [path, query] = req.url.split('?');
        const qs = query ? `?${query}` : '';
        let p = path;
        if (p === '/api' || p === '/api/') p = '/';
        else if (!p.startsWith('/api/')) p = `/api${p.startsWith('/') ? p : `/${p}`}`;
        req.url = p + qs;
        next();
    });
}

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Student Management API running'
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Server port (local development only; on Vercel the app is exported as a function)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;