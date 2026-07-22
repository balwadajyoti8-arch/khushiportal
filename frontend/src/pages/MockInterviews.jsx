import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Calendar, 
  Clock, 
  Video, 
  Trash2, 
  Edit, 
  ArrowRight, 
  Plus,
  CheckCircle,
  XCircle,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const MockInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Interview Form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Technical');
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Reschedule Form states
  const [rescheduleItem, setRescheduleItem] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/interviews');
      if (res.data.success) {
        setInterviews(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!date || !time || !type) return;

    try {
      const res = await api.post('/interviews', { date, time, type });
      if (res.data.success) {
        toast.success('Mock interview scheduled successfully!');
        setDate('');
        setTime('');
        setShowScheduleForm(false);
        fetchInterviews();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;
    try {
      const res = await api.put(`/interviews/${id}/cancel`);
      if (res.data.success) {
        toast.success('Interview cancelled');
        fetchInterviews();
      }
    } catch (err) {
      toast.error('Failed to cancel interview');
    }
  };

  const handleOpenReschedule = (interview) => {
    setRescheduleItem(interview);
    setNewDate(interview.date);
    setNewTime(interview.time);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime || !rescheduleItem) return;

    try {
      const res = await api.put(`/interviews/${rescheduleItem._id}/reschedule`, {
        date: newDate,
        time: newTime
      });

      if (res.data.success) {
        toast.success('Interview rescheduled successfully');
        setRescheduleItem(null);
        fetchInterviews();
      }
    } catch (err) {
      toast.error('Failed to reschedule');
    }
  };

  // Segregate scheduled vs past/cancelled
  const upcoming = interviews.filter((i) => i.status === 'Scheduled');
  const past = interviews.filter((i) => i.status === 'Completed' || i.status === 'Cancelled');

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Mock Interview Scheduler</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Schedule mock technical, behavioral, system design, or HR interviews with peer interviewers.
          </p>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-md shadow-primary-500/10 transition"
        >
          <Plus size={18} /> Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* UPCOMING INTERVIEWS PANEL */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Video size={18} className="text-primary-500" /> Upcoming Sessions
          </h3>

          {loading ? (
            <div className="h-48 border border-gray-150 dark:border-dark-border rounded-3xl animate-pulse bg-white dark:bg-dark-card"></div>
          ) : upcoming.length === 0 ? (
            <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl p-8 text-center space-y-3">
              <p className="text-slate-400 text-sm">No upcoming interviews scheduled.</p>
              <button
                onClick={() => setShowScheduleForm(true)}
                className="text-xs text-primary-500 hover:underline font-bold"
              >
                Schedule one now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((session) => (
                <div 
                  key={session._id} 
                  className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 text-xs font-extrabold bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg uppercase">
                        {session.type} Mock
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock size={12} /> {session.time}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm">Placement Preparation Practice Session</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Interviewer: Allocated peer coordinator</p>
                    </div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Date: {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <button
                      onClick={() => handleOpenReschedule(session)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 rounded-xl transition"
                    >
                      <Edit size={14} /> Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(session._id)}
                      className="p-2 text-rose-500 border border-gray-200 dark:border-dark-border hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-xl transition"
                      title="Cancel Interview"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAST SESSIONS HISTORICAL LOGS */}
        <div className="space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-500" /> History & Feedback
          </h3>

          {loading ? (
            <div className="h-48 border border-gray-150 dark:border-dark-border rounded-3xl animate-pulse bg-white dark:bg-dark-card"></div>
          ) : past.length === 0 ? (
            <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl p-6 text-center text-slate-400 text-sm">
              No historical data available.
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {past.map((session) => (
                <div 
                  key={session._id} 
                  className={`bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-5 rounded-3xl space-y-3 transition duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400 rounded-lg">
                      {session.type}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-bold ${
                      session.status === 'Completed' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {session.status === 'Completed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {session.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold">{new Date(session.date).toLocaleDateString()}</p>
                    <p className="text-slate-500 dark:text-gray-400">{session.time}</p>
                  </div>

                  {session.status === 'Completed' && (
                    <div className="border-t border-gray-100 dark:border-dark-border pt-2 space-y-2">
                      {session.score && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                          <Award size={14} /> Score: {session.score}/10
                        </div>
                      )}
                      {session.feedback && (
                        <div className="bg-gray-50 dark:bg-dark-card/50 p-2.5 rounded-lg border border-gray-250 dark:border-dark-border text-[11px] text-slate-600 dark:text-gray-450 leading-relaxed italic">
                          "{session.feedback}"
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* SCHEDULE NEW INTERVIEW MODAL POPUP */}
      {showScheduleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowScheduleForm(false)}></div>
          <form 
            onSubmit={handleSchedule}
            className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative z-10"
          >
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Calendar size={20} className="text-primary-500" /> Schedule Mock Interview
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Block past dates
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Select Time Slot
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Interview Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                >
                  <option value="Technical">Technical (Coding/DSA)</option>
                  <option value="HR">HR & Management</option>
                  <option value="Behavioral">Behavioral (Leadership)</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition"
              >
                Schedule Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RESCHEDULE MODAL POPUP */}
      {rescheduleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRescheduleItem(null)}></div>
          <form 
            onSubmit={handleRescheduleSubmit}
            className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative z-10"
          >
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Clock size={20} className="text-primary-500" /> Reschedule Session
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Select New Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Select New Time Slot
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleItem(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition"
              >
                Apply Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default MockInterviews;
