const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        console.error('[Auth Middleware]', err.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { requireAuth };
