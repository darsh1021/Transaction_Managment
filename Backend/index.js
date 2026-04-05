import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { router as authRoutes } from './Routes/authRoutes.js'
import { router as userRoutes } from './Routes/userRoutes.js'
import { router as recordRoutes } from './Routes/recordRoutes.js'


dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10kb' }));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

const port = process.env.PORT || 5000;
const DB_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/rbac_db";

mongoose.connect(DB_URL)
    .then(() => { console.log("Successfully connected to mongodb") })
    .catch((err) => console.error("Error connecting to mongodb :", err.message));

console.log(`Server running on port ${port}`);