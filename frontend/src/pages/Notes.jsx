import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  FileText, 
  Trash2, 
  Edit3, 
  ExternalLink,
  HelpCircle,
  Code
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/Skeleton';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Note Modal state
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      if (res.data.success) {
        setNotes(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study note?')) return;
    try {
      const res = await api.delete(`/notes/${id}`);
      if (res.data.success) {
        toast.success('Note deleted');
        setNotes((prev) => prev.filter((note) => note._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editContent || !editingNote) return;

    setSaving(true);
    try {
      // Endpoint handles create or update
      const res = await api.post(`/notes/question/${editingNote.questionId._id}`, {
        content: editContent
      });

      if (res.data.success) {
        toast.success('Note updated');
        setEditingNote(null);
        fetchNotes(); // reload
      }
    } catch (err) {
      toast.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Personal Study Notes</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          Access and manage notes you created for coding references during practice sessions.
        </p>
      </div>

      {/* NOTES LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton /><CardSkeleton />
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="flex justify-center text-gray-350">
            <FileText size={48} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">No Notes Found</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Open any coding reference card and click the notes icon to create personal study notes.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => {
            const q = note.questionId;
            if (!q) return null;

            return (
              <div 
                key={note._id} 
                className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between hover:shadow-lg transition duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-gray-105 border dark:border-dark-border text-slate-500 dark:text-gray-400 rounded-lg text-[10px] font-extrabold uppercase">
                      {q.topic}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600' :
                      q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-rose-500/10 text-rose-600'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm tracking-tight border-b border-gray-100 dark:border-dark-border pb-2">
                    {q.title}
                  </h3>

                  {/* Note Content preview */}
                  <p className="text-xs font-mono bg-slate-50 dark:bg-dark-bg p-3.5 rounded-2xl text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {note.content}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-dark-border pt-4 mt-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="flex items-center gap-1 text-xs text-primary-500 hover:underline font-bold"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="flex items-center gap-1 text-xs text-rose-500 hover:underline font-bold"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                  <Link
                    to="/questions"
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition"
                  >
                    View bank <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT NOTE MODAL DIALOG */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingNote(null)}></div>
          <form 
            onSubmit={handleUpdateSubmit}
            className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative z-10"
          >
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Edit3 size={20} className="text-primary-500" /> Edit Study Note
            </h3>
            
            <textarea
              required
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={8}
              className="w-full p-4 border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none font-mono"
            ></textarea>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Note'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Notes;
