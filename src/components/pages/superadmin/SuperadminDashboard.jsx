import React, { useState } from 'react'
import Sidebar from '../../superadmin/Sidebar'
import Hospitals from '../../superadmin/Hospital'
import Patients from '../../superadmin/Patients'
import Profile from '../../superadmin/Profile'
import ClinicActivity from '../../superadmin/ClinicActivity' // Import the new component
import { LayoutDashboard, Building2, Users, UserCircle2, Settings, Menu, BarChart } from 'lucide-react' // Added BarChart
import Overview from '../../superadmin/Overview'

const SuperadminDashboard = () => {
  const [active, setActive] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const renderContent = () => {
    switch (active) {
      case 'overview':
        return <Overview/>
      case 'hospitals':
        return <Hospitals />
      case 'activity': // Added case for activity
        return <ClinicActivity />
      case 'patients':
        return <Patients />
      case 'profile':
        return <Profile />
      case 'settings':
        return (
          <div className="bg-white rounded-[0.3rem] border border-gray-200 p-6 text-gray-700">Settings coming soon…</div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Desktop fixed sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen border-r" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <Sidebar activeTab={active} setActiveTab={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-4 left-4 z-40 text-white p-2 bg-brand">
        <Menu className="h-6 w-6" />
      </button>
      
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-white h-full border-r border-gray-200">
            <Sidebar activeTab={active} setActiveTab={(k)=>{setActive(k); setMobileOpen(false)}} />
          </div>
          <div className="flex-1 bg-black/30" onClick={()=>setMobileOpen(false)} />
        </div>
      )}

      {/* Right content area */}
      <div className={`transition-all duration-300 px-4 sm:px-6 lg:px-8 py-6 ${collapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        {/* Sticky header - Minimalist */}
        <div className="sticky top-4 z-10">
          <div className="app-card p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Icons colored with Primary Teal */}
                {active === 'overview' && <LayoutDashboard className="h-5 w-5 text-brand" />}
                {active === 'hospitals' && <Building2 className="h-5 w-5 text-brand" />}
                {active === 'activity' && <BarChart className="h-5 w-5 text-brand" />} 
                {active === 'patients' && <Users className="h-5 w-5 text-brand" />}
                {active === 'profile' && <UserCircle2 className="h-5 w-5 text-brand" />}
                {active === 'settings' && <Settings className="h-5 w-5 text-brand" />}
                <h1 className="text-lg font-semibold capitalize" style={{ color: 'var(--color-text-primary)' }}>{active === 'activity' ? 'Activity Logs' : active}</h1>
              </div>
              
              {/* Navigation Pills - Sharp, Teal Accents */}
              <div className="inline-flex p-1 self-start sm:self-auto overflow-x-auto max-w-full gap-1">
                {[
                  { k: 'overview', icon: LayoutDashboard, l: 'Overview' },
                  { k: 'hospitals', icon: Building2, l: 'Hospitals' },
                  { k: 'activity', icon: BarChart, l: 'Activity' },
                  { k: 'patients', icon: Users, l: 'Patients' },
                  { k: 'profile', icon: UserCircle2, l: 'Profile' },
                  { k: 'settings', icon: Settings, l: 'Settings' }
                ].map((item) => (
                  <button
                    key={item.k}
                    onClick={() => setActive(item.k)}
                    className={`px-3 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                      active === item.k
                        ? 'bg-brand text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ borderRadius: 'var(--radius-app)' }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden xs:inline">{item.l}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default SuperadminDashboard
