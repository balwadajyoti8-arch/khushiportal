import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  BookOpen, 
  Calendar, 
  LineChart, 
  ArrowRight, 
  CheckCircle, 
  Building2, 
  GraduationCap, 
  Users, 
  Trophy 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const companiesList = [
    { name: 'Google', logo: 'Google' },
    { name: 'Amazon', logo: 'Amazon' },
    { name: 'Microsoft', logo: 'Microsoft' },
    { name: 'Adobe', logo: 'Adobe' },
    { name: 'Oracle', logo: 'Oracle' },
    { name: 'Apple', logo: 'Apple' },
    { name: 'Meta', logo: 'Meta' },
    { name: 'Netflix', logo: 'Netflix' },
    { name: 'Atlassian', logo: 'Atlassian' }
  ];

  return (
    <div className="bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 min-h-screen font-sans overflow-x-hidden transition-colors duration-200">
      
      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 glass-effect border-b border-slate-200 dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap size={20} />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              PrepPortal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-md shadow-primary-500/20 transition-all text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-medium shadow-md shadow-primary-500/20 transition-all text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none"></div>

        <motion.div 
          className="text-center space-y-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400 border border-primary-200 dark:border-primary-900/30 shadow-sm">
            🚀 Complete Placement Preparation Suite
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Master the Coding & Theory of{' '}
            <span className="bg-gradient-to-r from-primary-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Tech Interviews
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Build coding confidence, practice mock MCQs, schedule mock interviews, and track your metrics - all in one unified, modern platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transform hover:-translate-y-0.5 transition-all"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card/50 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center"
            >
              Explore Features
            </a>
          </div>
        </motion.div>
      </section>

      {/* STATISTICS */}
      <section className="py-12 border-y border-slate-200 dark:border-dark-border bg-slate-100/50 dark:bg-dark-card/20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '200+', label: 'Coding References', icon: Code2 },
            { value: '500+', label: 'MCQs & Theory Tests', icon: BookOpen },
            { value: '15+', label: 'Tech Giants Covered', icon: Building2 },
            { value: '100% Free', label: 'No Credit Card Needed', icon: Trophy }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center space-y-1">
                <div className="flex justify-center text-primary-500 mb-2">
                  <Icon size={24} />
                </div>
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold">Unmatched Placement Toolkit</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Everything you need to level up your technical knowledge and behavioral skills.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {[
            {
              title: 'Coding References',
              desc: 'Hand-picked coding questions curated from LeetCode, GeeksforGeeks, and others with active status tracking.',
              icon: Code2,
              color: 'from-violet-500 to-purple-500'
            },
            {
              title: 'MCQ Test Module',
              desc: 'Practice core Computer Science topics (DBMS, OS, Networks, OOPs) under timed constraints with custom settings.',
              icon: BookOpen,
              color: 'from-blue-500 to-indigo-500'
            },
            {
              title: 'Mock Scheduler',
              desc: 'Schedule and manage Technical, System Design, or HR mock interviews with a robust dashboard and status reviews.',
              icon: Calendar,
              color: 'from-emerald-500 to-teal-500'
            },
            {
              title: 'Granular Analytics',
              desc: 'Track daily streaks, completion percentages across companies and topics, and evaluate test metrics on visual charts.',
              icon: LineChart,
              color: 'from-amber-500 to-orange-500'
            }
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                className="bg-white dark:bg-dark-card border border-slate-150 dark:border-dark-border p-6 rounded-2xl flex flex-col space-y-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-lg">{feat.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">{feat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* TOP COMPANIES */}
      <section className="py-16 bg-slate-100/30 dark:bg-dark-card/10 border-y border-slate-200 dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-8">
            Target Top Recruiters
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-60 dark:opacity-40">
            {companiesList.map((company, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold tracking-tight text-slate-600 dark:text-slate-300 hover:opacity-100 transition duration-200">
                {company.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold">What Successful Students Say</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Read how other college students used this portal to land placements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Aradhya Verma',
              role: 'Software Engineer @ Amazon',
              quote: 'The Mock Interview calendar and the MCQ module helped me practice Core CS theories which are generally overlooked. The clean design made me want to solve questions daily.',
              img: 'A'
            },
            {
              name: 'Gaurav Sen',
              role: 'Associate Analyst @ Deloitte',
              quote: 'Using the External Question Reference system, I could easily organize my LeetCode questions by targeted companies like Google and Microsoft. The personal notes are super handy.',
              img: 'G'
            },
            {
              name: 'Kritika Roy',
              role: 'System SDE @ Adobe',
              quote: 'The visual dashboard streak tracker kept me accountable. Highly recommend this to pre-final and final year college students who want a structured road to prep.',
              img: 'K'
            }
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-dark-card border border-slate-150 dark:border-dark-border p-6 rounded-2xl space-y-6 flex flex-col justify-between hover:shadow-lg transition">
              <p className="italic text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                  {t.img}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-indigo-600 p-8 md:p-14 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="relative max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Ace Your Placements?</h2>
            <p className="text-primary-100 text-sm sm:text-base">
              Create your account today and gain instant access to structured questions, mock exams, company resources, and advanced analytic charts.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="px-8 py-3.5 rounded-xl bg-white text-primary-600 font-semibold hover:bg-slate-50 transition shadow-lg flex items-center gap-2"
              >
                Get Started Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-dark-border py-12 bg-white dark:bg-dark-card/20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </div>
            <span className="font-bold">PrepPortal</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} PrepPortal. Built for placements and internships. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-primary-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary-500 transition">Terms of Service</a>
            <a href="#" className="hover:text-primary-500 transition">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
