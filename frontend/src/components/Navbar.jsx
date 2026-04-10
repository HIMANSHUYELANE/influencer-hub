import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Search, Bell } from 'lucide-react';
import axios from '../utils/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      const checkNotifications = async () => {
        try {
          const res = await axios.get('/notifications');
          setHasUnread(res.data.some(n => !n.read));
        } catch (err) {
          console.error(err);
        }
      };
      checkNotifications();
      // Polling every 60 seconds for new notifications
      const interval = setInterval(checkNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky bg-transparent top-0 z-50 glass h-20 px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent transform transition hover:scale-105 active:scale-95">
          XYZ
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/campaigns" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Campaigns</Link>
          <Link to="/creators" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Creators</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link 
              to="/notifications" 
              className="relative p-2 text-slate-500 hover:text-primary-600 transition-colors group"
              title="Notifications"
            >
              <Bell className={`w-5 h-5 ${hasUnread ? 'animate-bounce' : ''}`} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </Link>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <Link 
              to={user.role === 'creator' ? '/creator-dashboard' : '/brand-dashboard'} 
              className="group flex items-center gap-3 pr-2"
            >
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <img 
                  src={user.role === 'creator' ? '/creator_avatar_1775540021005.png' : '/brand_avatar_1775539904640.png'} 
                  alt="Profile" 
                  className="relative w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xl"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight">Dashboard</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">{user.role}</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout} 
              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-xl transition-all">Login</Link>
            <Link to="/register" className="btn-primary py-2 px-6">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
