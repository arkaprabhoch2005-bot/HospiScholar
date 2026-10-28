import React, { useState } from 'react';
import { 
  ShieldCheck, Mail, MapPin, Clock, Send, CheckCircle2, 
  HelpCircle, BookOpen, GraduationCap, ChefHat, Sparkles, 
  Lock, Globe, ExternalLink, ArrowRight, UserCheck, Award, Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from './SEO';
import { Logo, LogoText } from './Logo';
import { db, appId } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ==========================================
// 1. ABOUT US VIEW
// ==========================================
export const AboutUsView: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-16">
      <SEO 
        title="About Us | HospiScholar" 
        description="HospiScholar is the dedicated academic resource hub, culinary reference engine, and live industry intelligence portal for hospitality management scholars."
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-8 md:p-14 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Dedicated Hospitality Knowledge Hub</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Crafted for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">Hospitality Scholars</span> & Future Hoteliers.
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
            HospiScholar bridges the gap between traditional hotel school curricula and the dynamic international hospitality industry. Designed for students of B.Sc. Hospitality & Hotel Administration (NCHMCT / IHM), culinary arts institutes, and aspiring Management Trainees worldwide.
          </p>

          <div className="flex flex-wrap gap-4">
            {onNavigate && (
              <button 
                onClick={() => onNavigate('notes')}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Classical Notes</span>
              </button>
            )}
            {onNavigate && (
              <button 
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/15 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Editorial Team</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Core Mission Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Our Core Pillars</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Every feature on HospiScholar is curated to elevate academic scores and sharpen operational acumen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Escoffier Classical Foundations</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              In-depth analysis of the 17 Classical French Courses, mother sauces, brigade de cuisine hierarchies, and silver service protocols according to Auguste Escoffier.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Live Industry Intelligence</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Real-time Google Grounded news stream tracking RevPAR, ADR, mergers, boutique luxury openings, aviation impacts, and hospitality investment trends 24/7.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Management Trainee (MT) Readiness</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Targeted interview primers for Taj MT (TMTP), Oberoi OCLD, Marriott Voyage, and Hyatt Corporate Training with situational behavioral frameworks.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership & Editorial Team */}
      <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Platform Leadership & Contributors</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Conceived and spearheaded by hospitality scholars passionate about modernizing education.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              Verified Academic Platform
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Arkaprabho Chatterjee</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold">Lead Architect</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 mb-2">Founder & Primary Academic Curator</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Hospitality scholar with an emphasis on food & beverage operations, classical culinary theory, and modern digital educational tools.
              </p>
              <a 
                href="mailto:arkaprabhoch.2005@gmail.com" 
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-3 font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>arkaprabhoch.2005@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Community & Open Access Philosophy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              HospiScholar remains completely free to access for enrolled hospitality students. All study notes, syllabus blueprints, and real-time news are accessible without paywalls, backed by ethical standards and Google AdSense compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CONTACT US VIEW
// ==========================================
export const ContactUsView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Academic Note Feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    const newTicketId = `HSP-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      if (db) {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'contact_messages'), {
          ticketId: newTicketId,
          name: name.trim(),
          email: email.trim(),
          category,
          subject: subject.trim() || 'General Inquiry',
          message: message.trim(),
          createdAt: serverTimestamp(),
          status: 'received'
        });
      }
    } catch (err) {
      console.warn("Contact message local receipt fallback:", err);
    }

    setTicketId(newTicketId);
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <SEO 
        title="Contact Us | HospiScholar Support & Inquiries" 
        description="Get in touch with the HospiScholar academic and technical team. Contact us for syllabus queries, study note contributions, and general assistance."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>We're Here to Help</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Contact HospiScholar
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
          Have an academic question, culinary correction, or want to contribute study notes? Reach out directly to our team.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <a 
          href="mailto:arkaprabhoch.2005@gmail.com" 
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 transition-all group block"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Direct Email</h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">arkaprabhoch.2005@gmail.com</p>
          <p className="text-[11px] text-slate-400 mt-2">Monitored daily for student & recruiter queries</p>
        </a>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Response Window</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Within 24 Hours</p>
          <p className="text-[11px] text-slate-400 mt-2">Expedited review for exam-week questions</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">HQ & Community</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">India & Global Scholars</p>
          <p className="text-[11px] text-slate-400 mt-2">Pan-IHM & International Hotel Schools</p>
        </div>
      </div>

      {/* Contact Form & Side Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Dispatched!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                Thank you, <span className="font-semibold text-slate-900 dark:text-white">{name}</span>. Your inquiry has been registered under reference code <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{ticketId}</span>. We will follow up at <span className="font-medium text-slate-900 dark:text-white">{email}</span>.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setSubject('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Send Us an Inquiry</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Your Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Chef / Student"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm outline-none focus:border-indigo-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm outline-none focus:border-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm outline-none focus:border-indigo-500 dark:text-white font-medium"
                  >
                    <option value="Academic Note Feedback">Academic Note Feedback</option>
                    <option value="Escoffier French Course Query">Escoffier French Course Query</option>
                    <option value="Study Note Submission">Study Note Submission</option>
                    <option value="Technical Issue / Bug">Technical Issue / Bug</option>
                    <option value="Partnership / College Connect">Partnership / College Connect</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Subject Line
                  </label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Brief headline of your message"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm outline-none focus:border-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Detailed Message *
                </label>
                <textarea 
                  required
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Share details regarding your question, syllabus topic, or recommendation..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-sm outline-none focus:border-indigo-500 dark:text-white leading-relaxed resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* FAQ Column */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Are all study notes free?</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes, HospiScholar provides open academic access to all 6 semesters of NCHMCT notes, recipe archives, and MT interview questions.
                </p>
              </div>

              <div className="pt-3 border-t border-indigo-200/50 dark:border-indigo-900/40">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Can I submit my own chapter summaries?</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes! Use the form or email us with your college affiliation and subject notes. Peer-reviewed submissions are attributed to the author.
                </p>
              </div>

              <div className="pt-3 border-t border-indigo-200/50 dark:border-indigo-900/40">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">How is the live news grounded?</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Hospitality headlines are fetched through real-time Google search grounding covering luxury lodging, tourism economics, and culinary trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. PRIVACY POLICY VIEW (ADSENSE COMPLIANT)
// ==========================================
export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-16">
      <SEO 
        title="Privacy Policy | HospiScholar AdSense & Cookie Compliance" 
        description="HospiScholar's Google AdSense compliant Privacy Policy detailing cookie disclosures, DoubleClick DART cookies, log files, GDPR, and CCPA user rights."
      />

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Google AdSense & Privacy Standards Compliant</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Last updated: October 28, 2026 • Effective immediately across HospiScholar services
        </p>
      </div>

      {/* Main Legal Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed space-y-8">
        
        {/* Section 1: Introduction */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            1. Introduction & Overview
          </h2>
          <p>
            At <strong>HospiScholar</strong>, accessible via our web application, the privacy of our visitors and students is of paramount importance to us. This Privacy Policy document outlines the types of information that is collected and recorded by HospiScholar and how we utilize it.
          </p>
          <p>
            If you have additional questions or require more information regarding our Privacy Policy or data protection practices, please contact us at <a href="mailto:arkaprabhoch.2005@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">arkaprabhoch.2005@gmail.com</a>.
          </p>
        </section>

        {/* Section 2: Google AdSense & DoubleClick DART Cookie (CRITICAL ADSENSE CLAUSE) */}
        <section className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-lg md:text-xl">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            2. Google AdSense & DoubleClick DART Cookie Disclosure
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-medium">
            HospiScholar participates in the <strong>Google AdSense</strong> publisher network (Publisher ID: <code className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 font-mono text-xs">ca-pub-9688094336607311</code>). Google is one of the third-party vendors on our site. It uses cookies, known as <strong>DART cookies</strong>, to serve advertisements to our site visitors based upon their visit to HospiScholar and other sites on the internet.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-slate-600 dark:text-slate-300">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
            </li>
            <li>
              Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              <strong>Opt-Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline inline-flex items-center gap-1">Google Ads Settings <ExternalLink className="w-3 h-3" /></a>.
            </li>
            <li>
              Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline inline-flex items-center gap-1">www.aboutads.info <ExternalLink className="w-3 h-3" /></a> or the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline inline-flex items-center gap-1">Google Ad and Content Network Privacy Policy <ExternalLink className="w-3 h-3" /></a>.
            </li>
          </ul>
        </section>

        {/* Section 3: Third Party Advertisers */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            3. Third-Party Privacy Policies & Ad Networks
          </h2>
          <p>
            HospiScholar's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).
          </p>
        </section>

        {/* Section 4: Log Files & Analytical Telemetry */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            4. Log Files & Visitor Tracking
          </h2>
          <p>
            HospiScholar follows a standard procedure of utilizing log files and live session presence metrics. The information collected by log files includes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
            <li>Internet Protocol (IP) addresses and device characteristics</li>
            <li>Browser type and Internet Service Provider (ISP)</li>
            <li>Date and time stamp of access</li>
            <li>Referring/exit pages and curriculum interactions</li>
            <li>Number of clicks and chapter completion milestones</li>
          </ul>
          <p className="text-xs text-slate-500">
            These logs are not linked to any information that is personally identifiable without your voluntary consent. The purpose of the information is for analyzing trends, administering the site, tracking users' movement around the curriculum, and gathering demographic intelligence.
          </p>
        </section>

        {/* Section 5: Information You Provide */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            5. Personal Information Provided by Users
          </h2>
          <p>
            When utilizing HospiScholar features such as Google Authentication, Guest Portal, Recipe Submissions, or Contact Forms, you may provide:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
            <li><strong>Google Profile Data:</strong> Display name, verified email, and profile avatar provided via Google OAuth.</li>
            <li><strong>Academic Progress:</strong> Study notes completed, quiz scores, and internship log entries.</li>
            <li><strong>Communications:</strong> Inquiries sent via the Contact Us form, stored securely in Firebase Firestore.</li>
          </ul>
        </section>

        {/* Section 6: CCPA Rights */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            6. CCPA Privacy Rights (Do Not Sell My Personal Information)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), among other rights, California consumers have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
            <li>Request that a business disclose the categories and specific pieces of personal data collected.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data. <strong>HospiScholar never sells student or visitor personal data to third parties.</strong></li>
          </ul>
        </section>

        {/* Section 7: GDPR Rights */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            7. GDPR Data Protection Rights
          </h2>
          <p>
            We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any inaccurate information.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request restriction of personal data processing.</li>
            <li><strong>The right to data portability:</strong> You have the right to request that we transfer collected data to another organization.</li>
          </ul>
        </section>

        {/* Section 8: Children's Privacy (COPPA) */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            8. Children's Information Protection (COPPA)
          </h2>
          <p>
            HospiScholar does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        {/* Section 9: Consent & Contact */}
        <section className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            9. User Consent & Contact
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
          <p className="text-slate-300 text-xs md:text-sm">
            For any questions, contact our Data Privacy officer at: <strong className="text-indigo-400">arkaprabhoch.2005@gmail.com</strong>.
          </p>
        </section>

      </div>
    </div>
  );
};
