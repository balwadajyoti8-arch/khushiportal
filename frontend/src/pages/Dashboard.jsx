import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Flame, 
  CheckCircle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Activity, 
  Compass, 
  Target 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { CardSkeleton, ChartSkeleton } from '../components/Skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/progress/analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  // Fallback structures if db seeding warning occurred
  const stats = data?.stats || {
    totalQuestions: 0,
    solvedQuestions: 0,
    inProgressQuestions: 0,
    bookmarkedQuestions: 0,
    revisionQuestions: 0,
    completionPercentage: 0
  };
  const streak = data?.streak || { current: 0, longest: 0 };
  const difficultyStats = data?.difficultyStats || [
    { difficulty: 'Easy', solved: 0, total: 0 },
    { difficulty: 'Medium', solved: 0, total: 0 },
    { difficulty: 'Hard', solved: 0, total: 0 }
  ];
  const weeklyProgress = data?.weeklyProgress || [];
  const monthlyProgress = data?.monthlyProgress || [];
  const recentActivity = data?.recentActivity || [];
  const topicStats = data?.topicStats || [];

  // Recommended topics (topics with < 100% completion or general list)
  const recommendedTopics = topicStats
    .filter(topic => topic.percentage < 100)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 4);

  // Default recommendations if empty
  const defaultRecommendations = [
    { topic: 'Arrays', percentage: 20 },
    { topic: 'Strings', percentage: 10 },
    { topic: 'Dynamic Programming', percentage: 0 },
    { topic: 'Graphs', percentage: 0 }
  ];
  const finalRecommendations = recommendedTopics.length > 0 ? recommendedTopics : defaultRecommendations;

  // Colors for difficulty breakdown pie chart
  const COLORS = {
    Easy: '#10b981',   // Emerald
    Medium: '#f59e0b', // Amber
    Hard: '#ef4444'    // Red
  };

  const pieData = difficultyStats.map(d => ({
    name: d.difficulty,
    value: d.solved || 1, // Avoid 0 values in Pie charts
    color: COLORS[d.difficulty]
  }));

  // Daily goal mock state
  const dailyGoal = {
    target: 3,
    solvedToday: weeklyProgress.length > 0 ? weeklyProgress[weeklyProgress.length - 1].solved : 0
  };
  const dailyPercentage = Math.min(Math.round((dailyGoal.solvedToday / dailyGoal.target) * 100), 100);

  return (
    <div className="space-y-8">
      
      {/* WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-colors duration-200">
        <div className="absolute right-0 top-0 w-48 h-48 bg-primary-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm max-w-xl leading-relaxed">
            Ready to crack that dream offer? Keep up the progress. We recommend starting with a coding question or taking a quick MCQ quiz.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/questions"
            className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition shadow-md shadow-primary-500/10"
          >
            Solve Questions
          </Link>
          <Link
            to="/mcqs"
            className="px-5 py-3 rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 font-semibold text-sm transition"
          >
            Start MCQ Test
          </Link>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* COMPLETED */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex items-center gap-4 transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Solved</span>
            <span className="text-2xl font-extrabold block mt-0.5">{stats.solvedQuestions}</span>
            <span className="text-xs text-slate-400 block mt-0.5">out of {stats.totalQuestions} questions</span>
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex items-center gap-4 transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-extrabold block mt-0.5">{stats.inProgressQuestions}</span>
            <span className="text-xs text-slate-400 block mt-0.5">currently preparing</span>
          </div>
        </div>

        {/* STREAK */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex items-center gap-4 transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner animate-pulse">
            <Flame size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Current Streak</span>
            <span className="text-2xl font-extrabold block mt-0.5">{streak.current} Days</span>
            <span className="text-xs text-slate-400 block mt-0.5">Longest: {streak.longest} Days</span>
          </div>
        </div>

        {/* COMPLETION % */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex items-center gap-4 transition duration-200">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-inner">
            <Trophy size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Completion Rate</span>
            <span className="text-2xl font-extrabold block mt-0.5">{stats.completionPercentage}%</span>
            <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${stats.completionPercentage}%` }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PROGRESS OVER TIME */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl lg:col-span-2 transition duration-200">
          <h3 className="font-bold text-lg mb-6">Activity Progress</h3>
          <div className="h-64">
            {weeklyProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProgress}>
                  <defs>
                    <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#243048" opacity={0.1}/>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false}/>
                  <Tooltip 
                    contentStyle={{ 
                      background: '#161e2e', 
                      border: '1px solid #243048', 
                      borderRadius: '12px',
                      color: '#f3f4f6'
                    }}
                  />
                  <Area type="monotone" dataKey="solved" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolved)" name="Solved Questions"/>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No activity recorded yet</div>
            )}
          </div>
        </div>

        {/* DIFFICULTY BREAKDOWN PIE */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between transition duration-200">
          <h3 className="font-bold text-lg">Difficulty Mastery</h3>
          <div className="h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold">{stats.solvedQuestions}</span>
              <span className="text-xs text-slate-400">Total Solved</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            {difficultyStats.map((d, i) => (
              <div key={i} className="space-y-1">
                <span className="block" style={{ color: COLORS[d.difficulty] }}>{d.difficulty}</span>
                <span className="block text-sm font-bold">{d.solved} / {d.total}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* REMAINING MODULES: MOCKS, GOALS, RECENT ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DAILY GOAL & RECOMMENDED TOPICS */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl space-y-6 transition duration-200">
          
          {/* DAILY GOAL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Target size={18} className="text-primary-500" /> Daily Target
              </h3>
              <span className="text-xs font-bold text-slate-400">{dailyGoal.solvedToday} / {dailyGoal.target} Done</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full" style={{ width: `${dailyPercentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-400">
              {dailyPercentage === 100 
                ? '🎉 Excellent! You have hit today\'s goal.' 
                : `Solve ${dailyGoal.target - dailyGoal.solvedToday} more questions to hit your daily goal.`
              }
            </p>
          </div>

          <hr className="border-gray-100 dark:border-dark-border" />

          {/* RECOMMENDED TOPICS */}
          <div className="space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Compass size={18} className="text-indigo-500" /> Topic focus
            </h3>
            <div className="space-y-3">
              {finalRecommendations.map((rec, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-gray-300 font-medium">{rec.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${rec.percentage}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{rec.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* UPCOMING MOCK INTERVIEWS */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between transition duration-200">
          <div className="space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" /> Upcoming Mock
            </h3>
            
            {/* We mock this dynamically or show schedule CTA */}
            <div className="p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg uppercase">
                  Technical Mock
                </span>
                <span className="text-xs text-slate-400">Scheduled</span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm">Placement Preparation Mock 1</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">Interviewer: System Peer</p>
              </div>
              <div className="text-xs flex items-center justify-between font-semibold pt-1">
                <span>July 18, 2026</span>
                <span>02:00 PM</span>
              </div>
            </div>
          </div>

          <Link
            to="/mock-interviews"
            className="w-full py-3 px-4 mt-4 rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            Manage Mocks <ArrowRight size={14} />
          </Link>
        </div>

        {/* RECENT ACTIVITY LOGS */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between transition duration-200">
          <div className="space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Activity size={18} className="text-rose-500" /> Recent Activity
            </h3>

            <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
              {recentActivity.length > 0 ? (
                recentActivity.map((log, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-gray-700 dark:text-gray-200">{log.actionType}</p>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{log.details}</p>
                      <p className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No activities logged yet. Get started by solving a coding reference!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
