  //  MAIN.JS

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initHero();
  initMobileMenu();
  initSearch();
  initAnnouncement();
  initFadeIn();
  initActiveLink();
});


  //  DARK / LIGHT MODE

function initTheme() {
  var saved = localStorage.getItem('fci-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  setThemeIcons(saved);

  /* Click any .theme-toggle button on the page */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    var cur  = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fci-theme', next);
    setThemeIcons(next);
  });
}

function setThemeIcons(theme) {
  document.querySelectorAll('.theme-toggle i').forEach(function(ico) {
    ico.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  });
}


  //  HERO SLIDESHOW  

function initHero() {
  var slides = document.querySelectorAll('.hero-slide');
  var dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  var current = 0;
  slides[0].classList.add('active');
  if (dots[0]) dots[0].classList.add('active');

  setInterval(function() {
    /* Remove active from current */
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    /* Advance to next (loop) */
    current = (current + 1) % slides.length;

    /* Add active to new current */
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }, 5000); 
}


  //  MOBILE HAMBURGER MENU

function initMobileMenu() {
  /* Use event delegation — works even if elements are added by components.js */
  document.addEventListener('click', function(e) {

    /* Open — hamburger button */
    if (e.target.closest('.hamburger')) {
      var nav = document.getElementById('mobileNav');
      if (nav) nav.classList.add('open');
      return;
    }

    /* Close — X button */
    if (e.target.closest('#mobileNavClose')) {
      var nav = document.getElementById('mobileNav');
      if (nav) nav.classList.remove('open');
      return;
    }

    /* Close — clicking a nav link inside the mobile menu */
    if (e.target.closest('#mobileNav .nav-link')) {
      var nav = document.getElementById('mobileNav');
      if (nav) nav.classList.remove('open');
      return;
    }
  });
}


  //  SEARCH OVERLAY
function initSearch() {
  var searchData = [
    { title: 'Computer Science',             desc: 'Algorithms, AI, databases, programming',         url: 'pages/departments/computer-science.html'    },
    { title: 'Software Engineering',         desc: 'Agile, DevOps, mobile and web development',      url: 'pages/departments/software-engineering.html' },
    { title: 'Cyber Security',               desc: 'Ethical hacking, forensics, cryptography',       url: 'pages/departments/cyber-security.html'       },
    { title: 'IFT Department',               desc: 'Networks, cloud, telecommunications',             url: 'pages/departments/ict.html'                  },
    { title: 'Library & Information Science',desc: 'Information management, digital libraries',       url: 'pages/departments/library-info-science.html' },
    { title: '100 Level Contacts',           desc: 'Faculty and course reps — 100 Level',             url: 'pages/contacts/level-100.html'               },
    { title: '200 Level Contacts',           desc: 'Faculty and course reps — 200 Level',             url: 'pages/contacts/level-200.html'               },
    { title: '300 Level Contacts',           desc: 'Faculty and course reps — 300 Level',             url: 'pages/contacts/level-300.html'               },
    { title: '400 Level Contacts',           desc: 'Faculty and course reps — 400 Level',             url: 'pages/contacts/level-400.html'               },
    { title: 'CGPA Calculator',              desc: 'Calculate your GPA (max 5.0)',                    url: 'pages/resources.html'                        },
    { title: 'Age Calculator',               desc: 'Calculate your exact age',                        url: 'pages/resources.html'                        },
    { title: 'Study Materials',              desc: 'Download notes and past questions',               url: 'pages/resources.html'                        },
    { title: 'Academic Calendar',            desc: 'Key dates and timetable PDF',                     url: 'pages/resources.html'                        },
    { title: 'Faculty News',                 desc: 'Latest news and events from FCI',                 url: 'pages/news.html'                             },
    { title: 'Faculty Rules',                desc: 'Important rules and regulations',                 url: 'index.html#guide'                            },
    { title: 'Course Registration',          desc: 'How to register courses on the portal',           url: 'index.html#guide'                            },
    { title: 'Exam Tips',                    desc: 'Tips for excelling in examinations',              url: 'index.html#guide'                            },
    { title: 'About FCI',                    desc: 'Mission, vision, values, departments',            url: 'pages/about.html'                            },
    { title: 'Developer Contact (MattieTech)',desc: 'Contact Matthew Aliu',                           url: 'pages/contact.html'                          },
  ];

  document.addEventListener('click', function(e) {
    var overlay = document.getElementById('searchOverlay');
    var input   = document.getElementById('searchInput');

    /* Open search */
    if (e.target.closest('.search-trigger')) {
      if (overlay) overlay.classList.add('open');
      setTimeout(function(){ if (input) input.focus(); }, 80);
      return;
    }

    /* Close — X button */
    if (e.target.closest('#searchClose')) {
      if (overlay) overlay.classList.remove('open');
      return;
    }

    /* Close — click dark background */
    if (e.target === overlay) {
      overlay.classList.remove('open');
      return;
    }
  });

  /* Ctrl+K shortcut */
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      var overlay = document.getElementById('searchOverlay');
      var input   = document.getElementById('searchInput');
      if (overlay) overlay.classList.add('open');
      setTimeout(function(){ if (input) input.focus(); }, 80);
    }
    if (e.key === 'Escape') {
      var overlay = document.getElementById('searchOverlay');
      if (overlay) overlay.classList.remove('open');
    }
  });

  /* Search as user types */
  document.addEventListener('input', function(e) {
    if (e.target.id !== 'searchInput') return;
    var q       = e.target.value.toLowerCase().trim();
    var results = document.getElementById('searchResults');
    if (!results) return;
    results.innerHTML = '';

    if (!q) return;

    var BASE_URL = getBase ? getBase() : '';

    var matches = searchData.filter(function(item) {
      return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    });

    if (!matches.length) {
      results.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;font-size:14px">No results for "' + q + '"</p>';
      return;
    }

    matches.forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = '<h4>' + item.title + '</h4><p>' + item.desc + '</p>';
      div.addEventListener('click', function() {
        window.location.href = BASE_URL + item.url;
      });
      results.appendChild(div);
    });
  });
}

function getBase() {
  var path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/contacts/') || path.includes('/pages/departments/')) {
    return '../../';
  } else if (path.includes('/pages/')) {
    return '../';
  }
  return '';
}


//  ANNOUNCEMENT WIDGET

function initAnnouncement() {
  
  setTimeout(function() {
    var card = document.getElementById('annCard');
    if (card) card.classList.add('show');
  }, 2000);

  document.addEventListener('click', function(e) {
    if (e.target.closest('#annClose')) {
      var card = document.getElementById('annCard');
      if (card) card.classList.remove('show');
    }
  });
}


  //  SCROLL FADE-IN ANIMATIONS

function initFadeIn() {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  els.forEach(function(el) { obs.observe(el); });
}


  //  7. ACTIVE NAV LINK

function initActiveLink() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkPage = href.split('/').pop().split('#')[0];
    if (linkPage === page) link.classList.add('active');
  });
}


  //  LEVEL TABS 
  
  
function initLevelTabs() {
  var tabs   = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length) return;

  tabs[0].classList.add('active');
  if (panels[0]) panels[0].classList.add('active');

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      panels.forEach(function(p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.getElementById(tab.dataset.target);
      if (panel) panel.classList.add('active');
    });
  });
}


  //  RESOURCE TABS  

function initResTabs() {
  var tabs   = document.querySelectorAll('.res-tab');
  var panels = document.querySelectorAll('.res-panel');
  if (!tabs.length) return;

  tabs[0].classList.add('active');
  if (panels[0]) panels[0].classList.add('active');

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      panels.forEach(function(p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.getElementById(tab.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });
}


    // CGPA CALCULATOR

var GRADE_PTS = { A:5, B:4, C:3, D:2, E:1, F:0 };

function addCourseRow() {
  var container = document.getElementById('courseRows');
  if (!container) return;

  var row = document.createElement('div');
  row.className = 'course-row';
  row.innerHTML =
    '<input class="calc-input" type="text" placeholder="Course Code">' +
    '<input class="calc-input" type="number" placeholder="Units" min="1" max="6">' +
    '<select class="calc-select">' +
      '<option value="">Grade</option>' +
      '<option value="A">A — 5.0</option>' +
      '<option value="B">B — 4.0</option>' +
      '<option value="C">C — 3.0</option>' +
      '<option value="D">D — 2.0</option>' +
      '<option value="E">E — 1.0</option>' +
      '<option value="F">F — 0.0</option>' +
    '</select>' +
    '<button class="remove-btn" onclick="this.closest(\'.course-row\').remove()" title="Remove row">' +
      '<i class="fas fa-times"></i>' +
    '</button>';
  container.appendChild(row);
}

function calcCGPA() {
  var rows    = document.querySelectorAll('#courseRows .course-row');
  var totPts  = 0;
  var totUnits = 0;

  rows.forEach(function(row) {
    var ins    = row.querySelectorAll('input');
    var grade  = row.querySelector('select').value;
    var units  = parseFloat(ins[1].value);

    if (units > 0 && grade && grade in GRADE_PTS) {
      totPts   += units * GRADE_PTS[grade];
      totUnits += units;
    }
  });

  if (!totUnits) { alert('Please enter at least one course with units and a grade.'); return; }

  var cgpa   = (totPts / totUnits).toFixed(2);
  var cls    = parseFloat(cgpa) >= 4.50 ? 'First Class Honours 🎉' :
               parseFloat(cgpa) >= 3.50 ? 'Second Class Upper' :
               parseFloat(cgpa) >= 2.50 ? 'Second Class Lower' :
               parseFloat(cgpa) >= 1.50 ? 'Third Class' :
               parseFloat(cgpa) >= 1.00 ? 'Pass' : 'Fail';

  document.getElementById('cgpaNumber').textContent = cgpa;
  document.getElementById('cgpaClass').textContent  = cls;
  document.getElementById('cgpaResult').style.display = 'block';
}

function clearCGPA() {
  document.getElementById('courseRows').innerHTML = '';
  document.getElementById('cgpaResult').style.display = 'none';
  for (var i = 0; i < 4; i++) addCourseRow();
}


  //   AGE CALCULATOR

function calcAge() {
  var dob = document.getElementById('dobInput').value;
  if (!dob) { alert('Please enter your date of birth.'); return; }

  var birth  = new Date(dob);
  var today  = new Date();
  var y = today.getFullYear() - birth.getFullYear();
  var m = today.getMonth()    - birth.getMonth();
  var d = today.getDate()     - birth.getDate();

  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }

  var box = document.getElementById('ageResult');
  if (box) {
    box.innerHTML = 'You are <strong>' + y + '</strong> years, <strong>' + m + '</strong> months and <strong>' + d + '</strong> days old.';
    box.style.display = 'block';
  }
}


  //   NEWS FILTER
function filterNews(btn, cat) {
  document.querySelectorAll('.filter-tabs .tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  document.querySelectorAll('#newsGrid .news-card').forEach(function(card) {
    card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
  });
}
                   