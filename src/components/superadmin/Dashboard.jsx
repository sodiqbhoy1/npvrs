import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Hospitals from './Hospitals'; // Assuming you have this component
import ClinicActivity from './ClinicActivity'; // Import the new component

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('hospitals'); // Default to 'hospitals'

  const renderContent = () => {
    switch (activeTab) {
      case 'hospitals':
        return <Hospitals />; // Your existing component for managing hospitals
      case 'activity':
        return <ClinicActivity />; // The new activity log component
      default:
        return <Hospitals />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 pl-64">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;