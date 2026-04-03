import express from 'express';
export const router = express.Router();

import { registerUser, loginUser } from '../Controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);