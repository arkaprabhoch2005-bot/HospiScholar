import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, ChefHat, Briefcase, Sparkles, Lock, User, 
  ArrowRight, ShieldCheck, Globe, AlertCircle, CheckCircle2, Loader2, Sparkle, X, Copy, ExternalLink
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, recordGuestVisit, firebaseConfig } from '../firebase';
import { Logo, LogoText } from './Logo';
import { SEO } from './SEO';
import { AboutUsView, ContactUsView, PrivacyPolicyView } from './LegalViews';

interface LoginPageProps {
  onAdminLogin: () => void;
  onGuestLogin?: (guestUser: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAdminLogin, onGuestLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [domainCopied, setDomainCopied] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [legalModal, setLegalModal] = useState<'about' | 'contact' | 'privacy' | null>(null);

  const handleGoogleLogin = async () => {
    setError('');
    setUnauthorizedDomain(null);
    setLoadingGoogle(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        // Track the successful Google entry in Firestore
        await recordGuestVisit({
          name: result.user.displayName || result.user.email || 'Google Scholar',
          email: result.user.email || '',
          photoURL: result.user.photoURL || '',
          method: 'google',
          status: 'signed_in',
          uid: result.user.uid
        });
      }
    } catch (err: any) {
      console.warn('Google sign-in attempt warning:', err);
      let userFriendlyMsg = 'Google sign-in could not be completed. You can try again or use Guest Access below.';
      
      if (err?.code === 'auth/popup-closed-by-user') {
        userFriendlyMsg = 'The sign-in popup was closed before completing. Click again to sign in, or enter as Guest.';
      } else if (err?.code === 'auth/popup-blocked') {
        userFriendlyMsg = 'Your browser blocked the Google popup. Please allow popups or use instant Guest Access.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : '';
        setUnauthorizedDomain(host);
        userFriendlyMsg = '';
      } else if (err?.message) {
        userFriendlyMsg = err.message;
      }

      setError(userFriendlyMsg);

      // Track the attempted/failed entry in Firestore
      await recordGuestVisit({
        name: 'Guest Attempt',
        email: '',
        photoURL: '',
        method: 'google',
        status: 'failed',
        uid: 'attempt',
        errorDetails: err?.code || err?.message || 'Popup closed or blocked'
      });
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
      await recordGuestVisit({
        name: 'System Administrator',
        email: 'admin@hospischolar.com',
        photoURL: '',
        method: 'admin',
        status: 'signed_in',
        uid: 'admin-id'
      });
      onAdminLogin();
    } else {
      setError('Invalid credentials. (Hint: admin / admin or use Google/Guest)');
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGuest(true);
    const displayName = guestName.trim() || 'Guest Scholar';
    const guestUid = `guest-${Math.random().toString(36).substring(2, 9)}`;

    const guestUserObj = {
      uid: guestUid,
      displayName: displayName,
      email: `${displayName.toLowerCase().replace(/\s+/g, '')}@guest.local`,
      photoURL: null,
      isGuest: true,
      isAnonymous: true
    };

    // Track the guest entry in Firestore
    await recordGuestVisit({
      name: displayName,
      email: '',
      photoURL: '',
      method: 'guest',
      status: 'guest_access',
      uid: guestUid
    });

    if (onGuestLogin) {
      onGuestLogin(guestUserObj);
    } else {
      localStorage.setItem('hospi_scholar_user', JSON.stringify(guestUserObj));
      window.location.reload();
    }
    setLoadingGuest(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
      <SEO 
        title="Sign In & Guest Portal | HospiScholar" 
        description="Access HospiScholar curriculum notes, real-time hospitality industry news, sommelier engine, and hotel management study resources." 
      />
      {/* Left Side: Branding & Info */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <Logo size="lg" />
          <LogoText className="text-3xl" />
        </div>

        <div className="max-w-xl relative my-8 md:my-0">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-[80px] animate-pulse delay-700 pointer-events-none"></div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[0.95] tracking-tight mb-8 relative z-10"
          >
            Elevate Your <span className="text-indigo-600">Hospitality</span> Career.
          </motion.h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 relative z-10">
            The premier platform for IHM scholars and hospitality leaders to master curriculum, share culinary masteries, and track professional milestones.
          </p>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Academic Roadmap</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2.5 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Recipe Exchange</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Internship Logs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">AI Study Tutor</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex flex-wrap items-center gap-3 font-medium">
            <button 
              type="button"
              onClick={() => setLegalModal('about')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              About Us
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => setLegalModal('contact')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Contact Us
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => setLegalModal('privacy')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <span>Privacy Policy</span>
              <span className="text-[9px] px-1 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded font-bold">AdSense</span>
            </button>
          </div>
          <span className="text-slate-400 text-[11px] font-medium shrink-0">
            © 2026 HospiScholar
          </span>
        </div>
      </div>

      {/* Right Side: Login Action */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50 dark:bg-slate-950 relative">
        <div className="absolute inset-0 overflow-hidden opacity-25 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500 rounded-full blur-[130px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full blur-[130px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isGuestMode ? 'Enter as Guest Scholar' : 'Welcome to HospiScholar'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isGuestMode ? 'Access the platform with instant guest privileges' : 'Sign in with Google or continue as a guest visitor'}
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex flex-col gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
                {!isGuestMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsGuestMode(true);
                      setError('');
                    }}
                    className="self-end text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Enter as Guest Instead <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dedicated Firebase Authorized Domain Resolver Card */}
          <AnimatePresence>
            {unauthorizedDomain && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-5 rounded-2xl bg-indigo-50/90 dark:bg-slate-800/90 border-2 border-indigo-200 dark:border-indigo-800/80 text-xs space-y-3.5 shadow-sm text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
                    <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Authorize Domain in Firebase</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUnauthorizedDomain(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  Firebase Authentication requires your current deployment domain to be listed in your Firebase project's <strong>Authorized domains</strong> list before Google Sign-In can authenticate visitors.
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Domain to Authorize:
                  </span>
                  <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-indigo-100 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200">
                    <span className="truncate select-all font-medium">{unauthorizedDomain}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(unauthorizedDomain);
                        setDomainCopied(true);
                        setTimeout(() => setDomainCopied(false), 2500);
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-sans font-semibold shrink-0 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      {domainCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{domainCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-indigo-100/70 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-200">30-Second Fix in Firebase Console:</div>
                  <ol className="list-decimal list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                    <li>Click <strong>Open Firebase Settings</strong> below</li>
                    <li>Scroll down to <strong>Authorized domains</strong> ➔ Click <strong>Add domain</strong></li>
                    <li>Paste <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">{unauthorizedDomain}</code> and click <strong>Save</strong></li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <span>Open Firebase Settings</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGuestMode(true);
                      setUnauthorizedDomain(null);
                      setError('');
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-center py-1"
                  >
                    Continue as Guest Scholar →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isGuestMode ? (
            <>
              {/* Primary: Real Google Sign-In */}
              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 py-4 px-4 rounded-2xl font-bold text-slate-800 dark:text-slate-100 hover:bg-indigo-50/30 dark:hover:bg-slate-750 transition-all shadow-md group disabled:opacity-75 disabled:cursor-not-allowed mb-4"
              >
                {loadingGoogle ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              {/* Secondary: Instant Guest Mode Button */}
              <button
                type="button"
                onClick={() => setIsGuestMode(true)}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-semibold text-sm transition-all mb-6 border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
              >
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>Continue as Guest Visitor</span>
              </button>

              <div className="relative flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Or Administrator Login</span>
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              </div>

              {/* Admin / Username Login */}
              <form onSubmit={handleManualLogin} className="space-y-3.5 mb-6">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Username (e.g. admin)"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-100 dark:border-slate-700 pl-11 pr-4 py-3 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all dark:text-white"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-100 dark:border-slate-700 pl-11 pr-4 py-3 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all dark:text-white"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-sm transition-all shadow-md"
                >
                  Admin Login
                </button>
              </form>
            </>
          ) : (
            /* Guest Entry Form */
            <form onSubmit={handleGuestSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Your Name or Handle
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="e.g. Guest Scholar / Priya"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 pl-11 pr-4 py-3 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all dark:text-white font-medium"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Enter your name to explore curriculum modules and culinary resources.
                </span>
              </div>

              <button 
                type="submit" 
                disabled={loadingGuest}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {loadingGuest ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Enter HospiScholar Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsGuestMode(false);
                  setError('');
                }}
                className="w-full text-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 transition-colors"
              >
                ← Return to Google & Admin Sign-in
              </button>
            </form>
          )}

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified academic and culinary knowledge platform</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500 pt-1">
              <button 
                type="button" 
                onClick={() => setLegalModal('about')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                About Us
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => setLegalModal('contact')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Contact Us
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => setLegalModal('privacy')} 
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Legal Dialog Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex items-center justify-center overflow-y-auto"
            onClick={() => setLegalModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <Logo size="sm" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {legalModal === 'about' && 'About HospiScholar'}
                    {legalModal === 'contact' && 'Contact HospiScholar Team'}
                    {legalModal === 'privacy' && 'Privacy Policy & Google AdSense Disclosures'}
                  </span>
                </div>
                <button 
                  onClick={() => setLegalModal(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto flex-1">
                {legalModal === 'about' && <AboutUsView onNavigate={() => setLegalModal(null)} />}
                {legalModal === 'contact' && <ContactUsView />}
                {legalModal === 'privacy' && <PrivacyPolicyView />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
