const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    getAllUsers, 
    getUserById 
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', authMiddleware, getMe);
router.get('/users/:id', authMiddleware, getUserById);

// Admin-only routes
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);

// Test routes for role-based access
router.get('/user-dashboard', authMiddleware, (req, res) => {
    res.json({ 
        message: 'Welcome to User Dashboard', 
        user: req.user 
    });
});

router.get('/admin-dashboard', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.json({ 
        message: 'Welcome to Admin Dashboard', 
        user: req.user,
        adminNote: 'You can manage all users' 
    });
});

// Public test route
router.get('/public', (req, res) => {
    res.json({ message: 'This is a public endpoint, no authentication required' });
});

module.exports = router;