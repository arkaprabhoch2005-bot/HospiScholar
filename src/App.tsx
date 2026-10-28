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
import { StudyNotesCatalogView } from './components/StudyNotesCatalogView';
import { NoteReaderView } from './components/NoteReaderView';
import { studyNotes, StudyNote } from './data/notes';
import { SEO } from './components/SEO';
import { Logo, LogoText } from './components/Logo';
import { AboutUsView, ContactUsView, PrivacyPolicyView } from './components/LegalViews';
import { Footer } from './components/Footer';

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
    { id: 'notes', label: 'Study Notes', icon: BookOpen, badge: 'Escoffier' },
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

        <div className="pt-4 mt-4 border-t border-slate-800/80 px-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Legal & Trust
          </div>
          <button
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'about' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>About Us</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'contact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Contact Us</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'privacy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Privacy Policy</span>
            <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.2 rounded font-semibold">AdSense</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

const MobileBottomNav = ({ activeTab, setActiveTab }: any) => {
  const navItems = [
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'guest-tracker', label: 'Guests', icon: Users },
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

// --- URL ROUTING HELPERS FOR SITEMAP & DIRECT LINKS ---
const parseUrlRoute = (): { tab: string; note: StudyNote | null } => {
  if (typeof window === 'undefined') return { tab: 'academics', note: null };
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');

  if (pathname.startsWith('notes/')) {
    const slug = pathname.replace(/^notes\//, '');
    const found = studyNotes.find((n) => n.slug === slug || n.id === slug);
    return { tab: 'notes', note: found || null };
  }

  const validTabs = [
    'academics', 'notes', 'guest-tracker', 'news', 'chat', 
    'ai-tutor', 'recipes', 'internship', 'mt-prep', 'trivia', 
    'profile', 'about', 'contact', 'privacy'
  ];
  if (validTabs.includes(pathname)) {
    return { tab: pathname, note: null };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const qNote = params.get('note');
    const qTab = params.get('tab');
    if (qNote) {
      const found = studyNotes.find((n) => n.slug === qNote || n.id === qNote);
      return { tab: 'notes', note: found || null };
    }
    if (qTab && validTabs.includes(qTab)) {
      return { tab: qTab, note: null };
    }
  } catch {}

  return { tab: 'academics', note: null };
};

const syncBrowserUrl = (tab: string, note?: StudyNote | null) => {
  try {
    let targetPath = '/';
    if (note) {
      targetPath = `/notes/${note.slug}`;
    } else if (tab && tab !== 'academics') {
      targetPath = `/${tab}`;
    }
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab, noteSlug: note?.slug }, '', targetPath);
    }
  } catch {}
};

// --- MAIN APP ---

export default function App() {
  const initialRoute = parseUrlRoute();
  const [activeTab, setActiveTab] = useState(initialRoute.tab);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(initialRoute.note);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress>({ score: 0, completedChapters: [] });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedNote(null);
    if (tab !== 'academics') {
      setSelectedSubject(null);
      setSelectedSem(null);
    }
    syncBrowserUrl(tab, null);
  };

  const handleSelectNote = (note: StudyNote | null) => {
    setSelectedNote(note);
    if (note) {
      syncBrowserUrl('notes', note);
    } else {
      syncBrowserUrl(activeTab, null);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = parseUrlRoute();
      setActiveTab(route.tab);
      setSelectedNote(route.note);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Instant Guest Scholar access for direct public content URLs (e.g. Google crawlers & deep links)
  useEffect(() => {
    if (!loading && !user) {
      const isDirectContent = 
        initialRoute.note !== null || 
        ['notes', 'about', 'privacy', 'contact', 'news', 'academics'].includes(initialRoute.tab);
      
      if (isDirectContent) {
        const guestUser = {
          uid: 'guest-' + Math.random().toString(36).substring(2, 9),
          displayName: 'Guest Scholar',
          isGuest: true,
          photoURL: null
        };
        setUser(guestUser);
        recordGuestVisit({
          name: 'Guest Scholar (Direct Content)',
          email: '',
          photoURL: '',
          method: 'guest',
          status: 'guest_access',
          uid: guestUser.uid
        });
      }
    }
  }, [loading, user]);

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
    // If a specific note is currently being viewed, show the NoteReaderView
    if (selectedNote) {
      return (
        <NoteReaderView 
          note={selectedNote} 
          onBack={() => handleSelectNote(null)} 
          isCompleted={progress.completedChapters.includes(selectedNote.id)}
          onToggleComplete={() => {
            const isDone = progress.completedChapters.includes(selectedNote.id);
            const newCompleted = isDone 
              ? progress.completedChapters.filter(id => id !== selectedNote.id)
              : [...progress.completedChapters, selectedNote.id];
            updateProgress({
              ...progress,
              completedChapters: newCompleted,
              score: isDone ? Math.max(0, progress.score - 20) : progress.score + 20
            });
          }}
        />
      );
    }

    switch(activeTab) {
      case 'academics':
        if (selectedSubject) return (
          <SubjectDetail 
            subject={selectedSubject} 
            onBack={() => setSelectedSubject(null)} 
            progress={progress} 
            updateProgress={updateProgress}
            onSelectNote={handleSelectNote}
          />
        );
        if (selectedSem) return (
          <SemesterDetail 
            semId={selectedSem} 
            onBack={() => setSelectedSem(null)} 
            onSelectSubject={setSelectedSubject}
            onSelectNote={handleSelectNote}
          />
        );
        return <AcademicsView onSelectSem={setSelectedSem} onSelectNote={handleSelectNote} />;
      case 'notes':
        return (
          <StudyNotesCatalogView 
            onSelectNote={handleSelectNote} 
            completedChapters={progress.completedChapters} 
          />
        );
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
      case 'about':
        return <AboutUsView onNavigate={handleTabChange} />;
      case 'contact':
        return <ContactUsView />;
      case 'privacy':
        return <PrivacyPolicyView />;
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
       <SEO 
         title="HospiScholar" 
         description="A comprehensive academic and community platform for hospitality students, featuring study resources, news, and real-time collaboration." 
       />
       <DesktopSidebar activeTab={activeTab} setActiveTab={handleTabChange} isDark={isDark} setIsDark={setIsDark} user={user} />
       <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative flex flex-col justify-between">
          <div>
            <Header isDark={isDark} setIsDark={setIsDark} user={user} activeTab={activeTab} setActiveTab={handleTabChange} />
            <div className="p-6 md:p-10 max-w-6xl mx-auto">
               {renderContent()}
            </div>
          </div>
          <Footer onNavigate={handleTabChange} />
       </main>
       <MobileBottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
}
