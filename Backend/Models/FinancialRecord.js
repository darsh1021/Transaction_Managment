import mongoose from "mongoose";
const recordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        trim: true
    },
},
    {
        timestamps: true
    }
)

recordSchema.index({ user: 1, date: -1 });
recordSchema.index({ type: 1, category: 1 });

export const FinancialRecord = mongoose.model('FinancialRecord', recordSchema);