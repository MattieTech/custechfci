'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, GraduationCap, Building2, Bot, CheckSquare } from 'lucide-react';

const SLIDES = [
  {
    src: '/images/school-faculty.jpeg',
    alt: 'Faculty of Computing and Informatics Building, CUSTECH Osara',
    label: 'FCI Academic Complex',
    position: 'object-center sm:object-[center_35%]',
  },
  {
    src: '/images/school-gate.jpeg',
    alt: 'CUSTECH Osara University Main Gate',
    label: 'CUSTECH Main Entrance',
    position: 'object-[center_45%]',
  },
  {
    src: '/images/campus-aerial-1.jpg',
    alt: 'CUSTECH Osara Aerial Campus Overview',
    label: 'Aerial Campus Landscape',
    position: 'object-center',
  },
  {
    src: '/images/campus-aerial-2.jpg',
    alt: 'Confluence University of Science and Technology Grounds',
    label: 'University Grounds & Facilities',
    position: 'object-center',
  },
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance every 4 seconds (within the 3-5 seconds requirement)
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative min-h-[540px] sm:min-h-[580px] md:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-brand-200 dark:border-brand-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      aria-label="FCI Hero Slideshow"
    >
      {/* Background Slides with Cross-Fade */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-0 scale-100' : 'opacity-0 -z-10 scale-105'
          } transform transition-transform duration-[7000ms]`}
          aria-hidden={idx !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={idx === 0}
            className={`object-cover ${slide.position}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={90}
          />
        </div>
      ))}

      {/* Calibrated Multi-Layer Overlays for High Legibility on Desktop and Mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85 z-10" />
      <div className="absolute inset-0 bg-brand-950/35 mix-blend-multiply z-10" />

      {/* Hero Content (Preserving All Original Elements: Badge, Title, Subtitle, CTAs) */}
      <div className="container relative z-20 px-4 sm:px-6 mx-auto py-16 sm:py-24 text-center flex flex-col items-center max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-brand-100 mb-6 shadow-md">
          <GraduationCap className="w-4 h-4 mr-2 text-brand-300" />
          <span>CUSTECH &middot; FCI &middot; Student Guide</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-serif leading-[1.15] drop-shadow-md">
          FCI <span className="text-brand-300">Student</span> Guide
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-lg md:text-xl text-brand-100/90 max-w-2xl font-body leading-relaxed drop-shadow px-2">
          Your complete companion for academic life at the Faculty of Computing and Informatics, CUSTECH Osara.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-wrap sm:flex-row gap-2 sm:gap-3.5 w-full sm:w-auto justify-center items-center max-w-md sm:max-w-none">
          <Link
            href="/departments"
            className="inline-flex h-9 sm:h-11 items-center justify-center rounded-lg sm:rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-brand-950/30 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 gap-1.5 shrink-0"
          >
            <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span>Explore Departments</span>
          </Link>
          <Link
            href="/ai-tutor"
            className="inline-flex h-9 sm:h-11 items-center justify-center rounded-lg sm:rounded-xl bg-white text-brand-950 hover:bg-brand-50 px-3.5 sm:px-5 text-xs sm:text-sm font-semibold shadow-md shadow-black/20 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white gap-1.5 shrink-0"
          >
            <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-brand-600" />
            <span>Ask FCI AI</span>
          </Link>
          <Link
            href="/cbt"
            className="inline-flex h-9 sm:h-11 items-center justify-center rounded-lg sm:rounded-xl border border-white/30 bg-white/15 hover:bg-white/25 backdrop-blur-md px-3.5 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white gap-1.5 shrink-0"
          >
            <CheckSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span>CBT Practice</span>
          </Link>
        </div>

        {/* Slide Location Badge */}
        <div className="mt-8 text-xs text-white/80 bg-black/40 backdrop-blur-sm px-3.5 py-1 rounded-full border border-white/10 hidden sm:inline-block">
          {SLIDES[current].label}
        </div>
      </div>

      {/* Prev / Next Chevrons */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white border border-white/15 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white border border-white/15 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Hero Indicator Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              idx === current ? 'w-8 bg-brand-400 shadow-sm' : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === current ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  );
}
