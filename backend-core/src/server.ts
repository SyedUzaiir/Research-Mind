import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth';
import workspaceRoutes from './routes/workspace';
import paperRoutes from './routes/paper';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve raw uploaded PDF files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/papers', paperRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'ResearchMind Core Backend API', status: 'healthy', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`🚀 ResearchMind Core API Server running on port ${PORT}`);
});
