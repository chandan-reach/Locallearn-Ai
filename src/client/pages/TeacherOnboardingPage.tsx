import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export const TeacherOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [bio, setBio] = useState('Ex-KV faculty with 6 years experience coaching CBSE board exam students.');
  const [education, setEducation] = useState('M.Sc Mathematics (DU), B.Ed');
  const [experienceYears, setExperienceYears] = useState(6);
  const [hourlyRate, setHourlyRate] = useState(450);
  const [teachingMode, setTeachingMode] = useState('HYBRID');
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [gradesTaught, setGradesTaught] = useState<string[]>(['Class 9', 'Class 10', 'Class 12']);

  const handleFinishOnboarding = async () => {
    try {
      await api.updateTeacherProfile({
        bio,
        education,
        experienceYears,
        hourlyRate,
        teachingMode,
        subjects,
        gradesTaught,
      });

      navigate('/teacher/dashboard');
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
            <Award className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-extrabold text-white">Teacher Registration</h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Bio & Teaching Experience</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Education / Qualifications</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Years of Teaching Experience</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow"
            >
              Next Step →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Pricing & Teaching Mode</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Hourly Tuition Rate (₹/hour)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Teaching Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {['HYBRID', 'OFFLINE', 'ONLINE'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTeachingMode(m)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      teachingMode === m ? 'bg-emerald-600 border-emerald-400 text-white shadow-glow' : 'bg-gray-800 border-gray-700 text-gray-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
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
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Teacher Profile Ready!</h3>
            <p className="text-xs text-gray-300">Your profile will be listed in local search results immediately.</p>

            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow transition"
            >
              Enter Teacher Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
