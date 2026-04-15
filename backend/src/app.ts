import express from 'express';
import cors from 'cors';
import path from 'path';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Parvati POC Backend API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use(errorHandler);

export default app;
