import React, { useEffect, useMemo, useState } from 'react'
import { Building2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllHospitals } from '../../services/superAdminService'

// Superadmin Hospitals: Display only list
const Hospital = () => {
  const [hospitals, setHospitals] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getAllHospitals()
        console.log('Hospital API Raw Response:', data)
        // Check for array, or data.data (API format), or data.hospitals
        const list = Array.isArray(data) ? data : (data?.data || data?.hospitals || [])
        console.log('Hospitals List to State:', list)
        
        // Debug filter check: if list is empty, log why
        if (list.length > 0) {
            console.log('First Item:', list[0])
            console.log('Sample name check:', list[0]?.name)
        }

        setHospitals(list)
      } catch (e) {
        console.error(e)
        // console log the error just in case
        toast.error(e?.message || 'Failed to load hospitals')
      }
    }
    fetchHospitals()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return hospitals
    return hospitals.filter(h =>
      (h.name || '').toLowerCase().includes(q) ||
      (h.email || '').toLowerCase().includes(q) ||
      (h.state || '').toLowerCase().includes(q) 
    )
  }, [hospitals, query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Hospitals</h2>
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search by name, email or state"
            className="w-full pl-10 pr-3 py-2.5 rounded-[0.3rem] border border-gray-300 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-[0.3rem] border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium">Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => (
              <tr key={h._id || h.id || Math.random()} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-[0.3rem] bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="font-medium text-gray-900">{h.name || '—'}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{h.email || '—'}</td>
                <td className="px-4 py-3 text-gray-700">{h.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-700 capitalize">{h.state || '—'}</td>
                <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={h.address}>{h.address || '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">No hospitals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Hospital
