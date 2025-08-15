import React, { useState } from 'react';
import { Eye, EyeOff, MoreHorizontal, ChevronDown } from 'lucide-react';

function MobileLoginScreen() {
  const [email, setEmail] = useState('Joydeo@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    console.log('Sign in clicked');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleSignUp = () => {
    console.log('Sign up clicked');
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
        <div className="flex justify-between items-start px-6 pt-16 pb-12">
          <div>
            <h1 className="text-white text-4xl font-light leading-tight">Hello</h1>
            <h2 className="text-white text-4xl font-light">Sign in!</h2>
          </div>
          <MoreHorizontal className="text-white mt-2" size={24} />
        </div>

        {/* Login Form Card */}
        <div className="flex-1 bg-gray-50 rounded-t-3xl px-6 pt-8">
          <div className="w-full">
            
            {/* Email Field */}
            <div className="mb-8">
              <label className="block text-red-600 text-sm font-medium mb-3">
                Gmail
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-4 px-0 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors text-base"
                  placeholder="Enter your email"
                />
                <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-red-600 text-sm font-medium mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-4 px-0 pr-10 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors text-base"
                  placeholder="••••••••"
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

            {/* Forgot Password */}
            <div className="text-right mb-12">
              <button 
                onClick={handleForgotPassword}
                className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full py-4 text-white font-semibold rounded-full text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #a91b60 0%, #4a1229 100%)',
                boxShadow: '0 8px 32px rgba(169, 27, 96, 0.3)'
              }}
            >
              SIGN IN
            </button>

            {/* Footer */}
            <div className="text-center pt-12 pb-8">
              <p className="text-gray-500 text-sm mb-2">Don't have account?</p>
              <button 
                onClick={handleSignUp}
                className="text-gray-800 font-semibold text-sm hover:text-gray-600 transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileLoginScreen;