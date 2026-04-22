import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, DollarSign, Target, ArrowUpRight } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  return (
    <div className="dashboard-card group hover:scale-[1.02] transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center font-black text-secondary border border-outline-variant/10 shadow-inner group-hover:border-secondary/30 transition-colors">
            {campaign.brandId?.businessName?.[0] || 'C'}
          </div>
          <div>
            <h3 className="font-black text-xl text-on-surface group-hover:text-secondary transition-colors line-clamp-1 tracking-tight">
              {campaign.title}
            </h3>
            <p className="text-sm font-bold text-on-surface-variant/70">{campaign.brandId?.businessName}</p>
          </div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
          campaign.niche === 'Tech' ? 'niche-tech' :
          campaign.niche === 'Fashion' ? 'niche-fashion' :
          campaign.niche === 'Gaming' ? 'niche-gaming' :
          campaign.niche === 'Food' ? 'niche-food' :
          campaign.niche === 'Lifestyle' ? 'niche-lifestyle' :
          campaign.niche === 'Fitness' ? 'niche-fitness' :
          'bg-surface-container-high text-on-surface-variant border-outline-variant/10'
        }`}>
          {campaign.niche || campaign.status}
        </span>
      </div>
      
      <p className="text-on-surface-variant text-sm mb-6 line-clamp-3 min-h-[4.5rem] leading-relaxed">
        {campaign.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {campaign.requirements?.slice(0, 2).map((req, idx) => (
          <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/5">
            {req}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5">Budget</span>
          <div className="flex items-center gap-1 text-secondary font-black text-lg">
            <span className="text-sm">₹</span>
            <span>{campaign.budget?.toLocaleString()}</span>
          </div>
        </div>
        <Link 
          to={`/campaigns/${campaign._id}`} 
          className="flex items-center gap-2 text-xs font-black text-on-surface-variant hover:text-white uppercase tracking-widest transition-colors group/link"
        >
          Details <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
