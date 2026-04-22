import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Bell, Sun, Moon } from 'lucide-react';
import axios from '../utils/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <nav className="sticky top-0 z-60 bg-background/70 backdrop-blur-2xl border-b border-outline-variant/10 h-20 px-6 md:px-12 flex items-center justify-between transition-all duration-500">
      <div className="flex items-center gap-12">
        <Link to="/" className="group flex items-center gap-2 transform transition hover:scale-105 active:scale-95">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <span className="text-2xl font-black font-headline text-on-surface tracking-tighter">
            Brand<span className="text-secondary">Dealify</span>
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          {[
            { to: '/campaigns', label: 'Campaigns' },
            { to: '/creators', label: 'Creators' },
          ].map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/5">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all rounded-xl active:scale-90"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {user && (
            <Link 
              to="/notifications" 
              className="relative p-2.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container-high transition-all rounded-xl group active:scale-90"
              title="Notifications"
            >
              <Bell size={18} className={hasUnread ? 'animate-pulse text-secondary' : ''} />
              {hasUnread && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error border-2 border-surface rounded-full shadow-[0_0_8px_rgba(255,180,171,0.5)]"></span>
              )}
            </Link>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="h-8 w-px bg-outline-variant/10 hidden sm:block"></div>
            <Link 
              to={user.role === 'creator' ? '/creator-dashboard' : '/brand-dashboard'} 
              className="group flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 border border-outline-variant/10 hover:border-secondary/30"
            >
              <div className="relative group-hover:scale-105 transition-transform duration-500">
                <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-xl blur-sm opacity-0 group-hover:opacity-40 transition duration-500"></div>
                <img 
                  src={user.profilePicture || user.logo || (user.role === 'creator' ? '/creator_avatar_1775540021005.png' : '/brand_avatar_1775539904640.png')} 
                  alt="Profile" 
                  className="relative w-9 h-9 rounded-lg object-cover border border-outline-variant/20 shadow-md"
                />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-black text-on-surface leading-none mb-0.5">Console</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-secondary font-black opacity-80">{user.role}</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout} 
              className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/5 transition-all rounded-xl active:scale-90"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-on-surface hover:text-secondary transition-all active:scale-95">Log In</Link>
            <Link to="/register" className="bg-linear-to-r from-primary to-primary-container px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary/10 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
