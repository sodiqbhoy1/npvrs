import React, { useState } from 'react';
import { User, Users, PlusCircle, LogOut, Heart, Stethoscope, AlertCircle, Menu, X as XIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('hospitalToken');
    toast.success('You have been logged out.');
    navigate('/signin');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navItems = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'patients', label: 'Patients', icon: Users },
    { key: 'visits', label: 'Visits', icon: Stethoscope },
    { key: 'add', label: 'Enroll Patient', icon: PlusCircle },
  ];

  const handleNav = (key) => {
    setActiveTab(key);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <aside className="flex flex-col h-full w-[260px] bg-white border-r border-slate-200/80">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-8">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900">
          <Heart className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight">NPVRS</h2>
          <p className="text-[11px] text-slate-400 font-medium">Hospital Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu</p>
        <ul className="space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <li key={key}>
                <button
                  onClick={() => handleNav(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-4 border-t border-slate-100 mt-auto">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white border border-slate-200 text-slate-700"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop sidebar — always visible */}
      <div className="hidden md:block fixed top-0 left-0 h-screen z-30">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full z-10">
            {sidebarContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity">
          <div className="bg-white rounded-xl border border-slate-200/80 max-w-sm w-full mx-4 overflow-hidden">
            {/* Modal gradient header */}
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 py-5 flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex-shrink-0">
                <LogOut className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Sign Out</h3>
                <p className="text-xs text-slate-300">Confirm your action</p>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-slate-500">
                Are you sure you want to log out? You will be returned to the sign-in page.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
