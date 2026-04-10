import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, DollarSign, Target } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600 border border-indigo-100">
            {campaign.brandId?.businessName?.[0] || 'C'}
          </div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors line-clamp-1">{campaign.title}</h3>
            <p className="text-sm text-slate-500">{campaign.brandId?.businessName}</p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
          {campaign.status}
        </span>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 line-clamp-3 min-h-18">
        {campaign.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {campaign.requirements?.slice(0, 3).map((req, idx) => (
          <span key={idx} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            {req}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-1 text-primary-600 font-bold">
          <DollarSign size={16} />
          <span>{campaign.budget}</span>
        </div>
        <Link 
          to={`/campaigns/${campaign._id}`} 
          className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors"
        >
          View Details <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
