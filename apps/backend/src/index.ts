import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local' });

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// Assets
app.get('/api/assets', async (req: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json({ success: true, data: assets });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assets' });
  }
});

app.post('/api/assets', async (req: Request, res: Response) => {
  try {
    const { name, type, licensePlate, organizationId } = req.body;
    if (!name || !type || !organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }
    const asset = await prisma.asset.create({
      data: { name, type, licensePlate: licensePlate || null, organizationId },
    });
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create asset' });
  }
});

// Trips
app.get('/api/trips', async (req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany();
    res.json({ success: true, data: trips });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trips' });
  }
});

app.post('/api/trips', async (req: Request, res: Response) => {
  try {
    const { tripNumber, origin, destination, freightValue, organizationId } = req.body;
    if (!tripNumber || !origin || !destination || !organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }
    const trip = await prisma.trip.create({
      data: {
        tripNumber,
        origin,
        destination,
        freightValue: freightValue || 0,
        organizationId,
      },
    });
    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create trip' });
  }
});

// Error handler
app.use((err: Error, req: Request, res: Response, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
