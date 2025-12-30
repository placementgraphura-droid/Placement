import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Camera, Upload, User, Eye, EyeOff, Mail, Phone, Briefcase, Shield, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const HiringTeamRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 0,
    privateKey: '',
    password: '',
    confirmPassword: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [shake, setShake] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(formData.password === value);
      }
    }

    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsSubmitting(false);
      return;
    }

    // Validate private key
    if (!formData.privateKey.trim()) {
      setMessage({ type: 'error', text: 'Private key is required' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('experience', formData.experience.toString());
      submitData.append('privateKey', formData.privateKey);
      submitData.append('password', formData.password);

      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      const response = await axios.post('/api/hiring-team/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setMessage({
          type: 'success',
          text: 'Registration successful! Redirecting to login...'
        });

        setTimeout(() => {
          navigate("/hiring-team-login");
        }, 2000);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          experience: 0,
          privateKey: '',
          password: '',
          confirmPassword: ''
        });
        setProfileImage(null);
        setPreviewImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setMessage({
        type: 'error',
        text: errorMessage
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsSubmitting(false);
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
      <div className="w-full top-10 max-w-2xl mx-auto relative py-8">
        {/* Transparent Glass Form */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-auto max-h-[90vh]">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              HR Team Registration
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Join our hiring team and help us find the best talent
            </p>
          </div>

          {/* Success/Error Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
              } ${shake ? 'animate-shake' : ''}`}>
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-200" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-200" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div
                  className="w-32 h-32 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center cursor-pointer overflow-hidden shadow-lg"
                  onClick={handleImageClick}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white/60" />
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Upload indicator */}
                <div className="absolute -bottom-2 -right-2 bg-[#3287B1] text-white p-2 rounded-full shadow-lg border border-white/20">
                  <Upload className="w-4 h-4" />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={handleImageClick}
                className="mt-4 text-[#D4E5EE] hover:text-white font-medium text-sm transition-colors"
              >
                {previewImage ? 'Change Photo' : 'Upload Profile Photo'}
              </button>

              <p className="text-xs text-white/60 mt-2 text-center">
                Click on the circle to upload your profile image (Max 5MB)
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                  <User className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Experience Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                  <Briefcase className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200 appearance-none"
                  placeholder="0"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                  <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-white/60 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                  <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4E5EE]/30 transition-all duration-200 ${!passwordMatch && formData.confirmPassword
                        ? 'border-red-300 bg-red-500/10'
                        : 'bg-white/10 border-white/30'
                      }`}
                    placeholder="Confirm your password"
                  />
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${!passwordMatch && formData.confirmPassword ? 'text-red-300' : 'text-[#D4E5EE]'}`} />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!passwordMatch && formData.confirmPassword && (
                  <p className="text-red-300 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Private Key Field */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-white/90 mb-2">
                  <Shield className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Private Key *
                </label>
                <div className="relative">
                  <input
                    type={showPrivateKey ? "text" : "password"}
                    name="privateKey"
                    value={formData.privateKey}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                    placeholder="Enter the private key provided to you"
                  />
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
                  <button
                    type="button"
                    onClick={togglePrivateKeyVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-[#D4E5EE]/80 mt-2">
                  Enter the private key provided by your administrator for secure authentication.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#3287B1] to-[#09435F] text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${isSubmitting
                    ? 'opacity-50 cursor-not-allowed hover:scale-100'
                    : 'hover:from-[#3287B1]/90 hover:to-[#09435F]/90 transform hover:scale-105'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="w-5 h-5" />
                    <span>Register Hiring Team Member</span>
                  </div>
                )}
              </button>
            </div>

            {/* Form Note */}
            <p className="text-sm text-white/70 text-center mt-4">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/hiring-team-login')}
                className="font-semibold text-[#D4E5EE] hover:text-white transition-colors duration-200 underline underline-offset-2"
              >
                Login
              </button>
            </p>
          </form>
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

        /* Remove number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default HiringTeamRegistration;