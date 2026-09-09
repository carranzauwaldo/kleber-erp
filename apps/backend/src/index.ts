import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

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

// Helper: Log audit event
async function auditLog(action: string, entityType: string, entityId: string, oldValues?: any, newValues?: any, organizationId: string = 'org-demo-1') {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        organizationId,
      },
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
});

const assetSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  type: z.enum(['truck', 'van', 'car']),
  licensePlate: z.string().optional(),
  organizationId: z.string().min(1, 'Organization requerida'),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
});

const tripSchema = z.object({
  tripNumber: z.string().min(1, 'Número de viaje requerido'),
  origin: z.string().min(1, 'Origen requerido'),
  destination: z.string().min(1, 'Destino requerido'),
  freightValue: z.number().min(0, 'Valor de flete debe ser positivo').optional(),
  organizationId: z.string().min(1, 'Organization requerida'),
  status: z.enum(['draft', 'active', 'completed']).optional(),
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

// AUTH: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      const error = validation.error.errors[0]?.message || 'Validación fallida';
      return res.status(400).json({ success: false, error });
    }
    const { email, password } = validation.data;

    // Try to find user in database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Validate password
    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.json({
        success: true,
        requiresTwoFactor: true,
        userId: user.id,
        message: 'Please enter your 2FA code',
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);
    return res.json({
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
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// AUTH: Register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const error = validation.error.errors[0]?.message || 'Validación fallida';
      return res.status(400).json({ success: false, error });
    }
    const { email, password, name } = validation.data;

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
    const validation = assetSchema.safeParse(req.body);
    if (!validation.success) {
      const error = validation.error.errors[0]?.message || 'Validación fallida';
      return res.status(400).json({ success: false, error });
    }
    const { name, type, licensePlate, organizationId, status } = validation.data;
    const asset = await prisma.asset.create({
      data: { name, type, licensePlate: licensePlate || null, organizationId },
    });
    await auditLog('create', 'Asset', asset.id, null, asset, organizationId);
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
    const validation = tripSchema.safeParse(req.body);
    if (!validation.success) {
      const error = validation.error.errors[0]?.message || 'Validación fallida';
      return res.status(400).json({ success: false, error });
    }
    const { tripNumber, origin, destination, freightValue, organizationId, status } = validation.data;
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

// 2FA: Setup (Generate Secret)
app.post('/api/2fa/setup', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });

    if (!dbUser) return res.status(404).json({ success: false, error: 'User not found' });

    const secret = speakeasy.generateSecret({
      name: `KLEBER ERP (${dbUser.email})`,
      issuer: 'KLEBER ERP',
      length: 32,
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate 10 backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode,
        backupCodes,
      },
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ success: false, error: '2FA setup failed' });
  }
});

// 2FA: Verify & Enable
app.post('/api/2fa/enable', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const { secret, token, backupCodes } = req.body;
    const user = (req as any).user;

    if (!secret || !token) {
      return res.status(400).json({ success: false, error: 'Secret and token required' });
    }

    // Verify token
    const valid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!valid) {
      return res.status(400).json({ success: false, error: 'Invalid token' });
    }

    // Save to database
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: JSON.stringify(backupCodes),
      },
    });

    await auditLog('enable_2fa', 'User', user.userId, null, { twoFactorEnabled: true });

    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({ success: false, error: '2FA enable failed' });
  }
});

// 2FA: Verify Token (During Login)
app.post('/api/2fa/verify', async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ success: false, error: 'User ID and token required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      return res.status(404).json({ success: false, error: 'User or 2FA not found' });
    }

    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid 2FA token' });
    }

    const jwtToken = generateToken(user.id, user.role);
    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    res.status(500).json({ success: false, error: '2FA verification failed' });
  }
});

// 2FA: Disable
app.post('/api/2fa/disable', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const user = (req as any).user;

    if (!password) {
      return res.status(400).json({ success: false, error: 'Password required' });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser || hashPassword(password) !== dbUser.password) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    await prisma.user.update({
      where: { id: user.userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
      },
    });

    await auditLog('disable_2fa', 'User', user.userId);

    res.json({ success: true, message: '2FA disabled' });
  } catch (error) {
    res.status(500).json({ success: false, error: '2FA disable failed' });
  }
});

// AUDIT: Get audit logs
app.get('/api/audit/logs', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

// EXPORT: Assets
app.get('/api/export/assets', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Export failed' });
  }
});

// EXPORT: Trips
app.get('/api/export/trips', (req: Request, res: Response, next) => requireAuth(req, res, next), async (req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany();
    res.json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Export failed' });
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
