import Link from "next/link";
import { ChevronRight, Home, Target, Eye, ExternalLink, Award, Lightbulb, Shield, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-50/30 dark:bg-brand-950">
      {/* Page Header */}
      <div className="bg-brand-900 text-brand-50 border-b border-brand-800 py-16 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-800/50 via-brand-900 to-brand-950"></div>
        <div className="container mx-auto relative z-10 text-center">
          <nav className="flex items-center justify-center text-sm font-medium text-brand-300 mb-6">
            <Link href="/" className="hover:text-white flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">About FCI</span>
          </nav>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif mb-6">
            Faculty of Computing & Informatics
          </h1>
          <p className="text-brand-200 max-w-3xl mx-auto text-lg md:text-xl">
            Shaping the future of technology through innovative education, cutting-edge research, and real-world application at CUSTECH Osara.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 flex-grow space-y-16">
        
        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-brand-900 p-8 md:p-10 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm">
            <div className="h-12 w-12 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 rounded-xl flex items-center justify-center mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-4">Our Mission</h2>
            <p className="text-brand-700 dark:text-brand-300 leading-relaxed">
              To provide a comprehensive education in computing and informatics that equips students with the theoretical foundation, practical skills, and ethical grounding required to innovate and solve complex societal problems. We are committed to fostering a supportive environment that encourages continuous learning, research excellence, and technological advancement.
            </p>
          </div>

          <div className="bg-white dark:bg-brand-900 p-8 md:p-10 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm">
            <div className="h-12 w-12 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 rounded-xl flex items-center justify-center mb-6">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-4">Our Vision</h2>
            <p className="text-brand-700 dark:text-brand-300 leading-relaxed">
              To be a premier faculty recognized globally for excellence in computing education and research, producing graduates who are leaders, innovators, and problem-solvers capable of driving digital transformation across all sectors of the economy in Nigeria and beyond.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-4">Our Core Values</h2>
            <p className="text-brand-600 dark:text-brand-400 max-w-2xl mx-auto">
              These principles guide our teaching, research, and interaction within the university community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-brand-50/50 dark:bg-brand-950/50 p-6 rounded-xl border border-brand-200 dark:border-brand-800 text-center">
              <Award className="h-8 w-8 text-brand-600 dark:text-brand-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-2">Excellence</h3>
              <p className="text-sm text-brand-600 dark:text-brand-400">Striving for the highest standards in education and research.</p>
            </div>
            <div className="bg-brand-50/50 dark:bg-brand-950/50 p-6 rounded-xl border border-brand-200 dark:border-brand-800 text-center">
              <Lightbulb className="h-8 w-8 text-brand-600 dark:text-brand-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-2">Innovation</h3>
              <p className="text-sm text-brand-600 dark:text-brand-400">Encouraging creative thinking and novel solutions to computing challenges.</p>
            </div>
            <div className="bg-brand-50/50 dark:bg-brand-950/50 p-6 rounded-xl border border-brand-200 dark:border-brand-800 text-center">
              <Shield className="h-8 w-8 text-brand-600 dark:text-brand-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-2">Integrity</h3>
              <p className="text-sm text-brand-600 dark:text-brand-400">Upholding honesty, ethical practices, and professional responsibility.</p>
            </div>
            <div className="bg-brand-50/50 dark:bg-brand-950/50 p-6 rounded-xl border border-brand-200 dark:border-brand-800 text-center">
              <Users className="h-8 w-8 text-brand-600 dark:text-brand-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-2">Community</h3>
              <p className="text-sm text-brand-600 dark:text-brand-400">Fostering a collaborative, inclusive, and respectful academic environment.</p>
            </div>
          </div>
        </div>

        {/* About CUSTECH */}
        <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-4">About CUSTECH, Osara</h2>
            <p className="text-brand-700 dark:text-brand-300 leading-relaxed mb-6">
              Confluence University of Science and Technology (CUSTECH) is a state-owned university located in Osara, Kogi State, Nigeria. Established to address the growing need for specialized technical and scientific education, CUSTECH is poised to become a leading institution in technological advancement in Nigeria. The Faculty of Computing and Informatics is one of its pioneer faculties.
            </p>
            <a 
              href="https://custech.edu.ng" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-brand-600 dark:text-brand-400 font-medium hover:text-brand-800 dark:hover:text-brand-300 transition-colors w-fit"
            >
              Visit Official University Website <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
          <div className="bg-brand-100 dark:bg-brand-800 md:w-1/3 min-h-[200px] flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-400 mb-4 shadow-sm">
                <Target className="h-10 w-10" />
              </div>
              <p className="font-serif font-bold text-brand-900 dark:text-brand-100 text-xl">CUSTECH</p>
              <p className="text-brand-600 dark:text-brand-300 text-sm">Osara, Kogi State</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
