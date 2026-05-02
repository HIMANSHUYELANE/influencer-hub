import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  User, 
  Globe, 
  CheckCircle, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Target, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
  Briefcase
} from 'lucide-react';

const CreatorProfile = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await axios.get(`/creators/${id}`);
        setCreator(res.data);
      } catch (err) {
        console.error('Failed to fetch creator', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [id]);

  const handlePackageCheckout = async (tier) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'brand') {
      setMessage({ type: 'error', text: 'Only brands can purchase packages.' });
      return;
    }

    setCheckoutLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Step 1: Create the Deal in Escrow Pipeline
      const res = await axios.post('/deals/package-checkout', {
        creatorId: creator._id,
        packageTier: tier
      });
      const dealId = res.data._id;

      // Step 2: In Mock mode, we simulate the payment right away
      await axios.post(`/deals/${dealId}/pay`);
      
      // Redirect to the active deals dashboard
      navigate('/brand-dashboard');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Checkout failed.' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!creator) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface-variant">
      <User size={64} className="mb-6 opacity-20" />
      <p className="text-xl font-black font-display tracking-tight">Talent Not Found</p>
      <Link to="/creators" className="mt-8 text-primary font-black uppercase text-xs tracking-widest hover:underline">Return to Talent Pool</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface py-16 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/creators"
          className="flex items-center gap-2 text-on-surface-variant/40 hover:text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-12 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Talent Intelligence
        </Link>

        {/* Creator Hero Console */}
        <section className="relative p-12 rounded-[3.5rem] bg-surface-container border border-outline-variant/10 overflow-hidden mb-12 animate-reveal-up">
           
           <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="relative group">
                 <div className="w-48 h-48 bg-surface-container-high rounded-[3rem] flex items-center justify-center overflow-hidden border-4 border-outline-variant/10 shadow-2xl transition-transform group-hover:scale-105">
                   {creator.profilePicture ? (
                     <img src={creator.profilePicture} alt={creator.name} className="w-full self-auto h-full object-cover" />
                   ) : (
                     <User size={64} className="text-on-surface-variant/20" />
                   )}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-on-surface p-2.5 rounded-full shadow-2xl border-4 border-background">
                   <ShieldCheck size={28} className="text-primary" />
                 </div>
              </div>

              <div className="grow text-center md:text-left pt-4">
                 <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter leading-none">
                      {creator.name}
                    </h1>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] self-center">
                      Verified Talent
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
                   <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                     <Zap size={14} /> {creator.niche} Expert
                   </span>
                   {creator.location && (
                     <span className="px-4 py-1.5 bg-surface-container-highest text-on-surface-variant/60 border border-outline-variant/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                       <MapPin size={12} className="text-primary" /> {creator.location}
                     </span>
                   )}
                   {creator.age && (
                     <span className="px-4 py-1.5 bg-surface-container-low text-on-surface-variant border border-outline-variant/5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                       <User size={12} /> {creator.age} Years
                     </span>
                   )}
                 </div>

                 <div className="flex flex-wrap justify-center md:justify-start gap-12 border-t border-outline-variant/5">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Followers</span>
                      <span className="text-4xl font-black text-on-surface tracking-tighter">
                        {creator.followerCount >= 1000 
                          ? (creator.followerCount / 1000).toFixed(1) + 'K' 
                          : creator.followerCount || 0}
                      </span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Engagement</span>
                      <span className="text-4xl font-black text-secondary tracking-tighter">High</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1">Response</span>
                      <span className="text-4xl font-black text-on-surface tracking-tighter">{creator.responseTime || '< 24h'}</span>
                   </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8 flex flex-col gap-12">
              {/* Bio Section */}
              <section className="dashboard-card">
                 <h2 className="text-2xl font-black font-display mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-secondary rounded-full"></div>
                    Professional Narrative
                 </h2>
                 <p className="text-on-surface-variant text-lg leading-relaxed font-medium">
                   {creator.bio || 'This creator is dedicated to high-impact content creation and authentic audience storytelling.'}
                 </p>
              </section>

              {/* Service Packages */}
              <section>
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black font-display flex items-center gap-3">
                       <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                       Service Architectures
                    </h2>
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Pricing & Deliverables</span>
                 </div>

                 {message.text && (
                   <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'error' ? 'bg-error/10 text-error border border-error/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                     {message.text}
                   </div>
                 )}
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {['basic', 'standard', 'premium'].map((tier) => {
                     // Fallback mock logic for UI
                     const mockPrice = tier === 'premium' ? 10000 : (tier === 'standard' ? 5000 : 2500);
                     const actualPrice = creator.pricing?.[tier]?.price;
                     const displayPrice = actualPrice > 0 ? actualPrice : mockPrice;
                     const isAvailable = true; // Enabled for testing via fallback
                     
                     return (
                     <div key={tier} className="dashboard-card group flex flex-col gap-8 relative overflow-hidden hover:border-primary/30 transition-all">
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">{tier} Configuration</span>
                           <p className="text-3xl font-black text-on-surface mt-2 tracking-tighter">
                             ₹{displayPrice.toLocaleString()}
                           </p>
                        </div>
                        <p className="text-sm font-medium text-on-surface-variant leading-relaxed min-h-20">
                           {creator.pricing?.[tier]?.description || `Mock ${tier} campaign strategy and high-impact content delivery.`}
                        </p>
                        <div className="pt-8 border-t border-outline-variant/10">
                           <button 
                             disabled={!isAvailable || checkoutLoading}
                             onClick={() => handlePackageCheckout(tier)}
                             className="w-full py-4 rounded-2xl bg-surface-container-highest text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-on-surface hover:text-background transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              {checkoutLoading ? 'Processing...' : `Initiate ${tier} Deal`}
                           </button>
                        </div>
                     </div>
                   )})}
                 </div>
              </section>

              {/* Expertise Matrix */}
              {creator.expertise?.length > 0 && (
                <section className="dashboard-card bg-surface-container border border-outline-variant/10">
                   <h2 className="text-2xl font-black font-display mb-8 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                      Expertise Matrix
                   </h2>
                   <div className="flex flex-wrap gap-4">
                      {creator.expertise.map((skill, idx) => (
                        <div key={idx} className="px-6 py-4 bg-surface-container-low rounded-2xl font-black text-xs uppercase tracking-widest text-on-surface border border-outline-variant/5 shadow-sm hover:shadow-md transition-all">
                          {skill}
                        </div>
                      ))}
                   </div>
                </section>
              )}
           </div>

           {/* Creator Intelligence Sidebar */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="dashboard-card bg-surface-container border border-primary/20 sticky top-32">
                 <h3 className="text-xl font-black font-display mb-8 tracking-tight text-on-surface flex items-center gap-2">
                   Direct Collaboration <TrendingUp size={18} className="text-primary" />
                 </h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-10">
                   Start a strategic partnership with {creator.name} by sending a direct mission proposal.
                 </p>
                 
                 <div className="space-y-4 mb-10">
                    <button className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95">
                       <MessageCircle size={18} /> Initiate Contact
                    </button>
                    {creator.portfolioLink && (
                       <a 
                         href={creator.portfolioLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="w-full py-5 rounded-2xl bg-on-surface text-background font-black text-xs uppercase tracking-[0.2em] hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                       >
                         View Intelligence Portfolio <ExternalLink size={16} />
                       </a>
                    )}
                 </div>

                 <div className="pt-10 border-t border-outline-variant/10 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low/50">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                             <ShieldCheck size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Vetting Score</span>
                       </div>
                       <span className="text-lg font-black text-on-surface">9.8</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low/50">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                             <Briefcase size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Successful Deals</span>
                       </div>
                       <span className="text-lg font-black text-on-surface">42+</span>
                    </div>
                 </div>

                 <Link to="/campaigns" className="block text-center mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-colors">
                    Explore Global Discovery Console
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
