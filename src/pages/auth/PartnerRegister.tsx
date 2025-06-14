import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, MapPin, ArrowRight } from 'lucide-react';
import { PartnerAuthForm } from '../../components/auth/PartnerAuthForm';

export function PartnerRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    location: '',
    experience: '',
    referralSource: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessTypes = [
    'Independent Sales Professional',
    'Business Consultant',
    'Marketing Agency',
    'Freelance Networker',
    'Business Broker',
    'Other'
  ];

  const experienceLevels = [
    'Less than 1 year',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 2) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.businessType) {
        newErrors.businessType = 'Business type is required';
      }
      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      }
      if (!formData.experience) {
        newErrors.experience = 'Experience level is required';
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Redirect to dashboard or confirmation page
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Join Our Partnership</h2>
          <p className="mt-2 text-gray-400">Start earning commissions today</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            1
          </div>
          <div className={`h-1 w-16 ${
            currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-700'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            2
          </div>
        </div>

        {/* Registration Form */}
        <PartnerAuthForm
          type="register"
          onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit}
          isLoading={isLoading}
          errors={errors}
        >
          {currentStep === 1 ? (
            /* Step 1: Personal Information */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                <p className="text-gray-400 text-sm">Tell us about yourself</p>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                      placeholder="First name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>

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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                    placeholder="Enter your phone"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Password Fields */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border ${
                      errors.password ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Step 2: Business Information */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white">Business Information</h3>
                <p className="text-gray-400 text-sm">Tell us about your business</p>
              </div>

              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                      errors.businessName ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                    placeholder="Your business name"
                  />
                </div>
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-400">{errors.businessName}</p>
                )}
              </div>

              {/* Business Type */}
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Type
                </label>
                <select
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.businessType ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-400">{errors.businessType}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                      errors.location ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                    placeholder="City, Country"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                  Sales Experience
                </label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    errors.experience ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-400">{errors.experience}</p>
                )}
              </div>

              {/* Referral Source */}
              <div>
                <label htmlFor="referralSource" className="block text-sm font-medium text-gray-300 mb-2">
                  How did you hear about us? (Optional)
                </label>
                <input
                  id="referralSource"
                  type="text"
                  value={formData.referralSource}
                  onChange={(e) => handleInputChange('referralSource', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Google, LinkedIn, Friend referral, etc."
                />
              </div>

              {/* Terms & Marketing Consent */}
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-800 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-300">
                    I agree to the{' '}
                    <Link to="/terms" className="text-orange-500 hover:text-orange-400">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-orange-500 hover:text-orange-400">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-sm text-red-400">{errors.agreeTerms}</p>
                )}

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeMarketing}
                    onChange={(e) => handleInputChange('agreeMarketing', e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 rounded bg-gray-800 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-300">
                    I'd like to receive marketing communications and partnership updates
                  </span>
                </label>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{errors.general}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 px-4 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </div>
          )}
        </PartnerAuthForm>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 