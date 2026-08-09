import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing existing database records...');
  await prisma.communityPost.deleteMany();
  await prisma.aIMemory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.classroomMember.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🔒 Generating password hashes...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. CREATE ADMIN USER
  console.log('👤 Creating Admin user...');
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@locallearn.ai',
      passwordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      phone: '+91 98765 00000',
      city: 'Bengaluru',
      locality: 'Indiranagar',
      pincode: '560038',
    },
  });

  // 2. CREATE TEACHERS
  console.log('👩‍🏫 Creating Teachers...');
  
  // Teacher 1: Ankit Sharma
  const teacherUser1 = await prisma.user.create({
    data: {
      name: 'Ankit Sharma',
      email: 'ankit.sharma@locallearn.ai',
      passwordHash,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      phone: '+91 98765 11111',
      city: 'Bengaluru',
      locality: 'Indiranagar',
      pincode: '560038',
    },
  });

  const teacherProfile1 = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser1.id,
      bio: 'Ex-KV Senior Mathematics faculty with over 6 years of experience coaching Class 8 to 12 students for CBSE Board exams and Olympiads. Special focus on conceptual clarity and problem-solving tricks.',
      experienceYears: 6,
      education: 'M.Sc Mathematics (DU), B.Ed',
      verificationStatus: 'VERIFIED',
      teachingMode: 'HYBRID',
      hourlyRate: 450,
      monthlyRate: 4000,
      locality: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9784,
      lng: 77.6408,
      rating: 4.9,
      totalStudents: 24,
      subjects: JSON.stringify(['Mathematics', 'Physics', 'Vedic Maths']),
      gradesTaught: JSON.stringify(['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']),
    },
  });

  // Teacher 2: Priya Singh
  const teacherUser2 = await prisma.user.create({
    data: {
      name: 'Priya Singh',
      email: 'priya.singh@locallearn.ai',
      passwordHash,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      phone: '+91 98765 22222',
      city: 'Bengaluru',
      locality: 'Koramangala',
      pincode: '560034',
    },
  });

  const teacherProfile2 = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser2.id,
      bio: 'Passionate Chemistry & Biology tutor with 8 years of teaching experience. Specialized in NEET preparation and Class 10/12 ICSE & CBSE boards. Interactive experiments and visual learning approach.',
      experienceYears: 8,
      education: 'M.Sc Organic Chemistry (IISc Alumni)',
      verificationStatus: 'VERIFIED',
      teachingMode: 'OFFLINE',
      hourlyRate: 500,
      monthlyRate: 4500,
      locality: 'Koramangala',
      city: 'Bengaluru',
      pincode: '560034',
      lat: 12.9352,
      lng: 77.6245,
      rating: 5.0,
      totalStudents: 32,
      subjects: JSON.stringify(['Chemistry', 'Biology', 'Science']),
      gradesTaught: JSON.stringify(['Class 9', 'Class 10', 'Class 11', 'Class 12']),
    },
  });

  // Teacher 3: Rahul Kumar
  const teacherUser3 = await prisma.user.create({
    data: {
      name: 'Rahul Kumar',
      email: 'rahul.kumar@locallearn.ai',
      passwordHash,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      phone: '+91 98765 33333',
      city: 'Bengaluru',
      locality: 'HSR Layout',
      pincode: '560102',
    },
  });

  const teacherProfile3 = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser3.id,
      bio: 'Software engineer by day, passionate coding & Computer Science educator by evening. Teaching Python, Java, Web Development, and CBSE Computer Applications with real hands-on projects.',
      experienceYears: 5,
      education: 'B.Tech Computer Science (RVCE)',
      verificationStatus: 'VERIFIED',
      teachingMode: 'ONLINE',
      hourlyRate: 400,
      monthlyRate: 3500,
      locality: 'HSR Layout',
      city: 'Bengaluru',
      pincode: '560102',
      lat: 12.9121,
      lng: 77.6446,
      rating: 4.8,
      totalStudents: 19,
      subjects: JSON.stringify(['Computer Science', 'Python Coding', 'Mathematics']),
      gradesTaught: JSON.stringify(['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']),
    },
  });

  // Teacher 4: Dr. Sunita Mehta
  const teacherUser4 = await prisma.user.create({
    data: {
      name: 'Dr. Sunita Mehta',
      email: 'sunita.mehta@locallearn.ai',
      passwordHash,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      phone: '+91 98765 44444',
      city: 'Bengaluru',
      locality: 'Indiranagar',
      pincode: '560038',
    },
  });

  const teacherProfile4 = await prisma.teacherProfile.create({
    data: {
      userId: teacherUser4.id,
      bio: 'Ph.D in Physics with 12+ years teaching Class 11-12 Physics and JEE Main/Advanced aspirants. Focused on building strong fundamentals, numerical mastery, and step-by-step problem resolution.',
      experienceYears: 12,
      education: 'Ph.D Physics (IIT Madras)',
      verificationStatus: 'VERIFIED',
      teachingMode: 'HYBRID',
      hourlyRate: 650,
      monthlyRate: 6000,
      locality: 'Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9719,
      lng: 77.6412,
      rating: 4.9,
      totalStudents: 45,
      subjects: JSON.stringify(['Physics', 'Mathematics', 'JEE Physics']),
      gradesTaught: JSON.stringify(['Class 11', 'Class 12']),
    },
  });

  // 3. CREATE STUDENTS
  console.log('👨‍🎓 Creating Students...');
  
  // Student 1: Rahul Verma (Logged in default user)
  const studentUser1 = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul.student@locallearn.ai',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
      phone: '+91 91234 56789',
      city: 'Bengaluru',
      locality: 'Indiranagar',
      pincode: '560038',
    },
  });

  const studentProfile1 = await prisma.studentProfile.create({
    data: {
      userId: studentUser1.id,
      grade: 'Class 10',
      school: 'National Public School, Indiranagar',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      learningGoals: 'Targeting 95%+ in Class 10 Board Exams & strengthening Algebra & Physics fundamentals.',
      preferredLanguage: 'English & Hindi',
      preferredMode: 'HYBRID',
      preferredStudyTime: 'Evening (5:00 PM - 8:00 PM)',
    },
  });

  // Student 2: Ananya Das
  const studentUser2 = await prisma.user.create({
    data: {
      name: 'Ananya Das',
      email: 'ananya.das@locallearn.ai',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
      phone: '+91 91234 99999',
      city: 'Bengaluru',
      locality: 'Koramangala',
      pincode: '560034',
    },
  });

  const studentProfile2 = await prisma.studentProfile.create({
    data: {
      userId: studentUser2.id,
      grade: 'Class 12',
      school: 'Delhi Public School East',
      locality: 'Koramangala',
      city: 'Bengaluru',
      learningGoals: 'Excel in Physics & Chemistry for Class 12 Boards and competitive entrance tests.',
      preferredLanguage: 'English',
      preferredMode: 'OFFLINE',
      preferredStudyTime: 'Late Afternoon (4:00 PM - 6:00 PM)',
    },
  });

  // 4. CREATE AVAILABILITY SLOTS
  console.log('📅 Creating Teacher Availability Slots...');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  for (const teacher of [teacherProfile1, teacherProfile2, teacherProfile3, teacherProfile4]) {
    for (const day of days) {
      await prisma.availability.createMany({
        data: [
          { teacherId: teacher.id, dayOfWeek: day, startTime: '04:00 PM', endTime: '05:00 PM', isBooked: false },
          { teacherId: teacher.id, dayOfWeek: day, startTime: '05:30 PM', endTime: '06:30 PM', isBooked: false },
          { teacherId: teacher.id, dayOfWeek: day, startTime: '07:00 PM', endTime: '08:00 PM', isBooked: false },
        ],
      });
    }
  }

  // 5. CREATE BOOKINGS
  console.log('📝 Creating Tuition Bookings...');
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  await prisma.booking.create({
    data: {
      studentId: studentProfile1.id,
      teacherId: teacherProfile1.id,
      subject: 'Mathematics',
      date: todayStr,
      timeSlot: '05:30 PM - 06:30 PM',
      status: 'CONFIRMED',
      mode: 'HYBRID',
      fee: 450,
      note: 'Focus on Quadratic Equations word problems.',
    },
  });

  await prisma.booking.create({
    data: {
      studentId: studentProfile1.id,
      teacherId: teacherProfile4.id,
      subject: 'Physics',
      date: tomorrowStr,
      timeSlot: '04:00 PM - 05:00 PM',
      status: 'PENDING',
      mode: 'OFFLINE',
      fee: 650,
      note: 'Doubt clearing on Electricity & Magnetism.',
    },
  });

  await prisma.booking.create({
    data: {
      studentId: studentProfile2.id,
      teacherId: teacherProfile2.id,
      subject: 'Chemistry',
      date: todayStr,
      timeSlot: '04:00 PM - 05:00 PM',
      status: 'CONFIRMED',
      mode: 'OFFLINE',
      fee: 500,
      note: 'Organic Chemistry nomenclature practice.',
    },
  });

  // 6. CREATE CLASSROOMS & ASSIGNMENTS
  console.log('🏫 Creating Classrooms & Assignments...');
  const classroom1 = await prisma.classroom.create({
    data: {
      teacherId: teacherProfile1.id,
      name: 'Class 10 Mathematics - Batch Alpha',
      subject: 'Mathematics',
      grade: 'Class 10',
      batchName: 'Batch Alpha 2026',
      schedule: 'Mon, Wed, Fri at 5:30 PM',
      capacity: 12,
    },
  });

  await prisma.classroomMember.create({
    data: {
      classroomId: classroom1.id,
      studentId: studentProfile1.id,
    },
  });

  const assignment1 = await prisma.assignment.create({
    data: {
      classroomId: classroom1.id,
      teacherId: teacherProfile1.id,
      title: 'Quadratic Equations Practice Set',
      description: 'Solve 10 word problems involving discriminant method and real-world quadratic applications.',
      subject: 'Mathematics',
      dueDate: tomorrowStr,
      totalPoints: 100,
    },
  });

  await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: studentProfile1.id,
      content: 'Here are my solutions to Questions 1 to 10 with step-by-step working.',
      score: 92,
      feedback: 'Excellent work Rahul! Minor calculation mistake on Q7, but overall neat approach.',
    },
  });

  // 7. CREATE REVIEWS
  console.log('⭐ Creating Reviews...');
  await prisma.review.create({
    data: {
      studentId: studentProfile1.id,
      teacherId: teacherProfile1.id,
      rating: 5.0,
      comment: 'Ankit sir makes Maths so intuitive! My test scores improved from 72% to 94% in just two months. Highly recommended for Indiranagar students.',
    },
  });

  await prisma.review.create({
    data: {
      studentId: studentProfile2.id,
      teacherId: teacherProfile2.id,
      rating: 5.0,
      comment: 'Priya maam explains organic chemistry reactions with real life visual examples. Makes difficult concepts super memorable!',
    },
  });

  // 8. CREATE AI MEMORIES FOR RAHUL
  console.log('🧠 Creating AI Memories for Student...');
  await prisma.aIMemory.createMany({
    data: [
      {
        userId: studentUser1.id,
        memoryType: 'weakness',
        content: 'Struggles with word problems involving Quadratic Equations discriminant formulation.',
        importance: 'high',
        source: 'LearnMate AI Chat',
      },
      {
        userId: studentUser1.id,
        memoryType: 'preference',
        content: 'Prefers explanations combining real-life physical analogies with English/Hindi mixed dialogue.',
        importance: 'high',
        source: 'Onboarding Survey',
      },
      {
        userId: studentUser1.id,
        memoryType: 'strength',
        content: 'Strong in Coordinate Geometry and Linear Equations graph plotting.',
        importance: 'medium',
        source: 'Quiz Assessment',
      },
      {
        userId: studentUser1.id,
        memoryType: 'goal',
        content: 'Wants 95%+ score in Class 10 CBSE Board Examinations in 2026.',
        importance: 'high',
        source: 'Student Profile Goal',
      },
      {
        userId: studentUser1.id,
        memoryType: 'context',
        content: 'Currently taking weekly tuition with Ankit Sharma for Mathematics in Indiranagar.',
        importance: 'medium',
        source: 'Tuition Booking',
      },
    ],
  });

  // 9. CREATE LEARNING PROGRESS
  console.log('📊 Creating Student Learning Progress...');
  await prisma.learningProgress.createMany({
    data: [
      { studentId: studentProfile1.id, subject: 'Mathematics', topic: 'Quadratic Equations', completionPercent: 85, weakOrStrong: 'WEAK' },
      { studentId: studentProfile1.id, subject: 'Mathematics', topic: 'Coordinate Geometry', completionPercent: 98, weakOrStrong: 'STRONG' },
      { studentId: studentProfile1.id, subject: 'Physics', topic: 'Electricity & Circuits', completionPercent: 65, weakOrStrong: 'NEUTRAL' },
      { studentId: studentProfile1.id, subject: 'Physics', topic: 'Light Reflection & Refraction', completionPercent: 90, weakOrStrong: 'STRONG' },
    ],
  });

  // 10. CREATE MESSAGES
  console.log('💬 Creating Messages...');
  await prisma.message.createMany({
    data: [
      {
        conversationId: `conv_${studentUser1.id}_${teacherUser1.id}`,
        senderId: studentUser1.id,
        receiverId: teacherUser1.id,
        content: 'Hello Ankit Sir! Could we review discriminant word problems in today evening class?',
        isRead: true,
      },
      {
        conversationId: `conv_${studentUser1.id}_${teacherUser1.id}`,
        senderId: teacherUser1.id,
        receiverId: studentUser1.id,
        content: 'Sure Rahul! I have prepared 5 special board exam problems for today at 5:30 PM. See you soon!',
        isRead: true,
      },
    ],
  });

  // 11. CREATE COMMUNITY POSTS
  console.log('🌐 Creating Community Posts...');
  await prisma.communityPost.createMany({
    data: [
      {
        userId: studentUser1.id,
        title: 'Tips for memorizing Physics Optics ray diagrams?',
        content: 'Hi everyone! What techniques do you use to draw exact concave mirror ray diagrams without scaling errors during exams?',
        category: 'Doubt',
        likes: 8,
        repliesCount: 3,
      },
      {
        userId: teacherUser1.id,
        title: 'Class 10 CBSE Math Formula Cheat Sheet 2026 [Free Download]',
        content: 'I have compiled a 4-page quick formula revision sheet covering Algebra, Trigonometry, and Mensuration. Feel free to use it for quick revision!',
        category: 'Resource',
        likes: 24,
        repliesCount: 9,
      },
      {
        userId: teacherUser2.id,
        title: 'Indiranagar Class 10 Chemistry Weekend Doubt Batch starting this Saturday',
        content: 'Hosting a free 1-hour doubt resolution session on Chemical Reactions & Acids-Bases at our Indiranagar tuition hub. Open to all Class 10 students.',
        category: 'Announcement',
        likes: 15,
        repliesCount: 5,
      },
    ],
  });

  console.log('✅ Database seeded successfully with demo data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
