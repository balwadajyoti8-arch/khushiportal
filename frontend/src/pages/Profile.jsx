import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Award, BookOpen, Target, Sparkles, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  // Form states
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [achievementInput, setAchievementInput] = useState('');
  const [achievements, setAchievements] = useState([]);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCollege(user.college || '');
      setBranch(user.branch || '');
      setYear(user.year || '');
      setTargetCompany(user.targetCompany || '');
      setSkills(user.skills || []);
      setAchievements(user.achievements || []);
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (skills.includes(skillInput.trim())) {
      toast.error('Skill already added');
      return;
    }
    setSkills([...skills, skillInput.trim()]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!achievementInput.trim()) return;
    if (achievements.includes(achievementInput.trim())) {
      toast.error('Achievement already added');
      return;
    }
    setAchievements([...achievements, achievementInput.trim()]);
    setAchievementInput('');
  };

  const handleRemoveAchievement = (achToRemove) => {
    setAchievements(achievements.filter(a => a !== achToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const result = await updateProfile({
      name,
      college,
      branch,
      year,
      targetCompany,
      skills,
      achievements
    });

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Student Profile</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          Update your placement preferences, target companies, and personal details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PROFILE OVERVIEW CARD */}
        <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-3xl space-y-6 h-fit transition duration-200">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-lg shadow-primary-500/10">
              {name ? name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-tight">{name}</h2>
              <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
            </div>
            <span className="inline-flex px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-extrabold text-[10px] rounded-lg uppercase tracking-wider">
              {user?.role} ACCOUNT
            </span>
          </div>

          <hr className="border-gray-100 dark:border-dark-border" />

          {/* Quick info display */}
          <div className="space-y-4 text-xs font-semibold">
            {targetCompany && (
              <div className="flex items-center gap-3">
                <Target size={18} className="text-primary-500" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Target Recruiter</span>
                  <span className="text-slate-800 dark:text-gray-200">{targetCompany}</span>
                </div>
              </div>
            )}
            {college && (
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-indigo-500" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Institution</span>
                  <span className="text-slate-800 dark:text-gray-200">{college}</span>
                </div>
              </div>
            )}
            {branch && (
              <div className="flex items-center gap-3">
                <Award size={18} className="text-emerald-500" />
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Academic Stream</span>
                  <span className="text-slate-800 dark:text-gray-200">{branch} ({year || 'N/A'})</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* EDIT PROFILE DETAILS */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 sm:p-8 rounded-3xl space-y-6 transition duration-200">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Sparkles size={18} className="text-primary-500" /> Personal details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                  Target Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                  Branch / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                  Graduation Year / Term
                </label>
                <input
                  type="text"
                  placeholder="e.g. Final Year / 2027"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>

            </div>

            <hr className="border-gray-100 dark:border-dark-border" />

            {/* SKILLS TAGS INPUT */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                Technical Skills & Frameworks
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. React"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow transition flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-dark-bg text-xs font-bold border border-gray-200 dark:border-dark-border rounded-xl"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 dark:border-dark-border" />

            {/* ACHIEVEMENTS TAGS INPUT */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                Achievements & Badges
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Codeforces Specialist"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-250 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow transition flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {achievements.map((ach, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-dark-bg text-xs font-bold border border-gray-200 dark:border-dark-border rounded-xl"
                  >
                    <span>{ach}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(ach)}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-gray-100 dark:border-dark-border pt-6 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition disabled:opacity-50"
              >
                {saving ? 'Saving changes...' : 'Save Profile'}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
