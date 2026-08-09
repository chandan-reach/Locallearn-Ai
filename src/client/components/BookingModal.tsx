import React, { useState } from 'react';
import { TeacherProfile } from '../types';
import { api } from '../services/api';
import { X, Calendar, Clock, MapPin, Check, Sparkles, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  teacher: TeacherProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ teacher, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !teacher) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedSubject, setSelectedSubject] = useState<string>(teacher.subjects?.[0] || 'Mathematics');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('05:30 PM - 06:30 PM');
  const [selectedMode, setSelectedMode] = useState<string>(teacher.teachingMode || 'HYBRID');
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const availableSlots = [
    '04:00 PM - 05:00 PM',
    '05:30 PM - 06:30 PM',
    '07:00 PM - 08:00 PM',
  ];

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.createBooking({
        teacherId: teacher.id,
        subject: selectedSubject,
        date: selectedDate,
        timeSlot: selectedSlot,
        mode: selectedMode,
        fee: teacher.hourlyRate,
        note,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-glass animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-brand-950/60 to-gray-900">
          <div className="flex items-center space-x-3">
            <img
              src={teacher.avatar || teacher.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
              alt={teacher.name || teacher.user?.name}
              className="w-11 h-11 rounded-xl object-cover border border-brand-500"
            />
            <div>
              <h3 className="text-base font-bold text-white">Book Class with {teacher.name || teacher.user?.name}</h3>
              <p className="text-xs text-brand-300 font-medium">₹{teacher.hourlyRate}/hour • {teacher.locality}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY FORM */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-white">Tuition Booking Requested!</h4>
            <p className="text-sm text-gray-300 max-w-xs mx-auto">
              Your request for <span className="text-brand-300 font-bold">{selectedSubject}</span> on {selectedDate} has been sent to {teacher.name || teacher.user?.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SUBJECT SELECTION */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Select Subject</label>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects?.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      selectedSubject === sub
                        ? 'bg-brand-600 border-brand-400 text-white shadow-glow'
                        : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* DATE SELECTOR */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                <span>Select Class Date</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            {/* TIME SLOT BUTTONS */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Available Time Slots</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition ${
                      selectedSlot === slot
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-glow'
                        : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* TEACHING MODE */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Teaching Mode</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['HYBRID', 'OFFLINE', 'ONLINE'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedMode(mode)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      selectedMode === mode
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* NOTE TO TEACHER */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Note or Topics to Cover</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Please focus on quadratic equation discriminant word problems..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* SUMMARY & SUBMIT */}
            <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block">Total Tuition Fee</span>
                <span className="text-lg font-extrabold text-white">₹{teacher.hourlyRate}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-500 text-white shadow-glow flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{submitting ? 'Confirming...' : 'Confirm Request'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
