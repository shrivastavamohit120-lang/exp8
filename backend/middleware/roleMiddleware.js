// Role-based access control middleware
// Usage: app.get('/admin', roleMiddleware('admin'), adminController)

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};

module.exports = roleMiddleware;