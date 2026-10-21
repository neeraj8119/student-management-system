const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Add it to backend/.env');
}

module.exports = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);

        next();

    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};