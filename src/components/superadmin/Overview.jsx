import React, { useEffect, useState } from 'react'
import { Building2, Users, TrendingUp, Activity } from 'lucide-react'
import { getAllHospitals, getAllPatientsForAdmin } from '../../services/superAdminService'
import toast from 'react-hot-toast'

const StatCard = ({ icon, label, value, loading, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200'
  }

  return (
    <div className="bg-white rounded-[0.3rem] border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 sm:p-3 rounded-[0.3rem] border flex-shrink-0 ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 mb-0.5">{label}</p>
            {loading ? (
              <div className="h-7 w-16 bg-gray-200 rounded-[0.3rem] animate-pulse"></div>
            ) : (
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{value}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Overview = () => {
  const [stats, setStats] = useState({
    totalHospitals: 0,
    approvedHospitals: 0,
    pendingHospitals: 0,
    totalPatients: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        let hospitals = []
        try {
             const hData = await getAllHospitals()

             hospitals = Array.isArray(hData) ? hData : (hData?.data || hData?.hospitals || [])

        } catch (err) {
            console.error('Error fetching hospitals for stats:', err)
        }

        let patients = []
        try {
             const pData = await getAllPatientsForAdmin()
             patients = Array.isArray(pData) ? pData : (pData?.data || pData?.patients || [])
        } catch (err) {
            console.error('Error fetching patients for stats:', err)
        }

        // Calculate hospital stats
        const approved = hospitals.filter(h => h.approved === 1 || h.approved === true).length
        const pending = hospitals.length - approved

        setStats({
          totalHospitals: hospitals.length,
          approvedHospitals: approved,
          pendingHospitals: pending,
          totalPatients: patients.length
        })
      } catch (error) {
        console.error('Failed to update stats:', error)
        toast.error('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-emerald-700 flex-shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">System Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Building2 className="h-5 w-5 sm:h-6 sm:w-6" />}
          label="Total Hospitals"
          value={stats.totalHospitals.toLocaleString()}
          loading={loading}
          color="emerald"
        />
        
        
        
        
        <StatCard
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          label="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          loading={loading}
          color="purple"
        />
      </div>

      {/* Recent Activity Section (Optional) */}
      <div className="bg-white rounded-[0.3rem] border border-gray-200 p-4 sm:p-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Approval Rate</p>
            <p className="text-lg font-semibold text-gray-900">
              {stats.totalHospitals > 0 
                ? Math.round((stats.approvedHospitals / stats.totalHospitals) * 100) 
                : 0}%
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Patients/Hospital</p>
           
          </div>
         
        </div>
      </div>
    </div>
  )
}

export default Overview
