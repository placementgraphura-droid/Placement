import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Mic, Target, Users, Award } from "lucide-react";

const Hero = () => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #09435F 0%, #0069A8 100%)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2 + 0.5,
            }}
            animate={{
              y: [null, -100, 100],
              x: [null, 50, -50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
          >

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Ace Your{" "}
              <span className="relative">
                <span className="relative z-10">Technical & Behavioral</span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 bg-white/30 -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
              <br />
              <span style={{ color: 'transparent', background: 'linear-gradient(to right, #FFFFFF, #2E84AE)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Interviews With Confidence
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
            >
              Master technical questions, behavioral interviews, and system design with AI-powered mock interviews, personalized feedback, and industry expert guidance.
            </motion.p>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            >
              {[
                "Real-time Feedback",
                "Company-specific Questions",
                "System Design Prep",
                "Salary Negotiation Tips"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#2E84AE' }} />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-white/30 transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: '#FFFFFF', color: '#09435F' }}
              >
                <a href="/intern-login" className="relative z-10 flex items-center justify-center gap-2">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Enroll Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, #2E84AE, #FFFFFF)' }}
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-xl"
            >
              {[
                { value: "87%", label: "Success Rate", icon: Target },
                { value: "500+", label: "Companies", icon: Users },
                { value: "50K+", label: "Questions", icon: Mic }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-5 h-5" style={{ color: '#2E84AE' }} />
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">
              {/* Main mock interview interface */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white text-sm">Live Mock Interview</div>
                </div>

                {/* AI Interviewer */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full" style={{ background: 'linear-gradient(to right, #2E84AE, #0069A8)' }}>
                    <span className="text-white font-bold flex items-center justify-center h-full">AI</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold mb-1">AI Interviewer</div>
                    <div className="bg-white/20 p-4 rounded-lg">
                      <p className="text-white">
                        "Tell me about a time you faced a technical challenge and how you overcame it..."
                      </p>
                    </div>
                    <div className="text-white/60 text-xs mt-2">Typing...</div>
                  </div>
                </div>

                {/* User Response */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full" style={{ background: 'linear-gradient(to right, #FFFFFF, #2E84AE)' }}>
                    <span className="text-white font-bold flex items-center justify-center h-full">Y</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold mb-1">You</div>
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <textarea
                        placeholder="Type your response here..."
                        className="w-full bg-transparent text-white placeholder-white/50 resize-none focus:outline-none"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="rounded-xl p-4" style={{ background: 'linear-gradient(to right, #09435F, #0069A8)' }}>
                  <div className="text-white font-bold mb-2">Live Feedback</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/20 p-2 rounded text-center">
                      <div className="text-white text-sm">Clarity</div>
                      <div className="text-white font-bold">85%</div>
                    </div>
                    <div className="bg-white/20 p-2 rounded text-center">
                      <div className="text-white text-sm">Technical</div>
                      <div className="text-white font-bold">92%</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-2xl"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="text-sm font-bold" style={{ color: '#0069A8' }}>Average Score</div>
                <div className="text-2xl font-bold" style={{ color: '#09435F' }}>4.8/5</div>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4" style={{ color: '#2E84AE' }}>★</div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -right-4 p-4 rounded-xl shadow-2xl"
                style={{ background: 'linear-gradient(to right, #09435F, #0069A8)' }}
              >
                <div className="text-sm font-bold text-white">Prep Topics</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {["DSA", "System Design", "Behavioral", "Leadership"].map((topic, index) => (
                    <div key={index} className="text-xs bg-white/20 px-2 py-1 rounded text-white">
                      {topic}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Glow effect */}
              <div 
                className="absolute inset-0 blur-3xl rounded-full -z-10"
                style={{ background: 'linear-gradient(to right, rgba(9, 67, 95, 0.2), rgba(46, 132, 174, 0.2))' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-white/60 text-sm animate-pulse">
          Try free mock interview
        </div>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto mt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full mx-auto mt-2" />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;