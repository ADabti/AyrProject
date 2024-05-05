// server/auth/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js'); // Adjust the path as needed

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, 'secret_key_test');
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = authenticate;
