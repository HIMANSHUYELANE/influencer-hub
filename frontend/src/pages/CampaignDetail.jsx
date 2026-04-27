import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  MapPin,
  CheckCircle,
  Send,
  AlertCircle,
  Building,
  XCircle,
  User,
  ExternalLink,
  Target,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Briefcase
} from "lucide-react";

const CampaignDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applyMessage, setApplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/campaigns/${id}`);
        setCampaign(res.data);

        // If brand, fetch applications for this campaign
        if (user?.role === "brand") {
          const appsRes = await axios.get(`/applications/brand/${id}`);
          setApplications(appsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/applications", {
        campaignId: id,
        message: applyMessage,
      });
      setStatus({ type: "success", text: "Application sent successfully!" });
      setApplyMessage("");
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to apply.",
      });
    }
  };

  const updateAppStatus = async (appId, newStatus) => {
    try {
      await axios.put(`/applications/${appId}/status`, { status: newStatus });
      // Refresh applications list
      const appsRes = await axios.get(`/applications/brand/${id}`);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );

  if (!campaign)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface-variant">
        <Zap size={64} className="mb-6 opacity-20" />
        <p className="text-xl font-black font-display tracking-tight">Mission Not Found</p>
        <Link to="/campaigns" className="mt-8 text-primary font-black uppercase text-xs tracking-widest hover:underline">Return to Discovery Console</Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-on-surface py-16 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/campaigns"
          className="flex items-center gap-2 text-on-surface-variant/40 hover:text-secondary font-black text-[10px] uppercase tracking-[0.3em] mb-12 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Global Discovery
        </Link>

        {/* Campaign Hero Architecture */}
        <section className="relative p-12 rounded-[3.5rem] bg-surface-container-low/30 border border-outline-variant/10 overflow-hidden mb-12 animate-reveal-up">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="relative group">
                 <Link to={`/brands/${campaign.brandId?._id}`} className="block">
                    <div className="w-40 h-40 bg-surface-container-high rounded-[3rem] flex items-center justify-center overflow-hidden border-4 border-outline-variant/10 shadow-2xl transition-transform group-hover:scale-105 p-6">
                      {campaign.brandId?.logo ? (
                        <img src={campaign.brandId.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Building size={48} className="text-on-surface-variant/20" />
                      )}
                    </div>
                 </Link>
                 <div className="absolute -bottom-2 -right-2 bg-on-surface p-2 rounded-full shadow-2xl border-4 border-background">
                   <ShieldCheck size={24} className="text-secondary" />
                 </div>
              </div>

              <div className="grow text-center md:text-left pt-2">
                 <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter leading-none">
                      {campaign.title}
                    </h1>
                    <span className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-black uppercase tracking-[0.2em] self-center">
                      {campaign.status}
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-10">
                   <Link to={`/brands/${campaign.brandId?._id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface hover:text-secondary transition-colors">
                     {campaign.brandId?.businessName} <ExternalLink size={12} />
                   </Link>
                   <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-highest rounded-full text-on-surface">
                      <DollarSign size={14} className="text-secondary" />
                      <span className="text-xs font-black tracking-widest uppercase">Budget: ₹{campaign.budget?.toLocaleString()}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-highest rounded-full text-on-surface">
                      <Target size={14} className="text-primary" />
                      <span className="text-xs font-black tracking-widest uppercase">{campaign.niche}</span>
                   </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Main Intelligence Body */}
           <div className="lg:col-span-8 flex flex-col gap-12">
              <section className="dashboard-card">
                 <h2 className="text-2xl font-black font-display mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                    Mission Brief
                 </h2>
                 <p className="text-on-surface-variant text-lg leading-relaxed font-medium whitespace-pre-wrap">
                   {campaign.description}
                 </p>
              </section>

              <section>
                 <h2 className="text-2xl font-black font-display mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-secondary rounded-full"></div>
                    Requirements Matrix
                 </h2>
                 <div className="grid grid-cols-1 gap-4">
                    {campaign.requirements?.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-6 p-6 bg-surface-container-low border border-outline-variant/5 rounded-[2rem] group transition-all hover:bg-surface-container-high hover:shadow-xl"
                      >
                        <div className="w-10 h-10 bg-on-surface text-background rounded-xl flex items-center justify-center font-black text-xs">
                          0{idx + 1}
                        </div>
                        <span className="text-on-surface font-bold text-lg">{req}</span>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Interaction Panels */}
           <div className="lg:col-span-4 flex flex-col gap-8">
              {!user ? (
                <div className="dashboard-card bg-linear-to-tr from-on-surface to-surface-container-highest text-background border-none shadow-2xl">
                   <h3 className="text-2xl font-black font-display mb-4 tracking-tighter">Initiate Collaboration</h3>
                   <p className="text-background/60 text-sm font-medium leading-relaxed mb-8">
                     Authenticate to explore full campaign intelligence and start a professional dialogue with the brand.
                   </p>
                   <Link to="/login" className="w-full py-5 rounded-2xl bg-secondary text-white font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all text-center flex items-center justify-center gap-3">
                      Access Marketplace <ArrowRight size={18} />
                   </Link>
                </div>
              ) : user.role === 'creator' ? (
                <div className="dashboard-card sticky top-32 bg-linear-to-tr from-primary/10 to-transparent border-primary/20 animate-reveal-up">
                   <h3 className="text-2xl font-black font-display mb-6 tracking-tight flex items-center gap-2">
                     Apply for Mission <Zap size={20} className="text-primary" />
                   </h3>
                   <form onSubmit={handleApply} className="flex flex-col gap-6">
                      <textarea
                        placeholder="Detail your strategic fit, engagement metrics, and proposed execution... "
                        value={applyMessage}
                        onChange={(e) => setApplyMessage(e.target.value)}
                        className="w-full h-48 p-6 bg-surface-container-low border border-outline-variant/10 rounded-[2rem] outline-none focus:ring-2 focus:ring-primary/30 font-medium text-on-surface placeholder:text-on-surface-variant/30 transition-all"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-5 rounded-2xl bg-on-surface text-background font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl group active:scale-95"
                      >
                        <Send size={18} className="transition-transform group-hover:translate-x-1" />
                        Dispatch Application
                      </button>
                      
                      {status.text && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-reveal-up ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-error/10 text-error'}`}>
                          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                          {status.text}
                        </div>
                      )}
                   </form>
                </div>
              ) : user.role === 'brand' && campaign.brandId?._id === user.profileId ? (
                <div className="flex flex-col gap-8">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black font-display flex items-center gap-3">
                         Talent Pipeline 
                         <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full text-xs">
                           {applications.length}
                         </span>
                      </h3>
                   </div>
                   
                   <div className="flex flex-col gap-6">
                      {applications.length > 0 ? (
                        applications.map((app) => (
                          <div key={app._id} className="dashboard-card group hover:border-primary/30 transition-all p-6">
                            <div className="flex justify-between items-start mb-6">
                              <Link to={`/creators/${app.creatorId?._id}`} className="flex items-center gap-4 group/talent">
                                <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center font-black text-primary border border-outline-variant/10 shadow-inner group-hover/talent:scale-105 transition-transform overflow-hidden">
                                  {app.creatorId?.profilePicture ? (
                                    <img src={app.creatorId.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={20} />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-black text-on-surface group-hover/talent:text-primary transition-colors">
                                    {app.creatorId?.name || "Premium Talent"}
                                  </h4>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">
                                    {app.status}
                                  </span>
                                </div>
                              </Link>
                              <Link to={`/creators/${app.creatorId?._id}`} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                                 <ArrowUpRight size={18} />
                              </Link>
                            </div>
                            
                            <p className="text-on-surface-variant text-sm font-medium leading-relaxed italic mb-8 pl-4 border-l-2 border-primary/20">
                              "{app.message}"
                            </p>

                            {app.status === "pending" && (
                              <div className="grid grid-cols-2 gap-4">
                                <button
                                  onClick={() => updateAppStatus(app._id, "accepted")}
                                  className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/10"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateAppStatus(app._id, "rejected")}
                                  className="flex items-center justify-center gap-2 bg-surface-container-highest text-on-surface-variant py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-error hover:text-white transition-all shadow-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="dashboard-card border-dashed flex flex-col items-center justify-center py-16 gap-4 text-center opacity-50">
                           <Briefcase size={40} className="text-on-surface-variant/20" />
                           <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Pipeline Empty</p>
                        </div>
                      )}
                   </div>
                </div>
              ) : null}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
