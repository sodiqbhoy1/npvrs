import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Patients from './Patients';
import AddPatients from './AddPatients';
import Visits from './Visits';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content area — pushed right on desktop, full width on mobile (sidebar overlay) */}
      <main className="md:ml-[260px] min-h-screen">
        {/* Top gradient accent bar */}
        <div className="h-36 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />

        {/* Content card floats up over the gradient */}
        <div className="px-4 sm:px-6 lg:px-8 -mt-20 pb-10">
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'patients' && <Patients />}
          {activeTab === 'visits' && <Visits />}
          {activeTab === 'add' && <AddPatients />}
        </div>
      </main>
    </div>
  );
};

export default HospitalDashboard;