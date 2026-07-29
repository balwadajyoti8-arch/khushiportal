import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Building2, 
  HelpCircle, 
  ChevronLeft, 
  ExternalLink,
  Plus,
  BookmarkCheck,
  MessageSquare,
  Sparkles,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DetailSkeleton, TableSkeleton } from '../components/Skeleton';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CompanyDetail = () => {
  const { name } = useParams();
  const [company, setCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Filters for company questions
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [platform, setPlatform] = useState('');

  // Experience modal/form state
  const [showExpModal, setShowExpModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expYear, setExpYear] = useState('2026');
  const [expContent, setExpContent] = useState('');
  const [expStatus, setExpStatus] = useState('Offered');
  const [submittingExp, setSubmittingExp] = useState(false);

  // Lists
  const topics = ['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs', 'DP', 'Greedy', 'Binary Search'];
  const platforms = ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeStudio', 'InterviewBit', 'CodeChef'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const fetchCompanyDetails = async () => {
    try {
      const res = await api.get(`/companies/${name}`);
      if (res.data.success) {
        setCompany(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const params = {
        company: name,
        limit: 100, // Load all for this company
      };
      if (topic) params.topic = topic;
      if (difficulty) params.difficulty = difficulty;
      if (platform) params.platform = platform;

      const res = await api.get('/questions', { params });
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [name]);

  useEffect(() => {
    fetchCompanyQuestions();
  }, [name, topic, difficulty, platform]);

  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!expTitle || !expRole || !expContent) return;

    setSubmittingExp(true);
    try {
      const res = await api.post(`/companies/${name}/experiences`, {
        title: expTitle,
        role: expRole,
        year: expYear,
        content: expContent,
        status: expStatus,
      });

      if (res.data.success) {
        toast.success('Experience shared successfully!');
        setExpTitle('');
        setExpRole('');
        setExpContent('');
        setShowExpModal(false);
        fetchCompanyDetails(); // Reload company experiences
      }
    } catch (err) {
      toast.error('Failed to submit experience');
    } finally {
      setSubmittingExp(false);
    }
  };

  const handleUpdateStatus = async (questionId, field, value) => {
    try {
      const res = await api.post(`/questions/${questionId}/progress`, { [field]: value });
      if (res.data.success) {
        setQuestions((prev) =>
          prev.map((q) => {
            if (q._id === questionId) {
              return {
                ...q,
                userProgress: {
                  ...q.userProgress,
                  [field]: value,
                },
              };
            }
            return q;
          })
        );
        toast.success('Progress updated');
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-bold">Company not found</h2>
        <Link to="/companies" className="text-primary-500 hover:underline mt-2 inline-block">Back to companies</Link>
      </div>
    );
  }

  const { stats, preparationTips, interviewExperiences } = company;

  // Chart data
  const chartData = [
    { name: 'Easy', count: stats.easyQuestions, fill: '#10b981' },
    { name: 'Medium', count: stats.mediumQuestions, fill: '#f59e0b' },
    { name: 'Hard', count: stats.hardQuestions, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      
      {/* HEADER BREADCRUMB */}
      <div className="flex items-center gap-4">
        <Link to="/companies" className="p-2 rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-card/50 transition">
          <ChevronLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            {company.name} Prep Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400">Company Targeted prep dashboard</p>
        </div>
      </div>

      {/* OVERVIEW STATS & PREP TIPS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* STATS BREAKDOWN */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl space-y-4 lg:col-span-2 transition duration-200">
          <h3 className="font-bold text-base flex items-center gap-1.5"><Sparkles size={16} className="text-primary-500" /> Stats breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-dark-bg border border-gray-150 dark:border-dark-border p-4 rounded-2xl text-center">
              <span className="text-2xl font-black block">{stats.totalQuestions}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Coding</span>
            </div>
            <div className="bg-slate-50 dark:bg-dark-bg border border-gray-150 dark:border-dark-border p-4 rounded-2xl text-center">
              <span className="text-2xl font-black text-emerald-500 block">{stats.easyQuestions}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Easy</span>
            </div>
            <div className="bg-slate-50 dark:bg-dark-bg border border-gray-150 dark:border-dark-border p-4 rounded-2xl text-center">
              <span className="text-2xl font-black text-amber-500 block">{stats.mediumQuestions}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Medium</span>
            </div>
            <div className="bg-slate-50 dark:bg-dark-bg border border-gray-150 dark:border-dark-border p-4 rounded-2xl text-center">
              <span className="text-2xl font-black text-rose-500 block">{stats.hardQuestions}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hard</span>
            </div>
          </div>

          {/* Mini BarChart */}
          <div className="h-28 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" barSize={10}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={50} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PREPARATION TIPS */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between transition duration-200">
          <div className="space-y-4">
            <h3 className="font-bold text-base flex items-center gap-1.5"><Sparkles size={16} className="text-amber-500" /> Prep Tips</h3>
            <ul className="space-y-3">
              {preparationTips.map((tip, i) => (
                <li key={i} className="flex gap-2.5 text-xs leading-relaxed text-slate-650 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* CODING QUESTIONS LIST */}
      <div className="space-y-4">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-lg flex items-center gap-1.5"><BookOpen size={18} className="text-primary-500" /> Company Coding Questions</h3>
          
          <div className="flex flex-wrap gap-2.5">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-semibold rounded-lg focus:outline-none"
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-semibold rounded-lg focus:outline-none"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-semibold rounded-lg focus:outline-none"
            >
              <option value="">All Platforms</option>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Questions table list */}
        {questionsLoading ? (
          <TableSkeleton rows={5} />
        ) : questions.length === 0 ? (
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-8 rounded-3xl text-center text-slate-400 text-sm">
            No company specific questions found matching criteria.
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-dark-card/50 text-slate-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-dark-border">
                  <tr>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Difficulty</th>
                    <th className="px-6 py-3">Topic</th>
                    <th className="px-6 py-3 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {questions.map((q) => {
                    const progress = q.userProgress || { status: 'Not Started' };
                    return (
                      <tr key={q._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-card/50 transition">
                        <td className="px-6 py-3.5">
                          <select
                            value={progress.status}
                            onChange={(e) => handleUpdateStatus(q._id, 'status', e.target.value)}
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg focus:outline-none ${
                              progress.status === 'Solved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                              progress.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                              'bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            <option value="Not Started">⚪ Not Started</option>
                            <option value="In Progress">◐ In Progress</option>
                            <option value="Solved">✔ Solved</option>
                          </select>
                        </td>
                        <td className="px-6 py-3.5 font-bold">{q.title}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                            q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600' :
                            q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-rose-500/10 text-rose-600'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-850 rounded text-xs">{q.topic}</span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <a
                            href={q.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary-500 hover:underline"
                          >
                            Open {q.platform} <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* INTERVIEW EXPERIENCES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-1.5"><MessageSquare size={18} className="text-primary-500" /> Student Interview Experiences</h3>
          <button
            onClick={() => setShowExpModal(true)}
            className="flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            <Plus size={14} /> Add My Experience
          </button>
        </div>

        {interviewExperiences.length === 0 ? (
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl text-center text-slate-400 text-sm">
            No student experiences shared yet. Be the first to share!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviewExperiences.map((exp, i) => (
              <div key={i} className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-5 sm:p-6 rounded-3xl space-y-4 transition duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{exp.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      By {exp.author} • {exp.role} ({exp.year})
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg ${
                    exp.status === 'Offered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {exp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-650 dark:text-gray-400 leading-relaxed font-sans line-clamp-4">
                  {exp.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD EXPERIENCE MODAL POPUP */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExpModal(false)}></div>
          <form 
            onSubmit={handleAddExperience}
            className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl relative z-10"
          >
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <MessageSquare size={20} className="text-primary-500" /> Share My Interview Experience
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Experience Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE-1 Placement Drive Experience"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Target Role
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer Intern"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Year of Interview
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026"
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Final Decision / Status
                </label>
                <select
                  value={expStatus}
                  onChange={(e) => setExpStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none"
                >
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  Detailed Experience Content
                </label>
                <textarea
                  required
                  placeholder="Describe your rounds, coding questions asked, system design topics, questions on OS/DBMS, behavioral interview questions, and tips..."
                  value={expContent}
                  onChange={(e) => setExpContent(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExpModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submittingExp}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition"
              >
                {submittingExp ? 'Submitting...' : 'Share Experience'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CompanyDetail;
