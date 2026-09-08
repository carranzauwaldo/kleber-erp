import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper: Hash password (simple for now)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper: Generate JWT token (simplified)
function generateToken(userId: string, role: string): string {
  const payload = {
    userId,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Middleware: Check JWT token
function verifyToken(token: string): any {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// Middleware: Require authentication
function requireAuth(req: Request, res: Response, next: () => void): any {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
  (req as any).user = decoded;
  next();
}

// Middleware: Require specific role
function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: () => void) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// AUTH: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required',
      });
    }

    // For demo: accept any password with demo@kleber.app
    if (email === 'demo@kleber.app' && password.length > 0) {
      const token = generateToken('demo-user-1', 'ADMIN');
      return res.json({
        success: true,
        token,
        user: {
          id: 'demo-user-1',
          email: 'demo@kleber.app',
          name: 'Demo User',
          role: 'ADMIN',
        },
      });
    }

    // TODO: Implement real user authentication from database
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// AUTH: Register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name required',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Create user (demo org)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword(password),
        role: 'VIEWER', // Default role
        organizationId: 'org-demo-1', // TODO: Allow org selection
      },
    });

    const token = generateToken(user.id, user.role);
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Assets
app.get('/api/assets', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json({ success: true, data: assets });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch assets' });
  }
});

app.post('/api/assets', (req: Request, res: Response, next) => requireAuth(req, res, next), requireRole('ADMIN', 'MANAGER'), async (req: Request, res: Response) => {
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

app.put('/api/assets/:id', (req: Request, res: Response, next) => requireAuth(req, res, next), requireRole('ADMIN', 'MANAGER'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, licensePlate, status } = req.body;
    const asset = await prisma.asset.update({
      where: { id },
      data: { name, type, licensePlate: licensePlate || null, status },
    });
    res.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update asset' });
  }
});

app.delete('/api/assets/:id', (req: Request, res: Response, next) => requireAuth(req, res, next), requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.asset.delete({ where: { id } });
    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete asset' });
  }
});

// Trips
app.get('/api/trips', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany();
    res.json({ success: true, data: trips });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trips' });
  }
});

app.post('/api/trips', (req: Request, res: Response, next) => requireAuth(req, res, next), requireRole('ADMIN', 'MANAGER', 'DRIVER'), async (req: Request, res: Response) => {
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

app.put('/api/trips/:id', (req: Request, res: Response, next) => requireAuth(req, res, next), requireRole('ADMIN', 'MANAGER', 'DRIVER'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { origin, destination, freightValue, status } = req.body;
    const trip = await prisma.trip.update({
      where: { id },
      data: { origin, destination, freightValue, status },
    });
    res.json({ success: true, data: trip });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update trip' });
  }
});

app.delete('/api/trips/:id', (req: Request, res: Response, next) => requireAuth(req, res, next), requireRole('ADMIN', 'MANAGER'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.trip.delete({ where: { id } });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete trip' });
  }
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
