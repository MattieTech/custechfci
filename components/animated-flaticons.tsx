'use client';

import React from 'react';

interface FlaticonProps {
  className?: string;
  size?: number;
}

/**
 * 1. Interactive CBT Mock Drill Flaticon
 * Vibrant emerald/teal stopwatch with spinning second hand, pulsing lightning bolt, and floating check badge.
 */
export function FlaticonCbtIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <linearGradient id="cbtGradBody" x1="12" y1="8" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="cbtGradFace" x1="18" y1="18" x2="46" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#ECFDF5" />
        </linearGradient>
        <linearGradient id="cbtGradBolt" x1="26" y1="20" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Top Stopwatch Push Buttons */}
      <rect x="28" y="4" width="8" height="6" rx="2" fill="#065F46" />
      <rect x="29.5" y="2" width="5" height="3" rx="1.5" fill="#34D399" />
      <rect x="46" y="10" width="6" height="4" rx="1.5" transform="rotate(35 46 10)" fill="#065F46" />

      {/* Outer Case with Soft Drop Glow */}
      <circle cx="32" cy="35" r="24" fill="url(#cbtGradBody)" />
      <circle cx="32" cy="35" r="22" fill="#059669" />

      {/* Dial Face */}
      <circle cx="32" cy="35" r="18" fill="url(#cbtGradFace)" />

      {/* Dial Tick Marks */}
      <circle cx="32" cy="20" r="1.5" fill="#10B981" />
      <circle cx="47" cy="35" r="1.5" fill="#10B981" />
      <circle cx="32" cy="50" r="1.5" fill="#10B981" />
      <circle cx="17" cy="35" r="1.5" fill="#10B981" />

      {/* Animated Rotating Stopwatch Hand */}
      <g
        className="animate-[spin_4s_linear_infinite]"
        style={{ transformOrigin: '32px 35px' }}
      >
        <line x1="32" y1="35" x2="32" y2="23" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="23" r="2" fill="#047857" />
      </g>

      {/* Center Pivot Pin */}
      <circle cx="32" cy="35" r="3.5" fill="#065F46" />
      <circle cx="32" cy="35" r="1.5" fill="#34D399" />

      {/* Floating Animated Lightning Badge */}
      <g className="animate-icon-pulse" style={{ transformOrigin: '32px 35px' }}>
        <path
          d="M33 25L26 35H32L31 43L38 33H32L33 25Z"
          fill="url(#cbtGradBolt)"
          stroke="#D97706"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </g>

      {/* Mini Floating Check Badge */}
      <circle cx="48" cy="46" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M45 46L47 48L51 44" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 2. Smart CGPA Calculator Flaticon
 * Vibrant 3D flat calculator with glowing emerald digital display, colorful keypad, and floating animated math operators.
 */
export function FlaticonCgpaIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <linearGradient id="cgpaGradCase" x1="12" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="cgpaGradScreen" x1="18" y1="12" x2="46" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064E3B" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
      </defs>

      {/* Calculator Body */}
      <rect x="12" y="6" width="40" height="52" rx="8" fill="url(#cgpaGradCase)" />
      <rect x="14" y="8" width="36" height="48" rx="6" fill="#4338CA" />

      {/* Solar Cell / Brand Bar */}
      <rect x="18" y="11" width="12" height="4" rx="1.5" fill="#78350F" />
      <line x1="22" y1="11" x2="22" y2="15" stroke="#92400E" strokeWidth="0.8" />
      <line x1="26" y1="11" x2="26" y2="15" stroke="#92400E" strokeWidth="0.8" />

      {/* Digital LCD Screen */}
      <rect x="18" y="17" width="28" height="12" rx="3" fill="url(#cgpaGradScreen)" stroke="#047857" strokeWidth="1" />
      {/* 5.00 Digit Simulation with Glow */}
      <text
        x="42"
        y="26"
        fill="#34D399"
        fontSize="9"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="end"
        className="animate-pulse"
      >
        5.00
      </text>

      {/* Keypad Buttons */}
      {/* Row 1 */}
      <rect x="18" y="32" width="7" height="6" rx="2" fill="#818CF8" />
      <rect x="28" y="32" width="7" height="6" rx="2" fill="#818CF8" />
      <rect x="38" y="32" width="8" height="6" rx="2" fill="#F59E0B" />

      {/* Row 2 */}
      <rect x="18" y="40" width="7" height="6" rx="2" fill="#C7D2FE" />
      <rect x="28" y="40" width="7" height="6" rx="2" fill="#C7D2FE" />
      <rect x="38" y="40" width="8" height="6" rx="2" fill="#F59E0B" />

      {/* Row 3 */}
      <rect x="18" y="48" width="17" height="6" rx="2" fill="#C7D2FE" />
      <rect x="38" y="48" width="8" height="6" rx="2" fill="#10B981" />

      {/* Floating Animated Math Operators */}
      <g className="animate-icon-float">
        <circle cx="8" cy="20" r="5" fill="#FBBF24" />
        <path d="M8 17V23M5 20H11" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g className="animate-icon-wiggle" style={{ transformOrigin: '54px 18px' }}>
        <circle cx="55" cy="18" r="5" fill="#38BDF8" />
        <path d="M52 15L58 21M58 15L52 21" stroke="#0369A1" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 3. Academic Materials Vault Flaticon
 * Vibrant multi-tier book stack with turning page animation, glowing bookmark, and gold achievement star.
 */
export function FlaticonVaultIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <linearGradient id="vaultBook1" x1="10" y1="42" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="vaultBook2" x1="12" y1="30" x2="52" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="vaultTop" x1="14" y1="16" x2="50" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Bottom Book (Purple) */}
      <rect x="10" y="44" width="44" height="11" rx="3" fill="url(#vaultBook1)" />
      <rect x="12" y="46" width="38" height="7" rx="1.5" fill="#F5F3FF" />
      <rect x="10" y="44" width="6" height="11" rx="2" fill="#4C1D95" />

      {/* Middle Book (Cyan/Blue) */}
      <rect x="13" y="32" width="40" height="10" rx="3" fill="url(#vaultBook2)" />
      <rect x="15" y="34" width="34" height="6" rx="1.5" fill="#F0F9FF" />
      <rect x="13" y="32" width="6" height="10" rx="2" fill="#0369A1" />

      {/* Top Open Book / Binder */}
      <g className="animate-flaticon-page" style={{ transformOrigin: '32px 24px' }}>
        <path
          d="M16 28C22 26 30 26 32 28C34 26 42 26 48 28V16C42 14 34 14 32 16C30 14 22 14 16 16V28Z"
          fill="url(#vaultTop)"
        />
        <path
          d="M18 26C23 24.5 29 24.5 32 26V16.5C29 15 23 15 18 16.5V26Z"
          fill="#FFFBEB"
        />
        <path
          d="M46 26C41 24.5 35 24.5 32 26V16.5C35 15 41 15 46 16.5V26Z"
          fill="#FEF3C7"
        />
        {/* Book Spine Center */}
        <line x1="32" y1="15" x2="32" y2="28" stroke="#B45309" strokeWidth="1.5" />
      </g>

      {/* Bookmark Ribbon Hanging */}
      <path
        d="M32 27V38L34.5 35.5L37 38V27H32Z"
        fill="#EF4444"
        className="animate-icon-wiggle"
        style={{ transformOrigin: '32px 27px' }}
      />

      {/* Floating Gold Academic Star */}
      <g className="animate-icon-sparkle" style={{ transformOrigin: '52px 14px' }}>
        <polygon
          points="52,9 53.5,12.5 57,13 54.5,15.5 55,19 52,17.5 49,19 49.5,15.5 47,13 50.5,12.5"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

/**
 * 4. Lecture & Exam Timetable Flaticon
 * Vibrant spiral calendar with flipping days and an animated rotating clock indicator.
 */
export function FlaticonTimetableIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <linearGradient id="ttHeader" x1="12" y1="8" x2="52" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" />
          <stop offset="1" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      {/* Calendar Base Page */}
      <rect x="12" y="14" width="40" height="42" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Calendar Crimson Header */}
      <rect x="12" y="12" width="40" height="15" rx="5" fill="url(#ttHeader)" />

      {/* Spiral Binder Rings */}
      <rect x="18" y="8" width="4" height="8" rx="2" fill="#64748B" />
      <rect x="30" y="8" width="4" height="8" rx="2" fill="#64748B" />
      <rect x="42" y="8" width="4" height="8" rx="2" fill="#64748B" />

      {/* Calendar Grid Cells */}
      <rect x="17" y="32" width="6" height="5" rx="1.5" fill="#E2E8F0" />
      <rect x="26" y="32" width="6" height="5" rx="1.5" fill="#E2E8F0" />
      <rect x="35" y="32" width="6" height="5" rx="1.5" fill="#E2E8F0" />
      <rect x="44" y="32" width="4" height="5" rx="1.5" fill="#E2E8F0" />

      {/* Active Day Highlight (28 Resumption) */}
      <rect x="25" y="40" width="8" height="8" rx="2" fill="#3B82F6" />
      <text x="29" y="46" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">
        28
      </text>

      <rect x="17" y="40" width="6" height="5" rx="1.5" fill="#E2E8F0" />
      <rect x="35" y="40" width="6" height="5" rx="1.5" fill="#E2E8F0" />

      {/* Mini Clock Overlay at Bottom Right */}
      <circle cx="46" cy="46" r="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="46" cy="46" r="8" fill="#1E293B" />
      <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '46px 46px' }}>
        <line x1="46" y1="46" x2="46" y2="40" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="46" y1="46" x2="50" y2="46" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <circle cx="46" cy="46" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 5. Guild Grievance Box Flaticon
 * Vibrant amber envelope with an official report sheet sliding up and down, stamped with security wax badge.
 */
export function FlaticonGrievanceIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <linearGradient id="envGrad" x1="10" y1="22" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Animated Report Letter Sliding Out of Envelope */}
      <g className="animate-flaticon-slide">
        <rect x="18" y="10" width="28" height="26" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="22" y1="15" x2="38" y2="15" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="20" x2="42" y2="20" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="25" x2="34" y2="25" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
        {/* Verification Check on Letter */}
        <circle cx="39" cy="27" r="3" fill="#10B981" />
        <path d="M37.5 27L38.5 28L40.5 26" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* Envelope Back Body */}
      <rect x="10" y="24" width="44" height="32" rx="5" fill="url(#envGrad)" />

      {/* Envelope Flap Creases */}
      <path d="M10 26L32 40L54 26" stroke="#B45309" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <path d="M10 54L26 38" stroke="#B45309" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M54 54L38 38" stroke="#B45309" strokeWidth="1.4" strokeLinecap="round" />

      {/* Official Confidential Shield / Seal */}
      <g className="animate-icon-pulse" style={{ transformOrigin: '32px 42px' }}>
        <circle cx="32" cy="42" r="7" fill="#DC2626" stroke="#FEF2F2" strokeWidth="1.5" />
        <path d="M30 40H34V45H30V40Z" fill="#FFFFFF" />
        <path d="M30.5 40V38C30.5 37 31 36.5 32 36.5C33 36.5 33.5 37 33.5 38V40" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 6. Faculty Lost & Found Radar Flaticon
 * High-tech campus sonar scanner with rotating sweep radar beam and blinking detection ping points.
 */
export function FlaticonLostFoundIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <radialGradient id="radarSweep" cx="32" cy="32" r="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" stopOpacity="0.7" />
          <stop offset="1" stopColor="#0891B2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radar Dish Outer Ring */}
      <circle cx="32" cy="32" r="25" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />

      {/* Sonar Concentric Rings */}
      <circle cx="32" cy="32" r="18" stroke="#0891B2" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="32" cy="32" r="11" stroke="#0891B2" strokeWidth="1" opacity="0.6" />
      <circle cx="32" cy="32" r="4" fill="#06B6D4" />

      {/* Crosshairs */}
      <line x1="32" y1="8" x2="32" y2="56" stroke="#0E7490" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="32" x2="56" y2="32" stroke="#0E7490" strokeWidth="1" opacity="0.5" />

      {/* Rotating Radar Sweep Beam */}
      <g className="animate-flaticon-radar" style={{ transformOrigin: '32px 32px' }}>
        <path d="M32 32L54 22A25 25 0 0 0 46 11Z" fill="url(#radarSweep)" />
        <line x1="32" y1="32" x2="54" y2="22" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Blinking Ping Dots (Detected Items: ID Card / Device) */}
      <circle cx="43" cy="24" r="2.5" fill="#22C55E" className="animate-ping" />
      <circle cx="43" cy="24" r="2.5" fill="#4ADE80" />

      <circle cx="22" cy="38" r="2" fill="#F59E0B" className="animate-pulse" />
      <circle cx="38" cy="44" r="1.5" fill="#38BDF8" />
    </svg>
  );
}

/**
 * 7. AI Bot / Ask FCI Copilot Flaticon
 * Cute metallic AI companion with blinking eyes, pulsating antenna wave, and orbiting stars.
 */
export function FlaticonAiBotIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <linearGradient id="aiHead" x1="14" y1="16" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="aiVisor" x1="18" y1="24" x2="46" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="1" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* Antenna with Pulsing Glow Tip */}
      <line x1="32" y1="8" x2="32" y2="16" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="7" r="4.5" fill="#F59E0B" className="animate-ping" opacity="0.7" />
      <circle cx="32" cy="7" r="3.5" fill="#FBBF24" />

      {/* Ear Headphone Pods */}
      <rect x="9" y="26" width="5" height="14" rx="2.5" fill="#0369A1" />
      <rect x="50" y="26" width="5" height="14" rx="2.5" fill="#0369A1" />

      {/* Robot Head Body */}
      <rect x="14" y="16" width="36" height="34" rx="10" fill="url(#aiHead)" />
      <rect x="16" y="18" width="32" height="30" rx="8" fill="#0284C7" opacity="0.3" />

      {/* Glossy Dark Visor Screen */}
      <rect x="18" y="24" width="28" height="18" rx="6" fill="url(#aiVisor)" stroke="#38BDF8" strokeWidth="1" />

      {/* Animated Blinking Expressive Cyan Eyes */}
      <g className="animate-flaticon-blink" style={{ transformOrigin: '32px 33px' }}>
        <circle cx="26" cy="33" r="3.5" fill="#38BDF8" />
        <circle cx="27" cy="32" r="1.2" fill="#FFFFFF" />

        <circle cx="38" cy="33" r="3.5" fill="#38BDF8" />
        <circle cx="39" cy="32" r="1.2" fill="#FFFFFF" />
      </g>

      {/* Friendly Robot Smile Bar */}
      <path d="M28 44Q32 47 36 44" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Orbiting AI Sparkles */}
      <g className="animate-icon-sparkle" style={{ transformOrigin: '52px 14px' }}>
        <polygon points="52,10 53,13 56,14 53,15 52,18 51,15 48,14 51,13" fill="#FDE047" />
      </g>
    </svg>
  );
}

/**
 * 8. Notification Bell Flaticon
 * 3D-styled golden metallic bell swinging with clapper and radiating sound waves.
 */
export function FlaticonBellIcon({ className = 'w-12 h-12' }: FlaticonProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
    >
      <defs>
        <linearGradient id="bellGrad" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Soundwaves Emitting */}
      <path
        d="M10 24A22 22 0 0 0 10 40"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-icon-pulse"
      />
      <path
        d="M54 24A22 22 0 0 1 54 40"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-icon-pulse"
      />

      {/* Swinging Bell Assembly */}
      <g className="animate-icon-bell" style={{ transformOrigin: '32px 10px' }}>
        {/* Top Ring */}
        <circle cx="32" cy="11" r="5" fill="none" stroke="#D97706" strokeWidth="2.5" />

        {/* Bell Body */}
        <path
          d="M32 14C23 14 20 22 18 36C17 43 13 46 13 48H51C51 46 47 43 46 36C44 22 41 14 32 14Z"
          fill="url(#bellGrad)"
          stroke="#B45309"
          strokeWidth="1.5"
        />

        {/* Gloss Highlight on Bell Dome */}
        <path d="M25 20C24 24 23 30 22 36" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Bell Lip Rim */}
        <ellipse cx="32" cy="48" rx="19" ry="3.5" fill="#D97706" stroke="#B45309" strokeWidth="1" />

        {/* Moving Clapper */}
        <circle cx="32" cy="53" r="4.5" fill="#92400E" stroke="#78350F" strokeWidth="1" />
      </g>

      {/* Alert Dot Badge */}
      <circle cx="46" cy="18" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * 9. Computer Science Department Flaticon
 * Sleek laptop with glowing green matrix binary code and microchip.
 */
export function FlaticonDeptCs({ className = 'w-10 h-10' }: FlaticonProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="14" width="40" height="26" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <rect x="15" y="17" width="34" height="20" rx="1.5" fill="#022C22" />
      <text x="18" y="25" fill="#22C55E" fontSize="5" fontFamily="monospace" fontWeight="bold">
        &gt;_ CSC 101
      </text>
      <text x="18" y="32" fill="#4ADE80" fontSize="4.5" fontFamily="monospace">
        0110 1101
      </text>
      <path d="M8 44H56L52 48H12L8 44Z" fill="#475569" stroke="#334155" strokeWidth="1.5" />
      <line x1="28" y1="45" x2="36" y2="45" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 10. Cyber Security Department Flaticon
 * Gleaming cobalt & emerald security shield with padlock core.
 */
export function FlaticonDeptCyber({ className = 'w-10 h-10' }: FlaticonProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M32 8L50 15V28C50 40 42 50 32 56C22 50 14 40 14 28V15L32 8Z"
        fill="#0284C7"
        stroke="#0369A1"
        strokeWidth="2"
      />
      <path
        d="M32 12L46 18V28C46 38 39 46 32 51C25 46 18 38 18 28V18L32 12Z"
        fill="#0369A1"
        opacity="0.5"
      />
      <rect x="25" y="27" width="14" height="12" rx="2.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      <path d="M28 27V23C28 20.8 29.8 19 32 19C34.2 19 36 20.8 36 23V27" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="32" r="1.5" fill="#78350F" />
    </svg>
  );
}

/**
 * 11. Software Engineering Department Flaticon
 * Vibrant orange code tags with interlocking rotating gear wheels.
 */
export function FlaticonDeptSe({ className = 'w-10 h-10' }: FlaticonProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="24" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="2" />
      <g className="animate-icon-spin-slow" style={{ transformOrigin: '32px 32px' }}>
        <circle cx="32" cy="32" r="9" fill="#EA580C" />
        <rect x="30" y="19" width="4" height="26" rx="1.5" fill="#EA580C" />
        <rect x="19" y="30" width="26" height="4" rx="1.5" fill="#EA580C" />
        <circle cx="32" cy="32" r="4.5" fill="#FFFFFF" />
      </g>
      {/* Code Angle Brackets </> */}
      <path d="M14 26L8 32L14 38" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 26L56 32L50 38" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 12. Information Technology Department Flaticon
 * Modern high-tech server rack with glowing status LEDs and cloud sync waves.
 */
export function FlaticonDeptIt({ className = 'w-10 h-10' }: FlaticonProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="16" y="12" width="32" height="12" rx="2.5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
      <circle cx="22" cy="18" r="2" fill="#22C55E" className="animate-pulse" />
      <circle cx="28" cy="18" r="1.5" fill="#38BDF8" />
      <line x1="34" y1="18" x2="42" y2="18" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />

      <rect x="16" y="26" width="32" height="12" rx="2.5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
      <circle cx="22" cy="32" r="2" fill="#22C55E" className="animate-pulse" />
      <circle cx="28" cy="32" r="1.5" fill="#38BDF8" />
      <line x1="34" y1="32" x2="42" y2="32" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />

      <rect x="16" y="40" width="32" height="12" rx="2.5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
      <circle cx="22" cy="46" r="2" fill="#22C55E" className="animate-pulse" />
      <circle cx="28" cy="46" r="1.5" fill="#F59E0B" />
      <line x1="34" y1="46" x2="42" y2="46" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 13. Library & Information Science Department Flaticon
 * Digital knowledge library with open book and magnifying research lens.
 */
export function FlaticonDeptLis({ className = 'w-10 h-10' }: FlaticonProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="38" width="40" height="12" rx="2.5" fill="#7C3AED" />
      <rect x="14" y="40" width="36" height="8" rx="1.5" fill="#EDE9FE" />
      <path
        d="M16 34C22 32 30 32 32 34C34 32 42 32 48 34V22C42 20 34 20 32 22C30 20 22 20 16 22V34Z"
        fill="#A78BFA"
      />
      <circle cx="42" cy="20" r="7" fill="#FFFFFF" stroke="#6D28D9" strokeWidth="2" />
      <line x1="47" y1="25" x2="54" y2="32" stroke="#6D28D9" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
