import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  User, Briefcase, Search, Save, 
  CheckCircle, Clock, LayoutDashboard, 
  TrendingUp, Compass, Plus, CircleDollarSign,
  Users, Folder, MessageSquare, ArrowUpRight, Edit3, Target, Building2
} from 'lucide-react';
import { Instagram, Youtube } from '../components/SocialIcons';
import DashboardLayout from '../components/DashboardLayout';
import DealManager from '../components/DealManager';
import CampaignCard from '../components/CampaignCard';

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
  const [deals, setDeals] = useState([]);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [profileRes, appsRes, campaignsRes, dealsRes] = await Promise.all([
        axios.get('/creators/me'),
        axios.get('/applications/creator'),
        axios.get('/campaigns'),
        axios.get('/deals/user')
      ]);
      if (profileRes.data) {
        setProfile(profileRes.data);
      }
      setApplications(appsRes.data);
      setAvailableCampaigns(campaignsRes.data.slice(0, 6));
      setDeals(dealsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const confirmApplication = async (appId, currentStatus) => {
    try {
      if (currentStatus !== 'confirmed_by_creator') {
        await axios.put(`/applications/${appId}/status`, { status: 'confirmed_by_creator' });
      }
      await axios.post('/deals', { applicationId: appId });
      await fetchData();
      setMessage({ type: 'success', text: 'Application confirmed! Deal started.' });
      setActiveTab('deals');
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error confirming application.' });
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'My Profile', icon: <LayoutDashboard size={20} /> },
    { id: 'applied', label: 'Applied Campaigns', icon: <Briefcase size={20} /> },
    { id: 'deals', label: 'Active Deals', icon: <CircleDollarSign size={20} /> },
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
      {/* HEADER SECTION */}
      <div className="mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2 block">
          Welcome Back
        </span>
        <h1 className="text-5xl lg:text-7xl font-black text-on-surface tracking-tighter mb-4">
          {profile.name || user.email.split('@')[0]}
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          {profile.bio || "Content Creator & Storyteller exploring high-impact brand collaborations."}
        </p>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg animate-reveal-up ${
          message.type === 'success' ? 'bg-primary text-on-primary' : 'bg-error text-on-error'
        }`}>
          <CheckCircle size={20} /> {message.text}
        </div>
      )}

      {/* VIEWS */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-8">
          {/* METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dashboard-metric-card glow-purple">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Folder size={24} />
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Active Applications</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-on-surface">{applications.length}</span>
                  <span className="trend-up">
                    <ArrowUpRight size={14} /> {applications.filter(a => a.status === 'pending').length} pending
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-metric-card">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Users size={24} />
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Audience</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-on-surface">
                    {profile.followerCount >= 1000
                      ? (profile.followerCount / 1000).toFixed(1) + 'K'
                      : profile.followerCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-metric-card">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 flex items-center justify-center text-accent-teal">
                  <MessageSquare size={24} />
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-teal/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Avg. Response Time</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-on-surface">{profile.responseTime || '< 24h'}</span>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mt-1">Top 10% of creators</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* CURATED BIO */}
              <div className="dashboard-card relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">Curated Bio</h3>
                  <button onClick={() => setActiveTab('edit')} className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors">
                    <Edit3 size={20} />
                  </button>
                </div>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                  {profile.bio || "I build digital experiences and break down complex concepts for a community of brands and creators."}
                </p>
                <div className="flex flex-wrap gap-3">
                  {[profile.niche, "Content Creation", "Brand Strategy"].filter(Boolean).map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>

              {/* RECENT COLLABORATIONS (ACTIVE DEALS) */}
              <div className="dashboard-card">
                <h3 className="text-2xl font-black text-on-surface tracking-tight mb-8">Recent Collaborations</h3>
                <div className="flex flex-col gap-4">
                  {deals.length > 0 ? (
                    deals.slice(0, 3).map(deal => (
                      <div key={deal._id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all border border-outline-variant/10 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-secondary">
                            {deal.applicationId?.campaignId?.brandId?.logo ? (
                              <img src={deal.applicationId?.campaignId?.brandId?.logo} alt="Brand" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <Building2 size={24} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{deal.applicationId?.campaignId?.title}</h4>
                            <p className="text-xs text-on-surface-variant">Active Campaign • {new Date(deal.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-secondary uppercase tracking-widest">Active</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">In Progress</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-on-surface-variant border-2 border-dashed border-outline-variant/20 rounded-2xl">
                      No active collaborations yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* PROFILE STRENGTH */}
              <div className="dashboard-card flex flex-col items-center text-center">
                <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-10 w-full text-left">
                  Profile Strength
                </h3>
                
                <div className="relative w-40 h-40 mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      radius="70"
                      r="70"
                      className="circle-progress-bg"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      radius="70"
                      r="70"
                      className="circle-progress-bar"
                      strokeWidth="12"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * (profile.bio ? 75 : 25)) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-on-surface">{profile.bio ? 75 : 25}%</span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-on-surface mb-2">
                  {profile.bio ? "Almost Showcase Ready" : "Start Your Journey"}
                </h4>
                <p className="text-sm text-on-surface-variant mb-8 px-4">
                  {profile.bio 
                    ? "Add your media kit rates and 2 more portfolio items to reach 100% visibility."
                    : "Complete your bio and professional details to start attracting premium brands."}
                </p>

                <button 
                  onClick={() => setActiveTab('edit')}
                  className="w-full py-4 rounded-2xl bg-surface-container-highest text-on-surface font-black hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 group"
                >
                  Complete Profile <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}      {activeTab === 'applied' && (
        <div className="flex flex-col gap-6">
          {applications.length > 0 ? applications.map(app => (
            <div key={app._id} className="dashboard-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 border border-outline-variant/10">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border ${
                  app.status === 'accepted' ? 'niche-food' : 
                  app.status === 'pending' ? 'niche-fitness' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {app.campaignId?.title?.[0] || 'C'}
                </div>
                <div>
                  <h4 className="font-black text-2xl text-on-surface tracking-tight">{app.campaignId?.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      app.status === 'accepted' ? 'niche-food' :
                      app.status === 'pending' ? 'niche-fitness' :
                      'bg-surface-container text-on-surface-variant border-outline-variant/10'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-xs font-bold text-on-surface-variant/50">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {(app.status === 'accepted' || app.status === 'confirmed_by_creator') && !deals.some(d => d.applicationId?._id === app._id || d.applicationId === app._id) && (
                  <button
                    onClick={() => confirmApplication(app._id, app.status)}
                    className="bg-linear-to-r from-primary to-secondary text-black px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
                  >
                    {app.status === 'confirmed_by_creator' ? 'Retry Starting Deal' : 'Confirm & Start Deal'} <CheckCircle size={18} />
                  </button>
                )}
                <Link to={`/campaigns/${app.campaignId?._id}`} className="px-6 py-3.5 rounded-2xl bg-surface-container-highest text-on-surface font-black text-sm border border-outline-variant/10 hover:bg-white hover:text-black transition-all">
                  View Campaign
                </Link>
              </div>
            </div>
          )) : (
            <div className="dashboard-card border-dashed border-2 border-outline-variant/20 bg-transparent text-center py-24 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/20">
                <Clock size={40} />
              </div>
              <div>
                <p className="text-on-surface-variant font-black text-xl mb-2">No applications yet.</p>
                <button onClick={() => setActiveTab('browse')} className="text-secondary font-black hover:underline uppercase text-xs tracking-[0.2em] flex items-center gap-2 mx-auto">
                  Explore Campaigns <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="flex flex-col gap-6">
          {deals.length > 0 ? deals.map(deal => (
            <DealManager key={deal._id} deal={deal} onUpdate={fetchData} />
          )) : (
            <div className="dashboard-card border-dashed border-2 border-outline-variant/20 bg-transparent text-center py-24 flex flex-col items-center gap-6 animate-reveal-up">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/20">
                <CircleDollarSign size={40} />
              </div>
              <div>
                <p className="text-on-surface-variant font-black text-xl mb-2">No active deals yet.</p>
                <p className="text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest">Collaborations will appear here once confirmed</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'browse' && (
        <div className="flex flex-col gap-10">
          <div className="dashboard-card !p-6 flex justify-between items-center bg-surface-container/50 backdrop-blur-xl">
            <div className="flex items-center gap-5 grow px-4">
              <Search className="text-on-surface-variant" size={24} />
              <input 
                type="text" 
                placeholder="Search for opportunities..." 
                className="w-full bg-transparent text-lg font-bold text-on-surface outline-none placeholder:text-on-surface-variant/30" 
              />
            </div>
            <Link to="/campaigns" className="px-8 py-3 rounded-xl bg-secondary text-black font-black text-sm hover:scale-105 transition-transform flex items-center gap-2">
              Full Marketplace <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCampaigns.map(campaign => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="max-w-4xl">
          <div className="dashboard-card">
            <h3 className="text-3xl font-black mb-10 tracking-tighter text-on-surface">Creative Portfolio Settings</h3>
            
            {/* Avatar Upload Section */}
            <div className="flex items-center gap-8 mb-12 pb-12 border-b border-outline-variant/10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-highest border-4 border-surface shadow-2xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-20" />
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <User size={56} className="text-on-surface-variant/40 relative z-10" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 font-black text-xs z-20 backdrop-blur-sm">
                  CHANGE IMAGE
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files[0]) return;
                      const formData = new FormData();
                      formData.append('profilePicture', e.target.files[0]);
                      try {
                        const res = await axios.post('/creators/avatar', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        setProfile(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
                        setMessage({ type: 'success', text: 'Avatar updated!' });
                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                      } catch (err) {
                        setMessage({ type: 'error', text: 'Avatar upload failed.' });
                        console.error(err);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-2xl text-on-surface mb-1 uppercase tracking-tight">Identity Image</h4>
                <p className="text-on-surface-variant font-medium">Resolution 400x400 recommended. High quality PNG/JPG.</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Display Name</label>
                <input
                  type="text" value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="px-6 py-4 bg-surface-container-high border border-outline-variant/10 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/50 font-black text-on-surface placeholder:text-on-surface-variant/20 transition-all"
                  placeholder="e.g. Content King"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Primary Niche</label>
                <div className="relative">
                  <select
                    value={profile.niche}
                    onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
                    className="w-full px-6 py-4 bg-surface-container-high border border-outline-variant/10 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/50 font-black text-on-surface appearance-none cursor-pointer transition-all"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <Compass size={18} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Total Audience</label>
                <input
                  type="number" value={profile.followerCount}
                  onChange={(e) => setProfile({ ...profile, followerCount: parseInt(e.target.value) || 0 })}
                  className="px-6 py-4 bg-surface-container-high border border-outline-variant/10 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/50 font-black text-on-surface transition-all"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Avg Response Time</label>
                <input
                  type="text" value={profile.responseTime}
                  onChange={(e) => setProfile({ ...profile, responseTime: e.target.value })}
                  className="px-6 py-4 bg-surface-container-high border border-outline-variant/10 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/50 font-black text-on-surface transition-all"
                  placeholder="e.g. < 2h"
                />
              </div>
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Creator Biography</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="px-6 py-6 bg-surface-container-high border border-outline-variant/10 rounded-2xl outline-none h-40 font-medium text-on-surface placeholder:text-on-surface-variant/20 transition-all leading-relaxed"
                  placeholder="Describe your creative style and target audience..."
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-10 pt-10 border-t border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-on-surface uppercase text-xs tracking-[0.3em]">Social Networks</h4>
                  <span className="text-[10px] font-bold text-secondary uppercase animate-pulse">Live Connections</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-5 bg-surface-container-high p-5 rounded-2xl border border-outline-variant/10 group focus-within:border-primary/50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                      <Instagram size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Instagram</p>
                      <input
                        type="text"
                        placeholder="@handle"
                        value={getSocialHandle('Instagram')}
                        onChange={(e) => updateSocialLink('Instagram', e.target.value)}
                        className="bg-transparent outline-none font-black text-sm w-full text-on-surface"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-5 bg-surface-container-high p-5 rounded-2xl border border-outline-variant/10 group focus-within:border-secondary/50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <Youtube size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Youtube</p>
                      <input
                        type="text"
                        placeholder="@channel"
                        value={getSocialHandle('Youtube')}
                        onChange={(e) => updateSocialLink('Youtube', e.target.value)}
                        className="bg-transparent outline-none font-black text-sm w-full text-on-surface"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="md:col-span-2 py-5 rounded-2xl bg-linear-to-r from-primary to-secondary text-black font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Save size={24} /> Sync Portfolio Data
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
