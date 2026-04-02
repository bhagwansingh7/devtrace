import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello from DevTrace Server!');
}
);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});