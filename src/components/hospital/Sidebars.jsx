import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiUsers,
  FiActivity,
  FiUserPlus,
  FiLogOut,
  FiHeart,
} from 'react-icons/fi';

const Sidebars = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'patients', label: 'Patients' },
    { key: 'visits', label: 'Visits' },
    { key: 'add', label: 'Enroll Patient' },
  ];

  const handleNav = (key) => setActiveTab(key);

  const renderNavIcon = (key, className = 'h-4 w-4') => {
    if (key === 'profile') return <FiUser className={className} />;
    if (key === 'patients') return <FiUsers className={className} />;
    if (key === 'visits') return <FiActivity className={className} />;
    return <FiUserPlus className={className} />;
  };

  const confirmLogout = () => {
    localStorage.removeItem('hospitalToken');
    toast.success('You have been logged out.');
    navigate('/signin');
  };

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-72 flex-col bg-white border-r border-slate-200/80">
        <div className="px-6 pt-6 pb-7 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center">
              <FiHeart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">NPVRS</h2>
              <p className="text-xs text-slate-400">Hospital Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
          <ul className="space-y-1.5">
            {navItems.map(({ key, label }) => {
              const isActive = activeTab === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => handleNav(key)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                      {renderNavIcon(key)}
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 p-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <header className="md:hidden border-b border-slate-200/80 bg-white sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center">
              <FiHeart className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">NPVRS</h2>
              <p className="text-[10px] text-slate-400">Hospital Panel</p>
            </div>
          </div>
        </div>

        <nav className="px-3 pb-3">
          <ul className="space-y-2">
            {navItems.map(({ key, label }) => {
              const isActive = activeTab === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => handleNav(key)}
                    className={`w-full inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {renderNavIcon(key)}
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 pb-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-sm mx-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white">
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 py-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <FiLogOut className="h-5 w-5 text-white" />
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
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600"
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

export default Sidebars;
