import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Sparkles, Check, ArrowRight, GraduationCap } from 'lucide-react';

export const StudentOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [grade, setGrade] = useState('Class 10');
  const [school, setSchool] = useState('National Public School');
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [learningGoals, setLearningGoals] = useState('Targeting 95%+ in Class 10 Board Exams');
  const [preferredMode, setPreferredMode] = useState('HYBRID');
  const [preferredStudyTime, setPreferredStudyTime] = useState('Evening (5 PM - 8 PM)');

  const handleFinishOnboarding = async () => {
    try {
      await api.updateStudentProfile({
        grade,
        school,
        learningGoals,
        preferredMode,
        preferredStudyTime,
      });

      // Also create AI Memory for goals
      await api.addMemory({
        memoryType: 'goal',
        content: learningGoals,
        importance: 'high',
      });

      navigate('/student/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-glass space-y-6">
        {/* STEP PROGRESS INDICATOR */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-brand-400" />
            <h2 className="text-lg font-extrabold text-white">Student Onboarding</h2>
          </div>
          <span className="text-xs font-mono text-brand-300 font-bold">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">What class and school are you in?</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Select Grade / Class</label>
              <div className="grid grid-cols-3 gap-2">
                {['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      grade === g ? 'bg-brand-600 border-brand-400 text-white shadow-glow' : 'bg-gray-800 border-gray-700 text-gray-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">School Name</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center justify-center space-x-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">What is your primary learning goal?</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Learning Goal</label>
              <textarea
                rows={3}
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-white"
                placeholder="e.g. Improve Maths test scores, prepare for CBSE board exams..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Preferred Tuition Timing</label>
              <select
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                <option value="Late Afternoon (3 PM - 5 PM)">Late Afternoon (3 PM - 5 PM)</option>
                <option value="Morning (8 AM - 11 AM)">Morning (8 AM - 11 AM)</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Your Personalized Learning Profile is Ready!</h3>
            <p className="text-xs text-gray-300">
              Grade: <strong className="text-white">{grade}</strong> • Goal: <strong className="text-white">{learningGoals}</strong>
            </p>

            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow transition"
            >
              Enter Student Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
