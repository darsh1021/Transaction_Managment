import jwt, { decode } from "jsonwebtoken"
import { User } from "../Models/UserModel.js"

export const protect = async (req, res, next) => {

    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
            token = req.headers.authorize.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Authentication required please Login' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacke_secret');
        const user = await User.findById(decode.id);

        if (!user) {
            return res.status(401).json({ message: "User belonging to this token not exitst " });
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
    return (resr, res, next) => {
        if (!roles.includes(req.user.role)) {
            return req.status(403).json({
                status: "fail",
                message: "Forbidden : You do not have permission to perform this action"
            });
        }
        next();
    }
}