const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key_here_change_in_production'; // Must match controller secret

const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        console.error('JWT verification error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;