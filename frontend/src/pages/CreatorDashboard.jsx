import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  User, Briefcase, Search, Save, 
  CheckCircle, Clock, LayoutDashboard, 
  TrendingUp, Compass, Plus,
} from 'lucide-react';
import { Instagram, Youtube } from '../components/SocialIcons';
import DashboardLayout from '../components/DashboardLayout';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    niche: 'Tech',
    socialLinks: [],
    followerCount: 0,
    responseTime: '< 24h'
  });
  const [applications, setApplications] = useState([]);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appsRes, campaignsRes] = await Promise.all([
          axios.get('/creators/me'),
          axios.get('/applications/creator'),
          axios.get('/campaigns')
        ]);
        if (profileRes.data) {
          // Normalize social links for the form
          const profileData = profileRes.data;
          setProfile(profileData);
        }
        setApplications(appsRes.data);
        setAvailableCampaigns(campaignsRes.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/creators/profile', profile);
      setProfile(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const updateSocialLink = (platform, handle) => {
    const newLinks = [...profile.socialLinks];
    const index = newLinks.findIndex(l => l.platform === platform);
    if (index > -1) {
      newLinks[index].handle = handle;
    } else {
      newLinks.push({ platform, handle, url: '' });
    }
    setProfile({ ...profile, socialLinks: newLinks });
  };

  const getSocialHandle = (platform) => {
    const link = profile.socialLinks.find(l => l.platform === platform);
    return link ? link.handle : '';
  };

  const confirmApplication = async (appId) => {
    try {
      await axios.put(`/applications/${appId}/status`, { status: 'confirmed_by_creator' });
      await axios.post('/deals', { applicationId: appId });
      const res = await axios.get('/applications/creator');
      setApplications(res.data);
      setMessage({ type: 'success', text: 'Application confirmed! Deal started.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error confirming application.' });
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'My Profile', icon: <LayoutDashboard size={20} /> },
    { id: 'applied', label: 'Applied Campaigns', icon: <Briefcase size={20} /> },
    { id: 'browse', label: 'Browse New Campaigns', icon: <Compass size={20} /> },
    { id: 'edit', label: 'Edit Profile', icon: <Save size={20} /> },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          {activeTab === 'overview' && "Hello,"} {profile.name || user.email.split('@')[0]}
        </h1>
        <p className="text-slate-500 font-medium">Dashboard / {sidebarItems.find(i => i.id === activeTab)?.label}</p>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg animate-reveal-up ${message.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-red-500 text-white'
          }`}>
          <CheckCircle size={20} /> {message.text}
        </div>
      )}

      {/* VIEWS */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="metric-card">
              <div className="metric-icon bg-indigo-50 text-indigo-600">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="stat-label">Applications</p>
                <p className="stat-value">{applications.length}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon bg-primary-50 text-primary-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="stat-label">Followers</p>
                <p className="stat-value">
                  {profile.followerCount >= 1000
                    ? (profile.followerCount / 1000).toFixed(1) + 'K'
                    : profile.followerCount}
                </p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon bg-green-50 text-green-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="stat-label">Response Time</p>
                <p className="stat-value">{profile.responseTime || '< 24h'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="card">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="text-indigo-600" size={24} /> Public Bio
              </h3>
              <p className="text-slate-600 leading-relaxed italic">
                "{profile.bio || 'Add a bio to attract brands!'}"
              </p>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Niche</p>
                <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-bold text-sm">
                  {profile.niche}
                </span>
              </div>
            </div>

            <div className="card bg-indigo-600 text-white border-none relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold mb-4">Profile Strength</h3>
              <div className="w-full bg-indigo-900/30 h-3 rounded-full mb-6">
                <div className="bg-violet-800 h-full rounded-full" style={{ width: profile.bio ? '75%' : '25%' }}></div>
              </div>
              <p className="text-black text-sm mb-6 font-medium">Your profile is looking great! Complete your bio to reach 100%.</p>
              <button
                onClick={() => setActiveTab('edit')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applied' && (
        <div className="flex flex-col gap-4">
          {applications.length > 0 ? applications.map(app => (
            <div key={app._id} className="card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-y-0 border-slate-100 shadow-none hover:shadow-md">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                  {app.campaignId?.title?.[0] || 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900">{app.campaignId?.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`status-badge ${app.status === 'accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                        app.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                          'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {app.status === 'accepted' && (
                  <button
                    onClick={() => confirmApplication(app._id)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                  >
                    Confirm <CheckCircle size={18} />
                  </button>
                )}
                <Link to={`/campaigns/${app.campaignId?._id}`} className="btn-secondary py-3 text-sm">
                  View Campaign
                </Link>
              </div>
            </div>
          )) : (
            <div className="card border-dashed border-2 border-slate-200 shadow-none text-center py-20 flex flex-col items-center gap-4 bg-transparent">
              <Clock size={48} className="text-slate-200" />
              <p className="text-slate-400 font-bold">No applications yet.</p>
              <button onClick={() => setActiveTab('browse')} className="text-indigo-600 font-black hover:underline uppercase text-xs tracking-widest">
                Explore Campaigns
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'browse' && (
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-4 grow">
              <Search className="text-slate-400" size={20} />
              <input type="text" placeholder="Search for opportunities..." className="w-full font-medium outline-none" />
            </div>
            <Link to="/campaigns" className="text-indigo-600 font-bold text-sm">Full Marketplace</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCampaigns.map(campaign => (
              <div key={campaign._id} className="card group hover:bg-indigo-50/20">
                <h4 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{campaign.title}</h4>
                <p className="text-slate-500 text-xs mb-4 line-clamp-2">{campaign.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="font-extrabold text-indigo-600">₹{campaign.budget?.toLocaleString()}</span>
                  <Link to={`/campaigns/${campaign._id}`} className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-indigo-600 transition-colors">
                    Details <Plus size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="max-w-3xl">
          <div className="card p-10">
            <h3 className="text-2xl font-black mb-8 tracking-tighter">Creative Portfolio Settings</h3>
            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Display Name</label>
                <input
                  type="text" value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="e.g. Content King"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Primary Niche</label>
                <select
                  value={profile.niche}
                  onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none cursor-pointer"
                >
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food">Food</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Followers</label>
                <input
                  type="number" value={profile.followerCount}
                  onChange={(e) => setProfile({ ...profile, followerCount: parseInt(e.target.value) || 0 })}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Response Time</label>
                <input
                  type="text" value={profile.responseTime}
                  onChange={(e) => setProfile({ ...profile, responseTime: e.target.value })}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  placeholder="e.g. < 2h"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Creator Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none h-32 font-medium"
                  placeholder="Tell brands why they should work with you..."
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-6 pt-6 border-t border-slate-100">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Social Media Presence</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 group focus-within:border-indigo-500 transition-colors">
                    <Instagram size={20} className="text-pink-600" />
                    <input
                      type="text"
                      placeholder="Instagram Handle"
                      value={getSocialHandle('Instagram')}
                      onChange={(e) => updateSocialLink('Instagram', e.target.value)}
                      className="bg-transparent outline-none font-bold text-sm w-full"
                    />
                  </div>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 group focus-within:border-indigo-500 transition-colors">
                    <Youtube size={20} className="text-red-600" />
                    <input
                      type="text"
                      placeholder="Youtube Channel"
                      value={getSocialHandle('Youtube')}
                      onChange={(e) => updateSocialLink('Youtube', e.target.value)}
                      className="bg-transparent outline-none font-bold text-sm w-full"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary py-4 md:col-span-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all font-black text-lg">
                <Save size={20} /> Save Portfolio Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreatorDashboard;
;
