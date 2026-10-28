import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Shield, CheckCircle2, AlertCircle, Clock, Search, 
  Filter, Smartphone, Monitor, Globe, RefreshCw, Sparkles, UserCheck, Eye, LogIn
} from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db, appId, GuestVisitRecord } from '../firebase';
import { SEO } from './SEO';

interface GuestTrackerViewProps {
  currentUser: any;
}

export const GuestTrackerView: React.FC<GuestTrackerViewProps> = ({ currentUser }) => {
  const [visits, setVisits] = useState<(GuestVisitRecord & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<'all' | 'google' | 'guest' | 'failed'>('all');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchVisitsOnce = async () => {
    if (!db || !currentUser?.isAdmin) {
      setLoading(false);
      return;
    }
    try {
      const visitsRef = collection(db, 'artifacts', appId, 'public', 'data', 'guest_visits');
      const q = query(visitsRef, orderBy('timestamp', 'desc'), limit(100));
      const snap = await getDocs(q);
      const docs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GuestVisitRecord & { id: string }));
      setVisits(docs);
      setLastRefreshed(new Date());
    } catch (err) {
      console.warn('Fallback getDocs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!db || !currentUser?.isAdmin) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    try {
      const visitsRef = collection(db, 'artifacts', appId, 'public', 'data', 'guest_visits');
      const q = query(visitsRef, orderBy('timestamp', 'desc'), limit(100));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!isMounted) return;
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as GuestVisitRecord & { id: string }));
          setVisits(docs);
          setLoading(false);
          setLastRefreshed(new Date());
        },
        async (error) => {
          console.warn('Guest visits listener warning:', error);
          if (isMounted) {
            await fetchVisitsOnce();
          }
        }
      );
    } catch (err) {
      console.warn('Error initiating guest visit listener:', err);
      fetchVisitsOnce();
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch {
          // ignore cleanup error
        }
      }
    };
  }, []);

  // Access Guard: only available during admin login
  if (!currentUser?.isAdmin) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/40 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Privileges Required</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The Guest Tracker and visitor analytics dashboard is confidential and only accessible during administrator sessions.
        </p>
      </div>
    );
  }

  // Stats computation
  const totalVisits = visits.length;
  const googleVisits = visits.filter(v => v.method === 'google' && v.status === 'signed_in').length;
  const guestVisits = visits.filter(v => v.method === 'guest' || v.status === 'guest_access').length;
  const failedAttempts = visits.filter(v => v.status === 'failed' || v.status === 'attempted').length;

  // Filtered list
  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (visit.userAgent && visit.userAgent.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMethod === 'google') return visit.method === 'google' && visit.status === 'signed_in';
    if (filterMethod === 'guest') return visit.method === 'guest' || visit.status === 'guest_access';
    if (filterMethod === 'failed') return visit.status === 'failed' || visit.status === 'attempted';
    return true;
  });

  const getDeviceIcon = (ua?: string) => {
    if (!ua) return <Globe className="w-4 h-4 text-slate-400" />;
    const lower = ua.toLowerCase();
    if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
      return <Smartphone className="w-4 h-4 text-indigo-400" />;
    }
    return <Monitor className="w-4 h-4 text-emerald-400" />;
  };

  const getBrowserSummary = (ua?: string) => {
    if (!ua) return 'Web Browser';
    if (ua.includes('Edg/')) return 'Edge Browser';
    if (ua.includes('Chrome/')) return 'Google Chrome';
    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Apple Safari';
    if (ua.includes('Firefox/')) return 'Mozilla Firefox';
    return 'Web Browser';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <SEO 
        title="Front Office Guest Tracker & Live Visitor Log | HospiScholar" 
        description="Real-time guest tracking dashboard monitoring signed-in Google scholars, guest arrivals, and visit telemetry."
      />
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Guest & Visitor Tracker
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Real-time tracking of visitors, Google authenticated scholars, and entry attempts into HospiScholar.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Live Stream • {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <button
            onClick={() => fetchVisitsOnce()}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Recorded</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{totalVisits}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Site entry activities</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Sign-Ins</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{googleVisits}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verified Google accounts</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Passes</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{guestVisits}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Instant guest explorations</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auth Inquiries</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{failedAttempts}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Interrupted or popup issues</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visitor by name, email, or device..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterMethod('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterMethod === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All Activity ({visits.length})
          </button>
          <button
            onClick={() => setFilterMethod('google')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterMethod === 'google'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Google Logins ({googleVisits})
          </button>
          <button
            onClick={() => setFilterMethod('guest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterMethod === 'guest'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Guest Passes ({guestVisits})
          </button>
          <button
            onClick={() => setFilterMethod('failed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterMethod === 'failed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Auth Warnings ({failedAttempts})
          </button>
        </div>
      </div>

      {/* Visitor Logs List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Live Visitor Stream</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {filteredVisits.length} Records
            </span>
          </div>
          <span className="text-xs text-slate-400">Synced to Firestore Database</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Loading guest records from database...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-lg">No visitor logs match your filter</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'Try clearing your search query to see all guest visits.' : 'When users or guests sign in or enter the site, their visits will appear here live.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-[600px] overflow-y-auto">
            {filteredVisits.map((visit) => {
              const isGoogle = visit.method === 'google' && visit.status === 'signed_in';
              const isGuest = visit.method === 'guest' || visit.status === 'guest_access';
              const isFailed = visit.status === 'failed' || visit.status === 'attempted';

              return (
                <div key={visit.id} className="p-4 md:p-5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Visitor Profile Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm">
                        {visit.photoURL ? (
                          <img 
                            src={visit.photoURL} 
                            alt={visit.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${visit.uid || visit.name}`} 
                            alt={visit.name} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                      {isGoogle ? (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full shadow flex items-center justify-center p-0.5">
                          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow">
                          G
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-base truncate">
                          {visit.name}
                        </span>
                        {isGoogle && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Google Verified
                          </span>
                        )}
                        {isGuest && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md text-[11px] font-bold">
                            Guest Scholar
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-md text-[11px] font-bold">
                            <AlertCircle className="w-3 h-3" /> Attempt Alert
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {visit.email && (
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {visit.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          {getDeviceIcon(visit.userAgent)}
                          <span>{getBrowserSummary(visit.userAgent)}</span>
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          UID: {visit.uid.slice(0, 10)}...
                        </span>
                      </div>

                      {visit.errorDetails && (
                        <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded inline-block font-mono">
                          Note: {visit.errorDetails}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timestamp & Status Badge */}
                  <div className="flex md:flex-col items-end justify-between md:justify-center shrink-0 text-right">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {visit.time || new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {visit.date || new Date(visit.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
