import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Calendar,
  Stethoscope,
  FileText,
  Thermometer,
  HeartPulse,
  Activity,
  Wind,
  Pill,
  User,
  Search,
  Plus,
  X,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createVisit,
  getPatientVisits,
  getVisitById,
} from '../../services/hospitalService';

// Helper: format a date to a friendly string
const formatDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d.getTime())
    ? (typeof v === 'string' && v.includes('T') ? v.split('T')[0] : String(v))
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Visit/Prescription creation validation based on new schema
const prescriptionSchema = yup.object({
  diagnosis: yup.string().trim().required('Diagnosis is required'),
  notes: yup.string().trim().optional(),
  medications: yup.array().of(
    yup.object().shape({
      name: yup.string().trim().required('Medication name is required'),
      dosage: yup.string().trim().required('Dosage is required'),
      frequency: yup.string().trim().required('Frequency is required'),
      duration: yup.string().trim().optional(),
    })
  ).optional(),
});

const Visits = () => {
  // Patient public ID input
  const [patientId, setPatientId] = useState('');
  // List of visits for patient
  const [visits, setVisits] = useState([]);
  // Selected visit (detail view)
  const [selected, setSelected] = useState(null);
  // UI state
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // RHF for creating prescription
  const {
    register: registerVisit,
    control,
    handleSubmit: handleSubmitVisit,
    reset: resetVisit,
    formState: { errors: vErrors, isSubmitting: vSubmitting },
  } = useForm({
    resolver: yupResolver(prescriptionSchema),
    defaultValues: {
      diagnosis: '',
      notes: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  // Load all visits for patient
  const loadVisits = async () => {
    if (!patientId.trim()) {
      toast.error('Enter a patient code');
      return;
    }
    try {
      setLoadingList(true);
      const data = await getPatientVisits(patientId.trim());
      console.log('Visits fetched:', data);
      const visitsList = data?.visits || [];
      setVisits(Array.isArray(visitsList) ? visitsList : []);
      setSelected(null);
      setShowCreate(false);
    } catch (e) {
      toast.error(e?.message || 'Failed to fetch visits');
      setVisits([]);
    } finally {
      setLoadingList(false);
    }
  };

  // Open detail and ensure we have the latest visit data
  const openVisit = async (visit) => {
    try {
      setLoadingVisit(true);
      const full = await getVisitById(visit.id);
      console.log('Visit fetched:', full);
      setSelected(full || visit);
    } catch (e) {
      setSelected(visit);
      toast.error(e?.message || 'Failed to load visit');
    } finally {
      setLoadingVisit(false);
    }
  };

  // Create a new visit/prescription
  const onCreateVisit = async (values) => {
    if (!patientId.trim()) {
      toast.error('Enter a patient code first');
      return;
    }
    try {
      setCreating(true);
      const payload = {
        patient_code: patientId.trim(),
        ...values,
      };
      const res = await createVisit(patientId.trim(), payload);
      toast.success(res?.message || 'Prescription recorded');
      resetVisit();
      setShowCreate(false);
      await loadVisits(); // refresh list
    } catch (e) {
      toast.error(e?.message || 'Failed to record prescription');
    } finally {
      setCreating(false);
    }
  };

  // Quick summary line for table
  const summary = (v) => {
    const parts = [];
    if (v.blood_pressure) parts.push(`BP ${v.blood_pressure}`);
    if (v.temperature) parts.push(`Temp ${v.temperature}°C`);
    if (v.weight) parts.push(`Wt ${v.weight}kg`);
    if (v.heart_rate) parts.push(`HR ${v.heart_rate}`);
    if (v.respiration_rate) parts.push(`RR ${v.respiration_rate}`);
    return parts.join(' · ') || '—';
  };

  // Detail view
  if (selected) {
    const v = selected;
    return (
      <div className="w-full space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Visits
        </button>

        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
          {/* Detail header */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-5 sm:px-6 py-5 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex-shrink-0">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Visit Details</h2>
              <p className="text-xs text-slate-300">{formatDate(v.visit_date)}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {loadingVisit ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-7 w-7 border-[3px] border-slate-200 border-t-slate-700"></div>
                <p className="mt-3 text-sm text-slate-400">Loading visit details...</p>
              </div>
            ) : (
              <>
                {/* Vitals Grid */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Vitals</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { icon: Activity, label: 'Blood Pressure', value: v.blood_pressure },
                      { icon: HeartPulse, label: 'Weight (kg)', value: v.weight },
                      { icon: Thermometer, label: 'Temperature (°C)', value: v.temperature },
                      { icon: Activity, label: 'Heart Rate', value: v.heart_rate },
                      { icon: Wind, label: 'Respiration Rate', value: v.respiration_rate },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-slate-50/80 rounded-lg px-3 py-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="h-3.5 w-3.5 text-slate-400" />
                          <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                        </div>
                        <p className="text-sm font-medium text-slate-800">{value ?? '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Symptoms</p>
                    </div>
                    <p className="text-sm text-slate-700 break-words whitespace-pre-wrap">{v.symptoms || '—'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Diagnosis</p>
                    </div>
                    <p className="text-sm text-slate-700 break-words whitespace-pre-wrap">{v.diagnosis || '—'}</p>
                  </div>
                  {v.prescription && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Pill className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Prescription</p>
                      </div>
                      <p className="text-sm text-slate-700 break-words whitespace-pre-wrap">{v.prescription}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 sm:px-6 py-4 gap-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-800">Patient Visits</h2>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Patient ID input + actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient code (e.g., 416863)"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 outline-none focus:border-slate-400 transition-colors bg-slate-50/50 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={loadVisits}
              disabled={loadingList}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Search className="h-4 w-4" /> {loadingList ? 'Loading...' : 'Load Visits'}
            </button>
            <button
              onClick={() => setShowCreate((s) => !s)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showCreate ? 'Close' : 'New Visit'}
            </button>
          </div>

          {/* Create Prescription form */}
          {showCreate && (
            <form
              onSubmit={handleSubmitVisit(onCreateVisit)}
              className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/40"
            >
              <p className="text-sm font-semibold text-slate-700">New Prescription</p>
              
              {/* Diagnosis & Notes */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Diagnosis <span className="text-red-400">*</span></label>
                  <textarea
                    rows={2}
                    {...registerVisit('diagnosis')}
                    className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none focus:border-slate-400 resize-none transition-colors ${
                      vErrors.diagnosis ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white'
                    }`}
                    placeholder="Enter diagnosis"
                  />
                  {vErrors.diagnosis && (
                    <p className="text-xs text-red-500 mt-1">{vErrors.diagnosis.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Notes</label>
                  <textarea
                    rows={2}
                    {...registerVisit('notes')}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white outline-none focus:border-slate-400 resize-none transition-colors"
                    placeholder="Additional notes (optional)"
                  />
                </div>
              </div>

              {/* Medications List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    <Pill className="h-3.5 w-3.5" />
                    Medications
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })}
                    className="text-xs text-slate-600 hover:text-slate-800 font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3 w-3" /> Add Medication
                  </button>
                </div>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-2 items-start bg-white border border-slate-200 p-3 rounded-lg">
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div>
                          <input
                            {...registerVisit(`medications.${index}.name`)}
                            placeholder="Drug Name"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-slate-400 bg-slate-50/50"
                          />
                          {vErrors.medications?.[index]?.name && (
                            <p className="text-xs text-red-500 mt-1">{vErrors.medications[index].name.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            {...registerVisit(`medications.${index}.dosage`)}
                            placeholder="Dosage (e.g. 500mg)"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-slate-400 bg-slate-50/50"
                          />
                          {vErrors.medications?.[index]?.dosage && (
                            <p className="text-xs text-red-500 mt-1">{vErrors.medications[index].dosage.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            {...registerVisit(`medications.${index}.frequency`)}
                            placeholder="Freq (e.g. 2x daily)"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-slate-400 bg-slate-50/50"
                          />
                          {vErrors.medications?.[index]?.frequency && (
                            <p className="text-xs text-red-500 mt-1">{vErrors.medications[index].frequency.message}</p>
                          )}
                        </div>
                        <div>
                          <input
                            {...registerVisit(`medications.${index}.duration`)}
                            placeholder="Duration (e.g. 5 days)"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-slate-400 bg-slate-50/50"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No medications added.</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    resetVisit();
                    setShowCreate(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={vSubmitting || creating}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-all ${
                    vSubmitting || creating
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600'
                  }`}
                >
                  <Calendar className="h-4 w-4" /> {vSubmitting || creating ? 'Saving…' : 'Save Prescription'}
                </button>
              </div>
            </form>
          )}

          {/* Visits table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vitals Summary</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Diagnosis</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingList ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-400" colSpan={4}>
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-[3px] border-slate-200 border-t-slate-700"></div>
                      <p className="mt-2 text-sm">Loading visits...</p>
                    </td>
                  </tr>
                ) : visits.length === 0 ? (
                  <tr>
                    <td className="px-5 py-10 text-center text-sm text-slate-400" colSpan={4}>
                      No visits found. Enter a patient code and click "Load Visits".
                    </td>
                  </tr>
                ) : (
                  visits.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-slate-800 font-medium whitespace-nowrap">{formatDate(row.visit_date)}</td>
                      <td className="px-5 py-3 text-slate-500">{summary(row)}</td>
                      <td className="px-5 py-3 text-slate-500">{row.diagnosis || '—'}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => openVisit(row)}
                          className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors whitespace-nowrap"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visits;