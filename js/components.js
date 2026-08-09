
function getBase() {
  var path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/contacts/') || path.includes('/pages/departments/')) {
    return '../../';
  } else if (path.includes('/pages/')) {
    return '../';
  }
  return '';
}

var BASE = getBase();

/* ---- HEADER ---- */
function buildHeader() {
  var pages = [
    { href: BASE + 'index.html',             icon: 'fa-house',             label: 'Home'        },
    { href: BASE + 'pages/departments.html', icon: 'fa-building-columns',  label: 'Departments' },
    { href: BASE + 'pages/about.html',       icon: 'fa-circle-info',       label: 'About'       },
    { href: BASE + 'pages/resources.html',   icon: 'fa-book-open',         label: 'Resources'   },
    { href: BASE + 'pages/news.html',        icon: 'fa-newspaper',         label: 'News'        },
    { href: BASE + 'pages/contact.html',     icon: 'fa-address-book',      label: 'Contact'     },
  ];

  var desktopLinks = pages.map(function(p){
    return '<a href="' + p.href + '" class="nav-link"><i class="fas ' + p.icon + '"></i> ' + p.label + '</a>';
  }).join('');

  var mobileLinks = pages.map(function(p){
    return '<a href="' + p.href + '" class="nav-link"><i class="fas ' + p.icon + '"></i> ' + p.label + '</a>';
  }).join('');

  return `
  <header class="site-header">
    <div class="header-inner">

      <!-- LEFT: Logo + School name -->
      <div class="header-left">
      <img src="${BASE}images/school-logo.png" alt="FCI Logo" class="site-logo">
        <div class="header-school-name">
          Confluence University of Science &amp; Technology Osara (CUSTECH)
        </div>
      </div>

      <!-- RIGHT: Nav links + search + dark-mode + hamburger -->
      <div class="header-right">

        <!-- Desktop nav links (hidden on mobile via CSS) -->
        ${desktopLinks}

        <!-- Search pill (hidden on mobile) -->
        <div class="nav-search-pill search-trigger" title="Search (Ctrl+K)">
          <i class="fas fa-magnifying-glass"></i>
          <span>Search…</span>
        </div>

        <!-- Dark / Light mode toggle -->
        <button class="theme-toggle" aria-label="Toggle dark mode">
          <i class="fas fa-moon"></i>
        </button>

        <!-- Hamburger — only shows on mobile (CSS display:none on desktop) -->
        <button class="hamburger" aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </div>
  </header>

  <!-- ---- MOBILE FULL-SCREEN NAV ---- -->
  <nav class="mobile-nav" id="mobileNav">
    <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">
      <i class="fas fa-times"></i>
    </button>
    ${mobileLinks}
    <button class="theme-toggle" aria-label="Toggle dark mode" style="margin-top:14px;width:50px;height:50px;font-size:20px">
      <i class="fas fa-moon"></i>
    </button>
  </nav>

  <!-- ---- SEARCH OVERLAY ---- -->
  <div class="search-overlay" id="searchOverlay">
    <div class="search-box">
      <div class="search-row">
        <i class="fas fa-magnifying-glass"></i>
        <input type="text" id="searchInput" placeholder="Search departments, resources, contacts…">
        <button class="search-close" id="searchClose"><i class="fas fa-times"></i></button>
      </div>
      <div id="searchResults"></div>
    </div>
  </div>
  `;
}

/* ---- FOOTER ---- */
function buildFooter() {
  return `
  <footer class="footer">
    <div class="footer-grid">

      <div>
        <div class="footer-brand-name">FCI Student Guide</div>
        <p class="footer-brand-desc">
          Faculty of Computing and Informatics<br>
          Confluence University of Science &amp; Technology Osara (CUSTECH)
        </p>
        <div class="footer-socials">
          <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
          <a href="#" aria-label="Twitter / X"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="Telegram"><i class="fab fa-telegram"></i></a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Departments</h4>
        <ul>
          <li><a href="${BASE}pages/departments/computer-science.html"><i class="fas fa-chevron-right"></i> Computer Science</a></li>
          <li><a href="${BASE}pages/departments/software-engineering.html"><i class="fas fa-chevron-right"></i> Software Engineering</a></li>
          <li><a href="${BASE}pages/departments/cyber-security.html"><i class="fas fa-chevron-right"></i> Cyber Security</a></li>
          <li><a href="${BASE}pages/departments/ict.html"><i class="fas fa-chevron-right"></i> IFT</a></li>
          <li><a href="${BASE}pages/departments/library-info-science.html"><i class="fas fa-chevron-right"></i> Library &amp; Info Science</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="${BASE}pages/resources.html"><i class="fas fa-chevron-right"></i> CGPA Calculator</a></li>
          <li><a href="${BASE}pages/resources.html"><i class="fas fa-chevron-right"></i> Study Materials</a></li>
          <li><a href="${BASE}pages/news.html"><i class="fas fa-chevron-right"></i> Faculty News</a></li>
          <li><a href="${BASE}pages/contact.html"><i class="fas fa-chevron-right"></i> Contact Reps</a></li>
          <li><a href="https://custech.edu.ng" target="_blank"><i class="fas fa-chevron-right"></i> CUSTECH Portal</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Student Guide</h4>
        <ul>
          <li><a href="${BASE}index.html#guide"><i class="fas fa-chevron-right"></i> Faculty Rules</a></li>
          <li><a href="${BASE}index.html#guide"><i class="fas fa-chevron-right"></i> Exam Tips</a></li>
          <li><a href="${BASE}index.html#guide"><i class="fas fa-chevron-right"></i> Check Results</a></li>
          <li><a href="${BASE}index.html#guide"><i class="fas fa-chevron-right"></i> Course Registration</a></li>
          <li><a href="${BASE}pages/about.html"><i class="fas fa-chevron-right"></i> About FCI</a></li>
        </ul>
      </div>

    </div>

    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} FCI Student Guide &middot; CUSTECH Osara &middot; Built by <strong>MattieTech</strong></span>
      <span>Faculty of Computing &amp; Informatics</span>
    </div>
  </footer>
  `;
}

/* ---- ANNOUNCEMENT WIDGET ---- */
function buildAnnouncement() {
  return `
  <div class="ann-widget">
    <div class="ann-card" id="annCard">
      <div class="ann-head">
        <div class="ann-head-label"><i class="fas fa-bell"></i> Announcements</div>
        <button class="ann-head-close" id="annClose"><i class="fas fa-times"></i></button>
      </div>
      <div class="ann-body">
        <div class="ann-row"><div class="ann-dot red"></div><span>Second semester exams begin <strong>next week</strong></span></div>
        <div class="ann-row"><div class="ann-dot blue"></div><span>Course reg. deadline — <strong>Not Specific</strong></span></div>
        <div class="ann-row"><div class="ann-dot green"></div><span>More Announcements Coming Soon — Check back Later</span></div>
        <div class="ann-row"><div class="ann-dot"></div><span>More Announcements Coming Soon — Check back Later</span></div>
      </div>
    </div>
  </div>
  `;
}

/* ---- INJECT ON PAGE LOAD ---- */
document.addEventListener('DOMContentLoaded', function() {
  var h = document.getElementById('headerSlot');
  var f = document.getElementById('footerSlot');
  var a = document.getElementById('annSlot');
  if (h) h.innerHTML = buildHeader();
  if (f) f.innerHTML = buildFooter();
  if (a) a.innerHTML = buildAnnouncement();
});
