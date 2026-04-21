import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LottieComponent from "lottie-react";
const Lottie = LottieComponent.default || LottieComponent;
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { PlayCircle, BadgeCheck, FilePlus, Users, ClipboardCheck, TrendingUp, ArrowRight, ChevronRight, User, Building2, Globe, Share2, Mail } from "lucide-react";

import animationCreator from "../assets/creator.json";
import animationData from "../assets/social.json";
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
        duration: 1.6,
        times: [0, 0.6, 1],
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
    transition: { delay: i * 0.1, type: "spring", stiffness: 150 },
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
    <div className="bg-background text-on-surface transition-colors duration-300">
      <main className="">
        {/* Hero Section */}
        <section className="relative px-8 py-10 lg:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="lg:w-1/2 text-center lg:text-left relative z-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-surface-container-high text-secondary text-xs font-bold tracking-widest uppercase mb-6">
                Premium Creator Network
              </span>
              <h1 className="ext-5xl lg:text-6xl font-extrabold font-headline tracking-tight leading-tightest text-on-surface mb-8">
                Connect with the{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                  Skilled Content Creators
                </span>{" "}
                At Any{" "}<br></br>
                <TypeAnimation
                  sequence={[
                    "Time",
                    2500,
                    "Where",
                    2500,
                    "Moment",
                    2500,
                  ]}
                  wrapper="span"
                  speed={15}
                  repeat={Infinity}
                  className="inline-block min-w-30 text-pink-600"
                />
              </h1>
              <p className="text-on-surface-variant text-md lg:text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                The Digital Atelier for small businesses and D2C brands. We
                curate high-end influencer partnerships that drive authentic
                engagement.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="bg-secondary w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-white text-md shadow-xl shadow-secondary/30 hover:scale-95 transition-all outline-none border-none"
                >
                  Launch Your Campaign
                </Link>
                <Link
                  to="/campaigns"
                  className="bg-surface-container-high w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-on-surface text-md hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />{" "}
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="lg:w-2/5 relative z-20">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-secondary/40 bg-surface-container-low border border-outline-variant/10">
                <img
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover aspect-square md:aspect-video lg:aspect-square opacity-100"
                  src="hero.png"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent"></div>
              </div>

              <div className="absolute animate-bounce -bottom-6 -left-6 opacity-60  bg-black p-6 rounded-2xl shadow-lg shadow-pink-700 border border-outline-variant/20 hidden md:block">
                <div className="flex  items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      Vetted Network
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Top 2% of Global Creators
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 z-0 w-150 h-150 bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </section>

        {/* Stats Banner */}
        <section className="bg-surface-container mx-20 rounded-xl">
          <div className="  mx-auto py-14">
            <div className="grid grid-cols-2 lg:grid-cols-4 text-center ">
              <div className="flex flex-col gap-1  border-r-2 ">
                <span className="text-3xl font-extrabold font-headline text-secondary">
                  2,400+
                </span>
                <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                  Creators
                </span>
              </div>
              <div className="flex flex-col gap-1 border-x-2">
                <span className="text-3xl font-extrabold font-headline text-secondary">
                  850+
                </span>
                <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                  Campaigns
                </span>
              </div>
              <div className="flex flex-col gap-1 border-x-2">
                <span className="text-3xl font-extrabold font-headline text-secondary">
                  ₹12Cr+
                </span>
                <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                  Deals
                </span>
              </div>
              <div className="flex flex-col gap-1 border-l-2">
                <span className="text-3xl font-extrabold font-headline text-secondary">
                  98%
                </span>
                <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
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
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-bold font-headline text-on-surface mb-4">
                  Trending Campaigns
                </h2>
                <p className="text-on-surface-variant text-lg max-w-xl">
                  Explore active opportunities across multiple creative niches.
                </p>
              </div>
              <Link
                to="/campaigns"
                className="text-secondary font-bold flex items-center gap-2 hover:opacity-80 transition-all"
              >
                View All Opportunities{" "}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCampaigns.length > 0 ? (
                featuredCampaigns.map((campaign, i) => (
                  <motion.div
                    key={campaign._id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={campaignVariants}
                  >
                    <div className="bg-surface-container-highest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all h-full">
                      <div className="h-48 relative bg-linear-to-br from-surface-bright to-surface-low p-6 flex flex-col justify-end">
                        <div className="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                          Priority
                        </div>
                        <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center font-bold text-secondary text-2xl mb-2 shadow-lg">
                          {campaign.brandId?.logo ? (
                            <img
                              src={campaign.brandId.logo}
                              alt="Logo"
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : (
                            campaign.brandId?.businessName?.[0] || "C"
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold text-secondary uppercase tracking-tighter bg-secondary/10 px-2 py-0.5 rounded">
                            {campaign.niche || "General"}
                          </span>
                          <span className="text-xs font-mono text-on-surface-variant">
                            {campaign.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold font-headline text-on-surface mb-2">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-on-surface-variant line-clamp-2 mb-6">
                          {campaign.description}
                        </p>
                        <div className="flex items-center justify-between py-4 border-t border-outline-variant/10">
                          <div>
                            <p className="text-[10px] text-on-surface-variant uppercase font-bold">
                              Budget Range
                            </p>
                            <p className="font-bold text-on-surface">
                              ₹{campaign.budget?.toLocaleString()}
                            </p>
                          </div>
                          <Link
                            to={`/campaigns/${campaign._id}`}
                            className="p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary transition-all"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 card text-center py-12 text-on-surface-variant bg-surface-container">
                  No campaigns yet —{" "}
                  <Link
                    to="/register"
                    className="text-secondary font-bold hover:underline"
                  >
                    be the first to post one
                  </Link>
                  .
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

        {/* Two sides. One platform. */}
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
              <div className="lg:w-1/2">
                <span className="text-secondary text-xs font-bold tracking-widest uppercase mb-4 block">
                  How It Works
                </span>
                <h2 className="text-5xl lg:text-7xl font-extrabold font-headline text-on-surface leading-tight">
                  Two sides.
                  <br />
                  One platform.
                </h2>
              </div>
              <div className="lg:w-5/12 pt-8 lg:pt-12">
                <p className="text-on-surface-variant text-xl leading-relaxed">
                  Whether you're a creator looking for paid work or a business
                  searching for the right voice — we make the match simple,
                  transparent, and safe.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <motion.div
                variants={stepContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                className="lg:col-span-6 bg-[#06172b] rounded-[2rem] p-8 lg:p-12 border border-outline-variant/10 lg:mt-12 flex flex-col"
              >
                <motion.div variants={stepVariants} className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface">
                      For Creators
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Micro to rising stars
                    </p>
                  </div>
                </motion.div>
                <div className="space-y-8 flex-grow">
                  <motion.div variants={stepVariants} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-primary border border-outline-variant/20">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        Build your profile
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        Showcase your niche, follower stats, past work, and rate
                        card. Connect networks.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={stepVariants} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-primary border border-outline-variant/20">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        Browse campaigns
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        Filter by category, budget, and region. Apply to
                        campaigns that match your audience.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={stepVariants} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-primary border border-outline-variant/20">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        Collaborate &amp; getting paid
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        Deliver content and receive secure payments directly
                        through the platform.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                variants={stepContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                className="lg:col-span-6 bg-surface-container rounded-[2rem] p-8 lg:p-12 border border-outline-variant/10 lg:mt-12"
              >
                <motion.div variants={stepVariants} className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface">
                      For Businesses
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Startups to mid-size brands
                    </p>
                  </div>
                </motion.div>
                <div className="space-y-8">
                  <motion.div variants={stepVariants} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center text-xs font-bold text-secondary border border-outline-variant/20">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                        Create your brand profile
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        Share your business story, budget range, and the type of
                        creator you're looking for.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={stepVariants} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center text-xs font-bold text-secondary border border-outline-variant/20">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                        Post a campaign
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        List your collab brief or proactively search creators by
                        niche, city, follower range, and price.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={stepVariants} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center text-xs font-bold text-secondary border border-outline-variant/20">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                        Shortlist &amp; connect
                      </h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        View full creator profiles, compare options, and
                        initiate conversations — all on platform.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-8 bg-background">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-container p-12 lg:p-20 text-center shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-4xl lg:text-6xl font-extrabold font-headline text-on-primary mb-8 leading-tight">
                  Ready to Scale Your Brand?
                </h2>
                <p className="text-on-primary/80 text-lg lg:text-xl max-w-2xl mx-auto mb-12 font-medium">
                  Join 850+ brands that have transformed their market presence
                  through the power of curated editorial connections.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="bg-white text-primary-container px-10 py-4 rounded-2xl font-extrabold text-lg shadow-xl hover:scale-105 transition-all outline-none border-none"
                  >
                    Create Brand Account
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black/20 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-extrabold text-lg border border-white/30 hover:bg-white/10 transition-all outline-none"
                  >
                    Join as Creator
                  </Link>
                </div>
              </div>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg
                  className="w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M0 100 C 20 0 50 0 100 100 Z"
                    fill="currentColor"
                  ></path>
                </svg>
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
