import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import CampaignCard from '../components/CampaignCard';
import { Search } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Browse Campaigns</h1>
          <p className="text-slate-500 font-medium">Find your next big collaboration</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by keyword, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
            />
          </div>
          <select
            value={nicheFilter}
            onChange={(e) => setNicheFilter(e.target.value)}
            className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 transition-all"
          >
            {NICHES.map(n => <option key={n} value={n}>{n === 'All' ? 'All Niches' : n}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 transition-all"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="card animate-pulse h-64 bg-slate-100 flex flex-col gap-4">
               <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
               <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
               <div className="h-4 w-full bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((campaign, idx) => (
            <div key={campaign._id} className={`animate-reveal-up opacity-0 stagger-${(idx % 4) + 1}`}>
              <CampaignCard campaign={campaign} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-24 flex flex-col items-center gap-4">
          <Search size={48} className="text-slate-200" />
          <h3 className="text-xl font-bold text-slate-400">No campaigns found</h3>
          <p className="text-slate-300">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default CampaignListing;

