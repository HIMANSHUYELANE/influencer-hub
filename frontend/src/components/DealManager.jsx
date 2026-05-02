import React, { useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, Clock, ArrowUpRight, ExternalLink, 
  CheckCircle, AlertCircle 
} from 'lucide-react';
import ChatWidget from './ChatWidget';

function DealManager({ deal, onUpdate }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [contentUrl, setContentUrl] = useState(deal.contentUrl || '');
  const [error, setError] = useState('');

  // Handle older database entries that might have used hyphens or no budget field
  const normalizedStatus = (deal.status || '').replace('-', '_');
  const displayBudget = deal.budget || deal.applicationId?.campaignId?.budget || 0;

  const handleAction = async (actionType, payload = {}) => {
    setLoading(true);
    setError('');
    try {
      let url = `/deals/${deal._id}`;
      
      if (actionType === 'pay') url += '/pay';
      else if (actionType === 'submit-content') url += '/submit-content';
      else if (actionType === 'review') url += '/review';

      await axios.post(url, payload);
      
      if (onUpdate) onUpdate(); // Refresh parent component data
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-purple-100 text-purple-800';
      case 'revision_requested': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="dashboard-card group">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center text-secondary border border-outline-variant/10 shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Building2 size={32} />
          </div>
          <div>
            <span className="console-label mb-1!">
              {deal.originType === 'package' ? 'Package Order' : 'Campaign Deal'} / 0x{deal._id.slice(-4).toUpperCase()}
            </span>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter group-hover:text-violet-400 transition-colors">
              {deal.originType === 'package' 
                ? `${(deal.packageTier ? deal.packageTier.charAt(0).toUpperCase() + deal.packageTier.slice(1) : 'Custom')} Tier Package` 
                : (deal.applicationId?.campaignId?.title || 'Unknown Campaign')}
            </h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-lg font-black text-secondary">₹{displayBudget.toLocaleString()}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Payment: {formatStatus(deal.paymentDetails?.status || 'pending')}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
             <ChatWidget dealId={deal._id} isCompleted={normalizedStatus === 'completed'} />
             <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-2xl ${getStatusBadgeColor(normalizedStatus)}`}>
               {formatStatus(normalizedStatus)}
             </span>
          </div>
          {normalizedStatus === 'completed' && <span className="text-[8px] font-bold text-accent-teal uppercase tracking-widest animate-pulse">Archived</span>}
        </div>
      </div>

      {/* Milestone Track */}
      <div className="px-4 mb-14">
        <div className="milestone-track">
          {[
            { id: 'pending_payment', label: 'Funded' },
            { id: 'in_progress', label: 'Working' },
            { id: 'in_review', label: 'Review' },
            { id: 'completed', label: 'Finalized' }
          ].map((milestone, i, arr) => {
            const steps = ['pending_payment', 'in_progress', 'in_review', 'completed'];
            const currentIndex = steps.indexOf(normalizedStatus);
            const milestoneIndex = steps.indexOf(milestone.id);
            const isActive = milestoneIndex <= currentIndex;
            const isCurrent = milestoneIndex === currentIndex;

            return (
              <div key={milestone.id} className="relative">
                 <div className={`milestone-node ${isActive ? 'milestone-node-active' : ''} ${isCurrent ? 'ring-8 ring-secondary/20' : ''}`} />
                 <span className={`milestone-label ${isActive ? 'text-on-surface font-black' : 'text-on-surface-variant/40'}`}>
                   {milestone.label}
                 </span>
              </div>
            );
          })}
          
          {/* Progress fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-secondary transition-all duration-1000 ease-in-out rounded-full"
            style={{ 
              width: `${(Math.max(0, ['pending_payment', 'in_progress', 'in_review', 'completed'].indexOf(normalizedStatus)) / 3) * 100}%` 
            }}
          />
        </div>
      </div>

      {deal.originType === 'package' && deal.packageSnapshot && (
        <div className="mb-6 p-6 rounded-2xl bg-surface-container border border-outline-variant/10">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-3">Agreed Deliverables</h4>
          <p className="text-sm font-medium text-on-surface whitespace-pre-wrap">
            {deal.packageSnapshot.description || 'Deliverables exactly as listed in the package at time of purchase.'}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-error/10 text-error p-4 rounded-2xl text-sm font-bold border border-error/20 flex items-center gap-3">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* BRAND ACTIONS */}
      {user.role === 'brand' && (
        <div className="pt-6 border-t border-outline-variant/10">
          {normalizedStatus === 'pending_payment' && (
            <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Securely hold the funds in Escrow. Funds are only released upon your approval of the final deliverables.</p>
              <button 
                disabled={loading}
                onClick={() => handleAction('pay')}
                className="w-full py-4 rounded-2xl bg-white text-black font-black hover:bg-secondary hover:text-black transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : <>Pay with Escrow <ArrowUpRight size={18} /></>}
              </button>
            </div>
          )}

          {(normalizedStatus === 'in_progress' || normalizedStatus === 'revision_requested') && (
            <div className="bg-surface-container p-6 rounded-2xl border border-secondary/20">
              <h4 className="font-black text-secondary uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                <Clock size={16} /> Waiting for Creator
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Funds are securely held in escrow. The creator is currently working on your deliverables.</p>
            </div>
          )}

          {normalizedStatus === 'in_review' && (
            <div className="bg-surface-container-high border border-primary/20 p-6 rounded-2xl">
              <h4 className="font-black text-primary uppercase text-xs tracking-widest mb-4">Review Deliverables</h4>
              <div className="bg-surface-container-highest p-4 rounded-xl border border-outline-variant/10 mb-6 break-all font-bold text-sm text-primary flex items-center gap-3">
                <ExternalLink size={16} />
                <a href={deal.contentUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {deal.contentUrl || 'No URL Provided'}
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                  disabled={loading}
                  onClick={() => handleAction('review', { action: 'approve' })}
                  className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform text-sm w-full"
                >
                  Approve & Release Funds
                </button>
                <button 
                  disabled={loading}
                  onClick={() => handleAction('review', { action: 'reject' })}
                  className="flex-1 py-4 bg-surface-container-highest text-on-surface rounded-2xl font-black border border-outline-variant/20 hover:bg-error hover:text-white hover:border-error transition-all text-sm w-full"
                >
                  Request Revision
                </button>
              </div>
            </div>
          )}

          {normalizedStatus === 'completed' && (
            <div className="bg-surface-container border border-emerald-500/20 p-6 rounded-2xl text-center relative">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle size={24} />
              </div>
              <h4 className="font-black text-emerald-400 text-lg mb-1">Deal Completed</h4>
              <p className="text-sm text-on-surface-variant mb-6">Content approved and payment released.</p>
              {deal.contentUrl && (
                <a href={deal.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-on-surface hover:text-secondary transition-colors uppercase tracking-widest">
                  View Assets <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* CREATOR ACTIONS */}
      {user.role === 'creator' && (
        <div className="pt-6 border-t border-outline-variant/10">
          {normalizedStatus === 'pending_payment' && (
            <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 text-center">
              <Clock size={32} className="mx-auto text-on-surface-variant/30 mb-4" />
              <p className="text-sm text-on-surface-variant leading-relaxed">Waiting for the brand to fund the escrow. <strong>Avoid starting work</strong> until payment is secured.</p>
            </div>
          )}

          {(normalizedStatus === 'in_progress' || normalizedStatus === 'revision_requested') && (
            <div className="bg-surface-container border border-secondary/20 p-6 rounded-2xl">
              <h4 className="font-black text-secondary uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                {normalizedStatus === 'revision_requested' ? 'Revision Requested' : 'Submit Deliverables'}
              </h4>
              <div className="flex gap-3 items-center">
                <input 
                  type="url" 
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://drive.google.com/..." 
                  className="flex-1 px-5 py-4 bg-surface-container-high border border-outline-variant/10 rounded-xl text-on-surface outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-sm"
                />
                <button 
                  disabled={loading || !contentUrl}
                  onClick={() => handleAction('submit-content', { contentUrl })}
                  className="px-8 py-4 bg-secondary text-black rounded-xl font-black shadow-lg shadow-secondary/10 hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {normalizedStatus === 'in_review' && (
            <div className="bg-surface-container border border-outline-variant/10 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary border border-outline-variant/10">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-black text-on-surface text-sm uppercase tracking-widest">In Review</h4>
                  <p className="text-xs text-on-surface-variant">Waiting for Brand Approval</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {deal.contentUrl && (
                  <a href={deal.contentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-secondary hover:underline">View Submission</a>
                )}
              </div>
            </div>
          )}
          
          {normalizedStatus === 'completed' && (
            <div className="bg-surface-container border border-emerald-500/20 p-8 rounded-3xl text-center shadow-xl shadow-emerald-500/5 relative">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle size={32} />
              </div>
              <h4 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Success!</h4>
              <p className="text-on-surface-variant font-medium">Collaboration complete. Your funds have been released.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DealManager;
