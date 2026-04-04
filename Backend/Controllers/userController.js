const User = require("../Models/UserModel.js")
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.status(200).json({
            status: "success",
            results: User.lenght,
            data: { users }
        });
    }
    catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

export const updateUserAccess = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        const updateData = {};
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true, runValidators: true,
        })

        if (!user) {
            return res.status(404).json({ status: "fail", message: "No user found with tahat id" });
        }

        res.status(200).json({
            status: "success",
            data: { user }
        });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

export const getMe = async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { user: req.user }
    });
};