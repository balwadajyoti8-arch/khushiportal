import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  Calendar,
  Building2,
  Bookmark,
  FileText,
  User,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Coding Bank', path: '/questions', icon: Code2 },
    { name: 'MCQ Practice', path: '/mcqs', icon: BookOpen },
    { name: 'Mock Interviews', path: '/mock-interviews', icon: Calendar },
    { name: 'Company Bank', path: '/companies', icon: Building2 },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'My Notes', path: '/notes', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    menuItems.push({ name: 'Admin Control', path: '/admin', icon: ShieldCheck });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text flex flex-col font-sans transition-colors duration-200">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-dark-border glass-effect transition-colors duration-200">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
                <GraduationCap size={24} />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                PrepPortal
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card transition-all duration-200"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>

            {/* Profile Dropdown Indicator */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-dark-border">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        
        {/* SIDEBAR - DESKTOP */}
        <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card/40 transition-colors duration-200">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/15'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card/80 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 mt-8"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        {/* SIDEBAR - MOBILE OVERLAY */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="relative w-64 max-w-xs bg-white dark:bg-dark-card flex flex-col p-4 shadow-xl z-50">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-lg">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-1 flex-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card/85'
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 mt-8"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </aside>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
