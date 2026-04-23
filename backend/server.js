const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend dev server (Vite default)
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Full Stack Authentication System API',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/me',
                getUser: 'GET /api/auth/users/:id',
                getAllUsers: 'GET /api/auth/users (admin only)',
                userDashboard: 'GET /api/auth/user-dashboard',
                adminDashboard: 'GET /api/auth/admin-dashboard'
            }
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    }[dbStatus] || 'unknown';
    
    res.json({
        status: 'ok',
        serverTime: new Date().toISOString(),
        database: {
            status: dbStatusText,
            readyState: dbStatus,
            connected: dbStatus === 1
        }
    });
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
});