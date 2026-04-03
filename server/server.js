import express, { json } from 'express';
const app = express();
// import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.routes.js";




const PORT = process.env.PORT || 5000;
app.use(express.json());
// app.use(cors());
app.use("/api/auth",authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  connectDB()
});