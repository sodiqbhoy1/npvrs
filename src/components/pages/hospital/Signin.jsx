import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginHospital } from '../../../services/hospitalService';
import toast from 'react-hot-toast';

const Signin = () => {
  const navigate = useNavigate();
  
  const schema = yup.object({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required')
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values) => {
    try {
      const result = await loginHospital(values);
      
      // Check if login was successful
      if (result?.success === true && result?.data?.token) {
        // Store token and hospital data
        localStorage.setItem('hospitalToken', result.data.token);
        
        // Show success message
        toast.success(result.message || 'Login successful');

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/hospital/dashboard');
        }, 1500);
      } else {
        // Login failed - show error message
        toast.error(result?.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Handle errors from the service
      console.error('Login error:', error);
      toast.error(error?.message || 'An error occurred during login. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="min-h-screen py-10" style={{ backgroundColor: 'var(--color-background)' }}>
          <div className="w-full max-w-md mx-auto px-4">
            <div className="border p-6 sm:p-8" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-app)' }}>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 border mb-4" style={{ backgroundColor: 'var(--color-primary-light)', borderColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
                  <Building2 className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Sign In to NPVRS</h2>
                <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Access your hospital dashboard</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email or Hospital Code */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                    Email or Hospital Code
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      id="email"
                      {...register('email')}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm border outline-none transition-colors ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{
                        backgroundColor: errors.email ? '#FEF2F2' : 'var(--color-surface)',
                        borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        borderRadius: 'var(--radius-app)'
                      }}
                      placeholder="Enter email or hospital code"
                    />
                    {errors.email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AlertCircle className="h-5 w-5" style={{ color: 'var(--color-danger)' }} />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--color-danger)' }}>
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...register('password')}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-12 py-2.5 text-sm border outline-none transition-colors ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{
                        backgroundColor: errors.password ? '#FEF2F2' : 'var(--color-surface)',
                        borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        borderRadius: 'var(--radius-app)'
                      }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none disabled:cursor-not-allowed"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--color-danger)' }}>
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.password.message}
                    </p>
                  )}
                  <div className="mt-2 text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm font-medium transition-colors hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 text-sm font-medium text-white flex items-center justify-center gap-2 ${
                    isSubmitting ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  style={{
                    backgroundColor: isSubmitting ? 'var(--color-text-muted)' : 'var(--color-primary)',
                    borderRadius: 'var(--radius-app)'
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="font-medium transition-colors hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Signin;