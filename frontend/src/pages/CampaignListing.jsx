import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter, Rocket, Sparkles, SlidersHorizontal } from 'lucide-react';

const NICHES = ['All', 'Tech', 'Lifestyle', 'Fashion', 'Food', 'Travel', 'Gaming', 'Beauty', 'Finance', 'Health', 'Other'];
const STATUSES = ['All', 'active', 'paused', 'completed'];

const CampaignListing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nicheFilter, setNicheFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('/campaigns');
        setCampaigns(res.data);
      } catch (err) {
        console.error('Failed to fetch campaigns', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brandId?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNiche = nicheFilter === 'All' || c.niche === nicheFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchNiche && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="relative p-10 md:p-16 rounded-[3.5rem] overflow-hidden border border-outline-variant/10 shadow-2xl mb-20 animate-reveal-up">
          <div className="absolute inset-0 z-0">
            <img 
              src="/laptops.jpg" 
              className="w-full h-full object-cover opacity-0 dark:opacity-100 transition-opacity duration-1000" 
              alt="" 
            />
            <div className="absolute inset-0 bg-linear-to-r from-surface/95 via-surface/80 to-surface/40 dark:from-background/95 dark:via-background/80 dark:to-background/40" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-2xl">
               <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 backdrop-blur-sm">Marketplace</span>
                  <Sparkles size={16} className="text-secondary animate-pulse" />
               </div>
               <h1 className="text-5xl md:text-7xl font-black font-display mb-6 tracking-tighter leading-none">
                 Discovery <br/><span className="text-secondary">Console</span>
               </h1>
               <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-lg">
                 Navigate through our curated ecosystem of high-impact brand missions and creative opportunities.
               </p>
            </div>
            
            <div className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-surface-container-low/40 border border-outline-variant/10 backdrop-blur-xl shadow-2xl">
               <div className="text-right">
                  <p className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest mb-1">Global Active Missions</p>
                  <p className="text-4xl font-black text-on-surface tracking-tighter">{campaigns.length}</p>
               </div>
               <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                  <Rocket size={28} />
               </div>
            </div>
          </div>
        </div>

        <div className="sticky top-24 z-30 mb-16 px-4 md:px-0">
          <div className="p-4 rounded-[2.5rem] bg-surface-container/80 border border-outline-variant/10 backdrop-blur-3xl shadow-2xl shadow-black/10 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 transition-all duration-500">
            <div className="relative grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search missions, brands, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-surface-container-high border border-outline-variant/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all font-bold text-sm tracking-tight text-on-surface placeholder:text-on-surface-variant/50 shadow-inner"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative flex-1 lg:flex-none">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={16} />
                <select
                  value={nicheFilter}
                  onChange={(e) => setNicheFilter(e.target.value)}
                  className="w-full lg:w-48 pl-12 pr-10 py-5 bg-surface-container-high border border-outline-variant/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/30 font-black text-[10px] uppercase tracking-widest text-on-surface appearance-none cursor-pointer hover:bg-surface-container-highest transition-colors shadow-inner"
                >
                  {NICHES.map(n => <option key={n} value={n} className="bg-surface-container-highest text-on-surface">{n === 'All' ? 'All Domains' : n}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40">
                   <Filter size={12} />
                </div>
              </div>
              
              <div className="relative flex-1 lg:flex-none">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={16} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full lg:w-48 pl-12 pr-10 py-5 bg-surface-container-high border border-outline-variant/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/30 font-black text-[10px] uppercase tracking-widest text-on-surface appearance-none cursor-pointer hover:bg-surface-container-highest transition-colors shadow-inner"
                >
                  {STATUSES.map(s => <option key={s} value={s} className="bg-surface-container-highest text-on-surface">{s === 'All' ? 'All Levels' : s}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40">
                   <Filter size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-[400px] rounded-[2.5rem] bg-surface-container-low/20 animate-pulse border border-outline-variant/5"></div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((campaign, idx) => (
              <div key={campaign._id} className={`animate-reveal-up opacity-0 stagger-${(idx % 4) + 1}`}>
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 rounded-[3rem] bg-surface-container-low/10 border-2 border-dashed border-outline-variant/10 flex flex-col items-center text-center gap-6">
            <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/20">
               <Search size={48} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-on-surface tracking-tighter mb-2">No Parameters Matched</h3>
              <p className="text-on-surface-variant font-medium">Try adjusting your filters or search keywords to explore different missions.</p>
            </div>
            <button 
              onClick={() => {setSearchTerm(''); setNicheFilter('All'); setStatusFilter('All');}}
              className="mt-4 px-8 py-4 rounded-2xl bg-surface-container-highest text-on-surface font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Reset Console
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignListing;

