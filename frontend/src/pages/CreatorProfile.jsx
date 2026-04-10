import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { ChevronLeft, User, Globe, CheckCircle, Mail, MapPin } from 'lucide-react';

const Instagram = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);
const Youtube = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.5 7.1C2.5 7.1 2.3 5.4 3 4.6 3.8 3.7 4.8 3.7 5.2 3.6 8.5 3.4 12 3.4 12 3.4s3.5 0 6.8.2c.5.1 1.4.1 2.2 1 .7.8.5 2.5.5 2.5s.2 2 .2 3.9v1.6c0 1.9-.2 3.9-.2 3.9s-.2 1.7-.9 2.5c-.8.8-1.9.8-2.4.9-3.6.3-7 .3-7 .3s-3.5 0-6.8-.2c-.4-.1-1.4-.1-2.2-1-.7-.8-.5-2.5-.5-2.5s-.2-2-.2-3.9v-1.6c0-1.9.2-3.9.2-3.9z"></path><polygon points="9.7 15.5 15.7 12 9.7 8.5 9.7 15.5"></polygon></svg>
);
const Twitter = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const CreatorProfile = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-12 text-center text-slate-500 font-medium tracking-tight">Loading Profile...</div>;
  if (!creator) return <div className="p-12 text-center text-slate-500 font-medium tracking-tight">Creator not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <Link to="/creators" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-12 transition-colors">
        <ChevronLeft size={20} /> Back to Search
      </Link>

      <div className="flex flex-col gap-12">
        {/* Profile Card */}
        <section className="card p-10 flex flex-col md:flex-row items-center md:items-start gap-12 bg-white border-none shadow-2xl relative overflow-hidden animate-reveal-up opacity-0">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 translate-x-32 -translate-y-32"></div>
           
           <div className="relative">
              <div className="w-40 h-40 bg-primary-100 rounded-[40px] flex items-center justify-center text-6xl shadow-xl border-4 border-white">
                👤
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                <CheckCircle size={32} className="text-green-500 fill-green-50" />
              </div>
           </div>

           <div className="grow text-center md:text-left">
              <h1 className="text-4xl font-extrabold mb-3 tracking-tight">{creator.name}</h1>
              <span className="inline-block px-4 py-1.5 bg-primary-50 text-secondary-600 border border-primary-100 rounded-full font-extrabold text-xs uppercase tracking-widest text-primary-600 mb-6">
                {creator.niche} Expert
              </span>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                {creator.bio}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-10">
                <div className="flex flex-col items-center md:items-start">
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Engagement</span>
                   <span className="text-2xl font-black text-slate-900">4.8%</span>
                </div>
                <div className="h-12 w-px bg-slate-100"></div>
                <div className="flex flex-col items-center md:items-start">
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Followers</span>
                   <span className="text-2xl font-black text-slate-900">120K+</span>
                </div>
                <div className="h-12 w-px bg-slate-100"></div>
                <div className="flex flex-col items-center md:items-start">
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Response Time</span>
                   <span className="text-2xl font-black text-slate-900">&lt; 2h</span>
                </div>
              </div>
           </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
           <div className="lg:w-2/3 flex flex-col gap-12">
              <section>
                 <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                    Social Presence
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {creator.socialLinks?.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`card p-6 flex items-center justify-between group hover:border-primary-200 animate-reveal-scale opacity-0 stagger-${(idx % 4) + 1}`}
                      >
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                              {link.platform === 'Instagram' ? <Instagram /> : 
                               link.platform === 'Youtube' ? <Youtube /> : 
                               link.platform === 'Twitter' ? <Twitter /> : <Globe />}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900">{link.platform}</p>
                              <p className="text-xs font-medium text-slate-400">{link.handle}</p>
                           </div>
                         </div>
                         <ChevronLeft size={16} className="rotate-180 text-slate-300 group-hover:text-primary-600 transition-transform group-hover:translate-x-1" />
                      </a>
                    ))}
                 </div>
              </section>
           </div>

           <div className="lg:w-1/3">
              <div className="card sticky top-32 p-8 border-none shadow-2xl flex flex-col gap-6 animate-reveal-up opacity-0 stagger-2">
                 <h3 className="text-xl font-bold mb-2">Want to work together?</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">
                   Interested in collaborating with {creator.name}? Start by browsing their active campaigns or reach out via dashboard.
                 </p>
                 <button className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                    <Mail size={18} /> Send Message
                 </button>
                 <div className="flex items-center justify-center gap-4 text-slate-400">
                    <div className="h-px grow bg-slate-100"></div>
                    <span className="text-[10px] uppercase font-bold tracking-widest">or</span>
                    <div className="h-px grow bg-slate-100"></div>
                 </div>
                 <Link to="/campaigns" className="btn-secondary w-full py-4 text-center">
                    Browse Applications
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
