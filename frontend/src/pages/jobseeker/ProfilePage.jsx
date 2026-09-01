import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, CheckCircle2, ArrowLeft, Save, Briefcase, Award } from 'lucide-react';
import { profileApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/ui/Skeleton';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({
    headline: '',
    summary: '',
    skills: [],
    resumeUrl: '',
    preferredLocations: [],
    preferredRoles: [],
    preferredJobType: 'any',
    noticePeriod: 'immediate'
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await profileApi.getCandidateProfile();
        if (res?.data?.profile) {
          setProfile(res.data.profile);
          setSkillsInput((res.data.profile.skills || []).join(', '));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      await Promise.all([
        profileApi.updateProfile({ name: name.trim(), phone: phone.trim() }),
        profileApi.updateCandidateProfile({
          headline: profile.headline,
          summary: profile.summary,
          skills: skillsArray,
          resumeUrl: profile.resumeUrl,
          preferredJobType: profile.preferredJobType,
          noticePeriod: profile.noticePeriod
        })
      ]);

      updateUser({ name: name.trim(), phone: phone.trim() });
      setSuccessMessage('Profile saved successfully.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-96 rounded-3xl bg-[#111827] border border-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        to="/candidate/dashboard"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>

      <div className="p-6 sm:p-10 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Candidate Profile</h1>
              <p className="text-xs text-slate-400">Manage your skills, headline, and credentials for verified recruiters.</p>
            </div>
          </div>
          {profile?.profileCompleteness !== undefined && (
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
              {profile.profileCompleteness}% COMPLETE
            </div>
          )}
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Professional Headline</label>
            <input
              type="text"
              value={profile.headline || ''}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              placeholder="e.g. Senior Full Stack Engineer (React, Node.js, Cloud Architecture)"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Technical Skills (Comma separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Express, MongoDB, Docker, AWS"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Summary / Bio</label>
            <textarea
              rows={4}
              value={profile.summary || ''}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              placeholder="Passionate engineer with 4+ years building high-concurrency cloud applications..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Preferred Job Arrangement</label>
              <select
                value={profile.preferredJobType || 'any'}
                onChange={(e) => setProfile({ ...profile, preferredJobType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="any">Open to Any</option>
                <option value="fulltime">Full-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Notice Period</label>
              <select
                value={profile.noticePeriod || 'immediate'}
                onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="immediate">Immediate Joiner</option>
                <option value="15days">15 Days</option>
                <option value="1month">1 Month</option>
                <option value="2months">2 Months</option>
                <option value="3months">3 Months</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded-xl transition flex items-center space-x-2 shadow-glow-sm"
            >
              {saving ? <Spinner className="w-4 h-4 text-slate-900" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
