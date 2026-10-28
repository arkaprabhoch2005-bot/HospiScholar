import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, ChevronRight, ArrowLeft, Calendar, FileText, Bookmark, 
  ShieldCheck, CheckCircle, RotateCw, Camera, GraduationCap, X, Download,
  Trophy, Flame, Send, Sparkles, Plus, Trash2, Newspaper, MessageSquare,
  Briefcase, LogOut, Wine, Search, Utensils, ExternalLink, Radio, Globe, 
  Clock, Tag, RefreshCw, Zap, Filter, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  semesters, newsArticles, ongoingCurrentAffairs, 
  dailyQuiz, ihmCampuses 
} from '../constants';
import { db, appId } from '../firebase';
import { 
  collection, addDoc, onSnapshot, query, orderBy, limit, doc, deleteDoc, Timestamp 
} from 'firebase/firestore';

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string;
  instructions: string;
  authorUid: string;
  authorName: string;
  timestamp: any;
}

export interface InternshipEntry {
  id?: string;
  date: string;
  department: string;
  tasks: string;
  learning: string;
}

export const AcademicsView = ({ onSelectSem }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Academic Roadmap</h1>
      <p className="text-slate-500 dark:text-slate-400">Select your current semester to access syllabus and study materials.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {semesters.map(sem => (
        <button 
          key={sem.id}
          onClick={() => onSelectSem(sem.id)}
          className="text-left bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            S{sem.id}
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{sem.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{sem.subtitle}</p>
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>{sem.subjects.length} Subjects</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);

export const AITutorView = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer || "I couldn't generate a response." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[75vh] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">AI Hospitality Tutor</h1>
        <p className="text-slate-500 dark:text-slate-400">Ask anything about culinary arts, F&B service, or hotel management.</p>
      </div>
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
              <Sparkles className="w-12 h-12 mb-4 text-indigo-500 opacity-50" />
              <p className="font-medium">Hello! I'm your AI Hospitality Tutor.</p>
              <p className="text-sm">Try asking: "What are the 5 mother sauces?" or "Explain yield management in hotels."</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask your tutor..."
            className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
          />
          <button onClick={handleSend} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const RecipeExchangeView = ({ user }: { user: any }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: '', instructions: '' });

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'recipes'), orderBy('timestamp', 'desc'), limit(20));
    return onSnapshot(
      q,
      (snapshot) => {
        setRecipes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe)));
      },
      (err) => {
        console.warn("Recipes listener warning:", err);
      }
    );
  }, []);

  const handleAdd = async () => {
    if (!newRecipe.title || !db || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'recipes'), {
      ...newRecipe,
      authorUid: user.uid,
      authorName: user.displayName || 'Guest Chef',
      timestamp: Timestamp.now()
    });
    setNewRecipe({ title: '', ingredients: '', instructions: '' });
    setShowAdd(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Recipe Exchange</h1>
          <p className="text-slate-500 dark:text-slate-400">Share and discover culinary secrets from fellow students.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" /> Share Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{recipe.title}</h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-4">By {recipe.authorName}</p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Ingredients</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{recipe.ingredients}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Instructions</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{recipe.instructions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Share Your Recipe</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><X /></button>
              </div>
              <input 
                placeholder="Recipe Title" 
                value={newRecipe.title}
                onChange={e => setNewRecipe(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <textarea 
                placeholder="Ingredients (one per line)" 
                rows={4}
                value={newRecipe.ingredients}
                onChange={e => setNewRecipe(prev => ({ ...prev, ingredients: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <textarea 
                placeholder="Instructions" 
                rows={6}
                value={newRecipe.instructions}
                onChange={e => setNewRecipe(prev => ({ ...prev, instructions: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <button onClick={handleAdd} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Post Recipe</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const InternshipLogView = ({ user }: { user: any }) => {
  const [entries, setEntries] = useState<InternshipEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ date: new Date().toISOString().split('T')[0], department: 'Food Production', tasks: '', learning: '' });

  useEffect(() => {
    if (!db || !user) return;
    const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'internship_log'), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternshipEntry)));
      },
      (err) => {
        console.warn("Internship log listener warning:", err);
      }
    );
  }, [user]);

  const handleAdd = async () => {
    if (!newEntry.tasks || !db || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'internship_log'), newEntry);
    setNewEntry({ date: new Date().toISOString().split('T')[0], department: 'Food Production', tasks: '', learning: '' });
    setShowAdd(false);
  };

  const handleDelete = async (id: string) => {
    if (!db || !user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'internship_log', id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Internship Log</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your daily learnings and tasks during industrial training.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" /> New Entry
        </button>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{entry.date}</span>
                <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{entry.department}</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium">{entry.tasks}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">Learning: {entry.learning}</p>
            </div>
            <button onClick={() => entry.id && handleDelete(entry.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No entries yet. Start logging your internship journey!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Log Daily Tasks</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><X /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" 
                  value={newEntry.date}
                  onChange={e => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none dark:text-white"
                />
                <select 
                  value={newEntry.department}
                  onChange={e => setNewEntry(prev => ({ ...prev, department: e.target.value }))}
                  className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none dark:text-white"
                >
                  <option>Food Production</option>
                  <option>F&B Service</option>
                  <option>Front Office</option>
                  <option>Housekeeping</option>
                </select>
              </div>
              <textarea 
                placeholder="Tasks performed..." 
                rows={3}
                value={newEntry.tasks}
                onChange={e => setNewEntry(prev => ({ ...prev, tasks: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <textarea 
                placeholder="Key learnings..." 
                rows={3}
                value={newEntry.learning}
                onChange={e => setNewEntry(prev => ({ ...prev, learning: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <button onClick={handleAdd} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Save Entry</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SemesterDetail = ({ semId, onBack, onSelectSubject }: any) => {
  const sem = semesters.find(s => s.id === semId);
  if (!sem) return null;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap
      </button>

      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
           <GraduationCap className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{sem.title}</h1>
          <p className="text-indigo-100 text-lg font-medium mb-4">{sem.subtitle}</p>
          <p className="text-indigo-50/90 max-w-2xl leading-relaxed">{sem.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sem.subjects.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <button 
              key={idx} 
              onClick={() => onSelectSubject(sub)}
              className="text-left bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start gap-5 hover:shadow-md hover:border-indigo-100 transition-all group w-full"
            >
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3.5 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{sub.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 self-center" />
            </button>
          )
        })}
      </div>
    </motion.div>
  );
};

export const SubjectDetail = ({ subject, onBack, progress, updateProgress }: any) => {
  const Icon = subject.icon;
  
  const mockChapters = [
    { id: `${subject.name}_ch1`, title: "Chapter 1: Introduction & Fundamentals", topics: "Basic terminology, history, and scope.", icon: FileText },
    { id: `${subject.name}_ch2`, title: "Chapter 2: Equipment & Layouts", topics: "Identification, safe handling, and workspace design.", icon: FileText },
    { id: `${subject.name}_ch3`, title: "Chapter 3: Standard Operating Procedures", topics: "Step-by-step guides for daily tasks.", icon: FileText },
  ];

  const handleMarkChapterCompleted = (chapterId: string) => {
    if (!progress.completedChapters.includes(chapterId)) {
      updateProgress({ 
        ...progress, 
        completedChapters: [...progress.completedChapters, chapterId] 
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subjects
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-6">
         <div className="bg-indigo-50 dark:bg-indigo-900/30 p-5 rounded-2xl text-indigo-600 dark:text-indigo-400">
           <Icon className="w-10 h-10" />
         </div>
         <div>
           <h1 className="text-2xl font-bold dark:text-white">{subject.name}</h1>
           <p className="text-slate-500 dark:text-slate-400">{subject.desc}</p>
         </div>
      </div>

      <div className="space-y-4">
         {mockChapters.map(chapter => {
           const isCompleted = progress.completedChapters.includes(chapter.id);
           return (
             <div 
               key={chapter.id} 
               className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-5"
             >
               <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400">
                  <chapter.icon className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <h3 className={`font-bold ${isCompleted ? 'text-slate-400 line-through' : 'dark:text-white'}`}>{chapter.title}</h3>
                  <p className="text-sm text-slate-500">{chapter.topics}</p>
               </div>
               <button 
                 onClick={() => handleMarkChapterCompleted(chapter.id)}
                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
               >
                 {isCompleted ? 'Completed' : 'Mark as Read'}
               </button>
             </div>
           )
         })}
      </div>
    </motion.div>
  );
};

export const NewsFeed = () => {
  const [activeSubTab, setActiveSubTab] = useState<'industry' | 'current_affairs'>('industry');
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [groundingInfo, setGroundingInfo] = useState<{ searchQueries: string[]; sources: { title: string; uri: string }[] }>({
    searchQueries: [],
    sources: [],
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [autoSync, setAutoSync] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSources, setShowSources] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Initial load
  useEffect(() => {
    fetchLiveNews(false);
  }, []);

  // Background timer for relative last updated calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-sync polling every 120 seconds (2 minutes)
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchLiveNews(true);
    }, 120000);
    return () => clearInterval(interval);
  }, [autoSync]);

  const fetchLiveNews = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const url = `/api/news/live${forceRefresh ? '?refresh=true' : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      if (data.articles && Array.isArray(data.articles)) {
        setLiveNews(data.articles);
      }
      if (data.grounding) {
        setGroundingInfo(data.grounding);
      }
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setSecondsAgo(0);
    } catch (err) {
      console.warn("Could not fetch real-time news from server, using local feed:", err);
      if (liveNews.length === 0) {
        setLiveNews(newsArticles);
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Industry',
    'Hospitality Tech',
    'Luxury & Resorts',
    'F&B Trends',
    'Sustainability',
    'Aviation & Tourism'
  ];

  const filteredNews = liveNews.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'hospitality tech':
        return 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800';
      case 'sustainability':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'luxury & resorts':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'f&b trends':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'aviation & tourism':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      default:
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header with Live Status & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Live Wire
              </span>

              <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold">
                <Globe className="w-3.5 h-3.5 text-indigo-300" />
                Google Search Grounded
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {secondsAgo < 5 ? "Synced just now" : `Synced ${secondsAgo}s ago`} {lastUpdated ? `(${lastUpdated})` : ''}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hospitality Industry Live Wire</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time breaking developments across global luxury chains, Indian hotel markets, culinary trends, and hospitality technologies, constantly updated via Google Search Grounding.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Auto-Sync Toggle */}
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                autoSync 
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle automatic real-time sync every 2 minutes"
            >
              <Radio className={`w-3.5 h-3.5 ${autoSync ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              Auto-Sync: {autoSync ? 'ON' : 'PAUSED'}
            </button>

            {/* Force Refresh Button */}
            <button
              onClick={() => fetchLiveNews(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-indigo-500/20 disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Grounding Live Data...' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Search Grounding Queries Pill Strip */}
        {groundingInfo.searchQueries && groundingInfo.searchQueries.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Live Search Queries:
            </span>
            {groundingInfo.searchQueries.map((q, idx) => (
              <span key={idx} className="bg-slate-800/90 text-indigo-200 border border-slate-700/80 text-xs px-2.5 py-1 rounded-lg font-mono">
                "{q}"
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Verified Web Sources Dropdown Accordion */}
      {groundingInfo.sources && groundingInfo.sources.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Verified Google Search Grounded Web Sources ({groundingInfo.sources.length})</span>
              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                Authentic Citations
              </span>
            </div>
            {showSources ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence>
            {showSources && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-5 pb-4 border-t border-slate-100 dark:border-slate-700/60"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {groundingInfo.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-700/80 group transition-all text-xs"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {src.title || src.uri}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main Subtabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSubTab('industry')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'industry'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            Live Industry Stream
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-black">
              {liveNews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('current_affairs')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'current_affairs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Curriculum Current Affairs
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {ongoingCurrentAffairs.length}
            </span>
          </button>
        </div>

        {activeSubTab === 'industry' && (
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search headlines or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs pl-9 pr-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent dark:border-slate-700 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Pills Strip */}
      {activeSubTab === 'industry' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content Stream */}
      {activeSubTab === 'industry' ? (
        <div>
          {loading && liveNews.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl h-96 animate-pulse border border-slate-100 dark:border-slate-700 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-44 bg-slate-200 dark:bg-slate-700 rounded-2xl w-full"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6"></div>
                  </div>
                  <div className="h-8 bg-slate-100 dark:bg-slate-750 rounded-xl w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map(article => (
                <article
                  key={article.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700/80 flex flex-col transition-all group"
                >
                  {/* Image with Category & Time Pill */}
                  <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={article.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border shadow-sm ${getCategoryColor(article.category)}`}>
                        {article.category || 'Hospitality'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold flex items-center gap-1.5 drop-shadow">
                        <Clock className="w-3.5 h-3.5 text-indigo-300" />
                        {article.publishedAt || article.date || 'Live update'}
                      </span>
                      {article.sourceName && (
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md font-semibold text-[11px] text-slate-200">
                          {article.sourceName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Hospitality Academic / Practical Takeaway */}
                      {article.keyTakeaway && (
                        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-0.5">
                                Industry Takeaway for IHM Students:
                              </span>
                              <span className="text-indigo-800 dark:text-indigo-300/90 leading-relaxed">
                                {article.keyTakeaway}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer with Tags and Source Link */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {article.tags && article.tags.map((tag: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            <Tag className="w-2.5 h-2.5 opacity-60" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {article.sourceUrl && (
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline shrink-0"
                        >
                          <span>Full Coverage</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-8">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No matching news articles found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try resetting your filter or searching for another term.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-4 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Curriculum Current Affairs for Exam Prep */
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
              These recurring policy and institutional updates are aligned with the NCHMCT semester syllabus, focusing on ministry schemes, star-classification norms, and hospitality taxation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ongoingCurrentAffairs.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                      Curriculum Standard
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">{item.topic}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- DATASET: F&B Curriculum Standards (Wine & Food) ---
const pairingMatrix = [
  {
    id: 1,
    foodCategory: "Light Seafood & Crisp Salads",
    foodExamples: ["Oysters", "Ceviche", "Grilled Shrimp", "Light Green Salads", "Lemon Herb Chicken", "Sashimi"],
    wineStyles: "Crisp, High-Acidity Whites & Dry Rosé",
    broadWineType: "White & Rosé",
    classicMatches: ["Sauvignon Blanc", "Pinot Grigio", "Provençal Rosé", "Chenin Blanc", "Albariño", "Grüner Veltliner", "Vermentino", "Chablis", "Sancerre", "Vinho Verde", "Muscadet", "Torrontés", "Pinot Blanc"],
    theory: "Match acidity with acidity. The bright, zippy acidity of a crisp white acts like a squeeze of fresh lemon, elevating and complementing the delicate flavors of seafood and salads without overpowering them.",
    foodInfo: "Delicate, light-weight dishes that rely on freshness, herbal notes, and high natural acidity.",
    wineInfo: "These wines are known for their mouth-watering acidity, light body, and complete lack of heavy oak aging.",
    color: "bg-green-50 border-green-200 text-green-900"
  },
  {
    id: 2,
    foodCategory: "Fried Foods & Earthy Dishes",
    foodExamples: ["Fried Calamari", "Charcuterie Boards", "Mushroom Risotto", "Roast Pork", "Truffle Fries", "Fried Chicken"],
    wineStyles: "Traditional Method Sparklers & Light, Earthy Reds",
    broadWineType: "Sparkling & Light Red",
    classicMatches: ["Champagne", "Prosecco", "Cava", "Crémant", "Franciacorta", "Chardonnay (Lightly Oaked)", "Pinot Noir", "Gamay", "Beaujolais", "Blanc de Blancs"],
    theory: "Contrast texture and cut through fat. The high acidity and carbonation in sparkling wines act as a scrubbing bubble, cutting directly through rich, fried, or salty foods to cleanse the palate after every bite.",
    foodInfo: "Rich, textural dishes—often with crispy exteriors, salty profiles, or earthy, mushroom-based notes.",
    wineInfo: "Bubbly wines cleanse the palate perfectly, while light earthy reds harmonize with umami/mushroom notes.",
    color: "bg-amber-50 border-amber-200 text-amber-900"
  },
  {
    id: 3,
    foodCategory: "Roasted Poultry & Sweet/Savory Dishes",
    foodExamples: ["Roast Turkey", "Grilled Salmon", "Pork Chops", "Butternut Squash Ravioli", "Chicken Piccata"],
    wineStyles: "Medium-Bodied Whites & Fruity, Low-Tannin Reds",
    broadWineType: "White & Medium Red",
    classicMatches: ["Chardonnay (Oaked)", "Merlot", "Pinot Noir", "Rioja Crianza", "Côtes du Rhône", "Viognier", "Barbera", "White Burgundy", "Cabernet Franc", "Grenache"],
    theory: "Complementary weight. The fruit-forward nature and medium body of these wines pair beautifully with roasted white meats and dishes combining subtle sweet and savory elements. Avoid overly tannic reds which can taste metallic with these foods.",
    foodInfo: "Medium-weight dishes featuring caramelized roasting notes, pork, or subtle sweet-savory combinations.",
    wineInfo: "Offering a perfect balance of fruit and subtle structure, these highly versatile wines won't overpower delicate flavors.",
    color: "bg-orange-50 border-orange-200 text-orange-900"
  },
  {
    id: 4,
    foodCategory: "Rich, Fatty Meats & Hearty Stews",
    foodExamples: ["Ribeye Steak", "Braised Short Ribs", "Grilled Lamb Chops", "Rich Bolognese Pasta", "Venison"],
    wineStyles: "Bold, Highly Tannic Reds & Rich Whites",
    broadWineType: "Full-bodied Red & Rich White",
    classicMatches: ["Cabernet Sauvignon", "Chianti Classico", "Zinfandel", "Nebbiolo", "Barolo", "Brunello", "Bordeaux Blend", "Syrah", "Shiraz", "Malbec", "Tempranillo", "Rioja Reserva", "Amarone"],
    theory: "Fat binds to tannins. The heavy proteins and fats in rich meats act as a palate cleanser for the harsh, astringent tannins found in big red wines, making the wine taste incredibly smooth and fruit-forward.",
    foodInfo: "Heavy, intensely savory dishes with high protein and fat content that coat the mouth.",
    wineInfo: "Heavy, full-bodied wines with high tannin levels that physically require rich foods to soften their astringent grip.",
    color: "bg-rose-50 border-rose-200 text-rose-900"
  },
  {
    id: 5,
    foodCategory: "Rich Desserts & Intensely Salty Bites",
    foodExamples: ["Dark Chocolate", "Foie Gras", "Pecan Pie", "Fruit Tarts", "Roasted Walnuts", "Salted Caramel"],
    wineStyles: "Sweet Dessert Wines & Fortified Wines",
    broadWineType: "Dessert & Fortified",
    classicMatches: ["Vintage Port", "Tawny Port", "Sauternes", "Late Harvest Riesling", "Icewine", "Tokaji", "Pedro Ximénez Sherry", "Banyuls", "Moscato d'Asti"],
    theory: "The classic Sweet & Salty contrast. The sugar in the dessert wine beautifully balances extreme saltiness or intense richness, creating a harmonious third flavor on the palate.",
    foodInfo: "Intensely sweet, salty, or rich delicacies that would completely destroy a dry table wine.",
    wineInfo: "Wines with elevated residual sugar levels, offering honeyed, nectar-like sweetness to contrast bold savory notes.",
    color: "bg-indigo-50 border-indigo-200 text-indigo-900"
  },
  {
    id: 6,
    foodCategory: "Spicy & Aromatic Asian Cuisine",
    foodExamples: ["Spicy Thai Curry", "Peking Duck", "Indian Samosas", "Roasted Root Vegetables", "Pad Thai", "Spicy Tuna Roll"],
    wineStyles: "Aromatic Whites & Earthy, Light Reds",
    broadWineType: "Aromatic White & Earthy Red",
    classicMatches: ["Gewürztraminer", "Off-dry Riesling", "Pinot Gris", "Cru Beaujolais", "Pinot Noir (Earthy)", "Châteauneuf-du-Pape (White)", "Sauternes"],
    theory: "Mirror the aromatics and tame the heat. Highly aromatic, slightly sweet whites (off-dry) coat the palate to soothe spicy heat, while simultaneously matching the intense floral aromas of ingredients like ginger, lemongrass, and chili.",
    foodInfo: "Dishes featuring complex spice blends, moderate heat, and highly fragrant aromatic ingredients.",
    wineInfo: "Highly aromatic wines with pronounced floral/fruit notes and sometimes a touch of sweetness to cool the palate.",
    color: "bg-yellow-100 border-yellow-300 text-yellow-900"
  },
  {
    id: 7,
    foodCategory: "Casual Bites & Tomato-Based Dishes",
    foodExamples: ["Margherita Pizza", "Grilled Burgers", "Tomato Bruschetta", "Simple Tapas", "Spaghetti Pomodoro"],
    wineStyles: "Light, Fruity & Unobtrusive Wines",
    broadWineType: "Light White, Red & Rosé",
    classicMatches: ["Pinot Blanc", "Soave", "Dolcetto", "Valpolicella", "Lambrusco", "White Zinfandel", "Chenin Blanc", "Merlot (Light)"],
    theory: "Do no harm. Mild dishes are easily overwhelmed, and acidic tomatoes can make heavy wines taste flat. Pairing them with light, highly approachable, and intensely fruity wines ensures the food's flavors shine.",
    foodInfo: "Simple, everyday foods with mild flavors or bright, high-acid tomato bases.",
    wineInfo: "Easy-drinking, unpretentious wines with bright fruit flavors and very little tannin or oak interference.",
    color: "bg-teal-50 border-teal-200 text-teal-900"
  },
  {
    id: 8,
    foodCategory: "Smoked & Barbecued Meats",
    foodExamples: ["Texas BBQ Brisket", "Grilled Sausages", "Smoked Ribs", "Chili con Carne", "Pulled Pork"],
    wineStyles: "Spicy, Oaked, or Smoky Reds",
    broadWineType: "Full-bodied & Oaked Red",
    classicMatches: ["Syrah", "Carménère", "Pinotage", "Zinfandel", "Oaked Chardonnay", "Rioja (Oaked)", "Châteauneuf-du-Pape"],
    theory: "Like with like. The smoky phenols from the grill pair brilliantly with wines aged in heavily toasted oak barrels, or with grapes (like Syrah or Pinotage) that naturally exhibit smoky, tobacco, or peppery characteristics.",
    foodInfo: "Foods heavily flavored by wood smoke, char, and sweet, tangy, or spicy barbecue sauces.",
    wineInfo: "Wines that naturally express notes of black pepper and tobacco, or acquire toasty, smoky notes from resting in charred oak barrels.",
    color: "bg-stone-100 border-stone-300 text-stone-900"
  }
];

const itemOrigins: Record<string, string> = {
  "Ceviche": "Peru", "Peking Duck": "Beijing, China", "Margherita Pizza": "Naples, Italy",
  "Indian Samosas": "India", "Spicy Thai Curry": "Thailand", "Texas BBQ Brisket": "Texas, USA",
  "Truffle Fries": "Belgium / France", "Foie Gras": "France", "Rich Bolognese Pasta": "Bologna, Italy",
  "Pad Thai": "Thailand", "Spicy Tuna Roll": "Japan", "Spaghetti Pomodoro": "Campania, Italy",
  "Sauvignon Blanc": "Loire Valley & Bordeaux, France", "Pinot Grigio": "Northern Italy", "Provençal Rosé": "Provence, France", 
  "Chenin Blanc": "Loire Valley, France", "Albariño": "Galicia, Spain", "Grüner Veltliner": "Austria", 
  "Chablis": "Burgundy, France", "Sancerre": "Loire Valley, France", "Champagne": "Champagne, France", 
  "Prosecco": "Veneto, Italy", "Cava": "Catalonia, Spain", "Franciacorta": "Lombardy, Italy", 
  "Chardonnay (Lightly Oaked)": "Burgundy, France (Origin)", "Pinot Noir": "Burgundy, France", "Beaujolais": "Beaujolais, France", 
  "Chardonnay (Oaked)": "Global, notably California & Burgundy", "Merlot": "Bordeaux, France", "Rioja Crianza": "La Rioja, Spain", 
  "Côtes du Rhône": "Rhône Valley, France", "Cabernet Sauvignon": "Bordeaux, France", "Chianti Classico": "Tuscany, Italy", 
  "Zinfandel": "Croatia (Origin) / California, USA", "Nebbiolo": "Piedmont, Italy", "Barolo": "Piedmont, Italy", 
  "Brunello": "Tuscany, Italy", "Syrah": "Rhône Valley, France", "Malbec": "Cahors, France / Mendoza, Argentina", 
  "Tempranillo": "Spain", "Vintage Port": "Douro Valley, Portugal", "Tawny Port": "Douro Valley, Portugal", 
  "Sauternes": "Bordeaux, France", "Icewine": "Germany & Canada", "Moscato d'Asti": "Piedmont, Italy", 
  "Gewürztraminer": "Alsace, France / Germany", "Off-dry Riesling": "Germany", "Cru Beaujolais": "Beaujolais, France",
  "Lambrusco": "Emilia-Romagna, Italy", "Carménère": "Bordeaux, France / Chile", "Pinotage": "South Africa"
};

const wineTypes: Record<string, string> = {
  "Sauvignon Blanc": "White Wine", "Pinot Grigio": "White Wine", "Provençal Rosé": "Rosé Wine",
  "Chenin Blanc": "White Wine", "Albariño": "White Wine", "Grüner Veltliner": "White Wine",
  "Vermentino": "White Wine", "Chablis": "White Wine", "Sancerre": "White Wine",
  "Vinho Verde": "White Wine", "Muscadet": "White Wine", "Torrontés": "White Wine",
  "Pinot Blanc": "White Wine", "Champagne": "Sparkling Wine", "Prosecco": "Sparkling Wine",
  "Cava": "Sparkling Wine", "Crémant": "Sparkling Wine", "Franciacorta": "Sparkling Wine",
  "Chardonnay (Lightly Oaked)": "White Wine", "Pinot Noir": "Red Wine", "Gamay": "Red Wine",
  "Beaujolais": "Red Wine", "Blanc de Blancs": "Sparkling White", "Chardonnay (Oaked)": "White Wine",
  "Merlot": "Red Wine", "Rioja Crianza": "Red Wine", "Côtes du Rhône": "Red Wine",
  "Viognier": "White Wine", "Barbera": "Red Wine", "White Burgundy": "White Wine",
  "Cabernet Franc": "Red Wine", "Grenache": "Red Wine", "Cabernet Sauvignon": "Red Wine",
  "Chianti Classico": "Red Wine", "Zinfandel": "Red Wine", "Nebbiolo": "Red Wine",
  "Barolo": "Red Wine", "Brunello": "Red Wine", "Bordeaux Blend": "Red Wine",
  "Syrah": "Red Wine", "Shiraz": "Red Wine", "Malbec": "Red Wine", "Tempranillo": "Red Wine",
  "Rioja Reserva": "Red Wine", "Amarone": "Red Wine", "Vintage Port": "Fortified Red",
  "Tawny Port": "Fortified Red", "Sauternes": "Dessert White", "Late Harvest Riesling": "Dessert White",
  "Icewine": "Dessert Wine", "Tokaji": "Dessert White", "Pedro Ximénez Sherry": "Fortified Dessert",
  "Banyuls": "Fortified Red", "Moscato d'Asti": "Sparkling Dessert", "Gewürztraminer": "White Wine",
  "Off-dry Riesling": "White Wine", "Pinot Gris": "White Wine", "Cru Beaujolais": "Red Wine",
  "Pinot Noir (Earthy)": "Red Wine", "Châteauneuf-du-Pape (White)": "White Wine",
  "Soave": "White Wine", "Dolcetto": "Red Wine", "Valpolicella": "Red Wine",
  "Lambrusco": "Sparkling Red", "White Zinfandel": "Rosé Wine", "Merlot (Light)": "Red Wine",
  "Carménère": "Red Wine", "Pinotage": "Red Wine", "Châteauneuf-du-Pape": "Red Wine",
  "Rioja (Oaked)": "Red Wine"
};

const allWines = [...new Set(pairingMatrix.flatMap(item => item.classicMatches))].sort();
const allFoods = [...new Set(pairingMatrix.flatMap(item => item.foodExamples))].sort();

export const MTPrepView = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Pairing Generator State
  const [searchType, setSearchType] = useState('wine');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [matchedSpecificItem, setMatchedSpecificItem] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const performSearch = (query: string) => {
    if (!query.trim()) return;
    const lowerQuery = query.toLowerCase();
    let exactMatchString = '';
    
    const match = pairingMatrix.find(item => {
      if (searchType === 'food') {
        const foundFood = item.foodExamples.find(food => food.toLowerCase().includes(lowerQuery));
        if (foundFood) {
          exactMatchString = foundFood;
          return true;
        }
        return item.foodCategory.toLowerCase().includes(lowerQuery);
      } else {
        const foundWine = item.classicMatches.find(wine => wine.toLowerCase().includes(lowerQuery));
        if (foundWine) {
          exactMatchString = foundWine;
          return true;
        }
        return item.wineStyles.toLowerCase().includes(lowerQuery);
      }
    });

    setMatchedSpecificItem(exactMatchString || query);
    setSearchResult(match ? match : 'not_found');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchResult(null);

    if (value.trim().length > 0) {
      const dictionary = searchType === 'wine' ? allWines : allFoods;
      const filtered = dictionary.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Removed immediate search to comply with user request: only search on button press
  };

  const handleTypeChange = (type: string) => {
    setSearchType(type);
    setSearchResult(null);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const personalCategories = [
    { id: 'etiquettes', label: 'Etiquettes' },
    { id: 'verbal', label: 'Verbal Communication' },
    { id: 'non-verbal', label: 'Non Verbal Communication' }
  ];

  const technicalCategories = [
    { id: 'fnb', label: 'Food and Beverage' },
    { id: 'production', label: 'Food Production' },
    { id: 'rooms', label: 'Rooms Division' },
    { id: 'sales', label: 'Sales and Marketing' },
    { id: 'revenue', label: 'Revenue Management' },
    { id: 'hr', label: 'Human Resource' }
  ];

  useEffect(() => {
    setActiveSubCategory(activeTab === 'personal' ? 'etiquettes' : 'fnb');
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubCategory]);

  const questions: Record<string, Record<string, { q: string, a: string }[]>> = {
    personal: {
      etiquettes: [
        { q: "What are the key grooming standards for an MT interview?", a: "Clean-shaven (for men) or neatly tied hair (for women), polished shoes, ironed formal suit, minimal jewelry, and a pleasant smile." },
        { q: "How should you greet the interview panel?", a: "Enter with a confident knock, wait to be asked to sit, maintain eye contact, and greet everyone with a 'Good Morning/Afternoon' starting from the lady (if any) or the most senior person." },
        { q: "How to handle a question you don't know the answer to?", a: "Be honest but professional. Say 'I am sorry, I am not aware of this at the moment, but I will certainly look it up after this interview.' Avoid guessing." },
        { q: "What is the correct way to present your portfolio?", a: "Keep it organized, clean, and easily accessible. Present it only when relevant to the conversation or if asked. Briefly explain each section." },
        { q: "How to maintain professional distance during a site visit?", a: "Avoid over-familiarity with staff, follow all safety protocols, and stay observant without being intrusive." },
        { q: "What is the importance of punctuality in hospitality?", a: "It reflects your reliability and respect for others' time. Arriving 10-15 minutes early is standard for interviews." }
      ],
      verbal: [
        { q: "How to introduce yourself effectively?", a: "Use the 'Past-Present-Future' model. Briefly mention your background, your current academic status/internship, and your career aspirations in hospitality." },
        { q: "What is the importance of 'Tone' in hospitality?", a: "Your tone should be warm, helpful, and professional. It's not just what you say, but how you say it that creates the guest experience." },
        { q: "How do you handle a disagreement with a team member verbally?", a: "Focus on the issue, not the person. Use 'I' statements, listen actively, and seek a professional compromise that benefits the guest/hotel." },
        { q: "How to explain a gap in your resume?", a: "Be honest and focus on what you learned or how you grew during that time (e.g., personal projects, travel, online courses)." },
        { q: "What is active listening?", a: "Fully concentrating on what is being said rather than just passively 'hearing' the message of the speaker." },
        { q: "How to handle a difficult guest over the phone?", a: "Stay calm, use a steady voice, acknowledge their concern, and provide a clear timeline for resolution." }
      ],
      'non-verbal': [
        { q: "What does your posture say about you?", a: "Sitting upright shows confidence and alertness. Slouching can indicate lack of interest or low energy." },
        { q: "Why is eye contact crucial?", a: "It builds trust and shows that you are attentive and confident. Avoid staring; maintain natural, friendly eye contact." },
        { q: "What should your hand gestures be like?", a: "Keep them natural and open. Avoid crossing arms (defensive) or fidgeting (nervousness)." },
        { q: "What does a firm handshake signify?", a: "Confidence and professionalism. Ensure it's not too aggressive but not limp either." },
        { q: "How to use facial expressions to show empathy?", a: "A gentle nod and a concerned but calm expression can show a guest you truly care about their issue." },
        { q: "What is the 'Open Body Language' concept?", a: "Keeping your body oriented towards the speaker, uncrossed limbs, and relaxed shoulders to appear approachable." }
      ]
    },
    technical: {
      fnb: [
        { q: "What are the 5 Mother Sauces?", a: "Béchamel, Velouté, Espagnole, Tomato, and Hollandaise." },
        { q: "Explain the difference between Mise-en-place and Mise-en-scene.", a: "Mise-en-place is 'putting in place' (preparing ingredients/tools). Mise-en-scene is 'preparing the stage' (setting the overall ambiance/decor of the restaurant)." },
        { q: "What is a 'Sommelier'?", a: "A trained and knowledgeable wine professional, normally working in fine restaurants, who specializes in all aspects of wine service." },
        { q: "What are the different types of service in a restaurant?", a: "French Service, Russian Service, American Service, English Service, and Buffet Service." },
        { q: "What is 'Menu Engineering'?", a: "The study of the profitability and popularity of menu items and how these two factors influence their placement on a menu." },
        { q: "Explain the concept of 'Cover' in F&B.", a: "A cover refers to a single guest or a place setting for one person at a dining table." }
      ],
      production: [
        { q: "What is the HACCP system?", a: "Hazard Analysis and Critical Control Points. It's a systematic preventive approach to food safety from biological, chemical, and physical hazards." },
        { q: "What is 'Sous-vide' cooking?", a: "A method of cooking in which food is placed in a plastic pouch or a glass jar and cooked in a water bath for longer than normal cooking times at an accurately regulated temperature." },
        { q: "What are the different types of knives used in a professional kitchen?", a: "Chef's knife, Paring knife, Serrated/Bread knife, Boning knife, and Fillet knife." },
        { q: "What is 'Blanching' and why is it done?", a: "Briefly immersing food in boiling water, then plunging it into ice water to stop the cooking. It preserves color, texture, and nutritional value." },
        { q: "Explain the term 'Deglazing'.", a: "Adding liquid (like wine or stock) to a hot pan to loosen and dissolve food particles (fond) stuck to the bottom after searing or sautéing." },
        { q: "What is a 'Roux'?", a: "A mixture of fat (especially butter) and flour used in making sauces." }
      ],
      rooms: [
        { q: "What is the 'Guest Cycle'?", a: "Pre-arrival, Arrival, Occupancy, and Departure." },
        { q: "What is 'Overbooking' and why is it done?", a: "Accepting more reservations than available rooms to compensate for 'no-shows' and cancellations, aiming for 100% occupancy." },
        { q: "What is the role of a Concierge?", a: "To assist guests with various tasks like making restaurant reservations, booking hotels, arranging for spa services, recommending night life hot spots, etc." },
        { q: "What is 'Night Audit'?", a: "The process of reviewing and reconciling the day's financial transactions and preparing for the next day's operations." },
        { q: "Explain 'Turn-down Service'.", a: "A service provided in the evening where the bed is prepared for sleep, and the room is tidied for the night." },
        { q: "What is 'ADR' in hotel management?", a: "Average Daily Rate. A metric used to measure the average income per occupied room in a given period." }
      ],
      sales: [
        { q: "What is the difference between Marketing and Sales in a hotel?", a: "Marketing is about creating awareness and demand. Sales is about closing the deal and converting that demand into revenue." },
        { q: "What is a FAM trip?", a: "Familiarization trip. It's a low-cost or free trip for travel agents or media to experience the hotel so they can better sell it to clients." },
        { q: "What is 'MICE' in hospitality?", a: "Meetings, Incentives, Conferences, and Exhibitions. A major segment for business hotels." },
        { q: "What is a 'Loyalty Program'?", a: "A marketing strategy designed to encourage customers to continue to shop at or use the services of a business associated with the program." },
        { q: "Explain 'B2B' vs 'B2C' in hotel sales.", a: "B2B (Business to Business) targets corporate clients and travel agents. B2C (Business to Consumer) targets individual travelers directly." },
        { q: "What is 'Public Relations' in hospitality?", a: "The practice of managing the spread of information between an individual or an organization and the public." }
      ],
      revenue: [
        { q: "What is RevPAR?", a: "Revenue Per Available Room. Calculated by multiplying a hotel's average daily room rate (ADR) by its occupancy rate." },
        { q: "What is 'Yield Management'?", a: "A variable pricing strategy based on understanding, anticipating, and influencing consumer behavior to maximize revenue from a fixed, time-limited resource (like hotel rooms)." },
        { q: "What is a 'Channel Manager'?", a: "A tool that allows hotels to manage their inventory and rates across multiple online travel agencies (OTAs) and booking sites in real-time." },
        { q: "What is 'GOPPAR'?", a: "Gross Operating Profit Per Available Room. It measures the overall financial health of a hotel by considering both revenue and expenses." },
        { q: "Explain 'Dynamic Pricing'.", a: "Adjusting room rates in real-time based on market demand, competitor pricing, and other external factors." },
        { q: "What is 'Market Penetration Index' (MPI)?", a: "A metric that compares a hotel's occupancy to the average occupancy of its competitive set." }
      ],
      hr: [
        { q: "What are the key components of a hotel's orientation program?", a: "Company history, mission/vision, HR policies, safety/security training, and departmental introductions." },
        { q: "How do you handle employee turnover in hospitality?", a: "Through competitive pay, clear career paths, recognition programs, and a positive work culture." },
        { q: "What is 'Performance Appraisal'?", a: "A regular review of an employee's job performance and overall contribution to the company." },
        { q: "What is 'Employee Engagement'?", a: "The emotional commitment the employee has to the organization and its goals." },
        { q: "Explain the importance of 'Diversity and Inclusion' in hotels.", a: "It fosters a more creative, empathetic, and productive workforce that can better serve a global guest base." },
        { q: "What is 'Succession Planning'?", a: "The process of identifying and developing internal people with the potential to fill key business leadership positions in the company." }
      ]
    }
  };

  const currentQuestions = questions[activeTab]?.[activeSubCategory] || [];
  const totalPages = Math.ceil(currentQuestions.length / itemsPerPage);
  const paginatedQuestions = currentQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">MT Preparation</h1>
        <p className="text-slate-500 dark:text-slate-400">Master your Management Trainee interviews with curated questions.</p>
      </div>

      <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-4 font-bold transition-all border-b-2 ${activeTab === 'personal' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 dark:text-slate-500'}`}
        >
          Personal Questions
        </button>
        <button
          onClick={() => setActiveTab('technical')}
          className={`pb-4 font-bold transition-all border-b-2 ${activeTab === 'technical' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 dark:text-slate-500'}`}
        >
          Technical Questions
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {(activeTab === 'personal' ? personalCategories : technicalCategories).map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveSubCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeSubCategory === cat.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-indigo-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeSubCategory === 'fnb' && (
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 overflow-visible relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-xl text-rose-600 dark:text-rose-400">
                <Wine className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sommelier's Engine</h2>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8">Discover perfect wine and food pairings instantly, along with the F&B culinary theory behind them.</p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="searchType" value="wine" checked={searchType === 'wine'} onChange={() => handleTypeChange('wine')} className="w-4 h-4 accent-rose-600" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 transition-colors flex items-center gap-1">
                  <Wine size={16} /> I have a Wine
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="searchType" value="food" checked={searchType === 'food'} onChange={() => handleTypeChange('food')} className="w-4 h-4 accent-indigo-600" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <Utensils size={16} /> I have Food
                </span>
              </label>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 relative z-20">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder={searchType === 'wine' ? "Enter a wine (e.g., Cabernet, Chardonnay...)" : "Enter a dish (e.g., Ribeye, Oysters...)"}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-rose-500 outline-none transition-all font-medium dark:text-white"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                />
                
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl mt-2 shadow-xl max-h-60 overflow-y-auto py-2">
                    {suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`px-4 py-3 cursor-pointer font-medium transition-colors ${searchType === 'wine' ? 'hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600'} dark:text-slate-200`}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                Generate Pair
              </button>
            </form>

            {searchResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700"
              >
                {searchResult === 'not_found' ? (
                  <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    <p className="font-bold text-lg">No direct match found for "{searchQuery}".</p>
                    <p className="text-sm mt-2">Try classic examples like "Cabernet", "Oysters", "Port", or "Ribeye Steak".</p>
                  </div>
                ) : (
                  <div className={`p-8 rounded-3xl border shadow-sm ${searchResult.color} dark:bg-opacity-10 dark:border-opacity-20`}>
                    <div className="flex gap-4 items-start">
                      <CheckCircle className="shrink-0 mt-1 text-current opacity-80" size={28} />
                      <div className="w-full">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                          <h4 className="font-black text-2xl tracking-tight">
                            Perfect Match: {searchType === 'wine' ? searchResult.foodCategory : searchResult.wineStyles}
                          </h4>
                          
                          <div className="flex flex-wrap gap-2">
                            <div className="inline-flex bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 rounded-full border border-current/20 text-xs font-black uppercase tracking-widest shadow-sm">
                              Origin: {itemOrigins[matchedSpecificItem] || itemOrigins[searchQuery] || "Various Global Regions"}
                            </div>
                            <div className="inline-flex bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 rounded-full border border-current/20 text-xs font-black uppercase tracking-widest shadow-sm">
                              {searchType === 'wine' ? 'Type: ' + (wineTypes[matchedSpecificItem] || wineTypes[searchQuery] || "Wine Blend") : 'Wine Type: ' + searchResult.broadWineType}
                            </div>
                          </div>
                        </div>

                        <p className="text-lg italic opacity-80 mb-4 font-bold">
                          {searchType === 'wine' ? searchResult.foodInfo : searchResult.wineInfo}
                        </p>
                        
                        <div className="space-y-4">
                          <p className="font-bold text-slate-900 dark:text-white">
                            <span className="opacity-60 mr-2 uppercase text-xs tracking-widest">Classic {searchType === 'wine' ? 'foods' : 'wines'}:</span> 
                            {searchType === 'wine' ? searchResult.foodExamples.join(', ') : searchResult.classicMatches.join(', ')}
                          </p>
                          
                          <div className="bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-current/10">
                            <strong className="block mb-2 text-xs uppercase tracking-widest opacity-60">The Culinary Theory (Why it works):</strong>
                            <p className="text-sm font-bold leading-relaxed">{searchResult.theory}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {activeSubCategory === 'fnb' && currentQuestions.length > 0 && (
          <div className="flex items-center gap-3 mb-6 mt-8">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Question and answers</h2>
          </div>
        )}

        {(activeSubCategory === 'fnb' ? currentQuestions : paginatedQuestions).length > 0 ? (
          (activeSubCategory === 'fnb' ? currentQuestions : paginatedQuestions).map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <h3 className="font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">Q: {item.q}</h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border-l-4 border-indigo-500">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  <span className="font-bold text-slate-400 mr-2">A:</span>
                  {item.a}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">Select a category to view questions.</div>
        )}
      </div>

      {totalPages > 1 && activeSubCategory !== 'fnb' && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                currentPage === page 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const DailyChallengeView = ({ progress, updateProgress }: any) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedOpt(index);
    const isCorrect = index === dailyQuiz[currentQ].correct;
    if (isCorrect) setSessionScore(prev => prev + 10);

    setTimeout(() => {
      setSelectedOpt(null);
      if (currentQ < dailyQuiz.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        updateProgress({ ...progress, score: progress.score + sessionScore + (isCorrect ? 10 : 0) });
        setShowResult(true);
      }
    }, 1000);
  };

  if (showResult) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
        <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-2 dark:text-white">Challenge Completed!</h2>
        <p className="text-slate-500 mb-8">You earned {sessionScore} Flame Points today.</p>
        <button 
          onClick={() => { setCurrentQ(0); setSessionScore(0); setShowResult(false); }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Question {currentQ + 1} / {dailyQuiz.length}</span>
          <span className="flex items-center gap-1 font-bold text-orange-500"><Flame className="w-4 h-4" /> {sessionScore}</span>
        </div>
        <h2 className="text-2xl font-bold mb-8 dark:text-white">{dailyQuiz[currentQ].question}</h2>
        <div className="space-y-3">
          {dailyQuiz[currentQ].options.map((opt, idx) => (
            <button 
              key={idx}
              disabled={selectedOpt !== null}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${
                selectedOpt === idx 
                ? (idx === dailyQuiz[currentQ].correct ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 dark:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const GlobalChatView = ({ user }: { user: any }) => {
  const [activeCampus, setActiveCampus] = useState('all');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!db || !user) return;
    const chatRef = collection(db, 'artifacts', appId, 'public', 'data', 'chat_messages');
    const q = query(chatRef, orderBy('timestamp', 'asc'), limit(50));
    
    return onSnapshot(
      q, 
      (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => {
        console.warn("Global chat listener warning:", err);
      }
    );
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!inputText.trim() || !user || !db) return;
    
    const text = inputText;
    setInputText('');

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'chat_messages'), {
      campusId: activeCampus,
      text: text,
      sender: user.displayName || "Guest Scholar",
      uid: user.uid,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[70vh] flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="flex flex-1">
        <div className="w-48 border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-y-auto hidden sm:block">
          {ihmCampuses.map(campus => (
            <button
              key={campus.id}
              onClick={() => setActiveCampus(campus.id)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${activeCampus === campus.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {campus.name}
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.filter(m => activeCampus === 'all' || m.campusId === activeCampus).map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.uid === user?.uid ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm ${msg.uid === user?.uid ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{msg.sender} • {msg.time}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <input 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-2 outline-none dark:text-white"
            />
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl"><Send className="w-5 h-5" /></button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export const ProfileView = ({ user, progress, onLogout }: any) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-600/20 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                user.displayName?.charAt(0) || 'U'
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white dark:border-slate-800 w-8 h-8 rounded-full"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.displayName || 'HospiScholar User'}</h1>
              {user.photoURL && (
                <span className="p-1 bg-white dark:bg-slate-700 rounded-full shadow-sm" title="Google Account">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{user.email || 'No email provided'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-xl flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
                <Flame className="w-4 h-4" /> {progress.score} Flame Points
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <CheckCircle className="w-4 h-4" /> {progress.completedChapters.length} Chapters Done
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-4 h-4" />
                {user.isAdmin ? 'Admin Clearance' : (user.isGuest ? 'Guest Pass' : 'Google Authenticated')}
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Current Status</h3>
          <p className="text-2xl font-bold dark:text-white">Active Student</p>
          <p className="text-sm text-slate-500 mt-1">IHM Pusa, New Delhi</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Global Rank</h3>
          <p className="text-2xl font-bold dark:text-white">#124</p>
          <p className="text-sm text-slate-500 mt-1">Top 5% of all scholars</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Achievements</h3>
          <div className="flex gap-2 mt-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center"><Trophy className="w-4 h-4" /></div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
