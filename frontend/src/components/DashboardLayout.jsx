import React from 'react';
import { motion } from 'framer-motion';

const DashboardLayout = ({ sidebarItems, activeTab, setActiveTab, children }) => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-8 px-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Navigation</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-item ${activeTab === item.id ? 'sidebar-item-active' : ''}`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
