import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, BookOpen, Clock, Tag, Share2, Bookmark, CheckCircle, 
  Lightbulb, Table, ChevronRight, CheckCircle2, Copy, Sparkles 
} from 'lucide-react';
import { StudyNote } from '../data/notes';
import { SEO } from './SEO';

interface NoteReaderViewProps {
  note: StudyNote;
  onBack: () => void;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export const NoteReaderView: React.FC<NoteReaderViewProps> = ({
  note,
  onBack,
  isCompleted = false,
  onToggleComplete
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-4xl mx-auto pb-16"
    >
      {/* Dynamic SEO Meta Tags via react-helmet-async */}
      <SEO 
        title={`${note.title} | HospiScholar`}
        description={note.summary}
        type="article"
        keywords={note.tags.join(', ')}
      />

      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notes & Syllabus</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              bookmarked 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
            title="Bookmark note for revision"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Copy link"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          {onToggleComplete && (
            <button
              onClick={onToggleComplete}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isCompleted 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleted ? 'Completed' : 'Mark as Read'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Note Hero Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              {note.category}
            </span>
            <span className="bg-white/10 text-slate-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-300" />
              {note.readTime}
            </span>
            <span className="bg-white/10 text-slate-200 text-xs font-medium px-3 py-1 rounded-full">
              Semester {note.semester}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {note.title}
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {note.summary}
          </p>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <span>Curriculum: <strong className="text-slate-200">{note.subject}</strong></span>
            <span>Standard: <strong className="text-slate-200">{note.lastUpdated}</strong></span>
          </div>
        </div>
      </div>

      {/* Introduction Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm leading-relaxed text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3">
          <BookOpen className="w-4 h-4" />
          <span>Curriculum Foundation & Historical Context</span>
        </div>
        <p className="text-base md:text-lg leading-relaxed font-normal">
          {note.content.introduction}
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {note.content.sections.map((section, idx) => (
          <section
            key={idx}
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">
                {idx + 1}
              </span>
              <span>{section.heading}</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {section.body}
            </p>

            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="space-y-2.5 pt-2">
                {section.bulletPoints.map((bullet, bIdx) => (
                  <li 
                    key={bIdx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.callout && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-sm">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{section.callout}</span>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Structured Reference Table (e.g. 17 Courses Table) */}
      {note.content.table && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 overflow-hidden">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {note.content.table.caption}
            </h3>
          </div>

          <div className="overflow-x-auto -mx-6 md:-mx-8">
            <table className="w-full text-left text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                  {note.content.table.headers.map((h, i) => (
                    <th key={i} className="py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {note.content.table.rows.map((row, rIdx) => (
                  <tr 
                    key={rIdx} 
                    className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td 
                        key={cIdx} 
                        className={`py-3 px-4 ${cIdx === 1 ? 'font-bold text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exam Tips & Key High-Yield Takeaways */}
      {note.content.examTips && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg font-bold">University & NCHMCT JEE Exam High-Yield Tips</h3>
          </div>
          <ul className="space-y-2">
            {note.content.examTips.map((tip, tIdx) => (
              <li key={tIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed font-medium">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" />
          Tags:
        </span>
        {note.tags.map((t, idx) => (
          <span 
            key={idx} 
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-medium"
          >
            #{t}
          </span>
        ))}
      </div>
    </motion.article>
  );
};
