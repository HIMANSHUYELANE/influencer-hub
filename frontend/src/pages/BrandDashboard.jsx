import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Building, Plus, Users, Briefcase,
  Search, Save, DollarSign, LayoutDashboard,
  Target, TrendingUp, CheckCircle, ExternalLink, CircleDollarSign
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import CampaignCard from '../components/CampaignCard';
import DealManager from '../components/DealManager';

const BrandDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState({ 
    businessName: '', website: '', description: '',
    ownerName: '', location: '', businessType: 'Online', industry: '', operatingFrom: '',
    preferences: { targetGender: 'Both', targetAgeGroup: 'Any', targetLocality: 'Anywhere', brandPriority: 'Reach' }
  });
  const [campaigns, setCampaigns] = useState([]);
  const [deals, setDeals] = useState([]);
  const [allCreators, setAllCreators] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', budget: '', requirements: '', niche: 'Tech' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [profileRes, campaignsRes, creatorsRes, dealsRes] = await Promise.all([
        axios.get('/brands/me'),
        axios.get('/campaigns/mine'),
        axios.get('/creators'),
        axios.get('/deals/user')
      ]);
      setProfile(profileRes.data || { 
        businessName: '', website: '', description: '',
        ownerName: '', location: '', businessType: 'Online', industry: '', operatingFrom: '',
        preferences: { targetGender: 'Both', targetAgeGroup: 'Any', targetLocality: 'Anywhere', brandPriority: 'Reach' }
      });
      setCampaigns(campaignsRes.data);
      setAllCreators(creatorsRes.data);
      setDeals(dealsRes.data);
    } catch (err) {
      console.error(err);
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
      const res = await axios.post('/brands/profile', profile);
      setProfile(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handlePostCampaign = async (e) => {
    e.preventDefault();
    try {
      const formatted = {
        ...newCampaign,
        requirements: newCampaign.requirements.split(',').map(r => r.trim())
      };
      await axios.post('/campaigns', formatted);
      const res = await axios.get('/campaigns/mine');
      setCampaigns(res.data);
      setNewCampaign({ title: '', description: '', budget: '', requirements: '', niche: 'Tech' });
      setMessage({ type: 'success', text: 'Campaign launched successfully!' });
      setActiveTab('campaigns');
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error posting campaign.' });
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Profile Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'browse', label: 'Browse Creators', icon: <Search size={20} /> },
    { id: 'campaigns', label: 'Our Campaigns', icon: <Briefcase size={20} /> },
    { id: 'deals', label: 'Active Deals', icon: <CircleDollarSign size={20} /> },
    { id: 'create', label: 'Create New Campaign', icon: <Plus size={20} /> },
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
      {/* Premium Header */}
      <div className="mb-12 flex items-center gap-8 animate-reveal-up">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-surface-container-highest flex items-center justify-center border-4 border-surface shadow-2xl relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
            <div className="absolute inset-0 bg-linear-to-tr from-primary to-secondary opacity-10" />
            {profile.logo ? (
              <img src={profile.logo} alt="Brand Logo" className="w-[85%] h-[85%] rounded-2xl object-cover relative z-10" />
            ) : (
              <Building size={40} className="text-on-surface-variant/40 relative z-10" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-black shadow-lg border-2 border-surface">
            <CheckCircle size={16} />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/60 mb-2 block">Brand Control Console</span>
          <h1 className="text-5xl font-black text-on-surface tracking-tighter mb-2">
            {activeTab === 'overview' && "Welcome Back,"} <span className="text-secondary">{profile.businessName || user.email.split('@')[0]}</span>
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest">
              <span>Portfolio</span>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span>{sidebarItems.find(i => i.id === activeTab)?.label}</span>
            </div>
            <Link 
              to={`/brands/${profile._id}`} 
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container-high text-[10px] font-black uppercase tracking-widest text-secondary hover:bg-secondary hover:text-black transition-all"
            >
              View Public Profile <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`mb-10 p-5 rounded-2xl flex items-center gap-4 font-black shadow-2xl border animate-reveal-scale ${message.type === 'success' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-error/10 text-error border-error/20'
          }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <Target size={20} />}
          <span className="tracking-tight">{message.text}</span>
        </div>
      )}

      {/* VIEWS */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="dashboard-metric-card">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                <Briefcase size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Live Campaigns</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-on-surface">{campaigns.length}</p>
                  <span className="text-xs font-bold text-emerald-500 tracking-tighter">ActiveNow</span>
                </div>
              </div>
            </div>
            <div className="dashboard-metric-card">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-[0_0_20px_rgba(76,215,246,0.1)]">
                <Users size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Estimated Reach</p>
                <p className="text-3xl font-black text-on-surface">2.4M<span className="text-lg opacity-30">+</span></p>
              </div>
            </div>
            <div className="dashboard-metric-card">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Brand Score</p>
                <p className="text-3xl font-black text-on-surface">+12<span className="text-lg opacity-30">%</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="dashboard-card">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black font-display text-on-surface tracking-tight uppercase flex items-center gap-3">
                  <Building className="text-secondary" size={24} /> Brand Snapshot
                </h3>
                <a href={profile.website} target="_blank" className="p-2.5 rounded-xl bg-surface-container-highest text-on-surface hover:text-secondary transition-colors border border-outline-variant/10">
                  <ExternalLink size={18} />
                </a>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Official Domain</span>
                  <p className="text-lg font-black text-on-surface">{profile.website || 'identity.hub.dev'}</p>
                </div>
                {profile.ownerName && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Managed By</span>
                    <p className="text-lg font-black text-on-surface">{profile.ownerName}</p>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Business Bio</span>
                  <p className="text-on-surface-variant leading-relaxed font-medium">
                    {profile.description || 'Define your brand story in settings to attract top-tier creative talent.'}
                  </p>
                </div>
                <div className="pt-6 border-t border-outline-variant/5 grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-1">Industry</span>
                    <span className="px-3 py-1 rounded-lg bg-surface-container-high text-xs font-black text-secondary border border-secondary/10">{profile.industry || 'Multi-Channel'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-1">Type</span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-xs font-black text-emerald-400 border border-emerald-500/10">{profile.businessType || 'Online'}</span>
                  </div>
                  {profile.location && (
                    <div className="col-span-2">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-1">Location</span>
                      <span className="text-sm font-bold text-on-surface">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="dashboard-card relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-[80px]"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mb-8 border border-secondary/30">
                  <Plus size={32} />
                </div>
                <h3 className="text-4xl font-black font-display text-on-surface mb-4 tracking-tighter leading-none">Scale Your <br /><span className="text-secondary">Impact</span></h3>
                <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-xs mb-10">
                  Post a new campaign and reach millions through our curated creator network.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('create')}
                className="w-full py-5 rounded-2xl bg-on-surface text-surface font-black text-xl hover:bg-secondary hover:text-white transition-all relative z-10 shadow-2xl shadow-black/20"
              >
                Launch New Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'browse' && (
        <div className="flex flex-col gap-10">
          <div className="dashboard-card !p-6 flex justify-between items-center bg-surface-container/50 backdrop-blur-xl animate-reveal-up">
            <div className="flex items-center gap-5 grow max-w-2xl px-4">
              <Search className="text-on-surface-variant" size={24} />
              <input
                type="text"
                placeholder="Search creators by niche or name..."
                className="w-full bg-transparent text-lg font-bold text-on-surface outline-none placeholder:text-on-surface-variant/30"
              />
            </div>
            <Link to="/creators" className="px-8 py-3 rounded-2xl bg-secondary text-black font-black text-sm hover:scale-105 transition-transform flex items-center gap-2">
              Advanced Marketplace <ExternalLink size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCreators.slice(0, 6).map((creator, idx) => (
              <div key={creator._id} className="dashboard-card flex flex-col items-center text-center group transition-all hover:scale-[1.02] border border-outline-variant/10 animate-reveal-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-4 border-surface shadow-2xl relative z-10">
                    {creator.profilePicture ? (
                      <img src={creator.profilePicture} alt={creator.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <div className="absolute -inset-2 bg-linear-to-tr from-primary to-secondary rounded-full opacity-30 blur-md group-hover:opacity-60 transition-opacity"></div>
                </div>
                <h4 className="font-black text-2xl text-on-surface tracking-tight group-hover:text-secondary transition-colors">{creator.name}</h4>
                <div className={`mt-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${creator.niche === 'Tech' ? 'niche-tech' :
                    creator.niche === 'Fashion' ? 'niche-fashion' :
                      creator.niche === 'Gaming' ? 'niche-gaming' :
                        creator.niche === 'Food' ? 'niche-food' :
                          creator.niche === 'Lifestyle' ? 'niche-lifestyle' :
                            creator.niche === 'Fitness' ? 'niche-fitness' :
                              'bg-surface-container-high text-on-surface-variant border-outline-variant/10'
                  }`}>
                  {creator.niche || 'CREATOR'}
                </div>

                <div className="mt-8 flex items-center gap-8 py-4 border-y border-outline-variant/5 w-full justify-center">
                  <div className="text-center">
                    <p className="text-lg font-black text-on-surface">24k</p>
                    <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Followers</p>
                  </div>
                  <div className="w-px h-8 bg-outline-variant/10"></div>
                  <div className="text-center">
                    <p className="text-lg font-black text-on-surface">4.9</p>
                    <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Rating</p>
                  </div>
                </div>

                <Link to={`/creators/${creator._id}`} className="mt-8 w-full py-3.5 rounded-xl bg-surface-container-highest text-on-surface font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all border border-outline-variant/10">
                  View Portfolio
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.length > 0 ? campaigns.map(campaign => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          )) : (
            <div className="col-span-full dashboard-card border-dashed border-2 border-outline-variant/20 bg-transparent text-center py-24 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/20">
                <Briefcase size={40} />
              </div>
              <div>
                <p className="text-on-surface-variant font-black text-xl mb-2">No active campaigns.</p>
                <button onClick={() => setActiveTab('create')} className="text-secondary font-black hover:underline uppercase text-xs tracking-[0.2em] flex items-center gap-2 mx-auto">
                  Launch Your First <ArrowUpRight size={14} />
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
                <button onClick={() => setActiveTab('browse')} className="text-secondary font-black hover:underline uppercase text-xs tracking-[0.2em] flex items-center gap-2 mx-auto">
                  Find Creators <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="max-w-4xl">
          <div className="dashboard-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Plus size={120} />
            </div>
            <h3 className="text-4xl font-black mb-12 tracking-tighter text-on-surface">Post New <span className="text-secondary">Opportunity</span></h3>
            <form onSubmit={handlePostCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">Campaign Title</label>
                <input
                  required type="text" value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  className="px-6 py-5 bg-surface-container-high border border-outline-variant/10 rounded-2xl outline-none focus:ring-2 focus:ring-secondary/50 font-black text-on-surface text-lg transition-all"
                  placeholder="e.g. Summer Tech Review 2024"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">Brand Budget (₹)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-secondary">₹</span>
                  <input
                    required type="number" value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                    className="premium-input w-full pl-12"
                    placeholder="5000"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">Content Niche</label>
                <div className="relative">
                  <select
                    value={newCampaign.niche}
                    onChange={(e) => setNewCampaign({ ...newCampaign, niche: e.target.value })}
                    className="premium-input w-full"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <Target size={20} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">Deliverables (comma-separated)</label>
                <input
                  type="text" value={newCampaign.requirements}
                  onChange={(e) => setNewCampaign({ ...newCampaign, requirements: e.target.value })}
                  className="premium-input"
                  placeholder="3 Reels, 1 Story, Link in Bio"
                />
              </div>
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">Campaign Brief</label>
                <textarea
                  required value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  className="premium-input w-full h-48 font-medium"
                  placeholder="Describe your brand and what you expect from this collaboration..."
                />
              </div>
              <button type="submit" className="md:col-span-2 py-6 rounded-2xl bg-linear-to-r from-primary to-secondary text-black font-black text-2xl shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                Broadcast Campaign Now
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="max-w-4xl">
          <div className="dashboard-card">
            <h3 className="text-3xl font-black font-display mb-12 tracking-tighter text-on-surface">Brand Identity Settings</h3>

            {/* Logo Upload Section */}
            <div className="flex items-center gap-10 mb-12 pb-12 border-b border-outline-variant/10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-surface-container-highest border-4 border-surface shadow-2xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary to-secondary opacity-10" />
                  {profile.logo ? (
                    <img src={profile.logo} alt="Brand Logo" className="w-[80%] h-[80%] object-cover relative z-10" />
                  ) : (
                    <Building size={48} className="text-on-surface-variant/40 relative z-10" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/70 text-white rounded-3xl opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 font-black text-[10px] tracking-widest z-20 backdrop-blur-sm">
                  REPLACE LOGO
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files[0]) return;
                      const formData = new FormData();
                      formData.append('logo', e.target.files[0]);
                      try {
                        const res = await axios.post('/brands/logo', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        setProfile(prev => ({ ...prev, logo: res.data.logo }));
                        setMessage({ type: 'success', text: 'Logo updated!' });
                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                      } catch (err) {
                        setMessage({ type: 'error', text: 'Logo upload failed.' });
                        console.error(err);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-2xl text-on-surface mb-1 uppercase tracking-tight">Corporate Asset</h4>
                <p className="text-on-surface-variant font-medium">SVG or high-res PNG preferred. Transparent background looks best.</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-10">
              {/* Section 1: Corporate Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5 rounded-4xl bg-surface-container-high/50 border border-surface-container-highest">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-secondary rounded-full" /> 01. Corporate Identity
                  </h4>
                </div>

                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="console-label">Official Business Name</label>
                  <input
                    type="text" value={profile.businessName || ''}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                    className="premium-input"
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="console-label">Owner Name</label>
                  <input
                    type="text" value={profile.ownerName || ''}
                    onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                    className="premium-input"
                    placeholder="e.g. Vickram Nagmoote"
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="console-label">Brand Domain / Website</label>
                  <input
                    type="url" value={profile.website || ''}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="premium-input"
                    placeholder="https://yourbrand.com"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="console-label">Location</label>
                  <input
                    type="text" value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="premium-input"
                    placeholder="e.g. Nagpur"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="console-label">Business Type</label>
                  <select
                    value={profile.businessType || 'Online'}
                    onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                    className="premium-input appearance-none cursor-pointer"
                  >
                    <option value="Service">Service</option>
                    <option value="Local">Local</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="console-label">Industry</label>
                  <input
                    type="text" value={profile.industry || ''}
                    onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                    className="premium-input"
                    placeholder="e.g. Tech, Fashion, Food"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="console-label">Operating From (Years)</label>
                  <input
                    type="text" value={profile.operatingFrom || ''}
                    onChange={(e) => setProfile({ ...profile, operatingFrom: e.target.value })}
                    className="premium-input"
                    placeholder="e.g. 1-3 years"
                  />
                </div>

                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="console-label">Brand Narrative / Description</label>
                  <textarea
                    value={profile.description || ''}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    className="premium-input min-h-32 pt-6 font-medium!"
                    placeholder="Share your brand's mission and what you look for in creator partnerships..."
                  />
                </div>
              </div>

              {/* Section 2: Target Intelligence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5 rounded-4xl bg-surface-container-high/50 border border-surface-container-highest">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" /> 02. Target Intelligence Preferences
                  </h4>
                </div>
                  
                <div className="flex flex-col gap-3">
                  <label className="console-label">Creators We Are Looking For</label>
                  <select
                    value={profile.preferences?.targetGender || 'Both'}
                    onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, targetGender: e.target.value } })}
                    className="premium-input appearance-none cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Both">Both (Male & Female)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="console-label">Target Age Group</label>
                  <input
                    type="text" value={profile.preferences?.targetAgeGroup || ''}
                    onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, targetAgeGroup: e.target.value } })}
                    className="premium-input"
                    placeholder="e.g. 18-24, Any"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="console-label">Target Locality</label>
                  <input
                    type="text" value={profile.preferences?.targetLocality || ''}
                    onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, targetLocality: e.target.value } })}
                    className="premium-input"
                    placeholder="e.g. Mumbai, Anywhere"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="console-label">What is Important For You?</label>
                  <select
                    value={profile.preferences?.brandPriority || 'Reach'}
                    onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, brandPriority: e.target.value } })}
                    className="premium-input appearance-none cursor-pointer"
                  >
                    <option value="Followers">Followers</option>
                    <option value="Reach">Reach</option>
                    <option value="Video Content Only">Video Content Only</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="py-4 rounded-4xl bg-linear-to-r from-primary to-secondary text-black font-black text-2xl shadow-2xl shadow-primary/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 group">
                <Save size={28} className="group-hover:rotate-12 transition-transform" /> Synchronize Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BrandDashboard;
