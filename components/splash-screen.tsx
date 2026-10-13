'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, BookOpen, BellRing, Award } from 'lucide-react';

const LOADING_STEPS = [
  { text: 'Welcome to CUSTECH Osara', sub: 'Portal Initialization', icon: Sparkles },
  { text: 'Faculty of Computing & Informatics', sub: 'Loading Faculty Environment', icon: Cpu },
  { text: 'Curriculums & Digital Library', sub: 'Indexing Study Resources', icon: BookOpen },
  { text: 'Timetables & Academic Notices', sub: 'Syncing Live Updates', icon: BellRing },
  { text: 'Knowledge for Advancement of Mankind', sub: 'Ready to Launch', icon: Award },
];

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Total duration: 5.2 seconds of active loading + 0.7s fade out
    const TOTAL_DURATION_MS = 5200;
    const INTERVAL_MS = 40;
    const increment = 100 / (TOTAL_DURATION_MS / INTERVAL_MS);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, INTERVAL_MS);

    // Step message cycle
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, TOTAL_DURATION_MS / LOADING_STEPS.length);

    // Trigger fade-out
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, TOTAL_DURATION_MS);

    // Completely unmount
    const unmountTimeout = setTimeout(() => {
      setIsVisible(false);
    }, TOTAL_DURATION_MS + 700);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
      clearTimeout(fadeTimeout);
      clearTimeout(unmountTimeout);
    };
  }, []);

  if (!isVisible) return null;

  const CurrentIcon = LOADING_STEPS[currentStepIndex].icon;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-8 sm:py-10 px-4 bg-[#0E0A08] text-white overflow-hidden transition-all duration-700 ease-out select-none ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Starting CUSTECH Student Guide"
      role="dialog"
      aria-modal="true"
    >
      {/* Layered Mesh & Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(163,123,82,0.22),transparent_70%),radial-gradient(ellipse_60%_50%_at_50%_110%,rgba(14,165,233,0.12),transparent_70%),radial-gradient(circle_at_50%_45%,rgba(45,31,21,0.85)_0%,rgba(14,10,8,1)_75%)] pointer-events-none" />

      {/* Subtle Architectural Grid & Vignette */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(212,180,148,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,180,148,0.06) 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        }}
      />

      {/* Ambient Conic Light Beams */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[360px] h-[240px] sm:h-[360px] bg-sky-500/10 rounded-full blur-[95px] pointer-events-none" />

      {/* Floating Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-[18%] left-[20%] w-1.5 h-1.5 rounded-full bg-amber-300/40 blur-[0.5px] animate-[custechParticle_5s_ease-in-out_infinite]" />
        <span className="absolute top-[28%] right-[22%] w-2 h-2 rounded-full bg-sky-400/35 blur-[1px] animate-[custechParticle_7s_ease-in-out_infinite_1s]" />
        <span className="absolute bottom-[26%] left-[25%] w-1.5 h-1.5 rounded-full bg-brand-300/35 blur-[0.5px] animate-[custechParticle_6s_ease-in-out_infinite_0.5s]" />
        <span className="absolute bottom-[22%] right-[20%] w-1 h-1 rounded-full bg-amber-200/50 animate-[custechParticle_4.5s_ease-in-out_infinite_2s]" />
      </div>

      {/* Top Bar: Portal Badge & Skip Action */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between px-2 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-[11px] font-medium tracking-wider uppercase text-brand-200/80">
            Student Guild Portal
          </span>
        </div>

        <button
          onClick={() => {
            setIsFading(true);
            setTimeout(() => setIsVisible(false), 300);
          }}
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-brand-200/75 hover:text-white border border-white/10 hover:border-brand-400/50 bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-md px-3.5 py-1.5 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-300 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Centerpiece Content */}
      <div className="relative z-10 flex flex-col items-center my-auto max-w-xl w-full px-4">
        {/* Royal Medallion Crest Showcase */}
        <div className="relative flex items-center justify-center mb-8 sm:mb-10">
          {/* Outer SVG Orbital Ring with Glowing Nodes */}
          <svg
            className="absolute w-52 h-52 sm:w-64 sm:h-64 animate-[spin_24s_linear_infinite] pointer-events-none"
            viewBox="0 0 240 240"
          >
            <defs>
              <linearGradient id="custechGoldArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#C49A6C" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <circle
              cx="120"
              cy="120"
              r="116"
              fill="none"
              stroke="url(#custechGoldArc)"
              strokeWidth="1.2"
              strokeDasharray="48 18 12 18"
            />
            <circle cx="120" cy="4" r="3" fill="#FBBF24" />
            <circle cx="120" cy="236" r="2.5" fill="#38BDF8" />
          </svg>

          {/* Counter-Rotating Inner Technical Ring */}
          <div className="absolute -inset-4 sm:-inset-5 rounded-full border border-dashed border-sky-400/25 animate-[spin_30s_linear_infinite_reverse] pointer-events-none" />

          {/* Warm Golden Halo Glow */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/35 via-brand-400/25 to-sky-400/35 blur-2xl animate-pulse pointer-events-none" />

          {/* Medallion Frame (Eliminates square corners and frames the crest in a luxury circular seal) */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-b from-amber-200/80 via-brand-400/50 to-brand-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(196,154,108,0.3)] animate-[custechFloat_4s_ease-in-out_infinite]">
            {/* Inner Ivory/Pearl Seal */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#F3ECE4] flex items-center justify-center p-2.5 sm:p-3 overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-amber-900/10">
              {/* Subtle Shimmer Sweep across Medallion */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent -translate-x-full animate-[custechShimmer_4.5s_ease-in-out_infinite] pointer-events-none z-10" />
              <Image
                src="/images/school-logo-crest.png"
                alt="CUSTECH Official Crest"
                width={200}
                height={200}
                priority
                className="w-full h-full object-contain rounded-full mix-blend-multiply scale-[1.03]"
              />
            </div>
          </div>
        </div>

        {/* University Typography & Hierarchy */}
        <div className="text-center flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold tracking-wide bg-gradient-to-b from-white via-[#FAF6F3] to-brand-200 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            CONFLUENCE UNIVERSITY
          </h1>

          {/* Decorative Divider with Sub-header */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-brand-400/70" />
            <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.22em] uppercase text-amber-200/90">
              OF SCIENCE AND TECHNOLOGY, OSARA
            </p>
            <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-brand-400/70" />
          </div>

          {/* Glassmorphic Faculty Pill Badge */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 via-brand-500/15 to-sky-500/10 border border-sky-400/25 shadow-[0_0_25px_rgba(56,189,248,0.12)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            <span className="text-xs sm:text-sm font-medium tracking-wide text-sky-200">
              Faculty of Computing &amp; Informatics
            </span>
          </div>
        </div>

        {/* Glassmorphic Progress Card */}
        <div className="w-full max-w-md mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {/* Status Header Row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-400/30 flex items-center justify-center shrink-0 text-amber-300">
                <CurrentIcon className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-[13px] font-medium text-white/95 truncate">
                  {LOADING_STEPS[currentStepIndex].text}
                </p>
                <p className="text-[10px] text-brand-300/70 tracking-wider uppercase truncate">
                  {LOADING_STEPS[currentStepIndex].sub}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm sm:text-base font-mono font-bold bg-gradient-to-r from-amber-200 to-sky-300 bg-clip-text text-transparent tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Luminous Progress Bar Track */}
          <div className="relative w-full h-2 bg-black/50 border border-white/10 rounded-full overflow-hidden p-[1px]">
            <div
              className="relative h-full bg-gradient-to-r from-brand-400 via-amber-300 to-sky-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_16px_rgba(251,191,36,0.6)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Leading Edge Spark */}
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
            </div>
          </div>

          {/* Step Milestone Dots */}
          <div className="flex items-center justify-between mt-3 px-0.5">
            <div className="flex items-center gap-1.5">
              {LOADING_STEPS.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex
                      ? 'w-5 bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.6)]'
                      : idx < currentStepIndex
                      ? 'w-2 bg-brand-400/60'
                      : 'w-1.5 bg-white/15'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-brand-300/60 uppercase tracking-widest">
              Step {currentStepIndex + 1} of {LOADING_STEPS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Motto Footer */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2 text-brand-300/65">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400/70" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium">
            Knowledge for Advancement of Mankind
          </p>
        </div>
      </div>

      {/* Custom Keyframes */}
      <style jsx global>{`
        @keyframes custechFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.02);
          }
        }
        @keyframes custechShimmer {
          0% {
            transform: translateX(-120%) skewX(-15deg);
          }
          45%, 100% {
            transform: translateX(150%) skewX(-15deg);
          }
        }
        @keyframes custechParticle {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-16px) scale(1.3);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

