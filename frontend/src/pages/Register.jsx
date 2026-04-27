import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, Users, Briefcase, AlertCircle } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('creator');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(email, password, role);
      // Redirect based on role
      if (data.user.role === 'creator') {
        navigate('/creator-dashboard');
      } else {
        navigate('/brand-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="dashboard-card shadow-2xl border border-outline-variant/10 p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <UserPlus className="text-primary" size={32} />
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Join XYZ</h2>
            <p className="text-on-surface-variant font-medium mt-2">Pick your path and start creating</p>
          </div>

          {error && (
            <div className="bg-error/10 text-error border border-error/20 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${
                  role === 'creator' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-outline-variant/10 bg-surface-container-high text-on-surface-variant hover:border-primary/50'
                }`}
              >
                <Users size={24} />
                <span className="font-bold text-sm">Creator</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('brand')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${
                  role === 'brand' 
                  ? 'border-secondary bg-secondary/10 text-secondary' 
                  : 'border-outline-variant/10 bg-surface-container-high text-on-surface-variant hover:border-secondary/50'
                }`}
              >
                <Briefcase size={24} />
                <span className="font-bold text-sm">Brand</span>
              </button>
            </div>

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
                  placeholder="name@example.com"
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

            <button type="submit" className="py-4 rounded-2xl bg-linear-to-r from-primary to-secondary text-black font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
              Get Started
            </button>
          </form>

          <p className="text-center mt-8 text-on-surface-variant font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:underline font-bold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
