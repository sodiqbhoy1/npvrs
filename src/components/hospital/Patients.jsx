import { useEffect, useState } from 'react';
import { getAllPatients } from '../../services/hospitalService';
import { Search } from 'lucide-react';

const Patients = () => {
  // Loaded patients from API
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  // Fetch patients on mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getAllPatients();
        console.log("Patients loaded:", data);

        // Backend returns: { success: true, count: N, data: [...] }
        // Fallback to handling it if it were just an array
        const list = Array.isArray(data) ? data : (data?.data || []);
        setPatients(list);
      } catch (e) {
        console.error('Failed to fetch patients:', e);
        setPatients([]);
      }
    };
    loadPatients();
  }, []);

  // Helper to safely read fields that match your API response
  const normalize = (p) => {
    const card = p.patientCode || p.patient_code || (p._id ? p._id.slice(-6).toUpperCase() : 'N/A');
    const name = p.fullName || p.full_name || 'N/A';
    const gender = p.gender || '—';
    const phone = p.phone || '—';
    const condition = p.underlyingConditions || p.underlying_sickness || 'None';
    const address = p.address || '—';
    const bloodGroup = p.bloodGroup || p.blood_group || '—';
    
    // Handle date of birth (dateOfBirth or dob)
    const dob = p.dateOfBirth || p.dob;

    const age =
      typeof p.age === 'number'
        ? p.age
        : dob
        ? Math.max(
            0,
            Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          )
        : '—';
    return { card, name, age, gender, phone, condition, address, bloodGroup };
  };

  const filtered = patients.filter((p) => {
    const { name, card } = normalize(p);
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || String(card).toLowerCase().includes(q);
  });

  if (selected) {
    const s = normalize(selected);
    // Patient detail view
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        {/* Detail header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 sm:px-8 py-5">
          <h2 className="text-lg font-semibold text-white">Patient Profile</h2>
          <p className="text-slate-300 text-sm mt-0.5">Code: {s.card}</p>
        </div>

        <div className="px-6 sm:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {[
              { label: 'Name', value: s.name },
              { label: 'Age', value: s.age },
              { label: 'Gender', value: s.gender },
              { label: 'Phone', value: s.phone },
              { label: 'Blood Group', value: s.bloodGroup },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</span>
                <span className="text-sm text-slate-800">{value}</span>
              </div>
            ))}
            <div className="sm:col-span-2 flex flex-col gap-0.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Underlying Condition</span>
              <span className="text-sm text-slate-800">{s.condition}</span>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-0.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Address</span>
              <span className="text-sm text-slate-800">{s.address}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:from-slate-700 hover:to-slate-600 transition-all"
              onClick={() => window.print()}
            >
              Print Card
            </button>
            <button
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              onClick={() => setSelected(null)}
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 gap-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">Enrolled Patients</h2>
        <div className="relative w-full sm:w-auto sm:min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 transition-colors bg-slate-50/50 placeholder:text-slate-400"
            placeholder="Search by name or code..."
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Code</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Age</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gender</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Blood</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p, idx) => {
              const s = normalize(p);
              const key = p.id ?? p.patientId ?? p.patient_uuid ?? idx;
              return (
                <tr key={key} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">{s.card}</span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{s.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{s.age}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{s.gender}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{s.phone}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{s.bloodGroup}</td>
                  <td className="px-5 py-3">
                    <button
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
                      onClick={() => setSelected(p)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-sm text-slate-400">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
