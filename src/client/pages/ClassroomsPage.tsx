import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Classroom } from '../types';
import { BookOpen, Plus, FileText, CheckCircle, Clock, Calendar, Sparkles } from 'lucide-react';

export const ClassroomsPage: React.FC = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  // New Homework Form state
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [dueDate, setDueDate] = useState('');

  // Homework submission state
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const data = await api.getClassrooms();
      setClassrooms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAssignment({
        classroomId: selectedClassroomId || classrooms[0]?.id,
        title,
        description,
        subject,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
      });
      setShowAssignmentModal(false);
      setTitle('');
      setDescription('');
      fetchClassrooms();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitHomework = async (assignmentId: string) => {
    if (!submissionContent.trim()) return;
    try {
      await api.submitHomework(assignmentId, submissionContent);
      alert('Homework submitted successfully!');
      setSelectedAssignmentId(null);
      setSubmissionContent('');
      fetchClassrooms();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-glass">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Virtual Classrooms & Homework</h1>
            <p className="text-xs text-gray-400">Access batch schedules, view assignments, upload homework, and track grades.</p>
          </div>
        </div>

        {user?.role === 'TEACHER' && (
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Homework Assignment</span>
          </button>
        )}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showAssignmentModal && (
        <form onSubmit={handleCreateAssignment} className="bg-gray-900 border border-brand-500/40 rounded-3xl p-6 space-y-4 shadow-glow max-w-xl mx-auto">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" /> Post Homework Assignment
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Select Classroom Batch</label>
            <select
              value={selectedClassroomId}
              onChange={(e) => setSelectedClassroomId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Assignment Title</label>
            <input
              type="text"
              placeholder="e.g. Quadratic Equations Practice Set 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Instructions / Description</label>
            <textarea
              rows={3}
              placeholder="Solve Questions 1 to 10 step-by-step..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAssignmentModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-500 text-white shadow-glow"
            >
              Post Assignment
            </button>
          </div>
        </form>
      )}

      {/* CLASSROOMS LIST */}
      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading classrooms...</div>
      ) : classrooms.length === 0 ? (
        <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-10 text-center space-y-3 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Classrooms</h3>
          <p className="text-xs text-gray-400">Classrooms will appear once your tutor adds you to a batch classroom.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {classrooms.map((c) => (
            <div key={c.id} className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {c.name}
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {c.grade}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400">Schedule: {c.schedule} • Tutor: {c.teacher?.user.name}</p>
                </div>

                <span className="text-xs text-emerald-400 font-semibold font-mono">
                  Batch: {c.batchName} ({c.members?.length || 1}/{c.capacity} Students)
                </span>
              </div>

              {/* ASSIGNMENTS IN THIS CLASSROOM */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Class Assignments</h4>
                {c.assignments?.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No homework assignments posted yet.</p>
                ) : (
                  c.assignments?.map((a) => (
                    <div key={a.id} className="p-4 rounded-2xl bg-gray-800/60 border border-gray-700/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-white">{a.title}</h5>
                        <span className="text-xs text-amber-400 font-semibold">Due: {a.dueDate}</span>
                      </div>
                      <p className="text-xs text-gray-300">{a.description}</p>

                      {/* SUBMISSION ACTION */}
                      {user?.role === 'STUDENT' && (
                        <div className="pt-2">
                          {selectedAssignmentId === a.id ? (
                            <div className="space-y-2">
                              <textarea
                                rows={2}
                                placeholder="Type your homework answer or paste solution link..."
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                                className="w-full bg-gray-900 border border-brand-500 rounded-xl p-2.5 text-xs text-white"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSubmitHomework(a.id)}
                                  className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold shadow-glow"
                                >
                                  Submit Answer
                                </button>
                                <button
                                  onClick={() => setSelectedAssignmentId(null)}
                                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedAssignmentId(a.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-brand-300 text-xs font-semibold border border-gray-700 transition"
                            >
                              Submit Homework →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
