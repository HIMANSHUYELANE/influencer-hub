import React, { useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Campaign: {deal.applicationId?.campaignId?.title || 'Unknown Campaign'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Budget: ₹{displayBudget.toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(normalizedStatus)}`}>
          {formatStatus(normalizedStatus)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm">
          <span className="font-semibold">Payment Status:</span> {formatStatus(deal.paymentDetails?.status || 'pending')}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* BRAND ACTIONS */}
      {user.role === 'brand' && (
        <div className="space-y-4">
          {normalizedStatus === 'pending_payment' && (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-sm text-gray-600 mb-3">To start the collaboration, securely hold the funds in Escrow. Funds are only released when you approve the content.</p>
              <button 
                disabled={loading}
                onClick={() => handleAction('pay')}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
              >
                {loading ? 'Processing...' : 'Pay with Escrow (Mock)'}
              </button>
            </div>
          )}

          {(normalizedStatus === 'in_progress' || normalizedStatus === 'revision_requested') && (
            <div className="text-sm text-blue-700 bg-blue-50 p-4 rounded-md">
              <strong className="block mb-1">Waiting for Creator</strong>
              Funds are securely held in escrow. Waiting for the creator to submit their deliverables.
            </div>
          )}

          {normalizedStatus === 'in_review' && (
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 mb-2">Review Deliverables</h4>
              <a 
                href={deal.contentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline break-all text-sm block mb-4"
              >
                {deal.contentUrl || 'No URL Provided'}
              </a>
              <div className="flex gap-3">
                <button 
                  disabled={loading}
                  onClick={() => handleAction('review', { action: 'approve' })}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  Approve & Release Funds
                </button>
                <button 
                  disabled={loading}
                  onClick={() => handleAction('review', { action: 'reject' })}
                  className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition-colors text-sm"
                >
                  Request Revision
                </button>
              </div>
            </div>
          )}

          {normalizedStatus === 'completed' && (
            <div className="text-sm border border-green-200 text-green-700 bg-green-50 p-4 rounded-md">
              <strong className="block mb-1">🎉 Deal Completed</strong>
              Content approved and funds successfully transferred to the creator.
              {deal.contentUrl && (
                <a href={deal.contentUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs mt-2 block">View Final Deliverables</a>
              )}
            </div>
          )}
        </div>
      )}

      {/* CREATOR ACTIONS */}
      {user.role === 'creator' && (
        <div className="space-y-4">
          {normalizedStatus === 'pending_payment' && (
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
              Waiting for the brand to fund the escrow. Do not start work until payment is secured.
            </div>
          )}

          {(normalizedStatus === 'in_progress' || normalizedStatus === 'revision_requested') && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-1">
                {normalizedStatus === 'revision_requested' ? 'Revision Requested by Brand' : 'Submit Deliverables'}
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Provide a Google Drive, Dropbox, or unlisted YouTube link.
              </p>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://drive.google.com/..." 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  disabled={loading || !contentUrl}
                  onClick={() => handleAction('submit-content', { contentUrl })}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {normalizedStatus === 'in_review' && (
            <div className="text-sm text-amber-700 bg-amber-50 p-4 rounded-md flex items-center justify-between">
              <div>
                <strong className="block mb-1">Waiting for Brand Approval</strong>
                {deal.contentUrl && (
                  <a href={deal.contentUrl} target="_blank" rel="noreferrer" className="underline hover:text-amber-900">{deal.contentUrl}</a>
                )}
              </div>
            </div>
          )}
          
          {normalizedStatus === 'completed' && (
            <div className="text-sm font-semibold text-green-700 bg-green-50 p-4 rounded-md text-center">
              🎉 Collaboration Complete. Funds have been released to your account.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DealManager;
