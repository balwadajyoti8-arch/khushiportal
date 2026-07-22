import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  Code2, 
  BookOpen, 
  Building2, 
  Calendar,
  Activity,
  Plus,
  Trash2,
  Edit,
  Upload,
  Download,
  ToggleLeft,
  ToggleRight,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton, TableSkeleton } from '../components/Skeleton';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab data lists
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Modals / Form states
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null); // null for new, object for edit
  const [qTitle, setQTitle] = useState('');
  const [qCompanies, setQCompanies] = useState('');
  const [qTopic, setQTopic] = useState('Arrays');
  const [qDifficulty, setQDifficulty] = useState('Medium');
  const [qPlatform, setQPlatform] = useState('LeetCode');
  const [qUrl, setQUrl] = useState('');
  const [qTags, setQTags] = useState('');
  const [qFreq, setQFreq] = useState('No');
  const [qPremium, setQPremium] = useState('Free');

  // Bulk Import state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkData, setBulkData] = useState('');

  // MCQ Modal state
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [activeMCQ, setActiveMCQ] = useState(null);
  const [mcqQuest, setMcqQuest] = useState('');
  const [mcqOptA, setMcqOptA] = useState('');
  const [mcqOptB, setMcqOptB] = useState('');
  const [mcqOptC, setMcqOptC] = useState('');
  const [mcqOptD, setMcqOptD] = useState('');
  const [mcqCorrect, setMcqCorrect] = useState(0);
  const [mcqTopic, setMcqTopic] = useState('OS');
  const [mcqDiff, setMcqDiff] = useState('Medium');
  const [mcqExplain, setMcqExplain] = useState('');

  const topics = [
    'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs',
    'DP', 'Greedy', 'Binary Search', 'Recursion', 'Backtracking', 'Sorting',
    'Searching', 'Hashing', 'Math', 'Bit Manipulation', 'OOP', 'DBMS', 'OS', 'CN', 'Aptitude'
  ];

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentActivities(res.data.recentActivities);
      }
    } catch (err) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const loadTabData = async (tabName) => {
    try {
      if (tabName === 'Questions') {
        const res = await api.get('/questions?limit=100'); // fetch first 100 questions
        if (res.data.success) setQuestions(res.data.data);
      } else if (tabName === 'MCQs') {
        const res = await api.get('/mcqs?limit=100');
        if (res.data.success) setMcqs(res.data.data);
      } else if (tabName === 'Companies') {
        const res = await api.get('/companies');
        if (res.data.success) setCompanies(res.data.data);
      } else if (tabName === 'Users') {
        const res = await api.get('/admin/users');
        if (res.data.success) setUsers(res.data.data);
      }
    } catch (err) {
      toast.error(`Failed to load ${tabName} data`);
    }
  };

  useEffect(() => {
    if (activeTab !== 'Overview') {
      loadTabData(activeTab);
    } else {
      fetchOverview();
    }
  }, [activeTab]);

  // ==========================================
  // QUESTION MANAGEMENT ACTIONS
  // ==========================================

  const handleOpenQuestionModal = (q = null) => {
    setActiveQuestion(q);
    if (q) {
      setQTitle(q.title);
      setQCompanies(q.companies.join(', '));
      setQTopic(q.topic);
      setQDifficulty(q.difficulty);
      setQPlatform(q.platform);
      setQUrl(q.externalUrl);
      setQTags(q.tags.join(', '));
      setQFreq(q.frequentlyAsked);
      setQPremium(q.premiumBadge);
    } else {
      setQTitle('');
      setQCompanies('');
      setQTopic('Arrays');
      setQDifficulty('Medium');
      setQPlatform('LeetCode');
      setQUrl('');
      setQTags('');
      setQFreq('No');
      setQPremium('Free');
    }
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    const payload = {
      title: qTitle,
      companies: qCompanies.split(',').map(c => c.trim()).filter(Boolean),
      topic: qTopic,
      difficulty: qDifficulty,
      platform: qPlatform,
      externalUrl: qUrl,
      tags: qTags.split(',').map(t => t.trim()).filter(Boolean),
      frequentlyAsked: qFreq,
      premiumBadge: qPremium,
    };

    try {
      let res;
      if (activeQuestion) {
        res = await api.put(`/admin/questions/${activeQuestion._id}`, payload);
      } else {
        res = await api.post('/admin/questions', payload);
      }

      if (res.data.success) {
        toast.success(activeQuestion ? 'Question updated' : 'Question added');
        setShowQuestionModal(false);
        loadTabData('Questions');
      }
    } catch (err) {
      toast.error('Failed to save question reference');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question reference?')) return;
    try {
      const res = await api.delete(`/admin/questions/${id}`);
      if (res.data.success) {
        toast.success('Question deleted');
        loadTabData('Questions');
      }
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  const handleToggleQuestionStatus = async (q) => {
    const nextStatus = q.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await api.put(`/admin/questions/${q._id}`, { status: nextStatus });
      if (res.data.success) {
        toast.success(`Question status set to ${nextStatus}`);
        loadTabData('Questions');
      }
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  // Bulk Import
  const handleBulkImportSubmit = async (e) => {
    e.preventDefault();
    if (!bulkData) return;
    try {
      const parsed = JSON.parse(bulkData);
      const res = await api.post('/admin/questions/bulk', { questions: parsed });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowBulkModal(false);
        setBulkData('');
        loadTabData('Questions');
      }
    } catch (err) {
      toast.error('Invalid JSON format. Check brackets and commas.');
    }
  };

  // Export questions JSON
  const handleExportQuestions = async () => {
    try {
      const res = await api.get('/admin/questions/export');
      if (res.data.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "question_references.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success('Export downloaded');
      }
    } catch (err) {
      toast.error('Export failed');
    }
  };

  // ==========================================
  // MCQ PRACTICE CRUD ACTIONS
  // ==========================================

  const handleOpenMCQModal = (mcq = null) => {
    setActiveMCQ(mcq);
    if (mcq) {
      setMcqQuest(mcq.question);
      setMcqOptA(mcq.options[0] || '');
      setMcqOptB(mcq.options[1] || '');
      setMcqOptC(mcq.options[2] || '');
      setMcqOptD(mcq.options[3] || '');
      setMcqCorrect(mcq.correctOption);
      setMcqTopic(mcq.topic);
      setMcqDiff(mcq.difficulty);
      setMcqExplain(mcq.explanation);
    } else {
      setMcqQuest('');
      setMcqOptA('');
      setMcqOptB('');
      setMcqOptC('');
      setMcqOptD('');
      setMcqCorrect(0);
      setMcqTopic('OS');
      setMcqDiff('Medium');
      setMcqExplain('');
    }
    setShowMCQModal(true);
  };

  const handleSaveMCQ = async (e) => {
    e.preventDefault();
    const payload = {
      question: mcqQuest,
      options: [mcqOptA, mcqOptB, mcqOptC, mcqOptD].filter(Boolean),
      correctOption: Number(mcqCorrect),
      topic: mcqTopic,
      difficulty: mcqDiff,
      explanation: mcqExplain,
    };

    try {
      let res;
      if (activeMCQ) {
        res = await api.put(`/admin/mcqs/${activeMCQ._id}`, payload);
      } else {
        res = await api.post('/admin/mcqs', payload);
      }

      if (res.data.success) {
        toast.success(activeMCQ ? 'MCQ updated' : 'MCQ added');
        setShowMCQModal(false);
        loadTabData('MCQs');
      }
    } catch (err) {
      toast.error('Failed to save MCQ');
    }
  };

  const handleDeleteMCQ = async (id) => {
    if (!window.confirm('Delete this MCQ?')) return;
    try {
      const res = await api.delete(`/admin/mcqs/${id}`);
      if (res.data.success) {
        toast.success('MCQ deleted');
        loadTabData('MCQs');
      }
    } catch (err) {
      toast.error('Failed to delete MCQ');
    }
  };

  // ==========================================
  // USER CONTROL ACTIONS
  // ==========================================

  const handleToggleUserRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'student' : 'admin';
    try {
      const res = await api.put(`/admin/users/${u._id}/role`, { role: nextRole });
      if (res.data.success) {
        toast.success(`User role set to ${nextRole}`);
        loadTabData('Users');
      }
    } catch (err) {
      toast.error('Role update failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        toast.success('User deleted');
        loadTabData('Users');
      }
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck size={26} className="text-primary-500" /> Admin Control Center
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Maintain collections, manage students, import question data sets, and analyze portal usage.
          </p>
        </div>
      </div>

      {/* ADMIN TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b border-gray-250 dark:border-dark-border pb-1">
        {['Overview', 'Questions', 'MCQs', 'Companies', 'Users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold text-sm transition-all duration-200 border-b-2 px-3 ${
              activeTab === tab
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW PANEL */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { label: 'Students', value: stats?.totalUsers, icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
                { label: 'Total Coding', value: stats?.totalQuestions, icon: Code2, color: 'text-primary-500 bg-primary-500/10' },
                { label: 'Active Coding', value: stats?.activeQuestions, icon: Code2, color: 'text-emerald-500 bg-emerald-500/10' },
                { label: 'Total MCQs', value: stats?.totalMCQs, icon: BookOpen, color: 'text-blue-500 bg-blue-500/10' },
                { label: 'Companies', value: stats?.totalCompanies, icon: Building2, color: 'text-amber-500 bg-amber-500/10' },
                { label: 'Mocks Booked', value: stats?.totalInterviews, icon: Calendar, color: 'text-rose-500 bg-rose-500/10' }
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-4 rounded-2xl flex flex-col justify-between h-28">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="text-xl font-black block mt-2">{c.value}</span>
                      <span className="text-[10px] text-slate-450 dark:text-gray-400 block mt-0.5 uppercase tracking-wider font-semibold">{c.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RECENT ACTIVITY */}
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl space-y-4 transition duration-200">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Activity size={18} className="text-rose-500" /> Global Portal Log
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {recentActivities.map((log, i) => (
                <div key={i} className="flex gap-3 text-xs border-b border-gray-50 dark:border-dark-border pb-3 last:border-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="font-bold text-gray-700 dark:text-gray-200">
                      {log.userId?.name} <span className="text-slate-400 font-normal">({log.userId?.email})</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">{log.actionType} : {log.details}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONS PANEL */}
      {activeTab === 'Questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Coding Question References ({questions.length})</h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenQuestionModal(null)}
                className="flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                <Plus size={14} /> Add Reference
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-1 px-4 py-2 border border-gray-250 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-card/50 font-bold text-xs rounded-xl transition"
              >
                <Upload size={14} /> Bulk JSON Import
              </button>
              <button
                onClick={handleExportQuestions}
                className="flex items-center gap-1 px-4 py-2 border border-gray-250 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-card/50 font-bold text-xs rounded-xl transition"
              >
                <Download size={14} /> Export JSON
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-55/50 dark:bg-dark-card/50 text-slate-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-dark-border">
                  <tr>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Title</th>
                    <th className="px-6 py-3.5">Topic</th>
                    <th className="px-6 py-3.5">Platform</th>
                    <th className="px-6 py-3.5">Difficulty</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {questions.map((q) => (
                    <tr key={q._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-card/50 transition">
                      <td className="px-6 py-3.5">
                        <button
                          onClick={() => handleToggleQuestionStatus(q)}
                          className={`flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${
                            q.status === 'Active'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          }`}
                        >
                          {q.status === 'Active' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          {q.status}
                        </button>
                      </td>
                      <td className="px-6 py-3.5 font-bold">{q.title}</td>
                      <td className="px-6 py-3.5">{q.topic}</td>
                      <td className="px-6 py-3.5 font-semibold text-xs text-primary-500">{q.platform}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                          q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenQuestionModal(q)}
                          className="p-1.5 border hover:bg-gray-100 dark:hover:bg-dark-card text-slate-500 dark:text-gray-400 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="p-1.5 border hover:bg-rose-500/5 text-rose-500 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MCQS PANEL */}
      {activeTab === 'MCQs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">CS MCQ Library ({mcqs.length})</h3>
            <button
              onClick={() => handleOpenMCQModal(null)}
              className="flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              <Plus size={14} /> Add MCQ
            </button>
          </div>

          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-55/50 dark:bg-dark-card/50 text-slate-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-dark-border">
                  <tr>
                    <th className="px-6 py-3.5">Question Text</th>
                    <th className="px-6 py-3.5">Topic Focus</th>
                    <th className="px-6 py-3.5">Difficulty</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {mcqs.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-card/50 transition">
                      <td className="px-6 py-3.5 font-medium max-w-sm truncate">{m.question}</td>
                      <td className="px-6 py-3.5">{m.topic}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          m.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                          m.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {m.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenMCQModal(m)}
                          className="p-1.5 border hover:bg-gray-100 dark:hover:bg-dark-card text-slate-500 dark:text-gray-400 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteMCQ(m._id)}
                          className="p-1.5 border hover:bg-rose-500/5 text-rose-500 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COMPANIES PANEL */}
      {activeTab === 'Companies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Target Recruiters ({companies.length})</h3>
          </div>
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-55/50 dark:bg-dark-card/50 text-slate-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-dark-border">
                <tr>
                  <th className="px-6 py-3.5">Company Name</th>
                  <th className="px-6 py-3.5">Industry tags</th>
                  <th className="px-6 py-3.5">Brief Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {companies.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-card/50 transition">
                    <td className="px-6 py-3.5 font-bold">{c.name}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex gap-1">
                        {c.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500 max-w-sm truncate">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS PANEL */}
      {activeTab === 'Users' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base">Registered Portal Users ({users.length})</h3>
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-55/50 dark:bg-dark-card/50 text-slate-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-dark-border">
                  <tr>
                    <th className="px-6 py-3.5">Name</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Academic Track</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-card/50 transition">
                      <td className="px-6 py-3.5 font-bold">{u.name}</td>
                      <td className="px-6 py-3.5">{u.email}</td>
                      <td className="px-6 py-3.5 text-xs">
                        {u.college ? `${u.college} (${u.branch})` : 'Not Completed'}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-lg border ${
                          u.role === 'admin'
                            ? 'bg-primary-500/10 border-primary-500/20 text-primary-500'
                            : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleToggleUserRole(u)}
                          className="px-2.5 py-1 border hover:bg-gray-50 dark:hover:bg-dark-card text-xs font-bold rounded-xl transition"
                          title="Toggle Role"
                        >
                          Make {u.role === 'admin' ? 'Student' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 border hover:bg-rose-500/5 text-rose-500 rounded-xl transition"
                          title="Delete User"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION REFERENCE ADD/EDIT MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQuestionModal(false)}></div>
          <form 
            onSubmit={handleSaveQuestion}
            className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative z-10"
          >
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Code2 size={20} className="text-primary-500" /> {activeQuestion ? 'Edit Coding Reference' : 'Add Coding Reference'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Question Title</label>
                <input
                  type="text"
                  required
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Companies (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon"
                  value={qCompanies}
                  onChange={(e) => setQCompanies(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Topic Focus</label>
                <select
                  value={qTopic}
                  onChange={(e) => setQTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                >
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Difficulty</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Platform</label>
                <select
                  value={qPlatform}
                  onChange={(e) => setQPlatform(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="CodeStudio">CodeStudio</option>
                  <option value="InterviewBit">InterviewBit</option>
                  <option value="CodeChef">CodeChef</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">External Practice Link URL</label>
                <input
                  type="url"
                  required
                  value={qUrl}
                  onChange={(e) => setQUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-500 block uppercase">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. array, recursion, google-oa"
                  value={qTags}
                  onChange={(e) => setQTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Frequently Asked?</label>
                <select
                  value={qFreq}
                  onChange={(e) => setQFreq(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Premium / Free Badge</label>
                <select
                  value={qPremium}
                  onChange={(e) => setQPremium(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                >
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-primary-605 bg-primary-600 hover:bg-primary-700 rounded-xl shadow transition"
              >
                Save Reference
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BULK IMPORT MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkModal(false)}></div>
          <form 
            onSubmit={handleBulkImportSubmit}
            className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative z-10"
          >
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Upload size={20} className="text-primary-500" /> Bulk JSON Question Import
            </h3>
            <p className="text-xs text-slate-400">
              Paste a valid JSON array of Question Reference objects matching the required schema structure.
            </p>
            <textarea
              required
              rows={10}
              placeholder='[{"title":"Example Q","companies":["Google"],"topic":"Arrays","difficulty":"Medium","platform":"LeetCode","externalUrl":"https://leetcode.com/...","tags":["array"]}]'
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              className="w-full p-3.5 border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg rounded-2xl text-xs focus:outline-none font-mono"
            ></textarea>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow transition"
              >
                Validate & Import
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MCQ ADD/EDIT MODAL */}
      {showMCQModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMCQModal(false)}></div>
          <form 
            onSubmit={handleSaveMCQ}
            className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative z-10"
          >
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <BookOpen size={20} className="text-primary-500" /> {activeMCQ ? 'Edit MCQ' : 'Add MCQ'}
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Question Text</label>
                <input
                  type="text"
                  required
                  value={mcqQuest}
                  onChange={(e) => setMcqQuest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block uppercase">Option A</label>
                  <input
                    type="text"
                    required
                    value={mcqOptA}
                    onChange={(e) => setMcqOptA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block uppercase">Option B</label>
                  <input
                    type="text"
                    required
                    value={mcqOptB}
                    onChange={(e) => setMcqOptB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block uppercase">Option C</label>
                  <input
                    type="text"
                    value={mcqOptC}
                    onChange={(e) => setMcqOptC(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block uppercase">Option D</label>
                  <input
                    type="text"
                    value={mcqOptD}
                    onChange={(e) => setMcqOptD(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block uppercase">Correct Option Index</label>
                  <select
                    value={mcqCorrect}
                    onChange={(e) => setMcqCorrect(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                  >
                    <option value={0}>0 (Option A)</option>
                    <option value={1}>1 (Option B)</option>
                    <option value={2}>2 (Option C)</option>
                    <option value={3}>3 (Option D)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block uppercase">Topic</label>
                  <select
                    value={mcqTopic}
                    onChange={(e) => setMcqTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                  >
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 block uppercase">Difficulty</label>
                  <select
                    value={mcqDiff}
                    onChange={(e) => setMcqDiff(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500 block uppercase">Detailed Explanation</label>
                <textarea
                  value={mcqExplain}
                  onChange={(e) => setMcqExplain(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg rounded-xl focus:outline-none"
                ></textarea>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMCQModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow transition"
              >
                Save MCQ
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
