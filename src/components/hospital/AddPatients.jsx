import React, { useState } from 'react';
import {
  User, Phone, HeartPulse, AlertCircle, Home, Calendar, Droplet, Stethoscope,
  Transgender
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { addPatient } from '../../services/hospitalService';

// Allowed blood groups for dropdown
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Yup validation schema
const schema = yup.object({
  fullName: yup.string().trim().min(2, 'Enter at least 2 characters').required('Name is required'),
  address: yup.string().trim().min(5, 'Enter a valid address').required('Address is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('is-valid-date', 'Invalid date', (v) => !!v && !isNaN(new Date(v).getTime())),
  bloodGroup: yup.string().oneOf(BLOOD_GROUPS, 'Select a valid blood group').required('Blood group is required'),
  underlyingConditions: yup.string().trim().max(500, 'Keep it under 500 characters').optional(),
  gender: yup.string().oneOf(['Male', 'Female', 'Other'], 'Select a valid gender').required('Gender is required'),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/, 'Enter a valid phone number')
    .required('Phone is required'),
}).required();

const AddPatients = () => {
  const [success, setSuccess] = useState(false);

  // React Hook Form setup with Yup
  const {
    register,
    handleSubmit,
    reset,
    setError, // to map server field errors into the form
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      address: '',
      dateOfBirth: '',
      bloodGroup: '',
      underlyingConditions: '',
      gender: '',
      phone: '',
    },
  });

  // Submit: calls your API service
  const onSubmit = async (values) => {
    try {
      // Ensure dateOfBirth is ISO string (common backend format)
      const payload = {
        ...values,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
      };

      await addPatient(payload); // Service should attach Authorization internally
      toast.success('Patient registered successfully');
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Map backend validation errors to form fields if provided
      if (err?.fieldErrors && typeof err.fieldErrors === 'object') {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          setError(field, { type: 'server', message: message || 'Invalid value' });
        });
      }
      toast.error(err?.message || 'Failed to register patient');
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 sm:px-8 py-5">
          <h2 className="text-lg font-semibold text-white">Enroll New Patient</h2>
          <p className="text-slate-300 text-sm mt-0.5">Fill in the patient details below</p>
        </div>

        <div className="px-6 sm:px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  {...register('fullName')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-slate-400 transition-colors ${
                    errors.fullName ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'
                  }`}
                  placeholder="Enter patient name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Address</label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  rows={2}
                  {...register('address')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-slate-400 transition-colors resize-none ${
                    errors.address ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'
                  }`}
                  placeholder="Enter address"
                />
              </div>
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-slate-400 transition-colors ${
                      errors.dateOfBirth ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Gender</label>
                <div className="relative">
                  <Transgender className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    {...register('gender')}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-slate-400 transition-colors appearance-none ${
                      errors.gender ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.gender && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone and Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('phone')}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-slate-400 transition-colors ${
                      errors.phone ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'
                    }`}
                    placeholder="Phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    {...register('bloodGroup')}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-slate-400 transition-colors appearance-none ${
                      errors.bloodGroup ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                {errors.bloodGroup && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>
            </div>

            {/* Underlying Conditions */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Underlying Conditions (Optional)</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  rows={3}
                  {...register('underlyingConditions')}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-slate-400 transition-colors resize-none ${
                    errors.underlyingConditions ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'
                  }`}
                  placeholder="e.g., Hypertension, Asthma"
                />
              </div>
              {errors.underlyingConditions && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.underlyingConditions.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600'
              }`}
            >
              <HeartPulse className="h-4 w-4" />
              {isSubmitting ? 'Enrolling Patient...' : 'Enroll Patient'}
            </button>

            {success && (
              <div className="text-emerald-600 text-center text-sm font-medium mt-2">
                Patient added successfully!
              </div>
            )}
          </form>
        </div>
    </div>
  );
};


export default AddPatients;
