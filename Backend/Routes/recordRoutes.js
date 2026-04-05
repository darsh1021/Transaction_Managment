import express from "express";
export const router = express.Router();

import * as recordController from "../Controllers/recordController.js";
import { protect, authorize } from "../Middleware/authMiddleware.js"

router.use(protect);

router.get('/', authorize('analyst', 'admin'), recordController.getRecords);
router.post('/', authorize('admin'), recordController.createRecord);
router.patch('/:id', authorize('admin'), recordController.updateRecords);
router.delete('/:id', authorize('admin'), recordController.deleteRecords);
