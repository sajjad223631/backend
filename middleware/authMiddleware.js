import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_key"; // In production, use environment variable

export const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.userData = { userId: decodedToken.userId, role: decodedToken.role };
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.userData.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};
