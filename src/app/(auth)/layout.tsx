"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black bg-noise flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Premium Cyber-Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Floating Animated Radial Orbs (Ambient Light) */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] left-[15%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          x: [0, -70, 60, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[10%] right-[15%] h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[130px] pointer-events-none"
      />

      {/* Auth Content Area */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
