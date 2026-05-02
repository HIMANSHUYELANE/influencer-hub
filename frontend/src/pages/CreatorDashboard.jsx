import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  User,
  Briefcase,
  Search,
  Save,
  CheckCircle,
  Clock,
  LayoutDashboard,
  TrendingUp,
  Compass,
  Plus,
  CircleDollarSign,
  Users,
  Folder,
  MessageSquare,
  ArrowUpRight,
  Edit3,
  Target,
  Building2,
  MapPin,
} from "lucide-react";
import { Instagram, Youtube } from "../components/SocialIcons";
import DashboardLayout from "../components/DashboardLayout";
import DealManager from "../components/DealManager";
import CampaignCard from "../components/CampaignCard";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    bio: "",
    location: "",
    niche: "Tech",
    expertise: [],
    portfolioLink: "",
    pricing: {
      basic: { price: 0, description: "" },
      standard: { price: 0, description: "" },
      premium: { price: 0, description: "" },
    },
    followerCount: 0,
    responseTime: "< 24h",
  });
  const [applications, setApplications] = useState([]);
  const [deals, setDeals] = useState([]);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filterType, setFilterType] = useState('action_required'); // Default to action required

  const fetchData = async () => {
    try {
      const [profileRes, appsRes, campaignsRes, dealsRes] = await Promise.all([
        axios.get("/creators/me"),
        axios.get("/applications/creator"),
        axios.get("/campaigns"),
        axios.get("/deals/user"),
      ]);
      if (profileRes.data) {
        setProfile(prev => ({
          ...prev,
          ...profileRes.data,
          pricing: {
            ...prev.pricing,
            ...(profileRes.data.pricing || {})
          }
        }));
      }
      setApplications(appsRes.data);
      setAvailableCampaigns(campaignsRes.data.slice(0, 6));
      setDeals(dealsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
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
      const res = await axios.post("/creators/profile", profile);
      setProfile(prev => ({
        ...prev,
        ...res.data,
        pricing: {
          ...prev.pricing,
          ...(res.data.pricing || {})
        }
      }));
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile." });
    }
  };

  const updateSocialLink = (platform, handle) => {
    const newLinks = [...profile.socialLinks];
    const index = newLinks.findIndex((l) => l.platform === platform);
    if (index > -1) {
      newLinks[index].handle = handle;
    } else {
      newLinks.push({ platform, handle, url: "" });
    }
    setProfile({ ...profile, socialLinks: newLinks });
  };

  const getSocialHandle = (platform) => {
    const link = profile.socialLinks.find((l) => l.platform === platform);
    return link ? link.handle : "";
  };

  const confirmApplication = async (appId, currentStatus) => {
    try {
      if (currentStatus !== "confirmed_by_creator") {
        await axios.put(`/applications/${appId}/status`, {
          status: "confirmed_by_creator",
        });
      }
      await axios.post("/deals", { applicationId: appId });
      await fetchData();
      setMessage({
        type: "success",
        text: "Application confirmed! Deal started.",
      });
      setActiveTab("deals");
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Error confirming application." });
    }
  };

  const sidebarItems = [
    {
      id: "overview",
      label: "My Profile",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "applied",
      label: "Applied Campaigns",
      icon: <Briefcase size={20} />,
    },
    {
      id: "deals",
      label: "Active Deals",
      icon: <CircleDollarSign size={20} />,
    },
    {
      id: "browse",
      label: "Browse New Campaigns",
      icon: <Compass size={20} />,
    },
    { id: "edit", label: "Edit Profile", icon: <Save size={20} /> },
  ];

  if (loading)
    return (
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
      <div className="mb-12 flex">
        <div className="mx-7 border-2 border-gray-500 p-1 rounded-full">
          <img
            className="rounded-full h-35"
            src={profile.profilePicture}
            alt="Profile picture"
          />
        </div>
        <div className="self-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="w-1 h-1 rounded-full bg-secondary" />
                <span>Verified Talent</span>
              </div>
              <Link 
                to={`/creators/${profile._id}`} 
                className="flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary hover:scale-105 text-white transition-all"
              >
                View Public Profile <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
          <h1 className="text-5xl font-black font-display text-on-surface tracking-tighter mb-2">
            {profile.name || user.email.split('@')[0]}
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            {profile.bio ||
              "Content Creator & Storyteller exploring high-impact brand collaborations."}
          </p>
        </div>
      </div>
      {message.text && (
        <div
          className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg animate-reveal-up ${
            message.type === "success"
              ? "bg-primary text-on-primary"
              : "bg-error text-on-error"
          }`}
        >
          <CheckCircle size={20} /> {message.text}
        </div>
      )}
      {/* VIEWS */}
      {activeTab === "overview" && (
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
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Active Applications
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-on-surface">
                    {applications.length}
                  </span>
                  <span className="trend-up">
                    <ArrowUpRight size={14} />{" "}
                    {applications.filter((a) => a.status === "pending").length}{" "}
                    pending
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-metric-card bg-surface-container">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Users size={24} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Total Audience
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-on-surface">
                    {profile.followerCount >= 1000
                      ? (profile.followerCount / 1000).toFixed(1) + "K"
                      : profile.followerCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-metric-card bg-surface-container">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 flex items-center justify-center text-accent-teal">
                  <MessageSquare size={24} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Avg. Response Time
                </p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-on-surface">
                    {profile.responseTime || "< 24h"}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mt-1">
                  Top 10% of creators
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* CURATED BIO */}
              <div className="dashboard-card bg-surface-container relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-xl font-black font-display text-on-surface mb-2 tracking-tight">
                    Professional DNA
                  </h3>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
                  >
                    <Edit3 size={20} />
                  </button>
                </div>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                  {profile.bio ||
                    "I build digital experiences and break down complex concepts for a community of brands and creators."}
                </p>
                <div className="flex flex-wrap gap-3">
                  {profile.expertise?.length > 0 ? (
                    profile.expertise.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-surface-container-highest rounded-full text-xs font-bold text-on-surface">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-surface-container-highest rounded-full text-xs font-bold opacity-50 italic">No expertise specified</span>
                  )}
                  <span className="px-3 py-1 bg-secondary/10 text-secondary border-secondary/20 rounded-full text-xs font-bold">
                    {profile.niche} Expert
                  </span>
                </div>
              </div>
              
              {/* SERVICE OFFERINGS SUMMARY */}
              <div className="dashboard-card bg-surface-container">
                <h3 className="text-xl font-black font-display text-on-surface mb-2 tracking-tight">
                  Service Packages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['basic', 'standard', 'premium'].map((tier) => (
                    <div key={tier} className="p-5 rounded-2xl bg-surface-container-high/50 border border-outline-variant/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 mb-3">{tier}</p>
                      <p className="text-2xl font-black text-on-surface mb-2">₹{profile.pricing?.[tier]?.price || 0}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant leading-tight line-clamp-2">
                        {profile.pricing?.[tier]?.description || 'No description provided'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT COLLABORATIONS (ACTIVE DEALS) */}
              <div className="dashboard-card bg-surface-container">
                <h3 className="text-2xl font-black text-on-surface tracking-tight mb-8">
                  Recent Collaborations
                </h3>
                <div className="flex flex-col gap-4">
                  {deals.length > 0 ? (
                    deals.slice(0, 3).map((deal) => (
                      <div
                        key={deal._id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest transition-all border border-outline-variant/10 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-secondary">
                            {deal.applicationId?.campaignId?.brandId?.logo ? (
                              <img
                                src={
                                  deal.applicationId?.campaignId?.brandId?.logo
                                }
                                alt="Brand"
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <Building2 size={24} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                              {deal.applicationId?.campaignId?.title}
                            </h4>
                            <p className="text-xs text-on-surface-variant">
                              Active Campaign •{" "}
                              {new Date(deal.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-secondary uppercase tracking-widest">
                            Active
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-medium">
                            In Progress
                          </p>
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
              <div className="dashboard-card bg-surface-container flex flex-col items-center text-center">
                <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-10 w-full text-left">
                  Profile Strength
                </h3>

                <div className="relative w-40 h-40 mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-surface-container-highest"
                      fill="transparent"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-primary"
                      fill="transparent"
                      strokeWidth="12"
                      strokeDasharray={440}
                      strokeDashoffset={
                        440 - (440 * (profile.bio ? 75 : 25)) / 100
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-on-surface">
                      {profile.bio ? 75 : 25}%
                    </span>
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
                  onClick={() => setActiveTab("edit")}
                  className="w-full py-4 rounded-2xl bg-surface-container-highest text-on-surface font-black hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 group"
                >
                  Complete Profile{" "}
                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {activeTab === "applied" && (
        <div className="flex flex-col gap-6">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div
                key={app._id}
                className="dashboard-card bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-x-1 border border-outline-variant/10"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border bg-surface-container-highest text-on-surface`}
                  >
                    {app.campaignId?.title?.[0] || "C"}
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-on-surface tracking-tight">
                      {app.campaignId?.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-outline-variant/10`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant/50">
                        Applied on{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {(app.status === "accepted" ||
                    app.status === "confirmed_by_creator") &&
                    !deals.some(
                      (d) =>
                        d.applicationId?._id === app._id ||
                        d.applicationId === app._id,
                    ) && (
                      <button
                        onClick={() => confirmApplication(app._id, app.status)}
                        className="bg-primary text-black px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
                      >
                        {app.status === "confirmed_by_creator"
                          ? "Retry Starting Deal"
                          : "Confirm & Start Deal"}{" "}
                        <CheckCircle size={18} />
                      </button>
                    )}
                  <Link
                    to={`/campaigns/${app.campaignId?._id}`}
                    className="px-6 py-3.5 rounded-2xl bg-surface-container-highest text-on-surface font-black text-sm border border-outline-variant/10 hover:bg-white hover:text-black transition-all"
                  >
                    View Campaign
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="dashboard-card bg-surface-container border-dashed border-2 border-outline-variant/20 text-center py-24 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant/20">
                <Clock size={40} />
              </div>
              <div>
                <p className="text-on-surface-variant font-black text-xl mb-2">
                  No applications yet.
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="text-secondary font-black hover:underline uppercase text-xs tracking-[0.2em] flex items-center gap-2 mx-auto"
                >
                  Explore Campaigns <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === "deals" && (
        <div className="flex flex-col gap-8">
          {/* Deal Filters */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-container rounded-2xl w-fit border border-outline-variant/10">
            {['action_required', 'all', 'campaign', 'package', 'in_progress', 'done'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterType === type 
                  ? 'bg-primary text-black' 
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {type === 'action_required' ? '⚠️ Action Required' : 
                 type === 'all' ? 'All' : 
                 type === 'campaign' ? 'Campaigns' : 
                 type === 'package' ? 'Packages' :
                 type === 'in_progress' ? 'In Progress' : 'Done'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {(() => {
              // 1. Sort a copy of the deals (Most recent on top)
              const sortedDeals = [...deals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              
              // 2. Apply current filter
              const filteredDeals = sortedDeals.filter(d => {
                const isCreatorAction = d.status === 'in_progress' || d.status === 'revision_requested';
                if (filterType === 'action_required') return isCreatorAction;
                if (filterType === 'package') return d.originType === 'package';
                if (filterType === 'campaign') return d.originType !== 'package';
                if (filterType === 'in_progress') return ['in_progress', 'in_review', 'revision_requested'].includes(d.status);
                if (filterType === 'done') return d.status === 'completed';
                return true; // 'all'
              });

              if (filteredDeals.length === 0) {
                return (
                  <div className="dashboard-card bg-surface-container border-dashed border-2 border-outline-variant/20 text-center py-24 flex flex-col items-center gap-6 animate-reveal-up">
                    <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant/20">
                      <CircleDollarSign size={40} />
                    </div>
                    <div>
                      <p className="text-on-surface-variant font-black text-xl mb-2">
                        No {filterType.replace('_', ' ')} deals found.
                      </p>
                      <p className="text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest">
                        Try switching filters or wait for new collaborations
                      </p>
                    </div>
                  </div>
                );
              }

              return filteredDeals.map((deal) => (
                <div key={deal._id} className="relative">
                  {(deal.status === 'in_progress' || deal.status === 'revision_requested') && (
                    <div className="absolute -top-3 left-6 z-10 px-3 py-1 bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl border-2 border-surface">
                      Action Required
                    </div>
                  )}
                  <DealManager deal={deal} onUpdate={fetchData} />
                </div>
              ));
            })()}
          </div>
        </div>
      )}
      {activeTab === "browse" && (
        <div className="flex flex-col gap-10">
          <div className="dashboard-card p-6! flex justify-between items-center bg-surface-container">
            <div className="flex items-center gap-5 grow px-4">
              <Search className="text-on-surface-variant" size={24} />
              <input
                type="text"
                placeholder="Search for opportunities..."
                className="w-full bg-transparent text-lg font-bold text-on-surface outline-none placeholder:text-on-surface-variant/30"
              />
            </div>
            <Link
              to="/campaigns"
              className="px-8 py-3 rounded-xl bg-secondary text-black font-black text-sm hover:scale-105 transition-transform flex items-center gap-2"
            >
              Full Marketplace <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {availableCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}
      {activeTab === "edit" && (
        <div className="max-w-4xl">
          <div className="dashboard-card bg-surface-container">
            <h3 className="text-3xl font-black mb-6 tracking-tighter text-on-surface">
              Creative Portfolio Settings
            </h3>

            {/* Avatar Upload Section */}
            <div className="flex items-center gap-8 pb-5 border-b border-outline-variant/10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-highest border-4 border-surface shadow-lg flex items-center justify-center relative">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Avatar"
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <User
                      size={56}
                      className="text-on-surface-variant/40 relative z-10"
                    />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 font-black text-xs z-20">
                  CHANGE IMAGE
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files[0]) return;
                      const formData = new FormData();
                      formData.append("profilePicture", e.target.files[0]);
                      try {
                        const res = await axios.post(
                          "/creators/avatar",
                          formData,
                          {
                            headers: { "Content-Type": "multipart/form-data" },
                          },
                        );
                        setProfile((prev) => ({
                          ...prev,
                          profilePicture: res.data.profilePicture,
                        }));
                        setMessage({
                          type: "success",
                          text: "Avatar updated!",
                        });
                        setTimeout(
                          () => setMessage({ type: "", text: "" }),
                          3000,
                        );
                      } catch (err) {
                        setMessage({
                          type: "error",
                          text: "Avatar upload failed.",
                        });
                        console.error(err);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-2xl text-on-surface mb-1 uppercase tracking-tight">
                  Identity Image
                </h4>
                <p className="text-on-surface-variant font-medium">
                  Resolution 400x400 recommended. High quality PNG/JPG.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleProfileUpdate}
              className="flex flex-col gap-7 pt-6"
            >
              {/* Section 1: Professional Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5 rounded-4xl bg-surface-container-high/50 border border-outline-variant/10 ">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-secondary rounded-full" /> 01.
                    Professional Identity
                  </h4>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Display Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface"
                    placeholder="e.g. Content King"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Primary Niche</label>
                  <select
                    value={profile.niche}
                    onChange={(e) =>
                      setProfile({ ...profile, niche: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({ ...profile, age: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface"
                    placeholder="e.g. 25"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Base Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface"
                    placeholder="e.g. Mumbai, India"
                  />
                </div>
              </div>

              {/* Section 2: Expertise & Portfolio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5 rounded-4xl bg-surface-container-high/50 border border-outline-variant/10 ">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" /> 02.
                    Expertise & Portfolio
                  </h4>
                </div>

                <div className="md:col-span-2 flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Skillset / Expertise</label>
                  <div className="flex flex-wrap gap-4">
                    {["Editing", "Shooting", "Scripting", "All"].map(
                      (skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            const current = profile.expertise || [];
                            const next = current.includes(skill)
                              ? current.filter((s) => s !== skill)
                              : [...current, skill];
                            setProfile({ ...profile, expertise: next });
                          }}
                          className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                            profile.expertise?.includes(skill)
                              ? "bg-primary text-black border-primary"
                              : "bg-surface-container-highest text-on-surface-variant border-outline-variant/10"
                          }`}
                        >
                          {skill}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">
                    Work Portfolio (Google Drive / Link)
                  </label>
                  <input
                    type="url"
                    value={profile.portfolioLink}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, portfolioLink: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Creator Biography</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface min-h-32"
                    placeholder="Describe your creative style..."
                  />
                </div>
              </div>

              {/* Section 3: Pricing Console */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5 rounded-4xl bg-surface-container-high/50 border border-outline-variant/10 ">
                <div className="md:col-span-3">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" /> 03.
                    Pricing Console
                  </h4>
                </div>

                {["basic", "standard", "premium"].map((tier) => (
                  <div
                    key={tier}
                    className="flex flex-col gap-6 p-6 rounded-3xl bg-surface-container-highest border border-outline-variant/10"
                  >
                    <h5 className="font-black text-xs uppercase tracking-widest text-on-surface-variant">
                      {tier} Tier
                    </h5>
                    <div className="flex flex-col gap-3">
                      <label className="text-[8px] font-black uppercase text-on-surface-variant opacity-50">
                        Price (INR)
                      </label>
                      <input
                        type="number"
                        value={profile.pricing?.[tier]?.price}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              [tier]: {
                                ...prev.pricing[tier],
                                price: parseInt(e.target.value) || 0,
                              },
                            },
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/10 text-sm"
                        placeholder="₹ 0"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[8px] font-black uppercase text-on-surface-variant opacity-50">
                        Deliverables
                      </label>
                      <textarea
                        value={profile.pricing?.[tier]?.description}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              [tier]: {
                                ...prev.pricing[tier],
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/10 text-xs min-h-24"
                        placeholder="What's included?"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 4: Reach & Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5 rounded-4xl bg-surface-container-high/50 border border-outline-variant/10 ">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent-teal rounded-full" />{" "}
                    04. Reach & Response
                  </h4>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Total Audience</label>
                  <input
                    type="number"
                    value={profile.followerCount}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        followerCount: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Avg Response Time</label>
                  <input
                    type="text"
                    value={profile.responseTime}
                    onChange={(e) =>
                      setProfile({ ...profile, responseTime: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-highest border border-outline-variant/10 text-on-surface"
                    placeholder="e.g. < 2h"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-4 rounded-4xl bg-primary text-black font-black text-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 group"
              >
                <Save
                  size={28}
                  className="group-hover:rotate-12 transition-transform"
                />{" "}
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreatorDashboard;
