import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email:
    {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['viewer', 'analyst', 'admin'],
        default: 'viewer',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    lastLogin: {
        type: Date,
    },
},
    { timestamps: true }
)

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.method.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
