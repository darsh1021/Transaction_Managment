import * as recordService from "../Services/recordService.js"

export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        const record = await recordService.createRecord({
            user: req.user._id,
            amount, type, category, date, notes
        });

        res.status(201).json({ status: "success", data: { record } })
    }
    catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export const getRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;
        const records = await recordService.getRecords(req.user._id, { type, category, startDate, endDate });

        res.status(200).json({
            status: 'success',
            results: records.length,
            data: { records }
        });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

export const updateRecords = async (req, res) => {

    try {
        const { id } = req.params;
        const record = await recordService.updateRecords(id, req.user._id, req.body);

        if (!record) {
            return res.status(404).json({ status: "fail", message: "No record found or unauthorized" })
        }
        res.status(200).json({ status: "success", data: { record } });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message })
    }
}

export const deleteRecords = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await recordService.deleteRecords(id, req.user._id);

        if (!record) {
            return res.status(404).json({ status: "fail", message: "No record found or unauthorized" })
        }

        res.status(204).json({ status: 'success', data: null });
    }
    catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}