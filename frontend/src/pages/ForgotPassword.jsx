import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { GraduationCap, Mail, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/forgotpassword', { email });
      if (res.data.success) {
        toast.success('Token generated successfully!');
        setResetToken(res.data.resetToken);
        setResetLink(`/reset-password/${res.data.resetToken}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request reset token');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 transition-colors duration-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 glass-effect p-8 rounded-3xl border border-gray-200 dark:border-dark-border shadow-2xl relative z-10">
        
        {/* LOGO */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap size={22} />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              PrepPortal
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight mt-4">Forgot Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email to receive a password reset token.
          </p>
        </div>

        {!resetToken ? (
          /* REQUEST TOKEN FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Requesting...' : 'Request Reset Token'}
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          /* LOCAL SIMULATION CARD */
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl space-y-4 text-center">
            <div className="flex justify-center text-amber-500">
              <ShieldAlert size={36} />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-amber-600 dark:text-amber-400">Offline Mail Simulation Mode</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Since this application is deployed on a free plan, we generated your token in the response:
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl font-mono text-xs select-all text-gray-800 dark:text-gray-200 break-all">
              {resetToken}
            </div>
            <Link
              to={resetLink}
              className="w-full inline-flex py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold items-center justify-center gap-2 shadow-md transition"
            >
              Go to Reset Page <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* BACK TO LOGIN */}
        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
