import { FinancialRecord } from "../Models/FinancialRecord.js";

export const createRecord = async (data) => {
    return await FinancialRecord.create(data);
}

export const getRecords = async (userId, filters = {}) => {
    const query = { user: userId };

    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;


    //Filtering based on given dates 
    if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    return await FinancialRecord.find(query).sort({ date: -1 });
}

export const updateRecords = async (id, userId, updateData) => {
    return await FinancialRecord.findOneAndUpdate(
        { _id: id, user: userId },
        updateData,
        { new: true, runValidators: true }
    );
}

export const deleteRecords = async (id, userId) => {
    return await FinancialRecord.findOneAndDelete({ _id: id, user: userId });
};