import mongoose from "mongoose";
import { FinancialRecord } from "../Models/FinancialRecord.js";
import { getCache, setCache, delCache } from "../Utils/cache.js";


export const createRecord = async (data) => {
    const record = await FinancialRecord.create(data);

    if (record.user) await delCache(record.user);
    return record;
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
    const record = await FinancialRecord.findOneAndUpdate(
        { _id: id, user: userId },
        updateData,
        { new: true, runValidators: true }
    );

    //Invalidating cache after update 
    if (record) await delCache(userId);
    return record;
}

export const deleteRecords = async (id, userId) => {
    const record = await FinancialRecord.findOneAndDelete({ _id: id, user: userId });
    if (record) await delCache(userId);
    return record;
};

export const getDashboardSummary = async (userId) => {
    //Check cache first for scaling
    const cachedData = await getCache(userId);
    if (cachedData) return cachedData;

    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const summary = await FinancialRecord.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
            $facet: {
                totalStats: [
                    {
                        $group: {
                            _id: null,
                            totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                            totalExpenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalIncome: 1,
                            totalExpenses: 1,
                            balance: { $subtract: ['$totalIncome', '$totalExpenses'] }
                        }
                    }
                ],
                categoryBreakdown: [
                    {
                        $group: {
                            _id: { category: '$category', type: '$type' },
                            totalAmount: { $sum: '$amount' }
                        }
                    },
                    { $sort: { totalAmount: -1 } }
                ],
                monthlyTrends: [
                    { $match: { date: { $gte: sixMonthAgo } } },
                    {
                        $group: {
                            _id: {
                                month: { $month: '$date' },
                                year: { $year: '$date' },
                                type: '$type'
                            },
                            totalAmount: { $sum: '$amount' }
                        }
                    },
                    { $sort: { '_id.year': 1, '_id.month': 1 } }
                ],
                recentActivity: [
                    { $sort: { date: -1 } },
                    { $limit: 5 }
                ]
            }
        }
    ]);

    const result = summary[0];

    // 2. Set cache for future requests
    if (result) await setCache(userId, result);

    return result;
};
