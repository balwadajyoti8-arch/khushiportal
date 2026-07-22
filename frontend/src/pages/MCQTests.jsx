import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const MCQTests = () => {
  // Test Configuration states
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [limit, setLimit] = useState(10);
  const [enableNegativeMarking, setEnableNegativeMarking] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  
  // MCQ List and index
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [mcqId]: optionIndex }
  const [loading, setLoading] = useState(false);
  
  // Test Session states
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [testActive, setTestActive] = useState(false);
  const timerRef = useRef(null);

  // Test Results
  const [results, setResults] = useState(null);

  // Lists
  const topics = [
    'Trees', 'Stack', 'DBMS', 'OOP', 'OS', 'CN', 'Aptitude', 
    'Arrays', 'Strings', 'Linked List', 'Queue', 'Graphs', 'DP', 'Greedy', 'Binary Search'
  ];

  // Start Test Setup
  const handleStartTest = async () => {
    setLoading(true);
    try {
      const params = { limit };
      if (topic) params.topic = topic;
      if (difficulty) params.difficulty = difficulty;

      const res = await api.get('/mcqs', { params });
      if (res.data.success && res.data.data.length > 0) {
        setMcqs(res.data.data);
        setIsConfigured(true);
        setTestActive(true);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setTimeLeft(limit * 60); // 1 minute per question
        setResults(null);
      } else {
        toast.error('No MCQs found matching these criteria');
      }
    } catch (err) {
      toast.error('Failed to start test');
    } finally {
      setLoading(false);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (testActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testActive) {
      handleSubmitTest();
    }

    return () => clearInterval(timerRef.current);
  }, [testActive, timeLeft]);

  // Format Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Select Option
  const handleSelectOption = (optionIndex) => {
    const activeMcqId = mcqs[currentIndex]._id;
    setSelectedAnswers((prev) => ({
      ...prev,
      [activeMcqId]: optionIndex
    }));
  };

  // Submit Test
  const handleSubmitTest = async () => {
    clearInterval(timerRef.current);
    setTestActive(false);
    setLoading(true);
    
    // Structure answer payload
    const formattedAnswers = mcqs.map((m) => ({
      mcqId: m._id,
      selectedOption: selectedAnswers[m._id] !== undefined ? selectedAnswers[m._id] : -1
    }));

    try {
      const res = await api.post('/mcqs/submit', {
        answers: formattedAnswers,
        enableNegativeMarking
      });

      if (res.data.success) {
        setResults(res.data);
        toast.success('Test submitted successfully!');
      }
    } catch (err) {
      toast.error('Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsConfigured(false);
    setResults(null);
    setMcqs([]);
    setTopic('');
    setDifficulty('');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">MCQ Practice Module</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          Test your Computer Science fundamentals and aptitude knowledge under time constraints.
        </p>
      </div>

      {/* SETUP CONFIGURATION CARD */}
      {!isConfigured && !results && (
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto transition duration-200">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-primary-500" /> Test Settings
          </h2>
          
          <div className="space-y-4">
            {/* Topic Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                Select Topic Focus
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                <option value="">All Topics (Mixed Test)</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                Select Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Questions count selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                Number of Questions
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                <option value={5}>5 Questions (Short Quiz)</option>
                <option value={10}>10 Questions (Standard Quiz)</option>
                <option value={20}>20 Questions (Complete Test)</option>
              </select>
            </div>

            {/* Negative Marking toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-2xl">
              <div>
                <span className="font-bold text-sm block">Negative Marking (-1 per wrong)</span>
                <span className="text-xs text-slate-500 dark:text-gray-450 block mt-0.5">Incorrect answers deduct 1 point; unattempted deducts 0. Correct adds 4 points.</span>
              </div>
              <input
                type="checkbox"
                checked={enableNegativeMarking}
                onChange={(e) => setEnableNegativeMarking(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

          </div>

          <button
            onClick={handleStartTest}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Fetching Questions...' : 'Start MCQ Test'}
          </button>
        </div>
      )}

      {/* ACTIVE TEST WINDOW */}
      {isConfigured && testActive && !results && mcqs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Question Index Sidebar / Status Info */}
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl space-y-6 transition duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm uppercase text-slate-400 tracking-wider">Time Remaining</span>
              <span className={`flex items-center gap-1.5 font-mono font-bold text-base px-2.5 py-1 rounded-lg ${
                timeLeft < 60 ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-gray-100 dark:bg-dark-card text-gray-800 dark:text-gray-200 border border-gray-250 dark:border-dark-border'
              }`}>
                <Clock size={16} /> {formatTime(timeLeft)}
              </span>
            </div>

            <hr className="border-gray-100 dark:border-dark-border" />

            <div className="space-y-3">
              <span className="font-bold text-xs uppercase text-slate-400 tracking-wider block">Question Navigator</span>
              <div className="grid grid-cols-5 gap-2">
                {mcqs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm border flex items-center justify-center transition ${
                      currentIndex === i
                        ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                        : selectedAnswers[mcqs[i]._id] !== undefined
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-500'
                        : 'border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-card'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 dark:border-dark-border" />

            <button
              onClick={handleSubmitTest}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-md shadow-rose-500/10 transition"
            >
              Submit Test
            </button>
          </div>

          {/* Active Question Panel */}
          <div className="lg:col-span-3 bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[400px] transition duration-200">
            <div className="space-y-6">
              
              {/* Question Meta Tags */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg">
                  {mcqs[currentIndex].topic}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                  mcqs[currentIndex].difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                  mcqs[currentIndex].difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-600 border-rose-500/20'
                }`}>
                  {mcqs[currentIndex].difficulty}
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400">QUESTION {currentIndex + 1} OF {mcqs.length}</span>
                <p className="font-extrabold text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-100">
                  {mcqs[currentIndex].question}
                </p>
              </div>

              {/* Option choices */}
              <div className="space-y-3 pt-2">
                {mcqs[currentIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswers[mcqs[currentIndex]._id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition flex items-center gap-3 ${
                        isSelected
                          ? 'bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-400 font-bold shadow-sm'
                          : 'border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Next / Previous controllers */}
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-dark-border pt-6 mt-8">
              <button
                onClick={() => setCurrentIndex(p => Math.max(p - 1, 0))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              
              {currentIndex < mcqs.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(p => Math.min(p + 1, mcqs.length - 1))}
                  className="flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-primary-600 transition"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-500/10 transition"
                >
                  Submit Test
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* DETAILED RESULTS SCREEN */}
      {results && (
        <div className="space-y-6">
          
          {/* Statistics summary card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl text-center space-y-2 transition duration-200">
              <div className="flex justify-center text-amber-500">
                <Trophy size={32} />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Final Score</span>
              <span className="text-3xl font-extrabold block">{results.score} Pts</span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl text-center space-y-2 transition duration-200">
              <div className="flex justify-center text-emerald-500">
                <CheckCircle size={32} />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Correct Answers</span>
              <span className="text-3xl font-extrabold text-emerald-500 block">{results.correctCount}</span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl text-center space-y-2 transition duration-200">
              <div className="flex justify-center text-rose-500">
                <XCircle size={32} />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Incorrect Answers</span>
              <span className="text-3xl font-extrabold text-rose-500 block">{results.wrongCount}</span>
            </div>

            <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl text-center space-y-2 transition duration-200">
              <div className="flex justify-center text-gray-400">
                <HelpCircle size={32} />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">Unattempted</span>
              <span className="text-3xl font-extrabold block">{results.unattemptedCount}</span>
            </div>

          </div>

          {/* List of answers evaluation */}
          <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 sm:p-8 rounded-3xl space-y-6 transition duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg">Evaluation & Solutions</h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-card/50 rounded-xl transition"
              >
                <RotateCcw size={14} /> Start Another Test
              </button>
            </div>

            <div className="space-y-6 divide-y divide-gray-100 dark:divide-dark-border">
              {results.evaluation.map((evalItem, idx) => {
                return (
                  <div key={evalItem.mcqId} className={`pt-6 first:pt-0 space-y-4`}>
                    
                    {/* Header: Status badge */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-400">QUESTION {idx + 1}</span>
                      {evalItem.isUnattempted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-gray-100 text-gray-500 border">Unattempted</span>
                      ) : evalItem.isCorrect ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Correct (+4)</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          Incorrect {enableNegativeMarking ? '(-1)' : '(0)'}
                        </span>
                      )}
                    </div>

                    {/* Question text */}
                    <p className="font-bold text-base text-gray-800 dark:text-gray-100">{evalItem.question}</p>

                    {/* Options list showing right and wrong choices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evalItem.options.map((option, oIdx) => {
                        const isCorrectOpt = oIdx === evalItem.correctOption;
                        const isUserSelected = oIdx === evalItem.selectedOption;

                        let cardStyle = 'border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300';
                        if (isCorrectOpt) {
                          cardStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                        } else if (isUserSelected && !isCorrectOpt) {
                          cardStyle = 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-bold';
                        }

                        return (
                          <div key={oIdx} className={`p-3.5 rounded-xl border text-sm flex items-center gap-2.5 ${cardStyle}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                              isCorrectOpt ? 'bg-emerald-500 border-emerald-500 text-white' :
                              isUserSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-300'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </div>
                            <span>{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {evalItem.explanation && (
                      <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex gap-2.5 text-xs text-slate-600 dark:text-gray-400">
                        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-700 dark:text-gray-300 mb-0.5">Explanation:</p>
                          <p className="leading-relaxed">{evalItem.explanation}</p>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default MCQTests;
