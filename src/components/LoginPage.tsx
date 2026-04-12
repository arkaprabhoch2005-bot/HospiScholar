import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, GraduationCap, ChefHat, Briefcase, Sparkles, Lock, User } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

import { Logo, LogoText } from './Logo';

export const LoginPage = ({ onAdminLogin }: { onAdminLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onAdminLogin();
    } else {
      setError('Invalid credentials. Hint: admin/admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Branding & Info */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Logo size="lg" />
          <LogoText className="text-3xl" />
        </div>

        <div className="max-w-xl relative">
          {/* Animated Background Blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-[80px] animate-pulse delay-700 pointer-events-none"></div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[0.9] tracking-tight mb-8 relative z-10"
          >
            Elevate Your <span className="text-indigo-600">Hospitality</span> Career.
          </motion.h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-12 relative z-10">
            The all-in-one platform for IHM students to master academics, share culinary secrets, and track professional growth.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-medium">Academic Roadmap</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-medium">Recipe Exchange</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-medium">Internship Logs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-medium">AI Study Tutor</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-400">
          © 2026 HospiScholar. Built for the next generation of hoteliers.
        </div>
      </div>

      {/* Right Side: Login Action */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 relative">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h3>
            <p className="text-slate-500 dark:text-slate-400">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-indigo-500 transition-all dark:text-white"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 pl-12 pr-4 py-3 rounded-2xl outline-none focus:border-indigo-500 transition-all dark:text-white"
              />
            </div>
            {error && <p className="text-xs text-red-500 font-medium px-2">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
            >
              Login
            </button>
          </form>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
            <span className="text-xs font-bold text-slate-400 uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-200 transition-all shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Google Account
          </button>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy Policy. 
              Your data is securely stored in our encrypted database.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
