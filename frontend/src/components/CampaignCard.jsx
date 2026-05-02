import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, DollarSign, Target, ArrowUpRight, MapPin } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  return (
    <div className="dashboard-card group hover:scale-[1.02] transition-all duration-300 border border-outline-variant/10">
      <div className="flex justify-between items-start mb-6">
        {campaign.brandId ? (
          <Link to={`/brands/${campaign.brandId?._id || campaign.brandId}`} className="flex items-center gap-4 group/brand">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center font-black text-secondary border border-outline-variant/10 shadow-inner group-hover/brand:border-secondary transition-colors overflow-hidden">
              {campaign.brandId?.logo ? (
                <img src={campaign.brandId.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                campaign.brandId?.businessName?.[0] || 'B'
              )}
            </div>
            <div>
              <h3 className="font-black font-display text-xl text-on-surface group-hover:text-secondary transition-colors line-clamp-1 tracking-tight">
                {campaign.title}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest group-hover/brand:text-secondary transition-colors">{campaign.brandId?.businessName}</p>
                {campaign.brandId?.location && (
                  <span className="flex items-center gap-1 text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                    <MapPin size={10} /> {campaign.brandId.location}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-4 opacity-50">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center font-black text-secondary border border-outline-variant/10">
              ?
            </div>
            <div>
              <h3 className="font-black font-display text-xl text-on-surface tracking-tight">
                {campaign.title}
              </h3>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Unknown Brand</p>
            </div>
          </div>
        )}
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
        {campaign.requirements?.map((req, idx) => (
          <span key={idx} className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20 shadow-sm shadow-secondary/5">
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
          Analyze Brief <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
