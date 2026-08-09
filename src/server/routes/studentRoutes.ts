import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/students/profile
router.get('/profile', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const student = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, city: true, locality: true } },
        progress: true,
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'Student profile not found' } });
    }

    return res.json({ success: true, data: student });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// PUT /api/students/profile (also used during interactive student onboarding)
router.put('/profile', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { grade, school, learningGoals, preferredLanguage, preferredMode, preferredStudyTime, locality, city } = req.body;

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'Student profile not found' } });
    }

    const updated = await prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        grade: grade ?? student.grade,
        school: school ?? student.school,
        learningGoals: learningGoals ?? student.learningGoals,
        preferredLanguage: preferredLanguage ?? student.preferredLanguage,
        preferredMode: preferredMode ?? student.preferredMode,
        preferredStudyTime: preferredStudyTime ?? student.preferredStudyTime,
        locality: locality ?? student.locality,
        city: city ?? student.city,
      },
    });

    // Also update User locality/city if provided
    if (locality || city) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          locality: locality ?? undefined,
          city: city ?? undefined,
        },
      });
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
