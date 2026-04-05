import express from "express";
export const router = express.Router();
import * as userController from '../Controllers/userController.js';
import { protect, authorize } from '../Middleware/authMiddleware.js';

router.get('/me', protect, userController.getMe);
router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.patch('/:id', protect, authorize('admin'), userController.updateUserAccess);

