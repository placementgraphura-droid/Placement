import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  RefreshCw, 
  LogIn, 
  Mail, 
  Lock, 
  Shield,
  X,
  Key,
  ArrowLeft,
  CheckCircle,
  Clock,
  Hash
} from "lucide-react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createCaptcha = () => {
  const operations = [
    { op: "+", fn: (a, b) => a + b },
    { op: "-", fn: (a, b) => a - b },
    { op: "×", fn: (a, b) => a * b }
  ];
  const operation = operations[getRandomInt(0, 2)];
  const a = getRandomInt(1, 12);
  const b = getRandomInt(1, 12);
  const answer = operation.fn(a, b);
  return { 
    question: `${a} ${operation.op} ${b}`, 
    answer: answer.toString(),
    operation: operation.op
  };
};

const ResetPasswordForm = ({
  newPassword,
  setNewPassword,
  resetError,
  handleResetPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      {/* New Password */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-white/90">
          <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
          New Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 characters)"
            autoFocus
            className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#D4E5EE]"
            minLength="6"
          />

          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        <p className="text-white/60 text-xs mt-1">
          Password must be at least 6 characters long
        </p>
      </div>

      {resetError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-red-200 text-sm">
          {resetError}
        </div>
      )}

      <button
        type="button"
        onClick={handleResetPassword}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-600/90 hover:to-emerald-700/90 text-white font-semibold p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Reset Password</span>
      </button>
    </div>
  );
};

const LoginMentor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captcha, setCaptcha] = useState(createCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Forgot Password & Reset Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [userRole, setUserRole] = useState("mentor");

  const otpInputRef = useRef(null);
  const navigate = useNavigate();

  // OTP Timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Error animation
  useEffect(() => {
    if (error || resetError) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error, resetError]);

  // Auto focus OTP input when resetSent is true
  useEffect(() => {
    if (resetSent && otpInputRef.current && !otpVerified) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [resetSent, otpVerified]);

  // Check authentication
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("mentorToken");
      if (!token) return;

      try {
        await axios.get("/api/check-auth/mentor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/dashboard/mentor");
      } catch (err) {
        localStorage.removeItem("mentorToken",err);
      }
    };

    verifyAuth();
  }, [navigate]);

  // Reset modal states when closed
  const resetModalStates = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setOtpVerified(false);
    setResetEmail("");
    setOtpInput("");
    setNewPassword("");
    setResetError("");
    setResetToken("");
    setSuccess("");
    setResetLoading(false);
    setVerificationLoading(false);
    setOtpTimer(0);
  };

  // Login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    if (captchaInput !== captcha.answer) {
      setError("Captcha answer is incorrect. Please try again.");
      setCaptcha(createCaptcha());
      setCaptchaInput("");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/login/mentor", {
        email,
        password,
      });
      localStorage.setItem("mentorToken", res.data.token);
      navigate("/dashboard/mentor");
    } catch (err) { 
      setError(
        err.response?.data?.message ||
        "Invalid credentials. Please check your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setSuccess("");
    setResetLoading(true);

    if (!resetEmail) {
      setResetError("Please enter your email address.");
      setResetLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Please enter a valid email address.");
      setResetLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/forgot-password/mentor", {
        email: resetEmail
      });

      if (response.data.success) {
        setResetSent(true);
        setOtpTimer(300); // 5 minutes timer
        setSuccess(`OTP sent to ${resetEmail}. Please check your inbox.`);
        setUserRole("mentor");
        setOtpInput("");
      } else {
        setResetError(response.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setResetError(err.response?.data?.message || "Failed to send OTP. Please try again later.");
    } finally {
      setResetLoading(false);
    }
  };

  // OTP input handler
  const handleOtpInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtpInput(value);
      
      // Auto submit when 6 digits are entered
      if (value.length === 6) {
        setTimeout(() => verifyOTP(), 100);
      }
    }
  };

  // Verify OTP handler
  const verifyOTP = async () => {
    setResetError("");
    setSuccess("");
    setVerificationLoading(true);

    if (otpInput.length !== 6) {
      setResetError("Please enter all 6 digits of OTP.");
      setVerificationLoading(false);
      return;
    }

    if (otpTimer === 0) {
      setResetError("OTP has expired. Please request a new one.");
      setVerificationLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/verify-otp", {
        email: resetEmail,
        role: userRole,
        otp: otpInput
      });

      if (response.data.success) {
        setOtpVerified(true);
        setResetToken(response.data.resetToken);
        setSuccess("OTP verified successfully! You can now reset your password.");
      } else {
        setResetError(response.data.message || "OTP verification failed.");
      }
    } catch (err) {
      setResetError(err.response?.data?.message || "Failed to verify OTP. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  // Reset password handler
  const handleResetPassword = async () => {
    setResetError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", {
        email: resetEmail,
        role: userRole,
        resetToken: resetToken,
        newPassword: newPassword
      });

      if (response.data.success) {
        setSuccess("Password reset successfully! You can now login with your new password.");
        
        // Close modal after 3 seconds
        setTimeout(() => {
          resetModalStates();
        }, 3000);
      } else {
        setResetError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setResetError(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  // Resend OTP handler
  const resendOTP = async () => {
    setResetError("");
    setSuccess("");
    setOtpInput("");
    
    try {
      const response = await axios.post("/api/resend-otp", {
        email: resetEmail,
        role: userRole
      });

      if (response.data.success) {
        setOtpTimer(300); // Reset to 5 minutes
        setSuccess("New OTP sent to your email.");
        if (otpInputRef.current) {
          otpInputRef.current.focus();
        }
      } else {
        setResetError(response.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setResetError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaInput("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input key press
  const handleOtpKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyOTP();
    }
  };

  // Forgot Password Modal Component
  const ForgotPasswordModal = () => (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={resetModalStates}
      />
      
      {/* Modal Content */}
      <div 
        className="bg-gradient-to-br from-[#0D5D84] to-[#09435F] rounded-2xl p-6 w-full max-w-md relative border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetModalStates}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#3287B1]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            {!resetSent ? (
              <Key className="w-6 h-6 text-[#D4E5EE]" />
            ) : !otpVerified ? (
              <Hash className="w-6 h-6 text-[#D4E5EE]" />
            ) : (
              <Lock className="w-6 h-6 text-[#D4E5EE]" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {!resetSent ? "Forgot Password?" :
              !otpVerified ? "Verify OTP" :
                "Reset Password"}
          </h2>
          <p className="text-white/80 text-sm">
            {!resetSent ? "Enter your email to receive OTP" :
              !otpVerified ? `Enter 6-digit OTP sent to ${resetEmail}` :
                "Enter your new password"}
          </p>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          {!resetSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-white/90">
                  <Mail className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  required
                  autoFocus
                />
              </div>

              {resetError && (
                <div className={`bg-red-500/20 border border-red-500/30 rounded-lg p-3 ${shake ? 'animate-shake' : ''}`}>
                  <div className="flex items-center space-x-2 text-red-200">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{resetError}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{success}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-gradient-to-r from-[#3287B1] to-[#09435F] hover:from-[#3287B1]/90 hover:to-[#09435F]/90 text-white font-semibold p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
              >
                {resetLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Key className="w-5 h-5" />
                )}
                <span>{resetLoading ? "Sending..." : "Send OTP"}</span>
              </button>
            </form>
          ) : !otpVerified ? (
            <div className="space-y-4">
              {/* OTP Input */}
              <div className="space-y-3">
                <label className="flex items-center justify-between text-sm font-medium text-white/90">
                  <span className="flex items-center">
                    <Hash className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                    6-Digit OTP
                  </span>
                  {otpTimer > 0 && (
                    <span className="flex items-center text-amber-300 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(otpTimer)}
                    </span>
                  )}
                </label>
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="6"
                  value={otpInput}
                  onChange={handleOtpInputChange}
                  onKeyPress={handleOtpKeyPress}
                  placeholder="Enter 6-digit OTP"
                  className="w-full p-4 bg-white/10 border border-white/30 rounded-lg text-center text-2xl font-bold tracking-widest text-white focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 transition-all duration-200 placeholder-white/30"
                  autoComplete="off"
                  autoFocus
                />
                <div className="flex justify-center space-x-1 mt-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`w-10 h-1 rounded-full ${index < otpInput.length
                        ? 'bg-[#D4E5EE]'
                        : 'bg-white/20'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend OTP Button */}
              {otpTimer === 0 && (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="w-full text-[#D4E5EE] hover:text-white text-sm font-medium transition-colors py-2 flex items-center justify-center space-x-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Resend OTP</span>
                </button>
              )}

              {otpTimer > 0 && otpTimer <= 60 && (
                <p className="text-center text-amber-300 text-sm">
                  OTP expires in {otpTimer} seconds
                </p>
              )}

              {resetError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-200">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{resetError}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{success}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={verifyOTP}
                disabled={verificationLoading || otpInput.length !== 6 || otpTimer === 0}
                className="w-full bg-gradient-to-r from-[#3287B1] to-[#09435F] hover:from-[#3287B1]/90 hover:to-[#09435F]/90 text-white font-semibold p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
              >
                {verificationLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>{verificationLoading ? "Verifying..." : "Verify OTP"}</span>
              </button>
            </div>
          ) : (
            <ResetPasswordForm
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              resetError={resetError}
              handleResetPassword={handleResetPassword}
            />
          )}
        </div>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button
            onClick={resetModalStates}
            className="text-[#D4E5EE] hover:text-white transition-colors text-sm flex items-center justify-center space-x-1 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
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
      }}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 ">
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
          className="w-60 border-4shadow-lg" 
        />
      </div>

      {/* Main Container */}
      <div className="w-full top-5 max-w-lg mx-auto relative">
        {/* Transparent Glass Form */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Mentor Login
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Welcome back! Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <Mail className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4E5EE]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="flex items-center text-sm font-medium text-white/90">
                  <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#D4E5EE] hover:text-white transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 pr-10 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white placeholder-white/50 transition-all duration-200"
                  required
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

            {/* Captcha Section */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-white/90">
                <Shield className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Security Check
              </label>
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white/90">Solve this:</span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="flex items-center space-x-1 text-[#D4E5EE] hover:text-white transition-colors text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>New</span>
                  </button>
                </div>
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-center">
                    <span className="text-lg font-bold text-white font-mono">
                      {captcha.question}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-white">=</span>
                  <input
                    type="text"
                    placeholder="?"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-16 p-3 bg-white/10 border border-white/20 rounded-lg text-center text-lg font-bold font-mono focus:outline-none focus:border-[#D4E5EE] focus:ring-2 focus:ring-[#D4E5EE]/30 text-white transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`bg-red-500/20 border border-red-500/30 rounded-lg p-3 transform transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                <div className="flex items-center space-x-2 text-red-200">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && !showForgotPassword && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-green-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{success}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#3287B1] to-[#09435F] hover:from-[#3287B1]/90 hover:to-[#09435F]/90 text-white font-semibold p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Don't have an account?{" "}
              <a 
                href="/register-mentor" 
                className="font-semibold text-[#D4E5EE] hover:text-white transition-colors duration-200"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#3287B1]/20 rounded-full blur-xl -z-10"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#09435F]/20 rounded-full blur-xl -z-10"></div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && <ForgotPasswordModal />}

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

export default LoginMentor;