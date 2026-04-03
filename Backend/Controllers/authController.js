import { login, register } from "../Services/authService.js"

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { user, token } = await register({ username, email, password });

        res.status(201).json({
            status: 'success',
            token,
            data: { user }
        });
    }
    catch (error) {
        res.status(404).json({ status: "fail", message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await login(email, password);

        res.status(200).json({
            status: "success",
            token,
            data: { user }
        });
    }
    catch (error) {
        res.status(401).json({ status: 'fail', message: error.message })
    }
}

