import React, { useState } from 'react';
import Sidebars from './Sidebars';
import Profile from './Profile';
import Patients from './Patients';
import AddPatients from './AddPatients';
import Visits from './Visits';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Sidebars activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content area */}
      <main className="min-h-screen md:ml-72">
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