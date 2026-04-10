import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, Trash2, Clock, AlertCircle } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="p-12 text-center flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Crunching your alerts...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-4">
          <Bell className="text-primary-600" size={36} />
          Notifications
        </h1>
        <div className="px-4 py-1.5 bg-slate-100 rounded-full text-sm font-bold text-slate-500">
          {notifications.filter(n => !n.read).length} Unread
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n._id} 
              className={`group relative card p-6 border-none transition-all duration-300 ${
                n.read 
                ? 'bg-white opacity-75 grayscale-[0.5]' 
                : 'bg-white shadow-xl shadow-primary-50 ring-1 ring-primary-100'
              }`}
            >
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500 rounded-l-3xl"></div>
              )}
              
              <div className="flex gap-6">
                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                  n.read ? 'bg-slate-100 text-slate-400' : 'bg-primary-100 text-primary-600'
                }`}>
                  <Bell size={24} />
                </div>
                
                <div className="grow">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-lg leading-snug ${n.read ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800 font-bold'}`}>
                      {n.message}
                    </p>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mt-1 whitespace-nowrap">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n._id)}
                        className="flex items-center gap-2 text-primary-600 text-sm font-bold hover:bg-primary-50 px-3 py-1.5 rounded-xl transition-all"
                      >
                        <Check size={16} /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-24 bg-white border-dashed border-2 border-slate-100 shadow-none">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">You're all caught up!</h3>
            <p className="text-slate-500 font-medium">No new notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
