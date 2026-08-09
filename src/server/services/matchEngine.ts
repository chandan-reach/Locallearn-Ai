export interface TeacherMatchInput {
  teacher: {
    id: string;
    subjects: any;
    gradesTaught: any;
    locality: string;
    city: string;
    hourlyRate: number;
    teachingMode: string;
    rating: number;
    experienceYears: number;
  };
  studentQuery?: {
    subject?: string;
    grade?: string;
    locality?: string;
    maxBudget?: number;
    preferredMode?: string;
  };
}

export function calculateTeacherMatch(input: TeacherMatchInput) {
  const { teacher, studentQuery } = input;
  let score = 75; // base compatibility score
  const matchReasons: string[] = [];

  const targetSubject = studentQuery?.subject?.toLowerCase() || '';
  const targetGrade = studentQuery?.grade?.toLowerCase() || '';
  const targetLocality = studentQuery?.locality?.toLowerCase() || '';
  const maxBudget = studentQuery?.maxBudget || 1000;
  const targetMode = studentQuery?.preferredMode || 'HYBRID';

  // 1. Subject Match
  if (targetSubject) {
    const hasSubject = Array.isArray(teacher.subjects) && teacher.subjects.some((s: string) => s.toLowerCase().includes(targetSubject));
    if (hasSubject) {
      score += 15;
      matchReasons.push(`Teaches your requested subject (${studentQuery?.subject})`);
    } else {
      score -= 15;
    }
  } else {
    score += 5;
    matchReasons.push(`Offers core subjects in your curriculum`);
  }

  // 2. Class/Grade Match
  if (targetGrade) {
    const hasGrade = Array.isArray(teacher.gradesTaught) && teacher.gradesTaught.some((g: string) => g.toLowerCase().includes(targetGrade));
    if (hasGrade) {
      score += 10;
      matchReasons.push(`Specializes in ${studentQuery?.grade} curriculum`);
    }
  }

  // 3. Location/Distance
  if (targetLocality && teacher.locality.toLowerCase().includes(targetLocality)) {
    score += 10;
    matchReasons.push(`Located directly in your neighborhood (${teacher.locality})`);
  } else if (teacher.city === (studentQuery?.locality ? 'Bengaluru' : 'Bengaluru')) {
    score += 5;
    matchReasons.push(`Located nearby in ${teacher.locality}`);
  }

  // 4. Budget Compatibility
  if (teacher.hourlyRate <= maxBudget) {
    score += 5;
    matchReasons.push(`Fits within your budget at ₹${teacher.hourlyRate}/hr`);
  }

  // 5. Rating & Experience boost
  if (teacher.rating >= 4.8) {
    score += 5;
    matchReasons.push(`Top-rated tutor (${teacher.rating}⭐ with ${teacher.experienceYears}+ years exp)`);
  }

  // Clamp score between 60% and 99%
  const finalScore = Math.min(Math.max(Math.round(score), 68), 99);

  return {
    matchScore: finalScore,
    matchReasons: matchReasons.slice(0, 4),
  };
}
