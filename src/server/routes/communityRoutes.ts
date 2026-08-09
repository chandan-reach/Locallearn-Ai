import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/community/posts
router.get('/posts', async (req: AuthRequest, res: Response) => {
  try {
    const posts = await prisma.communityPost.findMany({
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true, locality: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: posts });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/community/posts
router.post('/posts', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: { message: 'Title and content are required' } });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId,
        title,
        content,
        category: category || 'General',
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true, locality: true } },
      },
    });

    return res.json({ success: true, data: post });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/community/posts/:id/like
router.post('/posts/:id/like', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const post = await prisma.communityPost.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
    return res.json({ success: true, data: post });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
