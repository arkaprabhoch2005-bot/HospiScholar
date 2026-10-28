/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, Sparkles, Utensils, Briefcase, 
  Newspaper, MessageSquare, Trophy, User, LogOut, Moon, Sun,
  Menu, X, ChevronRight, Search, Bell, Settings, Globe, ChefHat, Brain, ShieldCheck, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db, appId, recordGuestVisit } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { LoginPage } from './components/LoginPage';
import { GuestTrackerView } from './components/GuestTrackerView';
import { 
  AcademicsView, AITutorView, RecipeExchangeView, InternshipLogView,
  SemesterDetail, SubjectDetail, NewsFeed, GlobalChatView, 
  DailyChallengeView, ProfileView, MTPrepView
} from './components/Views';
import { Logo, LogoText } from './components/Logo';

interface UserProgress {
  score: number;
  completedChapters: string[];
}

// --- COMPONENTS ---

const Header = ({ 
  isDark, 
  setIsDark, 
  user, 
  activeTab, 
  setActiveTab 
}: { 
  isDark: boolean, 
  setIsDark: (v: boolean) => void, 
  user: any,
  activeTab: string,
  setActiveTab: (tab: string) => void
}) => (
  <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center md:hidden transition-colors">
    <div className="flex items-center gap-3">
      <Logo size="sm" />
      <LogoText className="text-lg" />
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setActiveTab('guest-tracker')}
        className={`p-2 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold ${
          activeTab === 'guest-tracker' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
        }`}
        title="Live Guest Tracker"
      >
        <Users className="w-4 h-4" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      </button>

      <button 
        onClick={() => setIsDark(!isDark)} 
        className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
         {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div 
        onClick={() => setActiveTab('profile')}
        className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        ) : (
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Guest'}`} alt="Profile" className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  </header>
);

const DesktopSidebar = ({ activeTab, setActiveTab, isDark, setIsDark, user }: any) => {
  const navItems = [
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'guest-tracker', label: 'Guest Tracker', icon: Users, badge: 'Live' },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'chat', label: 'Global Chat', icon: MessageSquare },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles },
    { id: 'recipes', label: 'Recipe Exchange', icon: ChefHat },
    { id: 'internship', label: 'Internship Log', icon: Briefcase },
    { id: 'mt-prep', label: 'MT Prep', icon: ShieldCheck },
    { id: 'trivia', label: 'Daily Trivia', icon: Brain },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.isGuest ? 'Guest Scholar' : 'Hospitality Scholar'));
  const userSubtitle = user?.isAdmin 
    ? 'System Administrator' 
    : (user?.isGuest ? 'Guest Scholar • Explorer' : 'Google Scholar • B.Sc. HHA');

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-900 dark:bg-slate-950 text-slate-300 border-r border-slate-800 shrink-0 transition-colors">
      <div className="p-8 flex items-center justify-between text-white mb-4">
        <div className="flex items-center gap-3">
          <Logo />
          <LogoText className="text-2xl text-white" />
        </div>
        <button onClick={() => setIsDark(!isDark)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-slate-800 dark:bg-slate-900 rounded-2xl p-4 flex items-center gap-3.5 border border-slate-750">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-700">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Guest'}`} alt="Profile" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate flex items-center gap-1.5">
              <span>{userDisplayName}</span>
              {user?.photoURL && (
                <img src="https://www.google.com/favicon.ico" alt="G" className="w-3 h-3 shrink-0" />
              )}
            </div>
            <div className="text-indigo-400 text-xs font-medium truncate">{userSubtitle}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isActive 
                    ? 'bg-indigo-700 text-white' 
                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  );
};

const MobileBottomNav = ({ activeTab, setActiveTab }: any) => {
  const navItems = [
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'guest-tracker', label: 'Guests', icon: Users },
    { id: 'mt-prep', label: 'MT Prep', icon: ShieldCheck },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-between items-center transition-colors">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors flex-1 min-w-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/50' : 'bg-transparent'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-medium truncate w-full px-1">{item.label}</span>
          </button>
        )
      })}
    </nav>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('academics');
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress>({ score: 0, completedChapters: [] });

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    let isMounted = true;
    try {
      const saved = localStorage.getItem('hospi_scholar_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read local storage:", e);
    }

    // Safety timeout in case Firebase Auth hangs or is blocked in cross-origin environments
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 1200);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (u) => {
        if (!isMounted) return;
        clearTimeout(safetyTimer);
        if (u) {
          setUser(u);
          localStorage.removeItem('hospi_scholar_user');
          // Track active signed-in session in Firestore
          await recordGuestVisit({
            name: u.displayName || u.email || 'Google Scholar',
            email: u.email || '',
            photoURL: u.photoURL || '',
            method: 'google',
            status: 'signed_in',
            uid: u.uid
          });
        } else {
          try {
            const saved = localStorage.getItem('hospi_scholar_user');
            if (saved) setUser(JSON.parse(saved));
            else setUser(null);
          } catch {
            setUser(null);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Auth state error:", error);
        if (isMounted) {
          clearTimeout(safetyTimer);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const handleAdminLogin = () => {
    const adminUser = {
      uid: 'admin-id',
      displayName: 'System Administrator',
      email: 'admin@hospischolar.com',
      photoURL: null,
      isAdmin: true
    };
    setUser(adminUser);
    localStorage.setItem('hospi_scholar_user', JSON.stringify(adminUser));
  };

  const handleGuestLogin = (guestUser: any) => {
    setUser(guestUser);
    localStorage.setItem('hospi_scholar_user', JSON.stringify(guestUser));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Logout error:", e);
    }
    localStorage.removeItem('hospi_scholar_user');
    setUser(null);
  };

  useEffect(() => {
    if (!db || !user?.uid) return;
    try {
      const progressRef = doc(db, 'artifacts', appId, 'users', user.uid, 'user_data', 'progress');
      const unsubscribe = onSnapshot(
        progressRef, 
        (docSnap) => {
          if (docSnap.exists()) setProgress(docSnap.data() as UserProgress);
        },
        (error) => {
          console.warn("Progress snapshot error:", error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Error setting up progress listener:", err);
    }
  }, [user]);

  const updateProgress = async (newProgress: UserProgress) => {
    setProgress(newProgress);
    if (!db || !user?.uid) return;
    try {
      const progressRef = doc(db, 'artifacts', appId, 'users', user.uid, 'user_data', 'progress');
      await setDoc(progressRef, newProgress, { merge: true });
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'academics':
        if (selectedSubject) return <SubjectDetail subject={selectedSubject} onBack={() => setSelectedSubject(null)} progress={progress} updateProgress={updateProgress} />;
        if (selectedSem) return <SemesterDetail semId={selectedSem} onBack={() => setSelectedSem(null)} onSelectSubject={setSelectedSubject} />;
        return <AcademicsView onSelectSem={setSelectedSem} />;
      case 'guest-tracker':
        return <GuestTrackerView currentUser={user} />;
      case 'news':
        return <NewsFeed />;
      case 'chat':
        return <GlobalChatView user={user} />;
      case 'ai-tutor':
        return <AITutorView />;
      case 'recipes':
        return <RecipeExchangeView user={user} />;
      case 'internship':
        return <InternshipLogView user={user} />;
      case 'mt-prep':
        return <MTPrepView />;
      case 'trivia':
        return <DailyChallengeView progress={progress} updateProgress={updateProgress} />;
      case 'profile':
        return <ProfileView user={user} progress={progress} onLogout={handleLogout} />;
      default:
        return <div className="p-20 text-center text-slate-400">Coming soon...</div>;
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!user) return (
    <LoginPage 
      onAdminLogin={handleAdminLogin} 
      onGuestLogin={handleGuestLogin} 
    />
  );

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-slate-950 font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
       <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} setIsDark={setIsDark} user={user} />
       <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
          <Header isDark={isDark} setIsDark={setIsDark} user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
             {renderContent()}
          </div>
       </main>
       <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
