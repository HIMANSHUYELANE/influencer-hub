import React from 'react';
import { Link } from 'react-router-dom';
import { User, CheckCircle, ExternalLink, MapPin } from 'lucide-react';

const CreatorCard = ({ creator }) => {
  return (
    <div className="dashboard-card group flex flex-col items-center text-center !p-8 border border-outline-variant/10 hover:border-primary/30 transition-all hover:-translate-y-1">
      <div className="relative mb-6">
        <div className="w-28 h-28 bg-surface-container-highest rounded-[2.5rem] flex items-center justify-center overflow-hidden border-2 border-outline-variant/5 shadow-xl transition-transform group-hover:scale-105">
          {creator.profilePicture ? (
            <img src={creator.profilePicture} alt={creator.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl opacity-20">👤</span>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-on-surface p-1.5 rounded-full shadow-2xl border-2 border-surface">
          <CheckCircle size={20} className="text-secondary" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1 mb-4">
        <h3 className="text-xl font-black font-display text-on-surface tracking-tight group-hover:text-primary transition-colors line-clamp-1">{creator.name}</h3>
        <div className="flex items-center gap-2">
           <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-[8px] font-black uppercase tracking-widest">
             {creator.niche} Expert
           </span>
           {creator.location && (
             <span className="flex items-center gap-1 text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                <MapPin size={10} /> {creator.location}
             </span>
           )}
        </div>
      </div>
      
      <p className="text-on-surface-variant text-xs font-medium leading-relaxed mb-8 line-clamp-3 min-h-12 px-2">
        {creator.bio || 'Professional creator building high-impact digital narratives.'}
      </p>

      <div className="w-full pt-6 border-t border-outline-variant/5 flex items-center justify-between gap-4">
        <div className="text-left">
           <p className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-widest">Starting at</p>
           <p className="text-sm font-black text-on-surface">₹{creator.pricing?.basic?.price?.toLocaleString() || '0'}</p>
        </div>
        <Link 
          to={`/creators/${creator._id}`} 
          className="px-6 py-2.5 rounded-xl bg-surface-container-highest text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2"
        >
          Analyze <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
};

export default CreatorCard;
