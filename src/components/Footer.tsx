import React from 'react';
import { 
  GraduationCap, BookOpen, ShieldCheck, Mail, Heart, 
  ChefHat, Sparkles, Globe, FileText, Users, ExternalLink 
} from 'lucide-react';
import { Logo, LogoText } from './Logo';

interface FooterProps {
  onNavigate?: (tab: string) => void;
  className?: string;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, className = '', isAdmin = false }) => {
  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={`mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 transition-colors ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100 dark:border-slate-800">
          
          {/* Brand Info (2 Columns wide on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <LogoText className="text-xl" />
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
              The premier academic and operational intelligence platform for IHM students, hotel school scholars, and hospitality professionals worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Google AdSense Compliant</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>NCHMCT / IHM Aligned</span>
              </span>
            </div>
          </div>

          {/* Academic Notes Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Curriculum Notes
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => handleNav('notes')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  17 French Courses (Escoffier)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('notes')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Classical Mother Sauces
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('notes')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Bordeaux & French Terroirs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('academics')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  6-Semester Roadmap
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('mt-prep')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Management Trainee (MT) Prep
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => handleNav('news')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Live Hospitality News
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button 
                    onClick={() => handleNav('guest-tracker')} 
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Guest Tracker</span>
                    <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-semibold">Admin</span>
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={() => handleNav('recipes')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Culinary Exchange
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('chat')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Global Scholar Chat
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('trivia')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  Daily Knowledge Challenge
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => handleNav('about')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-left flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-left flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('privacy')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li className="pt-2">
                <a 
                  href="mailto:arkaprabhoch.2005@gmail.com" 
                  className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 block truncate"
                >
                  arkaprabhoch.2005@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* AdSense DART Cookie Notice Box */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Advertising Transparency:</strong> We use Google AdSense and third-party vendor cookies to serve personalized ads.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNav('privacy')} 
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Read Cookie Policy & DART Details
            </button>
            <span>•</span>
            <a 
              href="https://policies.google.com/technologies/ads" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Google Ad Policies <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Direct Links */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>© 2026 HospiScholar. Founded by Arkaprabho Chatterjee.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button 
              onClick={() => handleNav('about')} 
              className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => handleNav('contact')} 
              className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Contact Us
            </button>
            <button 
              onClick={() => handleNav('privacy')} 
              className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </button>
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <span>XML Sitemap</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
