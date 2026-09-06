'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in motion-safe:transition-opacity duration-300">
      {children}
    </div>
  );
}
