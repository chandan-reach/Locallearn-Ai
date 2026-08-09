import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import classroomRoutes from './routes/classroomRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LocalLearn AI API Server', time: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend assets in production
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../dist');

app.use(express.static(distPath));

// Fallback to index.html for SPA client-side routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'An unexpected error occurred' },
  });
});

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 LocalLearn AI Server running on http://localhost:${CONFIG.PORT}`);
});
