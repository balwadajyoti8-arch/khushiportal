import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  HelpCircle,
  Code2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/Skeleton';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Question'); // Tab selections: 'Question', 'MCQ'

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/bookmarks');
      if (res.data.success) {
        setBookmarks(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (itemType, itemId) => {
    try {
      const res = await api.post('/bookmarks/toggle', {
        itemType,
        itemId
      });

      if (res.data.success) {
        toast.success('Bookmark removed');
        // Filter out locally
        setBookmarks((prev) =>
          prev.filter((b) => {
            if (itemType === 'Question' && b.questionId?._id === itemId) return false;
            if (itemType === 'MCQ' && b.mcqId?._id === itemId) return false;
            return true;
          })
        );
      }
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  // Filter bookmarks by tab
  const filtered = bookmarks.filter((b) => b.itemType === activeTab);

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Bookmarked Materials</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          Access your saved coding references and MCQ questions in one place.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-gray-250 dark:border-dark-border pb-1">
        <button
          onClick={() => setActiveTab('Question')}
          className={`pb-3 font-semibold text-sm transition-all duration-200 border-b-2 px-1 flex items-center gap-1.5 ${
            activeTab === 'Question'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Code2 size={16} /> Coding References ({bookmarks.filter(b => b.itemType === 'Question').length})
        </button>
        <button
          onClick={() => setActiveTab('MCQ')}
          className={`pb-3 font-semibold text-sm transition-all duration-200 border-b-2 px-1 flex items-center gap-1.5 ${
            activeTab === 'MCQ'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <BookOpen size={16} /> MCQ Questions ({bookmarks.filter(b => b.itemType === 'MCQ').length})
        </button>
      </div>

      {/* CONTENT LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton /><CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="flex justify-center text-gray-350">
            <Bookmark size={48} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">No Bookmarks Found</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Go to the Coding Bank or MCQ section to bookmark resources.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TAB 1: CODING REFERENCES */}
          {activeTab === 'Question' && filtered.map((b) => {
            const q = b.questionId;
            if (!q) return null;
            return (
              <div 
                key={b._id} 
                className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between hover:shadow-lg transition duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600' :
                      q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-rose-500/10 text-rose-600'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border dark:border-dark-border text-slate-600 dark:text-gray-400 rounded-lg text-[10px] font-bold">
                      {q.topic}
                    </span>
                  </div>
                  <h3 className="font-bold text-base leading-snug">{q.title}</h3>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-dark-border pt-4 mt-6">
                  <button
                    onClick={() => handleRemoveBookmark('Question', q._id)}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:underline font-bold"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                  <a
                    href={q.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-500/10 transition"
                  >
                    <span>Solve on {q.platform}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}

          {/* TAB 2: MCQ PRACTICE */}
          {activeTab === 'MCQ' && filtered.map((b) => {
            const m = b.mcqId;
            if (!m) return null;
            return (
              <div 
                key={b._id} 
                className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:shadow-lg transition duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border dark:border-dark-border text-slate-600 dark:text-gray-400 rounded-lg text-[10px] font-bold">
                      {m.topic}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      m.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600' :
                      m.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-rose-500/10 text-rose-600'
                    }`}>
                      {m.difficulty}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-100 leading-relaxed">{m.question}</p>
                </div>

                <div className="border-t border-gray-100 dark:border-dark-border pt-4 mt-2">
                  <button
                    onClick={() => handleRemoveBookmark('MCQ', m._id)}
                    className="flex items-center gap-1 text-xs text-rose-500 hover:underline font-bold"
                  >
                    <Trash2 size={14} /> Remove Bookmark
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Bookmarks;
