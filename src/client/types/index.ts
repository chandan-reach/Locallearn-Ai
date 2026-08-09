export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  city?: string;
  locality?: string;
  pincode?: string;
  teacherProfile?: TeacherProfile;
  studentProfile?: StudentProfile;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  bio: string;
  experienceYears: number;
  education: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  teachingMode: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  hourlyRate: number;
  monthlyRate: number;
  locality: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  rating: number;
  totalStudents: number;
  subjects: string[];
  gradesTaught: string[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    locality?: string;
    city?: string;
  };
  availabilities?: AvailabilitySlot[];
  matchScore?: number;
  matchReasons?: string[];
  reviewsCount?: number;
}

export interface StudentProfile {
  id: string;
  userId: string;
  grade: string;
  school: string;
  locality: string;
  city: string;
  learningGoals: string;
  preferredLanguage: string;
  preferredMode: string;
  preferredStudyTime: string;
  user?: User;
}

export interface AvailabilitySlot {
  id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

export interface Booking {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  date: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  mode: string;
  fee: number;
  note?: string;
  createdAt: string;
  teacher?: {
    id: string;
    user: {
      name: string;
      avatar?: string;
      phone?: string;
      locality?: string;
    };
  };
  student?: {
    id: string;
    user: {
      name: string;
      avatar?: string;
      phone?: string;
      locality?: string;
    };
  };
}

export interface AIMemoryItem {
  id: string;
  userId: string;
  memoryType: 'preference' | 'weakness' | 'strength' | 'goal' | 'habit' | 'context';
  content: string;
  importance: 'low' | 'medium' | 'high';
  source?: string;
  createdAt: string;
}

export interface Classroom {
  id: string;
  teacherId: string;
  name: string;
  subject: string;
  grade: string;
  batchName: string;
  schedule: string;
  capacity: number;
  teacher?: { user: { name: string; avatar?: string } };
  members?: any[];
  assignments?: Assignment[];
}

export interface Assignment {
  id: string;
  classroomId: string;
  teacherId: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  totalPoints: number;
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrl?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  fileUrl?: string;
  isRead: boolean;
  createdAt: string;
  sender?: { id: string; name: string; avatar?: string };
  receiver?: { id: string; name: string; avatar?: string };
}

export interface CommunityPostItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  repliesCount: number;
  createdAt: string;
  user: { id: string; name: string; avatar?: string; role: string; locality: string };
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalBookings: number;
  activeClassrooms: number;
  pendingVerifications: number;
  totalRevenue: number;
}
