import React from 'react';
import { Link } from 'react-router-dom';
import { User, CheckCircle, ExternalLink } from 'lucide-react';

const CreatorCard = ({ creator }) => {
  return (
    <div className="card flex flex-col items-center text-center group">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl transform transition-transform group-hover:scale-110">
          <span role="img" aria-label="creator">👤</span>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-50">
          <CheckCircle size={24} className="text-green-500 fill-green-50" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-1 group-hover:text-primary-600 transition-colors">{creator.name}</h3>
      <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
        {creator.niche}
      </span>
      
      <p className="text-slate-500 text-sm mb-8 line-clamp-2 min-h-10">
        {creator.bio}
      </p>

      <div className="w-full flex flex-col gap-2">
        <Link 
          to={`/creators/${creator._id}`} 
          className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 group-hover:bg-slate-100"
        >
          View Profile <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CreatorCard;
