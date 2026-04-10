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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="card shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-primary-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-slate-500">Log in to manage your campaigns</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-pulse">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                  placeholder="name@company.com"
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
              Sign In
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
