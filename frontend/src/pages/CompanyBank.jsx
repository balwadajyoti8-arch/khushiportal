import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Building2, ChevronRight, HelpCircle } from 'lucide-react';
import { CardSkeleton } from '../components/Skeleton';

const CompanyBank = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      if (res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight font-sans">Company Question Bank</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Browse targeted coding questions, MCQ quizzes, and interview experiences for specific tech companies.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
        </div>
      </div>

      {/* COMPANIES GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-3xl p-12 text-center space-y-4">
          <div className="flex justify-center text-gray-400">
            <Building2 size={48} />
          </div>
          <p className="font-bold text-lg text-slate-650">No Companies Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link
              key={company._id}
              to={`/companies/${company.name}`}
              className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:border-primary-500/30 transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-50 to-indigo-50 dark:from-primary-950/20 dark:to-indigo-950/20 flex items-center justify-center font-bold text-lg text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/10">
                    {company.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight group-hover:text-primary-500 transition">
                      {company.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {company.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] font-bold bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-550 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {company.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-dark-border pt-4 mt-6 text-xs font-bold text-slate-400 dark:text-gray-400 group-hover:text-primary-500 transition">
                <span>View preparation portal</span>
                <ChevronRight size={16} className="transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default CompanyBank;
