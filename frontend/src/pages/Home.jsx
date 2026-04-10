import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LottieComponent from "lottie-react";
const Lottie = LottieComponent.default || LottieComponent;
import { motion } from "framer-motion";

import animationCreator from "../assets/creator.json";
import animationData from "../assets/social.json";
import axios from "../utils/axios";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  Target,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const STEPS = [
  {
    icon: <Target size={28} />,
    title: "Brands Post Campaigns",
    desc: "Define your goals, budget, and target niche. Your campaign goes live instantly.",
  },
  {
    icon: <Users size={28} />,
    title: "Creators Apply",
    desc: "Verified creators discover and apply to campaigns that match their content style.",
  },
  {
    icon: <CheckCircle size={28} />,
    title: "2-Step Approval",
    desc: "Brands accept the best fit, then creators confirm — ensuring mutual commitment.",
  },
  {
    icon: <Zap size={28} />,
    title: "Collaborate & Grow",
    desc: "The deal is locked in. Deliver content, track performance, and get paid.",
  },
];

const STATS = [
  { value: "2,400+", label: "Verified Creators" },
  { value: "850+", label: "Active Campaigns" },
  { value: "₹12Cr+", label: "Deals Closed" },
  { value: "98%", label: "Satisfaction Rate" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: (i) => ({
    x: window.innerWidth < 1024 ? 0 : (i === 0 ? 120 : i === 1 ? 40 : i === 2 ? -40 : -120),
    y: window.innerWidth < 1024 ? 40 : 20,
    opacity: 0,
    scale: 0.9,
    rotate: window.innerWidth < 1024 ? 0 : (i * 2 - 3),
  }),
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const campaignVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      type: "spring",
      stiffness: 70,
      damping: 12,
    },
  }),
};

const performerVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 50 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  }),
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
        setFeaturedCreators(creatorRes.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured content", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="relative bg-linear-to-tl from-pink-300 via-purple-200 to-indigo-300 py-24 mb-5 px-8 flex flex-col items-center text-center overflow-hidden">
         <div className="absolute animate-fade-in  bg-violet-400 rounded-bl-full rounded-tr-full  z-0 flex left-10 top-5 opacity-100">
        <Lottie 
          animationData={animationData} 
          loop={true}
          className=" h-80"
        />
        </div>
         <div className="absolute animate-fade-in z-0 flex bg-fuchsia-500 rounded-tl-full rounded-br-full right-10 bottom-5 opacity-100">
        <Lottie 
          animationData={animationCreator} 
          loop={true}
          className=" h-70"
        />
      </div>
        <div className=" z-10"></div>
        <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-sm font-bold mb-8 animate-pulse">
          <ShieldCheck size={16} /> India's #1 Verified Influencer Marketplace
        </span>
        <h1 className="text-6xl animate-reveal-up md:text-5xl font-extrabold tracking-tight z-10 text-slate-900 mb-6 max-w-4xl leading-tight ">
          Connect with the <span className="text-primary-600">Top 1%</span> <br /> of
          Content Creators
        </h1>
        <p className="text-xl animate-reveal-up z-10 text-slate-500 mb-10 max-w-2xl leading-relaxed  ">
          The ultimate platform for high-performance influencer marketing. Post
          campaigns, discover creators, and scale your brand globally.
        </p>
        <div className="animate-reveal-up flex z-10 flex-wrap gap-4 justify-center  ">
          <Link
            to="/register"
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
          >
            I'm a Brand <ArrowRight size={20} />
          </Link>
          <Link to="/register" className="btn-secondary text-lg px-8 py-4">
            I'm a Creator
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-8 mx-auto w-full">
        <div className="bg-black p-0 rounded-md shadow-md shadow-black border-none">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col  items-center justify-center py-8 px-6 text-center animate-reveal-scale `}
              >
                <span className="text-3xl font-black text-white mb-1">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A transparent, two-sided process designed for trust and results.
          </p>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {/* connector line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-slate-100 z-0"></div>
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              className={`card flex flex-col items-center text-center gap-4 z-10 relative `}
            >
              <div className="w-16 h-16 bg-primary-50 border-2 border-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                {step.icon}
              </div>
              <span className="text-xs font-extrabold text-primary-400 uppercase tracking-widest">
                Step {i + 1}
              </span>
              <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Campaigns */}
      <section className="px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              Featured Campaigns
            </h2>
            <p className="text-slate-500">
              The latest opportunities for creators
            </p>
          </div>
          <Link
            to="/campaigns"
            className="text-primary-600 font-semibold flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8 overflow-hidden">
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
                <Link
                  to={`/campaigns/${campaign._id}`}
                  className="card group cursor-pointer block h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center font-bold text-primary-600 text-lg">
                      {campaign.brandId?.businessName?.[0] || "C"}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary-600 transition-colors">
                        {campaign.title}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {campaign.brandId?.businessName}
                      </p>
                    </div>
                  </div>
                  {campaign.niche && (
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-full mb-3">
                      {campaign.niche}
                    </span>
                  )}
                  <p className="text-slate-600 mb-6 line-clamp-2 text-sm">
                    {campaign.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <span className="font-bold text-primary-600 text-lg">
                      ₹{campaign.budget?.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${campaign.status === "active" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 card text-center py-12 text-slate-400">
              No campaigns yet —{" "}
              <Link
                to="/register"
                className="text-primary-600 font-semibold hover:underline"
              >
                be the first to post one
              </Link>
              .
            </div>
          )}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              Top Performers
            </h2>
            <p className="text-slate-500">
              Hand-picked influencers for your next brand story
            </p>
          </div>
          <Link
            to="/creators"
            className="text-primary-600 font-semibold flex items-center gap-1 hover:underline"
          >
            Discover creators <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredCreators.length > 0 ? (
            featuredCreators.map((creator, i) => (
              <motion.div
                key={creator._id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.2 }}
                variants={performerVariants}
                className="card flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl mb-6 relative">
                  <span role="img" aria-label="creator">
                    👤
                  </span>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{creator.name}</h3>
                <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
                  {creator.niche}
                </span>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {creator.bio}
                </p>
                <Link
                  to={`/creators/${creator._id}`}
                  className="w-full btn-secondary py-3 text-center"
                >
                  View Profile
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 card text-center py-12 text-slate-400">
              No creators registered yet —{" "}
              <Link
                to="/register"
                className="text-primary-600 font-semibold hover:underline"
              >
                join as a creator
              </Link>
              .
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 max-w-5xl mx-auto w-full">
        <div className="relative card bg-primary-600 border-none p-14 text-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-700 rounded-full blur-2xl opacity-50"></div>
          <TrendingUp size={40} className="text-primary-200 mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold text-primary-600 mb-4 tracking-tight relative z-10">
            Ready to Scale Your Brand?
          </h2>
          <p className="text-black mb-8 text-lg max-w-xl mx-auto relative z-10">
            Join thousands of brands and creators already growing together on
            Influencer's Hub.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <Link
              to="/register"
              className="bg-white text-primary-600 font-bold px-8 py-4 rounded-2xl transition-all shadow-primary-600 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              Get Started Free
            </Link>
            <Link
              to="/campaigns"
              className="border-2 border-white/50 text-primary-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-300 transition-all hover:shadow-md shadow-primary-600 hover:-translate-y-0.5 active:scale-95"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
