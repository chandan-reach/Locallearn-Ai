import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = Router();

// POST /api/ai/chat - Ask LearnMate AI
router.post('/chat', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: { message: 'Message text is required' } });
    }

    const aiResult = await AIService.chatWithAI({ userId, message });

    return res.json({
      success: true,
      data: aiResult,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'AI_SERVICE_ERROR', message: err.message || 'AI assistant encountered an error' },
    });
  }
});

// GET /api/ai/memories - View My Learning Memory
router.get('/memories', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const memories = await prisma.aIMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: memories });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/ai/memories - Add Custom Memory
router.post('/memories', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const { memoryType, content, importance } = req.body;

    const newMemory = await prisma.aIMemory.create({
      data: {
        userId,
        memoryType: memoryType || 'preference',
        content,
        importance: importance || 'medium',
        source: 'User Manual Addition',
      },
    });

    return res.json({ success: true, data: newMemory });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// DELETE /api/ai/memories/:id - Delete Specific Memory
router.delete('/memories/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.aIMemory.delete({ where: { id } });
    return res.json({ success: true, message: 'Memory item deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// DELETE /api/ai/memories - Clear All Memories
router.delete('/memories', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    await prisma.aIMemory.deleteMany({ where: { userId } });
    return res.json({ success: true, message: 'All student learning memories cleared' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/ai/learning-plan - Generate 7-Day Personalized Study Plan
router.post('/learning-plan', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { subject, goal } = req.body;
    const plan = await AIService.generateLearningPlan(subject || 'Mathematics', goal || 'Master Quadratic Equations');
    return res.json({ success: true, data: plan });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/ai/teacher-tools - AI Teacher Assistant tools
router.post('/teacher-tools', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { action, payload } = req.body;
    const result = await AIService.teacherAssistantTools(action, payload);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
