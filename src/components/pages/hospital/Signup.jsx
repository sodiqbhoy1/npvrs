import React, { useState } from 'react';
// Form management and schema validation
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import {Heart, Building2, MapPin, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Users, Activity, Database } from 'lucide-react';
import Footer from './Footer';
import Navbar from './Navbar';
import { Link } from 'react-router';
import { registerHospital } from '../../../services/hospitalService';
import toast from 'react-hot-toast';

// List of Nigerian States for the dropdown
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

const Signup = () => {
  const navigate = useNavigate();

  // 1) Define a simple Yup schema for validation (keeps rules in one place)
  const schema = yup.object({
    name: yup.string().trim().required('Hospital name is required'),
    address: yup.string().trim().required('Hospital address is required'),
    state: yup.string().required('State is required').notOneOf([''], 'Please select a state'),
    email: yup.string().email('Please enter a valid email address').required('Email address is required'),
    phone: yup.string().trim().min(10, 'Please enter a valid phone number').required('Phone number is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),
    terms: yup.boolean().oneOf([true], 'You must accept the terms')
  });

  // 2) Initialize react-hook-form with the schema
  const { register, handleSubmit, watch, setError, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      address: '',
      state: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  // Keep UI toggles for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit handler: sends valid data to backend and maps any field errors back to the form
  const onSubmit = async (values) => {
    // Drop confirmPassword and terms before sending
    const { confirmPassword: _CONFIRM, terms: _TERMS, ...payload } = values;
    
    try {
      console.log('Registering hospital with payload:', payload);
      const result = await registerHospital(payload);
      console.log('Registration result:', result);
      
      // Check for success property or if result itself suggests success (e.g. has id)
      // Some backends might return status: 201 or similar
      const isSuccess = result?.success === true || result?.status === 'success' || result?.status === 201 || !!result?.data?.id || (result?.message && !result?.error);

      if (isSuccess) {
        toast.success(result?.message || 'Hospital registered successfully! Redirecting to sign in...');
        
        reset();
        
        // Navigate to signin page
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        toast.error(result?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error?.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          setError(field, { type: 'server', message: String(message) });
        });
        toast.error('Please fix the errors in the form.');
      } else {
        toast.error(error?.message || 'Hospital registration failed. Please try again.');
      }
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;

    if (strength < 25) return { strength, label: 'Weak', color: 'var(--color-danger)' };
    if (strength < 50) return { strength, label: 'Fair', color: 'var(--color-warning)' };
    if (strength < 75) return { strength, label: 'Good', color: '#FFC107' };
    return { strength, label: 'Strong', color: 'var(--color-success)' };
  };

  // Use watch to get the current password value for live strength meter
  const watchedPassword = watch('password');
  const passwordStrength = getPasswordStrength(watchedPassword);

  return (
    <>
    <Navbar/>
    {/* Main wrapper adds space under fixed navbar and keeps layout stable on all screens */}
    <main className="pt-20">
    <div className="min-h-screen py-10" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left: Benefits Panel */}
          <div className="lg:col-span-2 text-white p-8 lg:p-10" style={{ backgroundColor: '#004d4d', borderRadius: 'var(--radius-app)' }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Join NPVRS</h1>
              <p style={{ color: '#B2D8D8' }}>Connect to Nigeria's National Patient Vital Record System</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-2 mr-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-app)' }}>
                  <Shield className="h-5 w-5" style={{ color: 'var(--color-primary-light)' }} />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Health Data</h3>
                  <p className="text-sm mt-1" style={{ color: '#B2D8D8' }}>Encrypted patient records with strict access controls</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 mr-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-app)' }}>
                  <Users className="h-5 w-5" style={{ color: 'var(--color-primary-light)' }} />
                </div>
                <div>
                  <h3 className="font-semibold">Unified Network</h3>
                  <p className="text-sm mt-1" style={{ color: '#B2D8D8' }}>Connect with healthcare facilities across Nigeria</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 mr-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-app)' }}>
                  <Activity className="h-5 w-5" style={{ color: 'var(--color-primary-light)' }} />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                  <p className="text-sm mt-1" style={{ color: '#B2D8D8' }}>Access insights for better patient care management</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 mr-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-app)' }}>
                  <Database className="h-5 w-5" style={{ color: 'var(--color-primary-light)' }} />
                </div>
                <div>
                  <h3 className="font-semibold">Interoperable System</h3>
                  <p className="text-sm mt-1" style={{ color: '#B2D8D8' }}>FHIR standards for seamless data exchange</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <p className="text-sm text-center" style={{ color: '#B2D8D8' }}>
                Already registered? <Link to="/signin" className="font-semibold underline hover:text-white" style={{ color: 'var(--color-primary-light)' }}>Sign in here</Link>
              </p>
            </div>
          </div>
          
          {/* Right: Form Panel */}
          <div className="lg:col-span-3">
            <div className="border p-6 sm:p-8 lg:p-10 w-full" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Hospital Registration</h2>
                <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Complete the form below to join our network</p>
              </div>
              
              {/* react-hook-form handles validation and submission via handleSubmit */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Hospital Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Hospital Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 border focus:outline-none transition-colors ${
                          errors.name ? 'border-red-400 bg-red-50' : ''
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          color: 'var(--color-text-primary)', 
                          backgroundColor: errors.name ? '#FEF2F2' : 'var(--color-surface)',
                          borderColor: errors.name ? 'var(--color-danger)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-app)'
                        }}
                        placeholder="Enter hospital name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Hospital Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none">
                        <MapPin className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                      <textarea
                        id="address"
                        {...register('address')}
                        disabled={isSubmitting}
                        rows={3}
                        className={`block w-full pl-10 pr-4 py-2.5 border focus:outline-none transition-colors resize-none ${
                          errors.address ? 'border-red-400 bg-red-50' : ''
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          color: 'var(--color-text-primary)', 
                          backgroundColor: errors.address ? '#FEF2F2' : 'var(--color-surface)',
                          borderColor: errors.address ? 'var(--color-danger)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-app)'
                        }}
                        placeholder="Enter complete hospital address"
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1.5 text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div className="md:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      State *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                      <select
                        id="state"
                        {...register('state')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 border focus:outline-none transition-colors ${
                          errors.state ? 'border-red-400 bg-red-50' : ''
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          color: 'var(--color-text-primary)', 
                          backgroundColor: errors.state ? '#FEF2F2' : 'var(--color-surface)',
                          borderColor: errors.state ? 'var(--color-danger)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-app)'
                        }}
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    {errors.state && (
                      <p className="mt-1.5 text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 border focus:outline-none transition-colors ${
                          errors.email ? 'border-red-400 bg-red-50' : ''
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          color: 'var(--color-text-primary)', 
                          backgroundColor: errors.email ? '#FEF2F2' : 'var(--color-surface)',
                          borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-app)'
                        }}
                        placeholder="hospital@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-4 py-2.5 border focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-400 bg-red-50' : ''
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          color: 'var(--color-text-primary)', 
                          backgroundColor: errors.phone ? '#FEF2F2' : 'var(--color-surface)',
                          borderColor: errors.phone ? 'var(--color-danger)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-app)'
                        }}
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1.5 text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        {...register('password')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-12 py-2.5 border focus:outline-none transition-colors ${
                          errors.password ? 'border-red-400 bg-red-50' : ''
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          color: 'var(--color-text-primary)', 
                          backgroundColor: errors.password ? '#FEF2F2' : 'var(--color-surface)',
                          borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-app)'
                        }}
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Password strength:</span>
                          <span className={`text-xs font-medium`} style={{ 
                            color: passwordStrength.strength < 50 ? 'var(--color-danger)' : 
                                   passwordStrength.strength < 75 ? 'var(--color-warning)' : 'var(--color-success)'
                          }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5" style={{ backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
                          <div 
                            className="h-1.5 transition-all duration-300"
                            style={{ 
                              width: `${passwordStrength.strength}%`,
                              backgroundColor: passwordStrength.color,
                              borderRadius: 'var(--radius-app)'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="mt-1.5 text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        {...register('confirmPassword')}
                        disabled={isSubmitting}
                        className={`block w-full pl-10 pr-12 py-2.5 border focus:outline-none transition-colors ${
                          errors.confirmPassword ? 'border-red-400 bg-red-50' : ''
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          color: 'var(--color-text-primary)', 
                          backgroundColor: errors.confirmPassword ? '#FEF2F2' : 'var(--color-surface)',
                          borderColor: errors.confirmPassword ? 'var(--color-danger)' : 'var(--color-border)',
                          borderRadius: 'var(--radius-app)'
                        }}
                        placeholder="Confirm your password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isSubmitting}
                          className="mr-2 disabled:cursor-not-allowed"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        {watch('confirmPassword') && watch('password') === watch('confirmPassword') && !errors.confirmPassword && (
                          <CheckCircle className="h-5 w-5" style={{ color: 'var(--color-success)' }} />
                        )}
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('terms')}
                    disabled={isSubmitting}
                    className="h-4 w-4 mt-0.5 border disabled:cursor-not-allowed"
                    style={{ 
                      accentColor: 'var(--color-primary)',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--radius-app)'
                    }}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    I agree to the <a href="#" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Terms of Service</a> and <a href="#" className="hover:underline" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm flex items-center" style={{ color: 'var(--color-danger)' }}>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.terms.message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 font-semibold text-white flex items-center justify-center gap-2 focus:outline-none ${
                    isSubmitting ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  style={{ 
                    backgroundColor: isSubmitting ? 'var(--color-text-muted)' : 'var(--color-primary)',
                    borderRadius: 'var(--radius-app)'
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 text-white" /> Register Hospital
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
    <Footer/>
    </>
  );
};

export default Signup;