import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/classrooms - List classrooms for logged-in user
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const role = req.user?.role;

    if (role === 'TEACHER') {
      const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
      if (!teacher) return res.json({ success: true, data: [] });

      const classrooms = await prisma.classroom.findMany({
        where: { teacherId: teacher.id },
        include: {
          members: { include: { student: { include: { user: { select: { name: true, avatar: true } } } } } },
          assignments: { include: { submissions: true } },
        },
      });
      return res.json({ success: true, data: classrooms });
    } else {
      const student = await prisma.studentProfile.findUnique({ where: { userId } });
      if (!student) return res.json({ success: true, data: [] });

      const memberships = await prisma.classroomMember.findMany({
        where: { studentId: student.id },
        include: {
          classroom: {
            include: {
              teacher: { include: { user: { select: { name: true, avatar: true } } } },
              assignments: { include: { submissions: { where: { studentId: student.id } } } },
            },
          },
        },
      });

      const classrooms = memberships.map((m) => m.classroom);
      return res.json({ success: true, data: classrooms });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/classrooms - Teacher creates virtual classroom batch
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const { name, subject, grade, batchName, schedule, capacity } = req.body;

    const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(403).json({ success: false, error: { message: 'Only teachers can create classrooms' } });
    }

    const classroom = await prisma.classroom.create({
      data: {
        teacherId: teacher.id,
        name,
        subject,
        grade,
        batchName: batchName || 'Batch 1',
        schedule: schedule || 'Mon & Wed at 5 PM',
        capacity: capacity ? Number(capacity) : 15,
      },
    });

    return res.json({ success: true, data: classroom });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/classrooms/assignments - Teacher creates assignment
router.post('/assignments', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const { classroomId, title, description, subject, dueDate, totalPoints } = req.body;

    const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (!teacher) {
      return res.status(403).json({ success: false, error: { message: 'Only teachers can post assignments' } });
    }

    const assignment = await prisma.assignment.create({
      data: {
        classroomId,
        teacherId: teacher.id,
        title,
        description,
        subject,
        dueDate,
        totalPoints: totalPoints ? Number(totalPoints) : 100,
      },
    });

    return res.json({ success: true, data: assignment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/classrooms/submissions - Student submits homework answer
router.post('/submissions', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const { assignmentId, content, fileUrl } = req.body;

    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) {
      return res.status(403).json({ success: false, error: { message: 'Only registered students can submit homework' } });
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: student.id,
        content: content || 'Homework submission attached.',
        fileUrl: fileUrl || null,
      },
    });

    return res.json({ success: true, data: submission });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// PATCH /api/classrooms/submissions/:id/grade - Teacher grades submission
router.patch('/submissions/:id/grade', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { score, feedback } = req.body;

    const submission = await prisma.submission.update({
      where: { id },
      data: {
        score: score ? Number(score) : undefined,
        feedback: feedback ?? undefined,
      },
    });

    return res.json({ success: true, data: submission });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
