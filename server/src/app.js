import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/responseHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import solutionRoutes from './routes/solutionRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import pilotRoutes from './routes/pilotRoutes.js';

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: ENV.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file hosting for uploaded attachments
app.use('/uploads', express.static(path.resolve('uploads')));

// Health Check Endpoints
app.get('/', (req, res) => {
  sendSuccess(res, 200, 'SANKALP Backend API is running', {
    version: '1.0.0',
    environment: ENV.NODE_ENV,
    timestamp: new Date(),
  });
});

app.get('/api/health', (req, res) => {
  sendSuccess(res, 200, 'API Health OK', {
    status: 'healthy',
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/pilots', pilotRoutes);

// Catch-all 404 Route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
