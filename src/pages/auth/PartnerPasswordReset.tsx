import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { PartnerAuthForm } from '../../components/auth/PartnerAuthForm';

export function PartnerPasswordReset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // TODO: Implement actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setIsEmailSent(true);
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
            <p className="text-gray-300 mb-6">
              We've sent a password reset link to <strong className="text-orange-500">{email}</strong>
            </p>
            <p className="text-gray-400 text-sm mb-8">
              If you don't see the email, check your spam folder or try again.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/auth/login"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
              
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                  setErrors({});
                }}
                className="w-full py-3 px-4 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="mt-2 text-gray-400">Enter your email to receive a reset link</p>
        </div>

        {/* Reset Form */}
        <PartnerAuthForm
          type="reset"
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errors={errors}
        >
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            {/* Back to Login */}
            <Link
              to="/auth/login"
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </PartnerAuthForm>
      </div>
    </div>
  );
} 