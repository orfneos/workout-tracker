const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

/**
 * JWT authentication middleware
 * Extracts and verifies Bearer token from Authorization header
 * Adds decoded user data to req.user for downstream handlers
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;