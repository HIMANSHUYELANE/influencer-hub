import React from 'react';
import { motion } from 'framer-motion';

const DashboardLayout = ({ sidebarItems, activeTab, setActiveTab, children }) => {
  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-background">
      {/* Sidebar */}
      <aside className="w-80 bg-background border-r border-outline-variant/5 p-8 flex flex-col gap-2 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto z-40 transition-all duration-500">
        <div className="mb-10 px-4">
          <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em]">Corporate Hub</span>
          <h2 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] mt-1">Navigation</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 group relative ${
                activeTab === item.id 
                  ? 'bg-surface-container-highest text-secondary shadow-2xl shadow-black/20' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <div className={`transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="truncate">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-secondary rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Pro Tip/Callout space */}
        <div className="mt-auto p-6 rounded-3xl bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/5">
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Pro Tip</p>
          <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed">
            Collaborate with creators who match your brand voice for 2x engagement.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-x-hidden bg-surface-container-lowest/30">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
