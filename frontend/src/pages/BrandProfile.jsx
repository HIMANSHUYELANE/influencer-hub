import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { 
  ChevronLeft, 
  Building, 
  Globe, 
  ShieldCheck, 
  ExternalLink, 
  MapPin, 
  Target, 
  Users, 
  Zap,
  ArrowRight
} from 'lucide-react';
import CampaignCard from '../components/CampaignCard';

const BrandProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const [brandRes, campaignsRes] = await Promise.all([
          axios.get(`/brands/${id}`),
          axios.get(`/campaigns?brandId=${id}`)
        ]);
        setProfile(brandRes.data);
        
        // Robust filtering: ensure we have an array and handle both object/string IDs
        const rawCampaigns = Array.isArray(campaignsRes.data) ? campaignsRes.data : [];
        const filteredCampaigns = rawCampaigns.filter(c => {
          const campaignBrandId = c.brandId?._id || c.brandId;
          return campaignBrandId === id;
        });
        
        setCampaigns(filteredCampaigns);
      } catch (err) {
        console.error('Failed to fetch brand profile intelligence', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface-variant">
      <Building size={64} className="mb-6 opacity-20" />
      <p className="text-xl font-black font-display tracking-tight">Brand Identity Not Found</p>
      <Link to="/" className="mt-8 text-secondary font-black uppercase text-xs tracking-widest hover:underline">Return to Hub</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/campaigns"
          className="flex items-center gap-2 text-on-surface-variant/40 hover:text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-12 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Discovery
        </Link>

        {/* Brand Hero Console */}
        <section className="relative p-12 rounded-[3.5rem] bg-surface-container border border-outline-variant/10 overflow-hidden mb-12 animate-reveal-up">
           
           <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="relative group">
                 <div className="w-48 h-48 bg-surface-container-high rounded-[3rem] flex items-center justify-center overflow-hidden border-4 border-outline-variant/10 shadow-2xl transition-transform group-hover:scale-105">
                   {profile.logo ? (
                     <img src={profile.logo} alt="Logo" className="w-[80%] h-[80%] object-contain" />
                   ) : (
                     <Building size={64} className="text-on-surface-variant/20" />
                   )}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-on-surface p-2.5 rounded-full shadow-2xl border-4 border-background">
                   <ShieldCheck size={28} className="text-secondary" />
                 </div>
              </div>

              <div className="grow text-center md:text-left pt-4">
                 <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter leading-none">
                      {profile.businessName}
                    </h1>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] self-center">
                      Verified Partner
                    </span>
                 </div>
                 
                 {profile.ownerName && (
                   <p className="text-lg font-bold text-on-surface-variant mb-6 flex items-center gap-2">
                     <Users size={16} /> Represented by {profile.ownerName}
                   </p>
                 )}
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
                   <span className="px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                     <Target size={14} /> {profile.industry || 'Multi-Channel'}
                   </span>
                   <span className="px-4 py-1.5 bg-surface-container-highest text-on-surface-variant/80 border border-outline-variant/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                     <Building size={12} className="text-on-surface-variant" /> {profile.businessType || 'Online'}
                   </span>
                   {profile.location && (
                     <span className="px-4 py-1.5 bg-surface-container-highest text-on-surface-variant/60 border border-outline-variant/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                       <MapPin size={12} className="text-secondary" /> {profile.location}
                     </span>
                   )}
                   {profile.website && (
                     <a href={profile.website} target="_blank" rel="noreferrer" className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                       <Globe size={12} /> Official Site <ExternalLink size={10} />
                     </a>
                   )}
                 </div>

                 <div className="flex flex-wrap justify-center md:justify-start gap-12 pt-10 border-t border-outline-variant/5">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Operating Since</span>
                      <span className="text-4xl font-black text-on-surface tracking-tighter">{profile.operatingFrom || 'Established'}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Opportunities</span>
                      <span className="text-4xl font-black text-on-surface tracking-tighter">{campaigns.length} Active</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Est. Payouts</span>
                      <span className="text-4xl font-black text-secondary tracking-tighter">₹50K+</span>
                   </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Strategic Intelligence */}
           <div className="lg:col-span-8 flex flex-col gap-12">
              <section className="dashboard-card">
                 <h2 className="text-2xl font-black font-display mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-secondary rounded-full"></div>
                    Brand Narrative
                 </h2>
                 <p className="text-on-surface-variant text-lg leading-relaxed font-medium">
                   {profile.description || 'Our brand is dedicated to pushing the boundaries of innovation and creativity. We seek partners who share our passion for high-impact digital storytelling and authentic audience engagement.'}
                 </p>
              </section>

              <section className="relative p-8 md:p-12 rounded-[3.5rem] overflow-hidden border border-outline-variant/10 shadow-2xl animate-reveal-up bg-surface-container">
                 <div className="absolute inset-0 z-0 bg-background/80" />

                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                       <h2 className="text-2xl font-black font-display flex items-center gap-3">
                          <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                          Discovery Console
                       </h2>
                       <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-high/50 px-3 py-1 rounded-full">Active Missions from this brand</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {campaigns.length > 0 ? (
                         campaigns.map(campaign => (
                           <CampaignCard key={campaign._id} campaign={campaign} />
                         ))
                       ) : (
                         <div className="col-span-2 p-12 rounded-4xl border-2 border-dashed border-outline-variant/10 text-center flex flex-col items-center gap-4 bg-surface/30">
                           <Zap size={48} className="text-on-surface-variant/20" />
                           <p className="text-on-surface-variant font-black text-sm uppercase tracking-widest">No active public missions at the moment.</p>
                         </div>
                       )}
                    </div>
                 </div>
              </section>
           </div>

           {/* Brand Intelligence Panel */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="dashboard-card bg-surface-container border border-secondary/20">
                 <h3 className="text-xl font-black font-display mb-8 tracking-tight text-on-surface flex items-center gap-2">
                   Target Intelligence <Zap size={18} className="text-secondary" />
                 </h3>
                 <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                       <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Primary Audience Age</p>
                       <div className="flex flex-wrap gap-2">
                          {(profile.preferences?.targetAgeGroup || 'Any').split(',').map((age, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-lg bg-surface-container-highest text-xs font-black text-on-surface">{age.trim()}</span>
                          ))}
                       </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                       <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Gender Priority</p>
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${profile.preferences?.targetGender === 'Male' ? 'bg-primary' : profile.preferences?.targetGender === 'Female' ? 'bg-secondary' : 'bg-emerald-400'}`} />
                          <span className="text-xs font-bold text-on-surface">{profile.preferences?.targetGender || 'Both (Male & Female)'}</span>
                       </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                       <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Target Locality</p>
                       <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-secondary" />
                          <span className="text-xs font-bold text-on-surface">{profile.preferences?.targetLocality || 'Anywhere'}</span>
                       </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                       <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Primary Goal</p>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-on-surface">{profile.preferences?.brandPriority || 'Reach'}</span>
                          <Target size={20} className="text-primary" />
                       </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                       <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Brand Integrity</p>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-emerald-400">98% Verified</span>
                          <ShieldCheck size={20} className="text-emerald-400" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="dashboard-card group bg-surface-container border border-primary/20">
                 <h3 className="text-xl font-black font-display mb-4 tracking-tight text-on-surface">Join the Story</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-8">
                   Apply to one of the missions in the Discovery Console to start a conversation with this brand.
                 </p>
                 <Link to="/campaigns" className="flex items-center justify-between p-5 rounded-2xl bg-on-surface text-background font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-black transition-all group">
                    Explore All Missions
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;
