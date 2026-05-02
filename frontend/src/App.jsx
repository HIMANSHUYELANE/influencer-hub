import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatorDashboard from './pages/CreatorDashboard';
import BrandDashboard from './pages/BrandDashboard';
import CampaignListing from './pages/CampaignListing';
import CampaignDetail from './pages/CampaignDetail';
import CreatorListing from './pages/CreatorListing';
import CreatorProfile from './pages/CreatorProfile';
import BrandProfile from './pages/BrandProfile';
import Notifications from './pages/Notifications';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (user) {
    return <Navigate to={user.role === 'creator' ? '/creator-dashboard' : '/brand-dashboard'} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="grow relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/login" 
                    element={
                      <GuestRoute>
                        <Login />
                      </GuestRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <GuestRoute>
                        <Register />
                      </GuestRoute>
                    } 
                  />
                  
                  <Route path="/campaigns" element={<CampaignListing />} />
                  <Route path="/campaigns/:id" element={<CampaignDetail />} />
                  <Route path="/creators" element={<CreatorListing />} />
                  <Route path="/creators/:id" element={<CreatorProfile />} />
                  <Route path="/brands/:id" element={<BrandProfile />} />
  
                  <Route 
                    path="/notifications" 
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    } 
                  />
  
                  <Route 
                    path="/creator-dashboard" 
                    element={
                      <ProtectedRoute role="creator">
                        <CreatorDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/brand-dashboard" 
                    element={
                      <ProtectedRoute role="brand">
                        <BrandDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
