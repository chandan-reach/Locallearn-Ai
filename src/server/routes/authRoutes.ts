import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { CONFIG } from '../config.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, city, locality, pincode, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Name, email, password, and role are required.' },
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists.' },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role.toUpperCase(),
        city: city || 'Bengaluru',
        locality: locality || 'Indiranagar',
        pincode: pincode || '560038',
        phone: phone || '',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
      },
    });

    if (user.role === 'TEACHER') {
      await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          bio: 'Newly registered tutor on LocalLearn AI.',
          education: 'Bachelor Degree',
          subjects: JSON.stringify(['Mathematics', 'Science']),
          gradesTaught: JSON.stringify(['Class 9', 'Class 10']),
          locality: user.locality,
          city: user.city,
          pincode: user.pincode,
        },
      });
    } else if (user.role === 'STUDENT') {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          grade: 'Class 10',
          locality: user.locality,
          city: user.city,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        token,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          locality: user.locality,
          city: user.city,
          teacherProfile: user.teacherProfile,
          studentProfile: user.studentProfile,
        },
        token,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      return res.status(444).json({ success: false, error: { message: 'User not found' } });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          locality: user.locality,
          city: user.city,
          teacherProfile: user.teacherProfile,
          studentProfile: user.studentProfile,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
