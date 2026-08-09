import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { calculateTeacherMatch } from '../services/matchEngine.js';

const router = Router();

// GET /api/teachers - Location-based search & multi-attribute filter
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { subject, grade, locality, mode, maxPrice, rating } = req.query;

    const teacherProfiles = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: { name: true, email: true, avatar: true, phone: true, city: true, locality: true },
        },
        reviews: { select: { rating: true, comment: true } },
        availabilities: true,
      },
    });

    // Format & Calculate AI Match Scores
    const results = teacherProfiles
      .map((tp) => {
        let subjectsList: string[] = [];
        let gradesList: string[] = [];
        try { subjectsList = JSON.parse(tp.subjects || '[]'); } catch (e) { subjectsList = [tp.subjects]; }
        try { gradesList = JSON.parse(tp.gradesTaught || '[]'); } catch (e) { gradesList = [tp.gradesTaught]; }

        const match = calculateTeacherMatch({
          teacher: {
            id: tp.id,
            subjects: subjectsList,
            gradesTaught: gradesList,
            locality: tp.locality,
            city: tp.city,
            hourlyRate: tp.hourlyRate,
            teachingMode: tp.teachingMode,
            rating: tp.rating,
            experienceYears: tp.experienceYears,
          },
          studentQuery: {
            subject: subject as string,
            grade: grade as string,
            locality: locality as string,
            maxBudget: maxPrice ? Number(maxPrice) : undefined,
            preferredMode: mode as string,
          },
        });

        return {
          id: tp.id,
          userId: tp.userId,
          name: tp.user.name,
          avatar: tp.user.avatar,
          bio: tp.bio,
          education: tp.education,
          experienceYears: tp.experienceYears,
          verificationStatus: tp.verificationStatus,
          teachingMode: tp.teachingMode,
          hourlyRate: tp.hourlyRate,
          monthlyRate: tp.monthlyRate,
          locality: tp.locality,
          city: tp.city,
          pincode: tp.pincode,
          lat: tp.lat,
          lng: tp.lng,
          rating: tp.rating,
          totalStudents: tp.totalStudents,
          subjects: subjectsList,
          gradesTaught: gradesList,
          availabilities: tp.availabilities,
          matchScore: match.matchScore,
          matchReasons: match.matchReasons,
          reviewsCount: tp.reviews.length,
        };
      })
      .filter((t) => {
        // Apply Filters
        if (subject && !t.subjects.some((s) => s.toLowerCase().includes((subject as string).toLowerCase()))) {
          return false;
        }
        if (grade && !t.gradesTaught.some((g) => g.toLowerCase().includes((grade as string).toLowerCase()))) {
          return false;
        }
        if (locality && !t.locality.toLowerCase().includes((locality as string).toLowerCase())) {
          return false;
        }
        if (mode && t.teachingMode !== mode && t.teachingMode !== 'HYBRID') {
          return false;
        }
        if (maxPrice && t.hourlyRate > Number(maxPrice)) {
          return false;
        }
        if (rating && t.rating < Number(rating)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/teachers/:id - Detailed Teacher Profile
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const tp = await prisma.teacherProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, phone: true, city: true, locality: true } },
        availabilities: true,
        reviews: {
          include: { student: { include: { user: { select: { name: true, avatar: true } } } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tp) {
      return res.status(404).json({ success: false, error: { message: 'Teacher profile not found' } });
    }

    let subjectsList: string[] = [];
    let gradesList: string[] = [];
    try { subjectsList = JSON.parse(tp.subjects || '[]'); } catch (e) { subjectsList = [tp.subjects]; }
    try { gradesList = JSON.parse(tp.gradesTaught || '[]'); } catch (e) { gradesList = [tp.gradesTaught]; }

    return res.json({
      success: true,
      data: {
        ...tp,
        subjects: subjectsList,
        gradesTaught: gradesList,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// PUT /api/teachers/profile - Update Teacher Profile
router.put('/profile', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bio, experienceYears, education, hourlyRate, monthlyRate, teachingMode, locality, city, pincode, subjects, gradesTaught } = req.body;

    const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(404).json({ success: false, error: { message: 'Teacher profile not found' } });
    }

    const updated = await prisma.teacherProfile.update({
      where: { id: teacher.id },
      data: {
        bio: bio ?? teacher.bio,
        experienceYears: experienceYears ? Number(experienceYears) : teacher.experienceYears,
        education: education ?? teacher.education,
        hourlyRate: hourlyRate ? Number(hourlyRate) : teacher.hourlyRate,
        monthlyRate: monthlyRate ? Number(monthlyRate) : teacher.monthlyRate,
        teachingMode: teachingMode ?? teacher.teachingMode,
        locality: locality ?? teacher.locality,
        city: city ?? teacher.city,
        pincode: pincode ?? teacher.pincode,
        subjects: subjects ? JSON.stringify(subjects) : teacher.subjects,
        gradesTaught: gradesTaught ? JSON.stringify(gradesTaught) : teacher.gradesTaught,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// PUT /api/teachers/availability - Save weekly availability schedule slots
router.put('/availability', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { slots } = req.body; // Array of { dayOfWeek, startTime, endTime }

    const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(404).json({ success: false, error: { message: 'Teacher profile not found' } });
    }

    // Clear old slots and replace with new schedule
    await prisma.availability.deleteMany({ where: { teacherId: teacher.id } });

    if (Array.isArray(slots) && slots.length > 0) {
      await prisma.availability.createMany({
        data: slots.map((s: any) => ({
          teacherId: teacher.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isBooked: false,
        })),
      });
    }

    const updatedAvailabilities = await prisma.availability.findMany({ where: { teacherId: teacher.id } });
    return res.json({ success: true, data: updatedAvailabilities });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
