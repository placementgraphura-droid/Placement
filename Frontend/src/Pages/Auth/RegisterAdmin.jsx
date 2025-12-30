import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield, LogIn, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    privateKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (message || error) {
      setMessage('');
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.privateKey) {
      setError('All fields are required');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/admin/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        privateKey: formData.privateKey
      });

      if (response.data.success) {
        setMessage('Admin registered successfully! Redirecting to login...');
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          privateKey: ''
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/admin-login');
        }, 2000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `
          linear-gradient(
            to bottom right,
            rgba(13,93,132,0.85),
            rgba(42,151,206,0.85),
            rgba(9,67,95,0.85)
          ),
          url('/herobg.png')
        `
      }}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(#FEFEFE 10px, transparent 10px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img 
          src="/logoWhite.png" 
          alt="Graphura Logo" 
          className="w-60" 
        />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto relative">
        {/* Transparent Glass Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Admin Registration
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Register as an administrator with valid private key
            </p>
          </div>

          {message && (
            <div className="mb-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className={`mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-4 transform transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
              <div className="flex items-center space-x-2 text-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <User className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Full Name *
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <Mail className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Enter your email address"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Enter password (min 6 characters)"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Private Key Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <Shield className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Private Key *
              </label>
              <div className="relative">
                <input
                  id="privateKey"
                  name="privateKey"
                  type={showPrivateKey ? "text" : "password"}
                  required
                  value={formData.privateKey}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Enter admin private key"
                />
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                <button
                  type="button"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-[#D4E5EE]/80">
                Contact system administrator to get the private key
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3287B1] to-[#09435F] hover:from-[#3287B1]/90 hover:to-[#09435F]/90 text-white font-semibold p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              <span>{loading ? "Registering..." : "Register Admin"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/70">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin-login')}
                className="w-full flex justify-center py-2 px-4 border border-white/30 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4E5EE]/30 transition-all duration-200"
              >
                Sign in to existing account
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#3287B1]/20 rounded-full blur-xl -z-10"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#09435F]/20 rounded-full blur-xl -z-10"></div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(212, 229, 238, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 229, 238, 0.5);
        }
      `}</style>
    </div>
  );
};

// You'll need to import Eye and EyeOff icons at the top
const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default AdminRegister;