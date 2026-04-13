import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Building, Plus, Users, Briefcase, 
  Search, Save, DollarSign, LayoutDashboard,
  Target, TrendingUp, CheckCircle, ExternalLink
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import CampaignCard from '../components/CampaignCard';

const BrandDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState({ businessName: '', website: '', description: '' });
  const [campaigns, setCampaigns] = useState([]);
  const [allCreators, setAllCreators] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', budget: '', requirements: '', niche: 'Tech' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, campaignsRes, creatorsRes] = await Promise.all([
          axios.get('/brands/me'),
          axios.get('/campaigns/mine'),
          axios.get('/creators')
        ]);
        setProfile(profileRes.data || { businessName: '', website: '', description: '' });
        setCampaigns(campaignsRes.data);
        setAllCreators(creatorsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
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
      {/* Header Info */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          {activeTab === 'overview' && "Welcome Back,"} {profile.businessName || user.email.split('@')[0]}
        </h1>
        <p className="text-slate-500 font-medium">Dashboard / {sidebarItems.find(i => i.id === activeTab)?.label}</p>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg animate-reveal-up ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <CheckCircle size={20} /> {message.text}
        </div>
      )}

      {/* VIEWS */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="metric-card">
              <div className="metric-icon bg-primary-50 text-primary-600">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="stat-label">Active Campaigns</p>
                <p className="stat-value">{campaigns.length}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon bg-indigo-50 text-indigo-600">
                <Users size={24} />
              </div>
              <div>
                <p className="stat-label">Total Reach</p>
                <p className="stat-value">2.4M+</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon bg-green-50 text-green-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="stat-label">Campaign Growth</p>
                <p className="stat-value">+12%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="card bg-linear-to-br from-white to-slate-50/50">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Building className="text-primary-600" size={24} /> Brand Snapshot
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-400 font-bold text-sm uppercase">Website</span>
                    <a href={profile.website} target="_blank" className="text-primary-600 font-bold flex items-center gap-1">
                      {profile.website || 'Not set'} <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="py-3">
                    <span className="text-slate-400 font-bold text-sm uppercase block mb-2">Description</span>
                    <p className="text-slate-600 text-sm leading-relaxed">{profile.description || 'No description provided yet.'}</p>
                  </div>
               </div>
            </div>
            
            <div className="card bg-primary-600 text-white border-none overflow-hidden relative">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
               <h3 className="text-xl font-bold mb-4 relative z-10">Quick Action</h3>
               <p className="text-primary-100 mb-8 max-w-60 relative z-10">Ready to find your next top-tier content creator?</p>
               <button 
                 onClick={() => setActiveTab('create')}
                 className="bg-white text-primary-600 px-6 py-3 rounded-2xl font-bold hover:bg-primary-50 transition-colors relative z-10"
               >
                 Launch New Campaign
               </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'browse' && (
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4 grow max-w-xl">
               <Search className="text-slate-400" size={20} />
               <input type="text" placeholder="Search creators by niche or name..." className="w-full font-medium outline-none" />
             </div>
             <Link to="/creators" className="text-primary-600 font-bold text-sm flex items-center gap-2">
               Advanced Filters <ExternalLink size={16} />
             </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allCreators.slice(0, 6).map(creator => (
              <div key={creator._id} className="card flex flex-col items-center text-center group transition-all hover:bg-primary-50/30">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  👤
                </div>
                <h4 className="font-bold text-lg">{creator.name}</h4>
                <p className="text-primary-600 text-xs font-black uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full mt-2">
                  {creator.niche}
                </p>
                <Link to={`/creators/${creator._id}`} className="mt-6 text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors">View Profile</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.length > 0 ? campaigns.map(campaign => (
            <div key={campaign._id} className="p-1">
              <div className="card h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-xl text-slate-900 mb-1">{campaign.title}</h4>
                    <span className="status-badge bg-primary-50 text-primary-600 border-primary-100">
                      {campaign.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">₹{campaign.budget?.toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Budget</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 grow">{campaign.description}</p>
                <Link 
                  to={`/campaigns/${campaign._id}`} 
                  className="w-full btn-secondary flex items-center justify-center gap-2 mt-auto"
                >
                   Review Applications <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-2 card border-dashed border-2 border-slate-200 shadow-none text-center py-20 bg-transparent">
              <p className="text-slate-400 font-bold mb-4">No campaigns found.</p>
              <button 
                onClick={() => setActiveTab('create')}
                className="text-primary-600 font-black hover:underline uppercase text-sm tracking-widest"
              >
                Launch your first campaign
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="max-w-3xl">
          <div className="card border-2 border-primary-100 bg-primary-50/10 p-10">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Post New Opportunity</h3>
            <form onSubmit={handlePostCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Campaign Title</label>
                <input 
                  required type="text" value={newCampaign.title} 
                  onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                  className="px-6 py-4 bg-white border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                  placeholder="e.g. Summer Tech Review 2024"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Budget (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required type="number" value={newCampaign.budget} 
                    onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                    placeholder="5000"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category / Niche</label>
                <select 
                  value={newCampaign.niche}
                  onChange={(e) => setNewCampaign({...newCampaign, niche: e.target.value})}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-primary-500 font-bold appearance-none"
                >
                  <option value="Tech">Tech</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food">Food</option>
                  <option value="Fitness">Fitness</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Requirements (comma-separated)</label>
                <input 
                  type="text" value={newCampaign.requirements} 
                  onChange={(e) => setNewCampaign({...newCampaign, requirements: e.target.value})}
                  className="px-6 py-4 bg-white border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                  placeholder="3 Reels, 1 Story, Link in Bio"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description & Goals</label>
                <textarea 
                  required value={newCampaign.description} 
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  className="px-6 py-4 bg-white border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-primary-500 h-32 font-medium"
                  placeholder="Describe your brand and what you expect from this collaboration..."
                />
              </div>
              <button type="submit" className="btn-primary py-4 md:col-span-2 text-lg">Launch Campaign Now</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="max-w-2xl">
          <div className="card p-10">
            <h3 className="text-2xl font-black mb-8">Brand Settings</h3>
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Company Name</label>
                <input 
                  type="text" value={profile.businessName} 
                  onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Official Website</label>
                <input 
                  type="url" value={profile.website} 
                  onChange={(e) => setProfile({...profile, website: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-900"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Public Bio</label>
                <textarea 
                  value={profile.description} 
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-[20px] outline-none h-32 font-medium text-slate-700"
                />
              </div>
              <button type="submit" className="btn-primary py-4 flex items-center justify-center gap-2">
                <Save size={20} /> Update Brand Identity
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BrandDashboard;
