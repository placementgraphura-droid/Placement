import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

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
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Master Your{" "}
              <span className="relative">
                <span className="relative z-10">Resume Unlock</span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 bg-white/30 -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
              <br />
              <span style={{ color: 'transparent', background: 'linear-gradient(to right, #FFFFFF, #2E84AE)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                Your Dream Career
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
            >
              Transform your resume into a powerful, ATS-optimized document that gets you interviews at top companies. Learn from industry experts.
            </motion.p>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            >
              {[
                "ATS-Friendly Templates",
                "Industry-Specific Examples",
                "1-on-1 Expert Review",
                "Interview Guarantee"
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
                <a href="/intern-login">
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
                { value: "95%", label: "Success Rate" },
                { value: "24hr", label: "Support" },
                { value: "10K+", label: "Placements" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">
              {/* Main image */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <img
                  src="https://storage.googleapis.com/ureify-strapi-assets/resume_building_for_freshers_9bbad96764/resume_building_for_freshers_9bbad96764.webp"
                  alt="Professional Resume Design"
                  className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl border-8 border-white/20"
                />
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
          Scroll to explore
        </div>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto mt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full mx-auto mt-2" />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;