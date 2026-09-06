'use client';

import Link from "next/link";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-50 dark:bg-brand-950 items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-brand-900 rounded-2xl shadow-sm border border-brand-200 dark:border-brand-800 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 dark:text-brand-100 font-serif mb-2">404</h1>
        <h2 className="text-xl font-medium text-brand-700 dark:text-brand-300 mb-4">Page not found</h2>
        
        <p className="text-brand-600 dark:text-brand-400 mb-8 text-sm leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Check the URL or return to the homepage to find what you need.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-600"
          >
            <Home className="mr-2 h-4 w-4" /> Go to Homepage
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-md border border-brand-300 bg-white dark:bg-brand-900 px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-brand-50 dark:hover:bg-brand-800 text-brand-700 dark:text-brand-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
