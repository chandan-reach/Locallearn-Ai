import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/bookings - Create new tuition booking request
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { teacherId, subject, date, timeSlot, mode, fee, note } = req.body;

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) {
      return res.status(400).json({ success: false, error: { message: 'Student profile required to create booking' } });
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        teacherId,
        subject,
        date,
        timeSlot,
        mode: mode || 'OFFLINE',
        fee: Number(fee || 400),
        note: note || '',
        status: 'PENDING',
      },
      include: {
        teacher: { include: { user: { select: { name: true, avatar: true } } } },
        student: { include: { user: { select: { name: true, avatar: true } } } },
      },
    });

    // Create Notification for Teacher
    const teacherProfile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });
    if (teacherProfile) {
      await prisma.notification.create({
        data: {
          userId: teacherProfile.userId,
          title: 'New Class Booking Request',
          message: `${req.user?.name} requested a ${subject} class on ${date} at ${timeSlot}.`,
          type: 'BOOKING',
          link: '/teacher/bookings',
        },
      });
    }

    return res.json({ success: true, data: booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/bookings - Get user bookings (student or teacher)
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let bookings: any[] = [];

    if (role === 'STUDENT') {
      const student = await prisma.studentProfile.findUnique({ where: { userId } });
      if (student) {
        bookings = await prisma.booking.findMany({
          where: { studentId: student.id },
          include: {
            teacher: { include: { user: { select: { name: true, avatar: true, phone: true, locality: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } else if (role === 'TEACHER') {
      const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
      if (teacher) {
        bookings = await prisma.booking.findMany({
          where: { teacherId: teacher.id },
          include: {
            student: { include: { user: { select: { name: true, avatar: true, phone: true, locality: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } else {
      // Admin sees all
      bookings = await prisma.booking.findMany({
        include: {
          student: { include: { user: { select: { name: true } } } },
          teacher: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return res.json({ success: true, data: bookings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// PATCH /api/bookings/:id/status - Accept, Reject, or Cancel Booking
router.patch('/:id/status', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body; // "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED"

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    });

    // Notify Student on status update
    await prisma.notification.create({
      data: {
        userId: booking.student.user.id,
        title: `Booking Request ${status}`,
        message: `Your booking for ${booking.subject} with ${booking.teacher.user.name} has been marked as ${status}.`,
        type: 'BOOKING',
        link: '/student/bookings',
      },
    });

    return res.json({ success: true, data: booking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
