import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

const port = process.env.port || 5000;
const DB_URL = process.env.DATABASE_URL || "mongoose://localhost:2707/rbac_db";

mongoose.connect(DB_URL)
    .then(() => { console.log("Successfully connected to mongodb") })
    .catch((err) => console.error("Error connecting to mongodb :", err.message));

app.listen(port, () =>
    console.log(`Sever running on port ${port}`));