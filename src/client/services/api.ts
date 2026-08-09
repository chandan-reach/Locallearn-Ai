const BASE_URL = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('locallearn_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('locallearn_token', token);
  } else {
    localStorage.removeItem('locallearn_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'API Request failed');
  }

  return json.data;
}

export const api = {
  // Auth
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<any>('/auth/me'),

  // Teachers
  getTeachers: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request<any[]>(`/teachers${query ? `?${query}` : ''}`);
  },
  getTeacherById: (id: string) => request<any>(`/teachers/${id}`),
  updateTeacherProfile: (data: any) => request<any>('/teachers/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateAvailability: (slots: any[]) => request<any>('/teachers/availability', { method: 'PUT', body: JSON.stringify({ slots }) }),

  // Students
  getStudentProfile: () => request<any>('/students/profile'),
  updateStudentProfile: (data: any) => request<any>('/students/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Bookings
  createBooking: (data: any) => request<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookings: () => request<any[]>('/bookings'),
  updateBookingStatus: (id: string, status: string) => request<any>(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // AI & Memory
  askAI: (message: string) => request<any>('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getMemories: () => request<AIMemoryItem[]>('/ai/memories'),
  addMemory: (data: { memoryType: string; content: string; importance?: string }) => request<AIMemoryItem>('/ai/memories', { method: 'POST', body: JSON.stringify(data) }),
  deleteMemory: (id: string) => request<any>(`/ai/memories/${id}`, { method: 'DELETE' }),
  clearAllMemories: () => request<any>('/ai/memories', { method: 'DELETE' }),
  generateLearningPlan: (subject: string, goal: string) => request<any>('/ai/learning-plan', { method: 'POST', body: JSON.stringify({ subject, goal }) }),
  teacherAITools: (action: string, payload: any) => request<any>('/ai/teacher-tools', { method: 'POST', body: JSON.stringify({ action, payload }) }),

  // Messages
  getConversations: () => request<any[]>('/messages'),
  getMessages: (partnerId: string) => request<any[]>(`/messages/${partnerId}/messages`),
  sendMessage: (receiverId: string, content: string, fileUrl?: string) => request<any>('/messages', { method: 'POST', body: JSON.stringify({ receiverId, content, fileUrl }) }),

  // Classrooms & Assignments
  getClassrooms: () => request<any[]>('/classrooms'),
  createClassroom: (data: any) => request<any>('/classrooms', { method: 'POST', body: JSON.stringify(data) }),
  createAssignment: (data: any) => request<any>('/classrooms/assignments', { method: 'POST', body: JSON.stringify(data) }),
  submitHomework: (assignmentId: string, content: string, fileUrl?: string) => request<any>('/classrooms/submissions', { method: 'POST', body: JSON.stringify({ assignmentId, content, fileUrl }) }),
  gradeSubmission: (id: string, score: number, feedback: string) => request<any>(`/classrooms/submissions/${id}/grade`, { method: 'PATCH', body: JSON.stringify({ score, feedback }) }),

  // Community
  getCommunityPosts: () => request<any[]>('/community/posts'),
  createCommunityPost: (data: { title: string; content: string; category?: string }) => request<any>('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  likeCommunityPost: (id: string) => request<any>(`/community/posts/${id}/like`, { method: 'POST' }),

  // Admin
  getAdminStats: () => request<AdminStats>('/admin/stats'),
  getAdminUsers: () => request<any[]>('/admin/users'),
  verifyTeacher: (id: string, status: string) => request<any>(`/admin/teachers/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

import { AIMemoryItem, AdminStats } from '../types';
