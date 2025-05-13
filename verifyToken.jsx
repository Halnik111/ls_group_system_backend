import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_KEY;


// Middleware to verify token and roles
const verifyToken = (roles = []) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};