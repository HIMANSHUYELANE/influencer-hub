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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-lg h-20 px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold font-headline text-on-surface transform transition hover:scale-105 active:scale-95">
          BrandDealify
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/campaigns" className="font-headline text-sm font-semibold tracking-tight text-on-surface opacity-70 hover:opacity-100 hover:text-secondary transition-all duration-200">Campaigns</Link>
          <Link to="/creators" className="font-headline text-sm font-semibold tracking-tight text-on-surface opacity-70 hover:opacity-100 hover:text-secondary transition-all duration-200">Creators</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-full"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {user ? (
          <>
            <Link 
              to="/notifications" 
              className="relative p-2 text-on-surface-variant hover:text-secondary transition-colors group"
              title="Notifications"
            >
              <Bell className={`w-5 h-5 ${hasUnread ? 'animate-bounce text-secondary' : ''}`} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error border-2 border-background rounded-full"></span>
              )}
            </Link>
            <div className="h-8 w-[1px] bg-outline-variant/20 mx-2"></div>
            <Link 
              to={user.role === 'creator' ? '/creator-dashboard' : '/brand-dashboard'} 
              className="group flex items-center gap-3 pr-2"
            >
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <img 
                  src={user.profilePicture || user.logo || (user.role === 'creator' ? '/creator_avatar_1775540021005.png' : '/brand_avatar_1775539904640.png')} 
                  alt="Profile" 
                  className="relative w-10 h-10 rounded-xl object-cover border border-outline-variant/30 shadow-xl"
                />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold text-on-surface leading-tight">Dashboard</span>
                <span className="text-[10px] uppercase tracking-widest text-secondary font-extrabold">{user.role}</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout} 
              className="p-2 text-on-surface-variant hover:text-error transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-on-surface opacity-70 hover:opacity-100 hover:text-secondary transition-all duration-200 active:scale-90">Log In</Link>
            <Link to="/register" className="bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg shadow-primary-container/20 hover:scale-95 active:scale-90 transition-transform duration-200">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
