import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, RefreshCw, LogIn, Mail, Lock, Shield } from "lucide-react";

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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState(createCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("interToken");
      if (!token) return;

      try {
        await axios.get("/api/check-auth/intern", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/dashboard/intern");
      } catch (err) {
        localStorage.removeItem("token", err);
      }
    };

    verifyAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email && !password) {
      setError("Please enter email or password to login.");
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
      const res = await axios.post("/api/login/intern", {
        email,
        password,
      });
      localStorage.setItem("interToken", res.data.token);
      navigate("/dashboard/intern");
    } catch (err) { 
      setError(
        err.response?.data?.message ||
        "Invalid credentials. Please check your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaInput("");
  };

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
              Candidate Login
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
              <label className="flex items-center text-sm font-medium text-white/90">
                <Lock className="w-4 h-4 mr-2 text-[#D4E5EE]" />
                Password
              </label>
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
                href="/register-intern" 
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

export default LoginPage;