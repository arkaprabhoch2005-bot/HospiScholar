import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Search, Clock, Tag, ChevronRight, CheckCircle, 
  Sparkles, Filter, FileText, Bookmark, GraduationCap 
} from 'lucide-react';
import { studyNotes, StudyNote } from '../data/notes';
import { SEO } from './SEO';

interface StudyNotesCatalogViewProps {
  onSelectNote: (note: StudyNote) => void;
  completedChapters?: string[];
}

export const StudyNotesCatalogView: React.FC<StudyNotesCatalogViewProps> = ({
  onSelectNote,
  completedChapters = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Food & Beverage Service', 'Culinary Arts & Food Production', 'Front Office Management', 'Housekeeping'];

  const filteredNotes = studyNotes.filter(note => {
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesQuery = 
      !searchQuery.trim() ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Dynamic SEO Meta Tags via react-helmet-async */}
      <SEO 
        title="Curriculum Study Notes & Chapter Reader | HospiScholar"
        description="Comprehensive academic study notes for hotel management scholars, including Classical French Menu 17 Courses, 5 Mother Sauces, Front Office Night Audit, and Room Cleaning SOPs."
        keywords="hospitality notes, classical french menu, 17 courses escoffier, mother sauces, front office audit, housekeeping sop, ihm notes"
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                Verified NCHMCT & IHM Curriculum Notes
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Curriculum Study Notes</h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              In-depth chapter notes, classical Escoffier culinary sequences, service protocols, and formula derivations crafted for hotel management students.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-3 rounded-2xl shrink-0">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            <div>
              <div className="text-lg font-black text-white">{studyNotes.length} Verified Notes</div>
              <div className="text-xs text-slate-400 font-medium">Standard University Archive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes by topic, tag, course (e.g. 'Classical French Menu', 'Escoffier', 'Mother Sauces')..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map(note => {
          const isDone = completedChapters.includes(note.id);
          return (
            <article
              key={note.id}
              onClick={() => onSelectNote(note)}
              className="bg-white dark:bg-slate-800 p-7 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {note.readTime}
                    </span>
                    {isDone && (
                      <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Read
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {note.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {note.summary}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {note.tags.slice(0, 3).map((t, idx) => (
                    <span 
                      key={idx}
                      className="text-[11px] bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>{note.subject} (Sem {note.semester})</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Full Note <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-8">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No notes found matching "{searchQuery}"</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try resetting your filter or searching for another term.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </motion.div>
  );
};
