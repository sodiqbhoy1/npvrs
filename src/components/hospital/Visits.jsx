import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Calendar,
  Pill,
  User,
  Plus,
  X,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createPrescription,
} from '../../services/hospitalService';

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
  // UI state
  const [creating, setCreating] = useState(false);
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

  // Create a new prescription
  const onCreatePrescription = async (values) => {
    if (!patientId.trim()) {
      toast.error('Enter a patient code first');
      return;
    }
    try {
      setCreating(true);
      const payload = {
        patientId: patientId.trim(),
        ...values,
      };
      
      const res = await createPrescription(payload);
      toast.success(res?.message || 'Prescription recorded');
      resetVisit();
      setShowCreate(false);
    } catch (e) {
      toast.error(e?.message || 'Failed to record prescription');
    } finally {
      setCreating(false);
    }
  };
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
              onClick={() => setShowCreate((s) => !s)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showCreate ? 'Close' : 'New Prescription'}
            </button>
          </div>

          {/* Create Prescription form */}
          {showCreate && (
            <form
              onSubmit={handleSubmitVisit(onCreatePrescription)}
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
                  <Calendar className="h-4 w-4" /> {vSubmitting || creating ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visits;