import React from "react";
import { motion } from "motion/react";
import { ArrowDown, Calendar, Search, ShieldCheck } from "lucide-react";

interface HeroProps {
  timeOfDay: "morning" | "noon" | "night";
  onDiscoverClick: () => void;
  onBookNowClick: () => void;
}

export default function Hero({ timeOfDay, onDiscoverClick, onBookNowClick }: HeroProps) {
  return (
    <div 
      id="hero" 
      className="relative h-screen overflow-hidden flex flex-col justify-between cinematic-time-transition"
      style={{ background: "var(--sky-bg)" }}
    >
      {/* 1. Cinematic Background Simulated Flight Stage */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        
        {/* Stars Background for Night Mode */}
        <div 
          className="absolute inset-0 z-0 cinematic-time-transition overflow-hidden bg-transparent"
          style={{ opacity: "var(--stars-opacity)" }}
        >
          {/* Scattered stars with subtle flickering */}
          <div className="absolute top-[12%] left-[18%] w-1 h-1 bg-white rounded-full animate-flicker" />
          <div className="absolute top-[18%] left-[58%] w-1.5 h-1.5 bg-white rounded-full animate-flicker" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[8%] left-[78%] w-1 h-1 bg-white rounded-full animate-flicker" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[28%] left-[42%] w-1 h-1 bg-white rounded-full animate-flicker" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-[32%] left-[12%] w-1.5 h-1.5 bg-white rounded-full animate-flicker" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-[38%] left-[72%] w-1 h-1 bg-white rounded-full animate-flicker" style={{ animationDelay: "2.5s" }} />
          <div className="absolute top-[52%] left-[28%] w-1.5 h-1.5 bg-white rounded-full animate-flicker" style={{ animationDelay: "1.8s" }} />
          <div className="absolute top-[48%] left-[88%] w-1 h-1 bg-white rounded-full animate-flicker" style={{ animationDelay: "0.8s" }} />
        </div>

        {/* Luminous Sun/Moon Celestial Orb */}
        <div 
          className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full cinematic-time-transition"
          style={{
            background: "var(--sun-moon-color)",
            boxShadow: "var(--sun-moon-shadow)",
            transform: "var(--sun-moon-pos)",
          }}
        />

        {/* Volumetric Sunlight Rays / Haze */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 mix-blend-overlay cinematic-time-transition ray-shine"
          style={{ opacity: "var(--ray-opacity)" }}
        />

        {/* Living Video Cloud Overlay for High-Fidelity Texturing */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Drifting Clouds Layer (Simulating real-time depth) */}
        <div className="absolute inset-0 overflow-hidden z-1">
          {/* Cloud 1 */}
          <div className="absolute top-[15%] left-0 animate-drift" style={{ "--drift-duration": "100s" } as React.CSSProperties}>
            <svg className="w-48 h-auto opacity-50 cinematic-time-transition" viewBox="0 0 200 100" fill="var(--cloud-color)">
              <path d="M 50 80 A 30 30 0 0 1 80 50 A 40 40 0 0 1 150 50 A 30 30 0 0 1 180 80 Z" style={{ filter: "drop-shadow(0px 10px 15px var(--cloud-shadow))" }} />
            </svg>
          </div>
          {/* Cloud 2 */}
          <div className="absolute top-[42%] left-0 animate-drift" style={{ "--drift-duration": "160s" } as React.CSSProperties}>
            <svg className="w-72 h-auto opacity-40 cinematic-time-transition" viewBox="0 0 200 100" fill="var(--cloud-color)">
              <path d="M 50 80 A 35 35 0 0 1 90 45 A 45 45 0 0 1 160 50 A 30 30 0 0 1 190 80 Z" style={{ filter: "drop-shadow(0px 15px 20px var(--cloud-shadow))" }} />
            </svg>
          </div>
          {/* Cloud 3 */}
          <div className="absolute top-[62%] left-0 animate-drift" style={{ "--drift-duration": "210s" } as React.CSSProperties}>
            <svg className="w-56 h-auto opacity-35 cinematic-time-transition" viewBox="0 0 200 100" fill="var(--cloud-color)">
              <path d="M 30 80 A 25 25 0 0 1 60 55 A 35 35 0 0 1 120 50 A 25 25 0 0 1 150 80 Z" style={{ filter: "drop-shadow(0px 8px 12px var(--cloud-shadow))" }} />
            </svg>
          </div>
        </div>

        {/* Airport Runway Beacon Lights (At the horizon line) */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 flex justify-center items-end pb-3 space-x-8 cinematic-time-transition"
          style={{ opacity: "var(--airport-lights-opacity)" }}
        >
          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_#facc15]" />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: "0.2s" }} />
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" style={{ animationDelay: "0.4s" }} />
          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_#facc15]" style={{ animationDelay: "0.6s" }} />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" style={{ animationDelay: "0.8s" }} />
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" style={{ animationDelay: "1s" }} />
        </div>


        
        {/* Soft elegant vignette gradient for readable layouts */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-[#0B1220]/95 cinematic-time-transition" 
          style={{ background: "linear-gradient(to bottom, transparent 40%, var(--sky-overlay) 85%, var(--glass-bg) 100%)" }}
        />
      </div>

      {/* Spacing for Navigation Header */}
      <div className="h-28 z-10 pointer-events-none"></div>

      {/* Hero Content Center */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 -mt-24 select-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Label */}
          <span 
            className="text-xs md:text-sm font-bold tracking-widest mb-4 uppercase bg-white/40 border border-white/35 px-4 py-1.5 rounded-full backdrop-blur-md shadow-xs cinematic-time-transition" 
            style={{ 
              color: "var(--text-primary)", 
              borderColor: "var(--glass-border)", 
              background: "var(--glass-bg)" 
            }}
          >
            ✨ PRIVATE JETS
          </span>

          {/* Overlapping Hero Headings */}
          <h1 className="flex flex-col items-center select-none">
            <span 
              className="text-6xl md:text-7xl lg:text-8xl font-normal leading-none tracking-tighter cinematic-time-transition" 
              style={{ color: "var(--text-secondary)" }}
            >
              Premium.
            </span>
            <span 
              className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tighter -mt-3 md:-mt-4 lg:-mt-5 cinematic-time-transition"
              style={{ color: "var(--text-primary)" }}
            >
              Accessible.
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-base md:text-lg lg:text-xl mt-6 max-w-2xl font-light leading-relaxed cinematic-time-transition" 
            style={{ color: "var(--text-secondary)" }}
          >
            Your dedication deserves recognition. Compare flights from hundreds of airlines, charter custom routes, and book with absolute confidence.
          </p>

          {/* Buttons CTA */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center items-center z-20">
            <button
              onClick={onDiscoverClick}
              className="px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex items-center space-x-2 cinematic-time-transition border cursor-pointer"
              style={{
                color: "var(--text-primary)",
                borderColor: "var(--glass-border)",
                background: "var(--glass-bg)",
                boxShadow: "var(--button-glow)"
              }}
              id="hero-discover-btn"
            >
              <span>Discover</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={onBookNowClick}
              className="px-6 py-3 rounded-full font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center space-x-2 cinematic-time-transition cursor-pointer"
              style={{
                boxShadow: "var(--button-glow)",
                background: "var(--text-primary)",
                color: "var(--time-btn-text)"
              }}
              id="hero-book-btn"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Floating trust badge info */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 pb-8 hidden md:flex justify-between text-xs font-mono select-none">
        <div 
          className="flex items-center space-x-2 border py-1.5 px-4 rounded-full backdrop-blur-md cinematic-time-transition shadow-xs"
          style={{
            borderColor: "var(--glass-border)",
            background: "var(--glass-bg)",
            color: "var(--text-secondary)"
          }}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Secure Encrypted Booking</span>
        </div>
        <div 
          className="flex items-center space-x-2 border py-1.5 px-4 rounded-full backdrop-blur-md cinematic-time-transition shadow-xs"
          style={{
            borderColor: "var(--glass-border)",
            background: "var(--glass-bg)",
            color: "var(--text-secondary)"
          }}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Real-time Global Inventory Sync</span>
        </div>
      </div>
    </div>
  );
}

