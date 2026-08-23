import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { initFirebase } from './config/firebase.js';

const startServer = async () => {
  // Initialize Database Connection
  await connectDB();

  // Initialize Firebase Admin SDK
  initFirebase();

  const PORT = ENV.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 SANKALP Server running in ${ENV.NODE_ENV} mode`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });

  // Handle uncaught exceptions and rejections gracefully
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated.');
    });
  });
};

startServer();
