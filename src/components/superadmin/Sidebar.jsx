import React, { useState } from 'react'
import { Shield, Hospital, BarChart, LogOut, AlertCircle, LayoutDashboard, Building2, Users, UserCircle2, Settings, ChevronsLeft, ChevronsRight } from 'lucide-react'

// Props: { activeTab, setActiveTab, collapsed, setCollapsed, onClose? }
const Sidebar = ({ activeTab, setActiveTab, collapsed = false, setCollapsed = () => {}, onClose, onLogout }) => {
  const items = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
    { key: 'hospitals', label: 'Hospitals', icon: <Building2 className="h-5 w-5" /> },
    { key: 'activity', label: 'Activity Logs', icon: <BarChart className="h-5 w-5" /> },
    { key: 'patients', label: 'Patients', icon: <Users className="h-5 w-5" /> },
    { key: 'profile', label: 'Profile', icon: <UserCircle2 className="h-5 w-5" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ]

  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <aside className={`fixed top-0 left-0 h-screen flex flex-col bg-white border-r border-gray-200 z-30 transition-all duration-200 ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Brand + collapse */}
        <div className="flex items-center justify-between gap-2 px-3 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-emerald-600 p-2 rounded-[0.3rem] text-white flex-shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">NPVRS Admin</p>
                <p className="text-[11px] text-gray-600 -mt-0.5">Super Console</p>
              </div>
            )}
          </div>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-[0.3rem] text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-none"
          >
            {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {items.map((item) => (
              <li key={item.key}>
                <button
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[0.3rem] font-medium transition-colors ${
                    activeTab === item.key
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${collapsed ? 'justify-center' : 'justify-start'}`}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-2 py-2">
          <button
            onClick={() => setConfirmOpen(true)}
            title="Logout"
            className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-[0.3rem] text-red-600 hover:bg-red-50 hover:text-red-700 ${collapsed ? 'justify-center' : 'justify-start'}`}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>

          {confirmOpen && !collapsed && (
            <div role="dialog" aria-labelledby="logout-title" className="mt-2 rounded-[0.3rem] border border-gray-200 bg-white p-3">
              <p id="logout-title" className="text-sm font-medium text-gray-900">Confirm logout</p>
              <p className="text-xs text-gray-600 mt-1">You will be signed out.</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-3 py-1.5 rounded-[0.3rem] border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    try {
                      if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem('superAdminToken')
                      }
                    } catch { /* ignore storage errors */ }
                    if (typeof onLogout === 'function') {
                      onLogout()
                    } else {
                      window.location.href = '/superadmin/signin'
                    }
                  }}
                  className="px-3 py-1.5 rounded-[0.3rem] bg-red-600 hover:bg-red-700 text-white text-sm w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-3 py-3 border-t border-gray-200 text-[11px] text-gray-500 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed ? `© ${new Date().getFullYear()} NPVRS` : '©'}
        </div>
      </aside>
      {/* ...existing code... (Logout Modal) */}
    </>
  )
}

export default Sidebar
