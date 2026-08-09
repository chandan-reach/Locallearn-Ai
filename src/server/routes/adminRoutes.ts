import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/stats - Overview Platform Metrics
router.get('/stats', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.studentProfile.count();
    const totalTeachers = await prisma.teacherProfile.count();
    const totalBookings = await prisma.booking.count();
    const activeClassrooms = await prisma.classroom.count();
    const pendingVerifications = await prisma.teacherProfile.count({ where: { verificationStatus: 'PENDING' } });

    const confirmedBookings = await prisma.booking.findMany({ where: { status: 'CONFIRMED' } });
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.fee || 0), 0);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalBookings,
        activeClassrooms,
        pendingVerifications,
        totalRevenue,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/admin/users - User Directory
router.get('/users', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        locality: true,
        city: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: users });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// PATCH /api/admin/teachers/:id/verify - Toggle Teacher Verification
router.patch('/teachers/:id/verify', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body; // "VERIFIED" | "PENDING" | "REJECTED"

    const teacher = await prisma.teacherProfile.update({
      where: { id },
      data: { verificationStatus: status },
      include: { user: true },
    });

    await prisma.notification.create({
      data: {
        userId: teacher.user.id,
        title: 'Profile Verification Status Updated',
        message: `Your teacher profile verification has been set to ${status}.`,
        type: 'SYSTEM',
        link: '/teacher/dashboard',
      },
    });

    return res.json({ success: true, data: teacher });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
