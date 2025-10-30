import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // expects Bearer token
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECREAT);
        req.admin = decoded; // attach decoded token info to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
