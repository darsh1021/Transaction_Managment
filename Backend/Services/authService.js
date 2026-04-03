import { User } from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
};

export const register = async (userData) => {
    const newUser = await User.create(userData);
    const token = signToken(newUser._id);

    newUser.password = undefined;
    return { user: newUser, token };
};

export const login = async (email, password) => {   //explicitly selected the password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Incorrect email or password');
    }
    const token = signToken(user._id);
    user.password = undefined;

    return { user, token };
}