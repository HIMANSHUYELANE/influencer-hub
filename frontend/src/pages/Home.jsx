import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LottieComponent from "lottie-react";
const Lottie = LottieComponent.default || LottieComponent;
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { PlayCircle, BadgeCheck, FilePlus, Users, ClipboardCheck, TrendingUp, ArrowRight, ChevronRight, User, Building2, Globe, Share2, Mail, Target, Zap, Search, ShieldCheck } from "lucide-react";
import { Instagram, Twitter, Facebook, Youtube as YoutubeIcon } from "../components/SocialIcons";

import animationCreator from "../assets/creator.json";
import axios from "../utils/axios";

// Retain framer-motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: (i = 0) => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    return {
      opacity: 0,
      x: isDesktop ? (i === 0 ? "154%" : i === 1 ? "52%" : i === 2 ? "-52%" : "-154%") : 0,
      y: isDesktop ? 80 : 40,
      scale: isDesktop ? 0.5 : 0.8,
      rotate: isDesktop ? (i - 1.5) * 8 : 0,
      zIndex: 10 - i,
    };
  },
  visible: (i = 0) => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    return {
      opacity: isDesktop ? [0, 1, 1] : 1,
      x: isDesktop ? [i === 0 ? "154%" : i === 1 ? "52%" : i === 2 ? "-52%" : "-154%", 0, 0] : 0,
      y: isDesktop ? [80, 80, 0] : 0,
      scale: isDesktop ? [0.5, 0.5, 1] : 1,
      rotate: isDesktop ? [(i - 1.5) * 8, 0, 0] : 0,
      zIndex: isDesktop ? [10 - i, 10 - i, 1] : 1,
      transition: {
        duration: 0.7,
        times: [0, 0.4, 1],
        ease: "easeInOut",
      },
    };
  },
};

const campaignVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 70 },
  }),
};

const performerVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 50 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.1, stiffness: 100 },
  }),
};

const stepContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.3 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const Home = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [featuredCreators, setFeaturedCreators] = useState([]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const campaignRes = await axios.get("/campaigns");
        const creatorRes = await axios.get("/creators");
        setFeaturedCampaigns(campaignRes.data.slice(0, 3));
        setFeaturedCreators(creatorRes.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured content", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-theme bg-background text-on-surface transition-colors duration-300">
      <main className="">
        {/* Hero Section */}
        <section 
          onMouseMove={handleMouseMove}
          className="relative px-8 py-20 lg:py-32 min-h-[90vh] flex items-center justify-center overflow-hidden bg-grid-glow group"
        >
          {/* Cursor Glow Spotlight */}
          <div className="cursor-glow" />

          {/* Floating Elements Container */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Floating Items */}
            <div className="absolute top-[10%] h-20      left-[10%] animate-float-boat" style={{ animationDelay: '0s' }}>
              <img src="1-hero.png" className="w-20 h-20 lg:w-full lg:h-32  border-4 border-primary shadow-[8px_8px_0px_0px_rgba(191,0,255,0.5)] object-cover" alt="" />
            </div>
            <div className="absolute top-[20%] right-[12%] animate-float-boat" style={{ animationDelay: '1.5s' }}>
              <div className="p-4 lg:p-6 rounded-full bg-surface-container-highest border-2 border-secondary shadow-[6px_6px_0px_0px_rgba(204,255,0,0.5)] flex items-center justify-center">
                <Instagram className="w-6 h-6 lg:w-10 lg:h-10 text-secondary" />
              </div>
            </div>
            <div className="absolute h-28 bottom-[10%] right-[15%] animate-float-boat" style={{ animationDelay: '0.8s' }}>
              <img src="3-hero.png" className="w-16 h-16 lg:w-full lg:h-full border-4 border-secondary shadow-[6px_6px_0px_0px_rgba(204,255,0,0.5)] object-cover" alt="" />
            </div>
            <div className="absolute top-[45%] left-[5%] animate-float-boat" style={{ animationDelay: '3.2s' }}>
              <div className="p-3 lg:p-5 rounded-full bg-surface-container-highest border-2 border-primary shadow-[5px_5px_0px_0px_rgba(191,0,255,0.5)] flex items-center justify-center">
                <YoutubeIcon className="w-5 h-5 lg:w-8 lg:h-8 text-red-500" />
              </div>
            </div>
            <div className="absolute bottom-[40%] right-[5%] animate-float-boat" style={{ animationDelay: '4s' }}>
              <div className="p-3 lg:p-5 rounded-full bg-surface-container-highest border-2 border-secondary shadow-[5px_5px_0px_0px_rgba(204,255,0,0.5)] flex items-center justify-center">
                <Twitter className="w-5 h-5 lg:w-8 lg:h-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container-high text-secondary text-xs font-bold tracking-widest uppercase mb-6">
                Premium Creator Network
              </span>
              <h1 className="text-5xl lg:text-[5.3rem] font-black font-headline tracking-tighter leading-none text-on-surface mb-8">
                Hire <span className="text-primary">Creators</span> <br />
                To Promote Your <br />
                <TypeAnimation
                  sequence={[
                    "Brand",
                    2500,
                    "Vision",
                    2500,
                    "Product",
                    2500,
                  ]}
                  wrapper="span"
                  speed={15}
                  repeat={Infinity}
                  className="inline-block text-secondary"
                />
              </h1>
             
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/register"
                  className="btn-primary px-10 py-4 text-md"
                >
                  Start Free 30 Days Trial
                </Link>
                <Link
                  to="/how-it-works"
                  className="btn-secondary px-10 py-4 text-md flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-6 h-6" />{" "}
                  How It Works?
                </Link>
              </div>

              {/* Trustpilot Placeholder */}
              <div className="mt-16 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <BadgeCheck className="w-6 h-6" />
                  <span>Trustpilot</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <span className="text-on-surface-variant text-sm font-bold">10000+ 5 Stars</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brutalist Marquee */}
        <div className="marquee-container my-10 -rotate-1 relative z-20">
          <div className="flex animate-marquee">
            <div className="marquee-content px-4">
              Premium Talent &bull; Global Missions &bull; Secure Escrow &bull; High-Impact Content &bull; Verified Creators &bull; Editorial Precision &bull;&nbsp;
            </div>
            <div className="marquee-content px-4">
              Premium Talent &bull; Global Missions &bull; Secure Escrow &bull; High-Impact Content &bull; Verified Creators &bull; Editorial Precision &bull;&nbsp;
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <section className="bg-surface-container mx-8 lg:mx-20 rounded-3xl border-2 border-primary/20 shadow-[15px_15px_0px_0px_rgba(204,255,0,0.05)]">
          <div className="mx-auto py-12 lg:py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 text-center divide-x-2 divide-primary/10">
              <div className="flex flex-col gap-2 p-4">
                <span className="text-4xl lg:text-5xl font-black font-headline text-primary tracking-tighter">
                  2,400+
                </span>
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">
                  Creators
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <span className="text-4xl lg:text-5xl font-black font-headline text-secondary tracking-tighter">
                  850+
                </span>
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">
                  Campaigns
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <span className="text-4xl lg:text-5xl font-black font-headline text-primary tracking-tighter">
                  ₹12Cr+
                </span>
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">
                  Deals
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <span className="text-4xl lg:text-5xl font-black font-headline text-secondary tracking-tighter">
                  98%
                </span>
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">
                  Satisfaction
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Bento Grid) */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold font-headline text-on-surface mb-4">
                Streamlined Collaboration
              </h2>
              <p className="text-on-surface-variant text-lg">
                Four steps to launch your most impactful brand campaign yet.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                custom={0}
                variants={cardVariants}
                className="bg-surface-container p-8 rounded-2xl hover:bg-surface-container-high transition-all group origin-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <FilePlus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-headline text-on-surface mb-3">
                  Brands Post
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Define your niche, budget, and creative requirements in
                  minutes.
                </p>
              </motion.div>
              <motion.div
                custom={1}
                variants={cardVariants}
                className="bg-surface-container-high p-8 rounded-2xl hover:bg-surface-container-highest transition-all group lg:mt-8 origin-center"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-headline text-on-surface mb-3">
                  Creators Apply
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Our hand-picked creator network applies with personalized
                  pitches.
                </p>
              </motion.div>
              <motion.div
                custom={2}
                variants={cardVariants}
                className="bg-surface-container p-8 rounded-2xl hover:bg-surface-container-high transition-all group origin-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-headline text-on-surface mb-3">
                  2-Step Approval
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Review profiles and analytics before finalizing your dream
                  team.
                </p>
              </motion.div>
              <motion.div
                custom={3}
                variants={cardVariants}
                className="bg-surface-container-high p-8 rounded-2xl hover:bg-surface-container-highest transition-all group lg:mt-8 origin-center"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-headline text-on-surface mb-3">
                  Collaborate &amp; Grow
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Scale your brand through authentic content and tracked
                  performance.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Campaigns */}
        <section className="py-24 px-8 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-secondary text-xs font-black tracking-[0.3em] uppercase mb-4 block">Marketplace Hub</span>
                <h2 className="text-5xl lg:text-7xl font-black font-headline text-on-surface leading-none tracking-tighter">
                  Trending <br /> <span className="text-primary">Campaigns</span>
                </h2>
              </div>
              <Link
                to="/campaigns"
                className="group flex items-center gap-4 bg-surface-container px-8 py-4 rounded-2xl border-2 border-primary/20 hover:border-primary transition-all shadow-[8px_8px_0px_0px_rgba(204,255,0,0.1)]"
              >
                <span className="font-black uppercase tracking-widest text-sm">View All Missions</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-primary" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featuredCampaigns.length > 0 ? (
                featuredCampaigns.map((campaign, i) => (
                  <motion.div
                    key={campaign._id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={campaignVariants}
                    className="group"
                  >
                    <div className="bg-surface-container rounded-[2.5rem] overflow-hidden border-2 border-outline-variant/10 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(191,0,255,0.1)] hover:border-secondary transition-all h-full flex flex-col">
                      <div className="h-56 relative bg-surface-container-high overflow-hidden">
                        <div className="absolute top-6 right-6 z-10">
                          <span className="bg-primary text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 border-black">
                            Priority
                          </span>
                        </div>
                        <div className="w-full h-full flex items-center justify-center bg-grid-glow/20">
                          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center font-black text-secondary text-3xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border-2 border-black/5">
                            {campaign.brandId?.logo ? (
                              <img src={campaign.brandId.logo} alt="Logo" className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                              campaign.brandId?.businessName?.[0] || "C"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-3 py-1 rounded-lg">
                            {campaign.niche || "General"}
                          </span>
                          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            {campaign.status}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black font-headline text-on-surface mb-3 group-hover:text-secondary transition-colors">
                          {campaign.title}
                        </h3>
                        <p className="text-on-surface-variant font-medium leading-relaxed mb-8 line-clamp-2">
                          {campaign.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant/10">
                          <div>
                            <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mb-1">Budget Allocation</p>
                            <p className="text-xl font-black text-on-surface font-headline">
                              ₹{campaign.budget?.toLocaleString()}
                            </p>
                          </div>
                          <Link
                            to={`/campaigns/${campaign._id}`}
                            className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-md group/btn"
                          >
                            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 bg-surface-container rounded-3xl text-center py-20 border-4 border-dashed border-outline-variant/20">
                  <p className="text-on-surface-variant font-bold text-xl mb-4">No active missions available</p>
                  <Link to="/register" className="text-secondary font-black hover:underline tracking-widest uppercase text-sm">Post the first one →</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Top Performers */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-headline text-on-surface mb-4">
                Top Performers
              </h2>
              <p className="text-on-surface-variant text-lg">
                Meet the creators setting new standards for brand storytelling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCreators.length > 0 ? (
                featuredCreators.map((creator, i) => (
                  <motion.div
                    key={creator._id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={performerVariants}
                    className="bg-surface-container p-6 rounded-3xl text-center group hover:bg-surface-container-high transition-all"
                  >
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      {creator.profilePicture ? (
                        <img
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-full p-1 ring-2 ring-secondary/30 group-hover:ring-secondary transition-all"
                          src={creator.profilePicture}
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-dim rounded-full flex items-center justify-center text-4xl p-1 ring-2 ring-secondary/30">
                          👤
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-surface-container-high p-1 rounded-full shadow-sm text-green-400">
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-on-surface font-headline">
                      {creator.name}
                    </h4>
                    <p className="text-xs text-secondary font-bold uppercase tracking-widest mb-6">
                      {creator.niche}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="bg-surface-container-low py-2 rounded-xl">
                        <p className="text-[10px] text-on-surface-variant uppercase">
                          Response
                        </p>
                        <p className="text-sm font-mono font-bold text-on-surface">
                          {creator.responseTime || "< 24H"}
                        </p>
                      </div>
                      <div className="bg-surface-container-low py-2 rounded-xl">
                        <p className="text-[10px] text-on-surface-variant uppercase">
                          Followers
                        </p>
                        <p className="text-sm font-mono font-bold text-on-surface">
                          {creator.followerCount >= 1000
                            ? (creator.followerCount / 1000).toFixed(1) + "K"
                            : creator.followerCount || 0}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/creators/${creator._id}`}
                      className="w-full py-3 rounded-xl bg-surface-container-highest text-on-surface font-bold text-sm flex justify-center hover:bg-primary hover:text-on-primary transition-all"
                    >
                      View Profile
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-4 card text-center py-12 text-on-surface-variant bg-surface-container">
                  No creators registered yet —{" "}
                  <Link
                    to="/register"
                    className="text-secondary font-bold hover:underline"
                  >
                    join as a creator
                  </Link>
                  .
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Operation Protocol (Redesign) */}
        <section className="py-24 px-8 bg-background border-t-2 border-outline-variant/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
              <div className="lg:w-1/2">
                <span className="text-secondary text-xs font-black tracking-[0.4em] uppercase mb-6 block">
                  Workflow Protocol
                </span>
                <h2 className="text-6xl lg:text-[6.5rem] font-black font-headline text-on-surface leading-none tracking-tighter">
                  Two sides. <br />
                  <span className="text-primary">One platform.</span>
                </h2>
              </div>
              <div className="lg:w-5/12 pt-12 border-l-8 border-primary/20 pl-10">
                <p className="text-on-surface-variant text-2xl leading-relaxed font-bold italic">
                  Whether you're a creator scaling your influence or a brand 
                  building a legacy — we provide the secure infrastructure 
                  for high-impact collaboration.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* For Creators */}
              <div className="space-y-12">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-3 h-12 bg-primary rounded-full shadow-[0_0_15px_rgba(204,255,0,0.3)]"></div>
                  <h3 className="text-4xl font-black font-headline text-on-surface uppercase tracking-tight">For Creators</h3>
                </div>
                
                <div className="grid gap-10">
                  <motion.div 
                    whileHover={{ y: -8, x: 5 }}
                    className="relative overflow-hidden bg-surface-container rounded-[2.5rem] p-10 border-2 border-primary/20 shadow-[15px_15px_0px_0px_rgba(204,255,0,0.05)] group hover:border-primary transition-all duration-500"
                  >
                    <span className="absolute top-6 right-12 text-9xl font-black text-primary/10 select-none group-hover:text-primary/20 transition-colors">01</span>
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border-2 border-primary/20 shadow-inner">
                      <User size={38} />
                    </div>
                    <h4 className="text-3xl font-black text-on-surface mb-4 group-hover:text-primary transition-colors">Build your profile</h4>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-bold">
                      Showcase your niche, follower stats, past work, and rate card. Connect networks seamlessly.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -8, x: 5 }}
                    className="relative overflow-hidden bg-surface-container rounded-[2.5rem] p-10 border-2 border-primary/20 shadow-[15px_15px_0px_0px_rgba(204,255,0,0.05)] group hover:border-primary transition-all duration-500"
                  >
                    <span className="absolute top-6 right-12 text-9xl font-black text-primary/10 select-none group-hover:text-primary/20 transition-colors">02</span>
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border-2 border-primary/20 shadow-inner">
                      <Target size={38} />
                    </div>
                    <h4 className="text-3xl font-black text-on-surface mb-4 group-hover:text-primary transition-colors">Browse campaigns</h4>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-bold">
                      Filter by category, budget, and region. Apply to missions that match your unique storytelling style.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -8, x: 5 }}
                    className="relative overflow-hidden bg-surface-container rounded-[2.5rem] p-10 border-2 border-primary/20 shadow-[15px_15px_0px_0px_rgba(204,255,0,0.05)] group hover:border-primary transition-all duration-500"
                  >
                    <span className="absolute top-6 right-12 text-9xl font-black text-primary/10 select-none group-hover:text-primary/20 transition-colors">03</span>
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border-2 border-primary/20 shadow-inner">
                      <Zap size={38} />
                    </div>
                    <h4 className="text-3xl font-black text-on-surface mb-4 group-hover:text-primary transition-colors">Execute & Get Paid</h4>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-bold">
                      Collaborate through our secure dashboard, complete milestones, and receive automated payouts.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* For Brands */}
              <div className="space-y-12 lg:mt-32">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-3 h-12 bg-secondary rounded-full shadow-[0_0_15px_rgba(191,0,255,0.3)]"></div>
                  <h3 className="text-4xl font-black font-headline text-on-surface uppercase tracking-tight">For Brands</h3>
                </div>

                <div className="grid gap-10">
                  <motion.div 
                    whileHover={{ y: -8, x: -5 }}
                    className="relative overflow-hidden bg-surface-container rounded-[2.5rem] p-10 border-2 border-secondary/20 shadow-[15px_15px_0px_0px_rgba(191,0,255,0.05)] group hover:border-secondary transition-all duration-500"
                  >
                    <span className="absolute top-6 right-12 text-9xl font-black text-secondary/10 select-none group-hover:text-secondary/20 transition-colors">01</span>
                    <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 border-2 border-secondary/20 shadow-inner">
                      <Search size={38} />
                    </div>
                    <h4 className="text-3xl font-black text-on-surface mb-4 group-hover:text-secondary transition-colors">Find the right talent</h4>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-bold">
                      Use advanced filters to discover creators that align with your brand values and mission.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -8, x: -5 }}
                    className="relative overflow-hidden bg-surface-container rounded-[2.5rem] p-10 border-2 border-secondary/20 shadow-[15px_15px_0px_0px_rgba(191,0,255,0.05)] group hover:border-secondary transition-all duration-500"
                  >
                    <span className="absolute top-6 right-12 text-9xl font-black text-secondary/10 select-none group-hover:text-secondary/20 transition-colors">02</span>
                    <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 border-2 border-secondary/20 shadow-inner">
                      <ShieldCheck size={38} />
                    </div>
                    <h4 className="text-3xl font-black text-on-surface mb-4 group-hover:text-secondary transition-colors">Set clear milestones</h4>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-bold">
                      Define deliverables and protect your budget with our integrated escrow pipeline.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -8, x: -5 }}
                    className="relative overflow-hidden bg-surface-container rounded-[2.5rem] p-10 border-2 border-secondary/20 shadow-[15px_15px_0px_0px_rgba(191,0,255,0.05)] group hover:border-secondary transition-all duration-500"
                  >
                    <span className="absolute top-6 right-12 text-9xl font-black text-secondary/10 select-none group-hover:text-secondary/20 transition-colors">03</span>
                    <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 border-2 border-secondary/20 shadow-inner">
                      <TrendingUp size={38} />
                    </div>
                    <h4 className="text-3xl font-black text-on-surface mb-4 group-hover:text-secondary transition-colors">Scale with confidence</h4>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-bold">
                      Manage all collaborations in one command center with real-time analytics and tracking.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-8 bg-background relative overflow-hidden">
          {/* Global Glow Backgrounds */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="relative overflow-hidden rounded-[3.5rem] bg-surface-container border-4 border-primary shadow-[20px_20px_0px_0px_rgba(204,255,0,0.1)] p-12 lg:p-20 text-center group transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-10 border border-primary/20">
                  Global Opportunity
                </span>
                <h2 className="text-5xl lg:text-8xl font-black font-headline text-on-surface mb-10 leading-[0.9] tracking-tighter">
                  Scale Your <br /> 
                  <span className="text-secondary group-hover:text-primary transition-colors duration-500">Digital Legacy</span>
                </h2>
                <p className="text-on-surface-variant text-xl lg:text-2xl max-w-2xl mx-auto mb-16 font-bold leading-relaxed opacity-80">
                  Join 850+ forward-thinking brands and thousands of creators 
                  redefining the editorial landscape.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto bg-primary text-black px-12 py-5 rounded-2xl font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
                  >
                    Start Your Campaign
                  </Link>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto bg-surface-container-highest text-on-surface px-12 py-5 rounded-2xl font-black text-xl border-4 border-secondary/30 hover:border-secondary transition-all active:scale-95 shadow-[8px_8px_0px_0px_rgba(191,0,255,0.1)]"
                  >
                    Join Creator Ranks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-12 px-8 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-start gap-6">
            <span className="text-xl font-bold text-on-surface font-headline">
              Editorial Architect
            </span>
            <p className="font-manrope text-sm text-on-surface-variant">
              Empowering the next generation of storytellers through high-impact
              brand collaborations.
            </p>
            <div className="flex items-center gap-4 text-secondary">
              <Globe className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
              <Share2 className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
              <Mail className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/creators"
                  className="text-sm text-on-surface-variant hover:text-secondary transition-colors"
                >
                  Discover Creators
                </Link>
              </li>
              <li>
                <Link
                  to="/campaigns"
                  className="text-sm text-on-surface-variant hover:text-secondary transition-colors"
                >
                  Brand Campaigns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <span className="text-sm text-on-surface-variant hover:text-secondary cursor-pointer transition-colors">
                  Creator Guidelines
                </span>
              </li>
              <li>
                <span className="text-sm text-on-surface-variant hover:text-secondary cursor-pointer transition-colors">
                  Brand Handbook
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <span className="text-sm text-on-surface-variant hover:text-secondary cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-on-surface-variant hover:text-secondary cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-manrope text-sm text-on-surface-variant">
            © 2024 Influencer's Hub. All rights reserved.
          </p>
          <span className="text-xs text-on-surface-variant font-medium">
            Made with precision for the creative economy.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
