import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Expected format: "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded; // decoded will have { id, role }
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};

export const isFaculty = (req, res, next) => {
    if (!req.user || req.user.role !== "faculty") {
        return res.status(403).json({ message: "Access denied: Faculties only" });
    }
    next();
};

// ✅ Default export for convenience
export default verifyToken;
