import jwt from "jsonwebtoken"
import { User } from "../Models/UserModel.js"

export const protect = async (req, res, next) => {

    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Authentication required please Login' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User belonging to this token not exists" });
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ message: "Your account is inactive, Please contact support" })
        }

        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token, Please login again" });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                message: "Forbidden : You do not have permission to perform this action"
            });
        }
        next();
    }
}