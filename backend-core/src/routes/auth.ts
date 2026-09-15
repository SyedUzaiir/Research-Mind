import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'researchmind_super_secret_key_2026';

// Mock DB for dev fallback when Prisma/Postgres is connecting
const USERS_DB: Record<string, any> = {
  'scholar@researchmind.ai': {
    id: 'dev-user-id',
    name: 'Dr. Research Scholar',
    email: 'scholar@researchmind.ai',
    passwordHash: '$2a$10$wT0...mock'
  }
};

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;
    const user = { id: userId, name: name || 'Scholar', email, passwordHash };

    USERS_DB[email] = user;
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = USERS_DB[email];

    // Simple dev login logic
    const token = jwt.sign(
      { id: user ? user.id : 'dev-user-id', email: email || 'scholar@researchmind.ai' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user ? user.id : 'dev-user-id',
        name: user ? user.name : 'Dr. Research Scholar',
        email: email || 'scholar@researchmind.ai'
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
