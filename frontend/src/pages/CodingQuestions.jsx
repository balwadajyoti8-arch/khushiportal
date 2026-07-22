import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Bookmark, 
  FileText, 
  Star, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../components/Skeleton';

const CodingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [bookmarkedFilter, setBookmarkedFilter] = useState(false);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [revisionFilter, setRevisionFilter] = useState(false);
  
  // Sort, Pagination
  const [sort, setSort] = useState('title_asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Lists for dropdown options
  const [companies, setCompanies] = useState([]);
  const [topics, setTopics] = useState([]);
  
  // Notes Modal state
  const [activeNoteQuestion, setActiveNoteQuestion] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Constants
  const platforms = ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeStudio', 'InterviewBit', 'CodeChef'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort,
      };
      if (search) params.search = search;
      if (selectedCompany) params.company = selectedCompany;
      if (selectedTopic) params.topic = selectedTopic;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (selectedPlatform) params.platform = selectedPlatform;
      if (selectedStatus) params.status = selectedStatus;
      if (bookmarkedFilter) params.bookmarked = 'true';
      if (favoriteFilter) params.favorite = 'true';
      if (revisionFilter) params.revision = 'true';

      const res = await api.get('/questions', { params });
      if (res.data.success) {
        setQuestions(res.data.data);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch coding questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      if (res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await api.get('/topics');
      if (res.data.success) {
        setTopics(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchTopics();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [
    page, 
    selectedCompany, 
    selectedTopic, 
    selectedDifficulty, 
    selectedPlatform, 
    selectedStatus, 
    bookmarkedFilter, 
    favoriteFilter, 
    revisionFilter,
    sort
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  // Quick state update helper
  const handleUpdateStatus = async (questionId, field, value) => {
    try {
      const payload = { [field]: value };
      const res = await api.post(`/questions/${questionId}/progress`, payload);
      
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

  // Toggle general bookmark collection
  const handleToggleBookmark = async (questionId) => {
    try {
      const res = await api.post('/bookmarks/toggle', {
        itemType: 'Question',
        itemId: questionId
      });
      if (res.data.success) {
        const isBookmarked = res.data.bookmarked;
        setQuestions((prev) =>
          prev.map((q) => {
            if (q._id === questionId) {
              return {
                ...q,
                userProgress: {
                  ...q.userProgress,
                  isBookmarked,
                },
              };
            }
            return q;
          })
        );
        toast.success(isBookmarked ? 'Bookmark added' : 'Bookmark removed');
      }
    } catch (err) {
      toast.error('Failed to toggle bookmark');
    }
  };

  // Notes Modal operations
  const handleOpenNote = async (question) => {
    setActiveNoteQuestion(question);
    setNoteContent('');
    try {
      const res = await api.get(`/notes/question/${question._id}`);
      if (res.data.success && res.data.data.content) {
        setNoteContent(res.data.data.content);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNote = async () => {
    if (!activeNoteQuestion) return;
    setSavingNote(true);
    try {
      const res = await api.post(`/notes/question/${activeNoteQuestion._id}`, {
        content: noteContent
      });
      if (res.data.success) {
        toast.success('Note saved successfully');
        setActiveNoteQuestion(null);
      }
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  // Color mappings
  const diffColors = {
    Easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Coding Question Bank</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Access, filter, and track external platform coding questions.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl space-y-4 transition duration-200">
        
        {/* Row 1: Search, Topic, Difficulty */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search by question title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          <div>
            <select
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.name} ({t.questionCount})</option>)}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </form>

        {/* Row 2: Company, Platform, Status, Sort */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => { setSelectedCompany(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              <option value="">All Companies</option>
              {companies.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <select
              value={selectedPlatform}
              onChange={(e) => { setSelectedPlatform(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              <option value="">All Platforms</option>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              <option value="">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            >
              <option value="title_asc">Sort A-Z</option>
              <option value="title_desc">Sort Z-A</option>
            </select>
          </div>
        </div>

        {/* Row 3: Quick flags toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2">
          <button
            onClick={() => { setBookmarkedFilter(!bookmarkedFilter); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg border transition ${
              bookmarkedFilter
                ? 'bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-card/50'
            }`}
          >
            ⭐ Bookmarked
          </button>
          <button
            onClick={() => { setFavoriteFilter(!favoriteFilter); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg border transition ${
              favoriteFilter
                ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                : 'border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-card/50'
            }`}
          >
            ❤ Favorite
          </button>
          <button
            onClick={() => { setRevisionFilter(!revisionFilter); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg border transition ${
              revisionFilter
                ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                : 'border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-card/50'
            }`}
          >
            🔁 Revision Required
          </button>

          {(bookmarkedFilter || favoriteFilter || revisionFilter || selectedCompany || selectedTopic || selectedDifficulty || selectedPlatform || selectedStatus || search) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCompany('');
                setSelectedTopic('');
                setSelectedDifficulty('');
                setSelectedPlatform('');
                setSelectedStatus('');
                setBookmarkedFilter(false);
                setFavoriteFilter(false);
                setRevisionFilter(false);
                setPage(1);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline ml-auto"
            >
              Clear All Filters
            </button>
          )}
        </div>

      </div>

      {/* QUESTION TABLE OR CARDS */}
      {loading ? (
        <TableSkeleton rows={10} />
      ) : questions.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl p-12 text-center space-y-4">
          <div className="flex justify-center text-gray-400">
            <HelpCircle size={48} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">No Questions Found</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        </div>
      ) : (
        /* Question List */
        <div className="space-y-4">
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl overflow-hidden transition duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-55/50 dark:bg-dark-card/50 text-slate-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-dark-border">
                  <tr>
                    <th className="px-6 py-4">Status / Actions</th>
                    <th className="px-6 py-4">Question Title</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Topic</th>
                    <th className="px-6 py-4">Companies</th>
                    <th className="px-6 py-4 text-right">Platform Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {questions.map((q) => {
                    const progress = q.userProgress || {
                      status: 'Not Started',
                      isBookmarked: false,
                      isFavorite: false,
                      revisionRequired: false,
                    };

                    return (
                      <tr key={q._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-card/50 transition">
                        
                        {/* Status Switcher & Bookmark / Favorite icons */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Status Quick selector */}
                            <select
                              value={progress.status}
                              onChange={(e) => handleUpdateStatus(q._id, 'status', e.target.value)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg focus:outline-none transition ${
                                progress.status === 'Solved'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : progress.status === 'In Progress'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                              }`}
                            >
                              <option value="Not Started">⚪ Not Started</option>
                              <option value="In Progress">◐ In Progress</option>
                              <option value="Solved">✔ Solved</option>
                            </select>

                            {/* Bookmark Toggle */}
                            <button
                              onClick={() => handleToggleBookmark(q._id)}
                              className={`p-1.5 rounded-lg border transition ${
                                progress.isBookmarked
                                  ? 'bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-400'
                                  : 'border-gray-200 dark:border-dark-border text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'
                              }`}
                              title="Bookmark"
                            >
                              <BookmarkCheck size={14} />
                            </button>

                            {/* Favorite Toggle */}
                            <button
                              onClick={() => handleUpdateStatus(q._id, 'isFavorite', !progress.isFavorite)}
                              className={`p-1.5 rounded-lg border transition ${
                                progress.isFavorite
                                  ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                                  : 'border-gray-200 dark:border-dark-border text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'
                              }`}
                              title="Favorite"
                            >
                              <Star size={14} fill={progress.isFavorite ? 'currentColor' : 'transparent'} />
                            </button>

                            {/* Revision Required */}
                            <button
                              onClick={() => handleUpdateStatus(q._id, 'revisionRequired', !progress.revisionRequired)}
                              className={`p-1.5 rounded-lg border transition ${
                                progress.revisionRequired
                                  ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                  : 'border-gray-200 dark:border-dark-border text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'
                              }`}
                              title="Revision Required"
                            >
                              <RotateCcw size={14} />
                            </button>

                            {/* Personal Notes */}
                            <button
                              onClick={() => handleOpenNote(q)}
                              className="p-1.5 rounded-lg border border-gray-200 dark:border-dark-border text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition"
                              title="Personal Notes"
                            >
                              <FileText size={14} />
                            </button>

                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span>{q.title}</span>
                              {q.frequentlyAsked === 'Yes' && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-500 rounded border border-indigo-500/20">
                                  🔥 Hot
                                </span>
                              )}
                              {q.premiumBadge === 'Premium' && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                                  💎 Premium
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg ${diffColors[q.difficulty]}`}>
                            {q.difficulty}
                          </span>
                        </td>

                        {/* Topic */}
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-dark-card border border-gray-250 dark:border-dark-border text-slate-600 dark:text-gray-300 rounded-lg">
                            {q.topic}
                          </span>
                        </td>

                        {/* Companies */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {q.companies.map((c, i) => (
                              <span key={i} className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* External Link */}
                        <td className="px-6 py-4 text-right">
                          <a
                            href={q.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs shadow-md shadow-primary-500/10 transition"
                          >
                            <span>Open {q.platform}</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-250 dark:border-dark-border pt-4 text-sm font-medium">
              <span className="text-slate-500 dark:text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 dark:border-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-200 dark:border-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-dark-card/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* NOTES MODAL DIALOG */}
      {activeNoteQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveNoteQuestion(null)}></div>
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative z-10">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FileText size={20} className="text-primary-500" /> Study Notes
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Personal notes for: <span className="font-bold">{activeNoteQuestion.title}</span>
              </p>
            </div>
            
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Paste optimal approach, dynamic programming transitions, or time/space complexity notes here..."
              rows={8}
              className="w-full p-4 border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none font-mono"
            ></textarea>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveNoteQuestion(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Close
              </button>
              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {savingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CodingQuestions;
