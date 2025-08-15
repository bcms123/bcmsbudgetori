import React, { useState } from 'react';
import { Eye, EyeOff, MoreHorizontal, ChevronDown } from 'lucide-react';

function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = () => {
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Sign up clicked', formData);
  };

  const handleSignIn = () => {
    console.log('Sign in clicked');
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center" 
         style={{ 
           background: 'linear-gradient(135deg, #a91b60 0%, #7d1b4a 50%, #4a1229 100%)'
         }}>
      {/* Mobile Container - Wider on desktop, full width on mobile */}
      <div className="w-full max-w-sm md:max-w-lg lg:max-w-xl mx-auto min-h-screen flex flex-col" 
           style={{ 
             background: 'linear-gradient(135deg, #a91b60 0%, #7d1b4a 50%, #4a1229 100%)'
           }}>
        
        {/* Header Section */}
        <div className="flex justify-between items-start px-6 pt-16 pb-8">
          <div>
            <h1 className="text-white text-4xl font-light leading-tight">Create</h1>
            <h2 className="text-white text-4xl font-light">Account!</h2>
          </div>
          <MoreHorizontal className="text-white mt-2" size={24} />
        </div>

        {/* Signup Form Card */}
        <div className="flex-1 bg-gray-50 rounded-t-3xl px-6 pt-8">
          <div className="w-full">
            
            {/* Full Name Field */}
            <div className="mb-6">
              <div className="relative">
                <label className="absolute left-0 top-0 text-red-600 text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full pt-6 pb-4 px-0 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <div className="relative">
                <label className="absolute left-0 top-0 text-red-600 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pt-6 pb-4 px-0 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors text-base"
                  placeholder="Enter your email"
                  required
                />
                <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <div className="relative">
                <label className="absolute left-0 top-0 text-red-600 text-sm font-medium">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pt-6 pb-4 px-0 pr-10 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors text-base"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <div className="relative">
                <label className="absolute left-0 top-0 text-red-600 text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pt-6 pb-4 px-0 pr-10 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors text-base"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-red-600 hover:text-red-700 underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-red-600 hover:text-red-700 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSignUp}
              className="w-full py-4 text-white font-semibold rounded-full text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #a91b60 0%, #4a1229 100%)',
                boxShadow: '0 8px 32px rgba(169, 27, 96, 0.3)'
              }}
            >
              SIGN UP
            </button>

            {/* Footer */}
            <div className="text-center pt-8 pb-8">
              <p className="text-gray-500 text-sm mb-2">Already have an account?</p>
              <button 
                onClick={handleSignIn}
                className="text-gray-800 font-semibold text-sm hover:text-gray-600 transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupScreen;