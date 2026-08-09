import React, { useState } from 'react';
import { api } from '../services/api';
import { Clock, Plus, Trash2, Check, Save } from 'lucide-react';

interface Slot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export const TeacherAvailabilityPage: React.FC = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [schedule, setSchedule] = useState<Slot[]>([
    { dayOfWeek: 'Monday', startTime: '04:00 PM', endTime: '05:00 PM' },
    { dayOfWeek: 'Monday', startTime: '05:30 PM', endTime: '06:30 PM' },
    { dayOfWeek: 'Wednesday', startTime: '04:00 PM', endTime: '05:00 PM' },
    { dayOfWeek: 'Friday', startTime: '05:30 PM', endTime: '06:30 PM' },
  ]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAddSlot = (dayOfWeek: string) => {
    setSchedule((prev) => [...prev, { dayOfWeek, startTime: '05:00 PM', endTime: '06:00 PM' }]);
  };

  const handleRemoveSlot = (index: number) => {
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateAvailability(schedule);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center justify-between shadow-glass">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" /> Weekly Availability Schedule
          </h1>
          <p className="text-xs text-gray-400">Define the days and time slots when students can book tuition classes with you.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow transition flex items-center space-x-2"
        >
          {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Schedule'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const daySlots = schedule.filter((s) => s.dayOfWeek === day);
          return (
            <div key={day} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{day}</span>
                <button
                  onClick={() => handleAddSlot(day)}
                  className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-brand-300 border border-gray-700 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slot</span>
                </button>
              </div>

              {daySlots.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No available slots set for {day}.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {schedule.map((slot, idx) => {
                    if (slot.dayOfWeek !== day) return null;
                    return (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/60">
                        <span className="text-xs text-emerald-400 font-mono font-bold">{slot.startTime} - {slot.endTime}</span>
                        <button
                          onClick={() => handleRemoveSlot(idx)}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
