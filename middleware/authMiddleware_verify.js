require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(400).send({ error: "Access denied. Unauthorized" });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(400).send({ error: "Invalid token" });
    }
}

module.exports = authMiddleware;