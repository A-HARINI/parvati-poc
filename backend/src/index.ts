import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './models/db';

dotenv.config();

const port = process.env.PORT || '4000';

async function start() {
  await connectDB();

  app.listen(Number(port), () => {
    console.log(`🚀 Backend running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  process.exit(0);
});
