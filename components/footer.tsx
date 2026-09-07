import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-brand-50 py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h2 className="font-playfair font-bold text-2xl mb-4 text-brand-100">FCI Student Guide</h2>
          <p className="text-brand-200 text-sm leading-relaxed">
            The official student portal for the Faculty of Computing and Informatics at Confluence University of Science and Technology (CUSTECH) Osara.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-brand-100">Departments</h3>
          <ul className="space-y-2">
            <li><Link href="/departments/computer-science" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Computer Science</Link></li>
            <li><Link href="/departments/cyber-security" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Cyber Security</Link></li>
            <li><Link href="/departments/information-technology" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Information Technology</Link></li>
            <li><Link href="/departments/software-engineering" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Software Engineering</Link></li>
            <li><Link href="/departments/library-info-science" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Library &amp; Information Science</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-brand-100">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/calendar" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Academic Calendar</Link></li>
            <li><Link href="/timetable" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Exam Timetable</Link></li>
            <li><Link href="/resources?tab=materials" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Study Materials</Link></li>
            <li><Link href="/resources?tab=cgpa" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">CGPA Calculator</Link></li>
            <li><Link href="/contacts" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Contact Reps</Link></li>
            <li><Link href="/news" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Faculty News</Link></li>
            <li><Link href="https://custech.edu.ng" target="_blank" rel="noopener noreferrer" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">CUSTECH Portal</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-brand-100">Student Guide</h3>
          <ul className="space-y-2">
            <li><Link href="/guide/faculty-rules" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Faculty Rules</Link></li>
            <li><Link href="/guide/exam-tips" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Exam Tips</Link></li>
            <li><Link href="/guide/check-results" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Check Results</Link></li>
            <li><Link href="/guide/course-registration" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Course Registration</Link></li>
            <li><Link href="/about" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">About Us</Link></li>
            <li><Link href="/about" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">About FCI</Link></li>
            <li><Link href="/#guide" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Faculty Regulations</Link></li>
            <li><Link href="/#guide" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Exam Protocols</Link></li>
            <li><Link href="/contacts" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Department Reps</Link></li>
            <li><Link href="/#guide" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Exam Protocols &amp; Conduct</Link></li>
            <li><Link href="/about" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">About Faculty &amp; Leadership</Link></li>
            <li><Link href="/resources?tab=cgpa" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">CGPA &amp; Grading System</Link></li>
            <li><Link href="/contacts" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Department &amp; Faculty Reps</Link></li>
            <li><Link href="https://custech.edu.ng" target="_blank" rel="noopener noreferrer" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Student Portal / Registration</Link></li>
            <li><Link href="/admin/login" className="text-brand-300 hover:text-brand-100 transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 rounded-sm">Admin Portal</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-brand-800 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-400 text-xs">
        <p>&copy; {currentYear} Faculty of Computing and Informatics. All rights reserved.</p>
        <p>Built by MattieTech</p>
      </div>
    </footer>
  );
}
