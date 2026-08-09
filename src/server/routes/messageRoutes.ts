import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/conversations - Get list of direct conversations
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } },
        receiver: { select: { id: true, name: true, avatar: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by conversation partner
    const conversationsMap = new Map<string, any>();

    for (const msg of messages) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(partner.id)) {
        conversationsMap.set(partner.id, {
          conversationId: msg.conversationId,
          partner,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          isRead: msg.isRead || msg.senderId === userId,
        });
      }
    }

    return res.json({ success: true, data: Array.from(conversationsMap.values()) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// GET /api/conversations/:partnerId/messages - Get messages with a specific partner
router.get('/:partnerId/messages', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '';
    const partnerId = Array.isArray(req.params.partnerId) ? req.params.partnerId[0] : req.params.partnerId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ success: true, data: messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// POST /api/messages - Send a text or attachment message
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id || '';
    const { receiverId, content, fileUrl } = req.body;

    if (!receiverId || (!content && !fileUrl)) {
      return res.status(400).json({ success: false, error: { message: 'Receiver and content/file are required' } });
    }

    const conversationId = [senderId, receiverId].sort().join('_');

    const message = await prisma.message.create({
      data: {
        conversationId: `conv_${conversationId}`,
        senderId,
        receiverId,
        content: content || 'Sent an attachment',
        fileUrl: fileUrl || null,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: `New message from ${req.user?.name}`,
        message: content ? content.slice(0, 80) : 'Sent an attachment file',
        type: 'MESSAGE',
        link: '/student/messages',
      },
    });

    return res.json({ success: true, data: message });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { message: err.message } });
  }
});

export default router;
