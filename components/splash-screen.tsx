'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const LOADING_STEPS = [
  'Welcome to CUSTECH Osara',
  'Faculty of Computing & Informatics',
  'Loading Department Curriculums & Resources...',
  'Syncing Timetables & Academic Notices...',
  'Knowledge for Advancement of Mankind',
  'Welcome!',
];

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Total duration: 5.5 seconds of active loading + 0.7s fade out (~6.2s total)
    const TOTAL_DURATION_MS = 5500;
    const INTERVAL_MS = 50;
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

    // Trigger fade-out at 5.5s
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
    }, TOTAL_DURATION_MS);

    // Completely unmount at 6.2s
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

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1614] via-[#261B14] to-[#120F0D] text-white overflow-hidden transition-all duration-700 ease-out select-none ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Starting CUSTECH Student Guide"
      role="dialog"
      aria-modal="true"
    >
      {/* Background Animated Ambient Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] bg-brand-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Logo Showcase Area */}
      <div className="relative flex flex-col items-center">
        {/* Outer Rotating Halo Ring */}
        <div className="absolute -inset-6 sm:-inset-8 border border-brand-400/20 rounded-full animate-[spin_16s_linear_infinite] pointer-events-none" />
        <div className="absolute -inset-3 sm:-inset-4 border border-dashed border-sky-400/25 rounded-full animate-[spin_22s_linear_infinite_reverse] pointer-events-none" />

        {/* Pulsing Backglow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-600/30 to-sky-500/30 blur-xl animate-pulse" />

        {/* Animated Crest Logo */}
        <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center animate-[custechFloat_3.5s_ease-in-out_infinite]">
          <Image
            src="/images/school-logo-crest.png"
            alt="CUSTECH Official Logo"
            width={200}
            height={200}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] drop-shadow-[0_0_18px_rgba(196,154,108,0.35)]"
          />
        </div>
      </div>

      {/* Typography and Identification */}
      <div className="mt-8 text-center px-6 max-w-lg z-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold tracking-tight text-white drop-shadow-md">
          CONFLUENCE UNIVERSITY
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-brand-300 mt-1">
          OF SCIENCE AND TECHNOLOGY, OSARA
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sky-300/90 text-xs sm:text-sm font-medium tracking-wide">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping" />
          <span>Faculty of Computing & Informatics</span>
        </div>
      </div>

      {/* Modern Progress Bar Section */}
      <div className="w-64 sm:w-80 mt-8 sm:mt-10 px-2 z-10 flex flex-col items-center">
        {/* Progress Track */}
        <div className="w-full h-1.5 bg-brand-950/70 border border-brand-800/40 rounded-full overflow-hidden p-[1px] shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-brand-400 via-amber-300 to-sky-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(212,180,148,0.7)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Dynamic Status Text & Percentage */}
        <div className="w-full flex items-center justify-between mt-3 text-[11px] sm:text-xs">
          <span className="text-brand-200/80 font-medium tracking-wide truncate max-w-[200px] sm:max-w-[240px] animate-fade-in">
            {LOADING_STEPS[currentStepIndex]}
          </span>
          <span className="text-brand-300 font-mono font-semibold tabular-nums ml-2">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* University Motto at bottom */}
      <div className="absolute bottom-6 text-center z-10">
        <p className="text-[10px] sm:text-xs text-brand-400/60 uppercase tracking-widest font-medium">
          Knowledge for Advancement of Mankind
        </p>
      </div>

      {/* Optional Skip Button for quick testing or admins */}
      <button
        onClick={() => {
          setIsFading(true);
          setTimeout(() => setIsVisible(false), 300);
        }}
        className="absolute top-6 right-6 text-xs text-brand-400/60 hover:text-brand-200 border border-brand-800/50 hover:border-brand-600/60 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full transition-all cursor-pointer"
      >
        Skip &rarr;
      </button>

      {/* Floating animation keyframes */}
      <style jsx global>{`
        @keyframes custechFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
}
