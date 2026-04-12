import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <motion.div 
      className={`relative flex items-center justify-center ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background Shape: A soft-edged hexagon/shield */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <path 
          d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
          fill="url(#logoGradient)"
          className="transition-all duration-500"
        />
      </svg>

      {/* The Icon: Graduation Cap + Cloche Hybrid */}
      <svg viewBox="0 0 24 24" className="relative w-3/5 h-3/5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Cloche Base (Hospitality) */}
        <path d="M3 18h18" />
        <path d="M5 18a7 7 0 0 1 14 0" />
        
        {/* Graduation Cap Top (Scholarship) */}
        <motion.path 
          d="M12 4L4 8l8 4 8-4-8-4z" 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <path d="M4 8v4" />
        <path d="M20 8v4" />
        
        {/* Tassel */}
        <motion.path 
          d="M12 12v4" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    </motion.div>
  );
};

export const LogoText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-0.5 font-bold tracking-tight ${className}`}>
    <span className="text-slate-900 dark:text-white">Hospi</span>
    <span className="text-indigo-600 dark:text-indigo-400">Scholar</span>
  </div>
);
