import { Building2, Mail, MapPin, Phone, Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getHospitalProfile } from '../../services/hospitalService';

const Profile = () => {
  // fetch hospital data from local storage or API
  const [hospital, setHospital] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getHospitalProfile();
        console.log("Profile data:", data);
        
        // Extract the hospital object from the response
        // Backend returns: { success: true, data: hospitalObject }
        setHospital(data?.data || {});
      } catch (error) {
        console.error("Failed to fetch hospital profile:", error);
        setHospital({});
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden w-full">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex-shrink-0">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{hospital.name || 'Hospital Name'}</h2>
            <p className="text-slate-300 text-sm mt-0.5">Code: {hospital.hospital_code || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 sm:px-8 py-6">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-50 flex-shrink-0">
              <Mail className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Email</h3>
              <p className="text-sm text-slate-800 mt-0.5">{hospital.email || '—'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-50 flex-shrink-0">
              <Phone className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Phone</h3>
              <p className="text-sm text-slate-800 mt-0.5">{hospital.phone || '—'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-50 flex-shrink-0">
              <MapPin className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Address</h3>
              <p className="text-sm text-slate-800 mt-0.5">{hospital.address || '—'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-50 flex-shrink-0">
              <Calendar className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Registered On</h3>
              <p className="text-sm text-slate-800 mt-0.5">
                {hospital.created_at ? new Date(hospital.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;