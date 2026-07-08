// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });
    
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token." });
        req.user = user;
        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: `Access Denied. Requires ${role} role.` });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };