# 🎓 FCI Student Guide — CUSTECH Osara

> **Your complete digital companion for academic life at the Faculty of Computing and Informatics (FCI), Confluence University of Science and Technology (CUSTECH), Osara.**

---

## 📌 About The Project

The **FCI Student Guide** is a modern, responsive web application engineered to empower students, course representatives, and faculty members at **CUSTECH Osara**. It provides central access to academic department details, student leadership contacts across all levels (100L - 400L), interactive utility tools such as a **5.0-scale CGPA Calculator**, faculty regulations, announcements, and study resources.

---

## ✨ Key Features

- 🏛️ **Academic Department Profiles**: Comprehensive details, curriculum overviews, and specializations for all 5 FCI departments:
  - **Computer Science**
  - **Software Engineering**
  - **Cyber Security**
  - **Information & Communication Technology (IFT)**
  - **Library & Information Science**

- 📱 **Level-by-Level Contact Directory**: Structured directories for student representatives and level executives across **100L, 200L, 300L, and 400L**.

- 🧮 **Interactive Student Tools**:
  - **5.0 CGPA & GPA Calculator**: Real-time grade point calculations, credit unit aggregation, and academic standing assessment based on standard CUSTECH grading systems.
  - **Age Calculator**: Quick utility tool for student registration verification.

- 🔍 **Instant Global Search**: Hotkey-enabled (`Ctrl + K` / `Cmd + K`) instant search modal indexing all departments, contact pages, tools, and guide topics.

- 🌙 **Dark / Light Theme System**: Dynamic theme switcher with persistent user preference stored in `localStorage`.

- 🔔 **Live Announcement Drawer**: Floating, collapsible notification drawer for urgent faculty announcements, exam dates, and course registration deadlines.

- ⚡ **Lightweight & Fast**: Built with pure HTML5, CSS3, and Vanilla JavaScript using a component-based layout pattern (`components.js`) for rapid rendering without heavy framework overhead.

---

## 📁 Project Directory Structure

```
fci-v3/
├── index.html                      # Main Landing Page & Student Guide
├── css/
│   └── style.css                   # Core Design System, Variables & Component Styling
├── js/
│   ├── main.js                     # Theme Logic, Global Search, Hero Slider & Calculators
│   └── components.js               # Dynamic Header, Footer & Announcement Injectors
├── pages/
│   ├── about.html                  # Mission, Vision & Faculty Overview
│   ├── contact.html                # Developer & Representative Contact Information
│   ├── departments.html            # Faculty Departments Overview
│   ├── news.html                   # Latest Announcements, Events & Articles
│   ├── resources.html              # CGPA Calculator, Age Calculator & Study Resources
│   ├── contacts/                   # Level Representative Directories
│   │   ├── level-100.html
│   │   ├── level-200.html
│   │   ├── level-300.html
│   │   └── level-400.html
│   └── departments/                # Individual Academic Department Pages
│       ├── computer-science.html
│       ├── cyber-security.html
│       ├── ict.html
│       ├── library-info-science.html
│       └── software-engineering.html
└── images/                         # Logos, Campus Photography & Media Assets
```

---

## 🚀 Getting Started

Since this application is built with standard Web technologies (HTML/CSS/JS), no compilation or complex installation is required.

### Local Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   ```
2. **Navigate into the directory**:
   ```bash
   cd fci-v3
   ```
3. **Open `index.html`** in any web browser, or launch using VS Code **Live Server**.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic document structure
- **CSS3**: Modern custom properties (CSS variables), Flexbox, CSS Grid, smooth animations, and glassmorphism styling
- **Vanilla JavaScript (ES6)**: Modular component rendering, DOM manipulation, state persistence, and event delegation
- **FontAwesome 6**: Modern iconography

---

## 👨‍💻 Author & Credits

- **Developer**: **MattieTech** (*Matthew Aliu*)
- **Email**: [matthewaliu001@gmail.com](mailto:matthewaliu001@gmail.com)
- **Institution**: **Confluence University of Science and Technology (CUSTECH), Osara, Kogi State, Nigeria**

---

© 2026 FCI Student Guide &middot; CUSTECH Osara &middot; Built with ❤️ by **MattieTech**
