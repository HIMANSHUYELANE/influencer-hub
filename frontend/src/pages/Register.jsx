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
        <div className="card shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-primary-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold">Join XYZ</h2>
            <p className="text-slate-500">Pick your path and start creating</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
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
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary-200'
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
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary-200'
                }`}
              >
                <Briefcase size={24} />
                <span className="font-bold text-sm">Brand</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-4 mt-2">
              Get Started
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
