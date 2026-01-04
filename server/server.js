import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from '#config';
import mainRouter from '#routes';

dotenv.config({ quiet: true });

const app = express();
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api + root routes
app.use('/api', mainRouter);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to this product catalog' });
});

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});