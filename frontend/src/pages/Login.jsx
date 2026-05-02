import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // Redirect based on role
      if (data.user.role === 'creator') {
        navigate('/creator-dashboard');
      } else {
        navigate('/brand-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-grid-glow">
      <div className="w-full max-w-md">
        <div className="dashboard-card shadow-2xl border border-outline-variant/10 p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-surface-container-highest rounded-3xl flex items-center justify-center mx-auto mb-4 border border-outline-variant/10">
              <LogIn className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Welcome Back</h2>
            <p className="text-on-surface-variant font-medium mt-2">Log in to manage your campaigns</p>
          </div>

          {error && (
            <div className="bg-error/10 text-error border border-error/20 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input w-full pl-14!"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input w-full pl-14!"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="py-4 rounded-2xl bg-primary text-on-primary font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
              Sign In
            </button>
          </form>

          <p className="text-center mt-8 text-on-surface-variant font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary hover:underline font-bold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
