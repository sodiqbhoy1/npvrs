import React, { useState, useEffect } from 'react';
import { BarChart, AlertTriangle, Loader, Users, User, UserMinus } from 'lucide-react';
import { API_URL } from '../../api/api';

const ClinicActivity = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      // Ensure this endpoint matches your PHP file name exactly.
      const url = `${API_URL}/admin/clinic_stats.php`; 

      try {
        const token = localStorage.getItem('superAdminToken');
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        const data = await response.json();

        if (data.status === true && Array.isArray(data.data)) {
          setLogs(data.data);
          setError(null);
        } else {
          const msg = data.message || "Failed to fetch data or invalid format";
          setError(msg);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Network error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-6 rounded-[0.3rem] border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
        <BarChart className="h-6 w-6 text-emerald-700" />
        Clinic Enrollment Activity
      </h2>
      
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <Loader className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="ml-3 text-gray-600">Loading Activity Logs...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-[0.3rem]" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">Failed to Load Data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && logs.length === 0 && (
        <div className="text-center py-16 px-6 bg-gray-50 rounded-[0.3rem]">
          <BarChart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Activity Logs Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The system has not recorded any patient enrollments yet.
          </p>
        </div>
      )}

      {!isLoading && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Clinic Name
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Total Enrollments
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Male
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Female
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={log.hospital_id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.hospital_name}</div>
                    <div className="text-xs text-gray-500">{log.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                      <Users className="h-4 w-4" />
                      {log.total_enrollments}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-blue-800">
                      <User className="h-4 w-4" />
                      {log.male_enrollments}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-pink-800">
                      <UserMinus className="h-4 w-4" />
                      {log.female_enrollments}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClinicActivity;