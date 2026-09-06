// Generated comprehensive department and course outline data for CUSTECH FCI
export interface Course {
  code: string;
  title: string;
  units: number;
  status: 'Core' | 'Elective';
}

export interface SkillItem {
  title: string;
  description: string;
}

export interface DepartmentData {
  slug: string;
  name: string;
  iconName: string;
  summary: string;
  about: string[];
  careers: string[];
  skills: SkillItem[];
  courses: {
    [level: number]: {
      1: Course[];
      2: Course[];
    };
  };
}

export const DEPARTMENTS_DATA: Record<string, DepartmentData> = {
  "computer-science": {
    "name": "Computer Science",
    "slug": "computer-science",
    "iconName": "monitor",
    "summary": "The Department of Computer Science at CUSTECH offers a rigorous program giving students a strong theoretical and practical foundation in computing. Students explore algorithms, data structures, artificial intelligence, database systems, and the mathematics behind computers.",
    "about": [
      "The Department of Computer Science at CUSTECH offers a rigorous program giving students a strong theoretical and practical foundation in computing. Students explore algorithms, data structures, artificial intelligence, database systems, and the mathematics behind computers.",
      "The department focuses on critical thinking and problem-solving, with modern laboratories and experienced faculty guiding students through programming, software development, AI, and research."
    ],
    "careers": [
      "Software Developer",
      "Data Scientist",
      "AI/ML Engineer",
      "Database Admin",
      "Systems Analyst",
      "Research Scientist",
      "Lecturer",
      "IT Consultant",
      "Product Manager"
    ],
    "skills": [
      {
        "title": "Programming",
        "description": "C, Python, Java, data structures"
      },
      {
        "title": "Artificial Intelligence",
        "description": "Machine learning, neural networks"
      },
      {
        "title": "Database Systems",
        "description": "SQL, NoSQL, database design"
      },
      {
        "title": "Computer Networks",
        "description": "Protocols, architecture, security"
      },
      {
        "title": "Operating Systems",
        "description": "OS theory, process management"
      },
      {
        "title": "Research Methods",
        "description": "Dissertation and methodology"
      }
    ],
    "courses": {
      "100": {
        "1": [
          {
            "code": "CSC131",
            "title": "Introduction to Computing Sciences",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC132",
            "title": "Introduction to Front-End Web Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST131",
            "title": "Communication in English",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH131",
            "title": "Elementary Mathematics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "HTH132",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY131",
            "title": "General Physics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY133",
            "title": "General Physics Pratical I",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "STA131",
            "title": "Descriptive Statistics",
            "units": 3,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC141",
            "title": "Problem Solving",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST141",
            "title": "Nigerian Peoples and Culture",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH141",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY141",
            "title": "General Physics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY143",
            "title": "General Physics Practical II",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "CSC142",
            "title": "Fundamentals of Data Science",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "STA141",
            "title": "Probability I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE142",
            "title": "Introduction to Software Fundamentals",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST142",
            "title": "Leadership Skills",
            "units": 1,
            "status": "Core"
          }
        ]
      },
      "200": {
        "1": [
          {
            "code": "CSC231",
            "title": "Computer Programming I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC233",
            "title": "Discrete Structures",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC235",
            "title": "Computing Mini-Project",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "ENT231",
            "title": "Entrepreneurship and Innovation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT231",
            "title": "Digital Logic Design",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT232",
            "title": "Computer Architecture and Organization",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE231",
            "title": "Introduction to Software Engineering",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB231",
            "title": "Introduction to Cybersecurity and Strategy",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH231",
            "title": "Mathematical Methods I",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC241",
            "title": "Computer Programming II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC242",
            "title": "System Analysis and Design",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST241",
            "title": "Philosophy, Logic and Human Existence",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT241",
            "title": "Human-Computer Interface",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH241",
            "title": "Elementary Differential Equations",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE241",
            "title": "Introduction to Generative AI",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "300": {
        "1": [
          {
            "code": "CSC331",
            "title": "Data Structures",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC332",
            "title": "Artificial Intelligence",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC335",
            "title": "Data Communication System and Network",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC333",
            "title": "Object-Oriented Programming",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS331",
            "title": "SIWES",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT334",
            "title": "Web Application Development using Content Management System",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC341",
            "title": "Operating System",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC342",
            "title": "Computer Science Innovation and New Technologies",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC343",
            "title": "Data Management I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT341",
            "title": "Mobile Applications Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT342",
            "title": "Web Application Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB344",
            "title": "Information and Big Data Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE344",
            "title": "Software Testing and Quality Assurance",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST342",
            "title": "Peace and Conflict Resolution",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "ENT342",
            "title": "Venture Creation",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "400": {
        "1": [
          {
            "code": "CSC431",
            "title": "Algorithm and Complexity Analysis",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT431",
            "title": "Project Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC433",
            "title": "Research Methodology and Technical Report Writing",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC435",
            "title": "Advanced Python Programming",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC436",
            "title": "Data Management II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE435",
            "title": "Machine Learning",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS431",
            "title": "SIWES",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC434",
            "title": "Distributed Computing System",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "SWE434",
            "title": "Open-Source Software Development and Application",
            "units": 2,
            "status": "Elective"
          }
        ],
        "2": [
          {
            "code": "CSC442",
            "title": "Ethics and Legal Issues in Computer Science",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC447",
            "title": "Project I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC448",
            "title": "Project II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE442",
            "title": "Cloud Computing and DevOps",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC441",
            "title": "Computer System Performance Evaluation",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT442",
            "title": "System Integration and Architecture",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "IFT443",
            "title": "Wireless Communication and Networking",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "CSC437",
            "title": "Modeling and Simulation",
            "units": 2,
            "status": "Elective"
          }
        ]
      }
    }
  },
  "software-engineering": {
    "name": "Software Engineering",
    "slug": "software-engineering",
    "iconName": "code",
    "summary": "The Department of Software Engineering trains students to design, build, test, and maintain high-quality software systems. The program combines engineering principles with hands-on coding, preparing graduates for the modern software industry.",
    "about": [
      "The Department of Software Engineering trains students to design, build, test, and maintain high-quality software systems. The program combines engineering principles with hands-on coding, preparing graduates for the modern software industry.",
      "Students use industry-standard tools and methodologies including Agile, DevOps, and modern frameworks, guided by faculty with academic and real-world experience."
    ],
    "careers": [
      "Software Architect",
      "Full-Stack Developer",
      "DevOps Engineer",
      "QA Engineer",
      "Tech Lead",
      "Project Manager",
      "Mobile Developer",
      "Cloud Engineer"
    ],
    "skills": [
      {
        "title": "Software Design",
        "description": "Design patterns, UML, system architecture"
      },
      {
        "title": "Agile / Scrum",
        "description": "Sprint planning, kanban, iterative dev"
      },
      {
        "title": "DevOps & CI/CD",
        "description": "Docker, Git, Jenkins, deployment"
      },
      {
        "title": "Web & Mobile Dev",
        "description": "React, Node.js, Android, iOS"
      },
      {
        "title": "Software Testing",
        "description": "Unit testing, integration, automation"
      },
      {
        "title": "Project Management",
        "description": "Planning, risk, team leadership"
      }
    ],
    "courses": {
      "100": {
        "1": [
          {
            "code": "CSC131",
            "title": "Introduction to Computing Sciences",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC132",
            "title": "Introduction to Front-End Web Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST131",
            "title": "Communication in English",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH131",
            "title": "Elementary Mathematics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH132",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY131",
            "title": "General Physics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY133",
            "title": "General Physics Pratical I",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "STA131",
            "title": "Descriptive Statistics",
            "units": 3,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC141",
            "title": "Problem Solving",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST141",
            "title": "Nigerian Peoples and Culture",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH141",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY141",
            "title": "General Physics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY143",
            "title": "General Physics Practical II",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "CSC142",
            "title": "Fundamentals of Data Science",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "STA141",
            "title": "Probability I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE142",
            "title": "Introduction to Software Fundamentals",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST142",
            "title": "Leadership Skills",
            "units": 1,
            "status": "Core"
          }
        ]
      },
      "200": {
        "1": [
          {
            "code": "CSC231",
            "title": "Computer Programming I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC233",
            "title": "Discrete Structures",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC235",
            "title": "Computing Mini-Project",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "ENT231",
            "title": "Entrepreneurship and Innovation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT231",
            "title": "Digital Logic Design",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT232",
            "title": "Computer Architecture and Organization",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE231",
            "title": "Introduction to Software Engineering",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH231",
            "title": "Mathematical Methods I",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC241",
            "title": "Computer Programming II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC242",
            "title": "System Analysis and Design",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST241",
            "title": "Philosophy,logic and Human Existence",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT241",
            "title": "Human Computer Interface",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH241",
            "title": "Mathematical Method II (Elementary Differential Equation I)",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB242",
            "title": "System and Network Administration",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE241",
            "title": "Introduction to Generative AI",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "300": {
        "1": [
          {
            "code": "CSC331",
            "title": "Data Structures",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC332",
            "title": "Artificial Intelligence",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT334",
            "title": "Web Application Development Using Content Management System",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE331",
            "title": "Object-oriented Analysis and Design",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS311",
            "title": "SIWES (12Weeks)",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE332",
            "title": "Emerging Issues in Software Engineering",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE333",
            "title": "Cloud Security",
            "units": 2,
            "status": "Elective"
          }
        ],
        "2": [
          {
            "code": "CSC341",
            "title": "Operating Systems",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "ENT341",
            "title": "Venture Creation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST341",
            "title": "Peace and Conflict Resolution",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE342",
            "title": "Software Engineering Innovation and New Technology",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE344",
            "title": "Software Testing and Quality Assurance",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE346",
            "title": "Software Construction",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE343",
            "title": "Programming Language Concepts",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT341",
            "title": "Mobile Applications Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT342",
            "title": "Web Application Development",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "400": {
        "1": [
          {
            "code": "CSC433",
            "title": "Research Methodology and Technical Report Writing",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE431",
            "title": "Software Configuration Management and Maintenance",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT431",
            "title": "Project Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS411",
            "title": "SIWES (12Weeks)",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE432",
            "title": "Software Modeling and Design Techniques",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE433",
            "title": "Machine Learning",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE436",
            "title": "Software Engineering Economics",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC435",
            "title": "Advanced Python Programming",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "SWE434",
            "title": "Open-Source Software Development and Applications",
            "units": 2,
            "status": "Elective"
          }
        ],
        "2": [
          {
            "code": "SWE441",
            "title": "Software Architecture and Design",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE447",
            "title": "Project I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE448",
            "title": "Project II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE442",
            "title": "Cloud Computing and DevOps",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE443",
            "title": "Software Engineering Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE444",
            "title": "Software System Performance Evaluation",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE445",
            "title": "Data Analysis in Software Engineering",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "SWE446",
            "title": "Fault Tolerance Computing",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "IFT466",
            "title": "Network Security II",
            "units": 2,
            "status": "Elective"
          }
        ]
      }
    }
  },
  "cyber-security": {
    "name": "Cyber Security",
    "slug": "cyber-security",
    "iconName": "shield",
    "summary": "The Department of Cyber Security prepares students to protect digital systems, networks, and data from cyber threats. The program covers ethical hacking, digital forensics, cryptography, and security operations in a dedicated lab.",
    "about": [
      "The Department of Cyber Security prepares students to protect digital systems, networks, and data from cyber threats. The program covers ethical hacking, digital forensics, cryptography, and security operations in a dedicated lab.",
      "As cyber threats grow globally, demand for qualified security professionals has never been higher. Graduates are prepared for both defensive and offensive security roles in government, banking, and the private sector."
    ],
    "careers": [
      "Ethical Hacker",
      "Security Analyst",
      "Penetration Tester",
      "Forensic Investigator",
      "SOC Analyst",
      "CISO",
      "Malware Analyst",
      "Security Consultant"
    ],
    "skills": [
      {
        "title": "Ethical Hacking",
        "description": "Penetration testing, Kali Linux"
      },
      {
        "title": "Digital Forensics",
        "description": "Evidence collection, forensic tools"
      },
      {
        "title": "Cryptography",
        "description": "Encryption, PKI, blockchain basics"
      },
      {
        "title": "Network Security",
        "description": "Firewalls, IDS/IPS, VPNs"
      },
      {
        "title": "Malware Analysis",
        "description": "Reverse engineering, sandboxing"
      },
      {
        "title": "Compliance & Law",
        "description": "Cyber law, GDPR, ISO 27001"
      }
    ],
    "courses": {
      "100": {
        "1": [
          {
            "code": "CSC131",
            "title": "Introduction to Computing Sciences",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC132",
            "title": "Introduction to Front-End Web Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST131",
            "title": "Communication in English",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH131",
            "title": "Elementary Mathematics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH132",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY131",
            "title": "General Physics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY133",
            "title": "General Physics Pratical I",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "STA131",
            "title": "Descriptive Statistics",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB131",
            "title": "Fundamentals of Cyber Security",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC141",
            "title": "Problem Solving",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST141",
            "title": "Nigerian Peoples and Culture",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH141",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY141",
            "title": "General Physics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY143",
            "title": "General Physics Practical II",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "CSC142",
            "title": "Fundamentals of Data Science",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "STA141",
            "title": "Probability I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE142",
            "title": "Introduction to Software Fundamentals",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST142",
            "title": "Leadership Skills",
            "units": 1,
            "status": "Core"
          }
        ]
      },
      "200": {
        "1": [
          {
            "code": "CSC231",
            "title": "Computer Programming I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB231",
            "title": "Introduction to Cyber Security and Strategy",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "ENT231",
            "title": "Entrepreneurship and Innovation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE231",
            "title": "Introduction to Software Engineering",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC233",
            "title": "Discrete Structures",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT232",
            "title": "Computer Architecture and Organization",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC235",
            "title": "Computing Mini-Project",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB233",
            "title": "Cybersecurity in Business and Industry",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB232",
            "title": "Introduction to Digital Forensics",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC241",
            "title": "Computer Programming II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB243",
            "title": "Cyber Crime, Law and Counter measure",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC242",
            "title": "System Analysis and Design",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST241",
            "title": "Philosophy, logic and Human Existence",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB241",
            "title": "Introduction to Networking",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB242",
            "title": "Systems and Network Administration",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB246",
            "title": "Enterprise and Perimeter Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB245",
            "title": "Information Security Policy",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "300": {
        "1": [
          {
            "code": "CSC332",
            "title": "Artificial Intelligence",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB331",
            "title": "Cryptography Techniques, Algorithms and Applications I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB333",
            "title": "Cybersecurity Risks Analysis, Challenges and Mitigation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB335",
            "title": "Digital Forensic and Investigation Methods",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS311",
            "title": "SIWES (12Weeks)",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC331",
            "title": "Data Structure",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB332",
            "title": "Mobile Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB334",
            "title": "Threat,Exploits and Countermeasure",
            "units": 2,
            "status": "Elective"
          }
        ],
        "2": [
          {
            "code": "CYB342",
            "title": "Biometrics Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB3433",
            "title": "Cybersecurity Innovation and New Technologies",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB344",
            "title": "Information and Big Data Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "ENT341",
            "title": "Venture Creation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST341",
            "title": "Peace and Conflict Resolution",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB341",
            "title": "Systems Security",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB345",
            "title": "Cryptography Techniques, Algorithms and Applications II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB348",
            "title": "Network Security Concepts",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB346",
            "title": "Database Security",
            "units": 2,
            "status": "Elective"
          }
        ]
      },
      "400": {
        "1": [
          {
            "code": "CSC439",
            "title": "Research Methodology and Technical Report Writing",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB431",
            "title": "Systems Vulnerability Assessment and Testing",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB433",
            "title": "Cyber Threat Intelligence and Cyber Conflict",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS411",
            "title": "SIWES (12WEEKS)",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB432",
            "title": "IoT System Security",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB434",
            "title": "Enterprise Cybersecurity",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB435",
            "title": "Risk Management in Information System",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "CYB436",
            "title": "Emerging Trends in Cybersecurity",
            "units": 2,
            "status": "Elective"
          }
        ],
        "2": [
          {
            "code": "CYB442",
            "title": "Steganography-Access Methods and Data Hiding",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB444",
            "title": "Cloud Computing Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB445",
            "title": "Ethical Hacking and Reverse Engineering",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB446",
            "title": "Deep and Dark Web Security",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB447",
            "title": "Project II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB448",
            "title": "Project II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB443",
            "title": "Data Privacy and Technology",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CYB445",
            "title": "Malware Analysis",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "CYB449",
            "title": "Blockchain Technology and Application",
            "units": 2,
            "status": "Elective"
          }
        ]
      }
    }
  },
  "information-technology": {
    "name": "Information Technology",
    "slug": "information-technology",
    "iconName": "server",
    "summary": "The Department of Information Technology trains students in the design, deployment, and management of IT systems and infrastructure. From networking to cloud computing and database management, the program prepares students for a rapidly growing industry.",
    "about": [
      "The Department of Information Technology trains students in the design, deployment, and management of IT systems and infrastructure. From networking to cloud computing and database management, the program prepares students for a rapidly growing industry.",
      "Students gain hands-on skills through laboratory sessions, industrial training, and final-year projects that address real-world IFT challenges."
    ],
    "careers": [
      "Network Engineer",
      "Cloud Architect",
      "IT Support",
      "Telecom Engineer",
      "Systems Admin",
      "IT Manager",
      "IoT Developer",
      "IT Auditor"
    ],
    "skills": [
      {
        "title": "Networking",
        "description": "TCP/IP, routing, switching, Cisco"
      },
      {
        "title": "Cloud Computing",
        "description": "AWS, Azure, Google Cloud"
      },
      {
        "title": "Telecommunications",
        "description": "GSM, fibre optics, satellite"
      },
      {
        "title": "Systems Admin",
        "description": "Linux, Windows Server"
      },
      {
        "title": "IoT Technologies",
        "description": "Sensors, embedded systems"
      },
      {
        "title": "IT Project Mgmt",
        "description": "ITIL, IT governance"
      }
    ],
    "courses": {
      "100": {
        "1": [
          {
            "code": "CSC131",
            "title": "Introduction to Computing Sciences",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC132",
            "title": "Introduction to Front-End Web Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST131",
            "title": "Communication in English",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH131",
            "title": "Elementary Mathematics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "HTH132",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY131",
            "title": "General Physics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY133",
            "title": "General Physics Pratical I",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "STA131",
            "title": "Descriptive Statistics",
            "units": 3,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC141",
            "title": "Problem Solving",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST141",
            "title": "Nigerian Peoples and Culture",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH141",
            "title": "Elementary Mathematics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY141",
            "title": "General Physics II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "PHY143",
            "title": "General Physics Practical II",
            "units": 1,
            "status": "Core"
          },
          {
            "code": "CSC142",
            "title": "Fundamentals of Data Science",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "STA141",
            "title": "Probability I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE142",
            "title": "Introduction to Software Fundamentals",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST142",
            "title": "Leadership Skills",
            "units": 1,
            "status": "Core"
          }
        ]
      },
      "200": {
        "1": [
          {
            "code": "CSC231",
            "title": "Computer Programming I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "ENT231",
            "title": "Entrepreneurship and Innovation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT231",
            "title": "Digital Logic Design",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT232",
            "title": "Computer Architecture and Organization",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT235",
            "title": "Introduction to Information Technology",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT233",
            "title": "Introduction to Web Technologies",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC235",
            "title": "Computing Mini-Project",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH231",
            "title": "Mathematical Methods I",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC241",
            "title": "Computer Programming II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "GST241",
            "title": "Philosophy, Logic and Human Existence",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT241",
            "title": "Human-Computer Interface",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC242",
            "title": "System Analysis and Design",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT242",
            "title": "Introduction to Web Technologies II",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT244",
            "title": "Information Security Fundamentals",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CYB242",
            "title": "System and Network Administration",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE241",
            "title": "Introduction to Generative AI",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "300": {
        "1": [
          {
            "code": "CSC331",
            "title": "Data Structures",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC332",
            "title": "Artificial Intelligence",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT331",
            "title": "Mobile Application Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT332",
            "title": "Web Application Development using Content Management Systems",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC335",
            "title": "Data Communications Systems and Network",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT334",
            "title": "IT Innovation and Entrepreneurship",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS311",
            "title": "SIWES (12 Weeks)",
            "units": 3,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC341",
            "title": "Operating Systems",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC343",
            "title": "Data Management I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "SWE344",
            "title": "Software Testing and Quality Assurance",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "ENT341",
            "title": "Venture Creation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST341",
            "title": "Peace and Conflict Resolution",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT341",
            "title": "Web Application Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT342",
            "title": "Ethics and Legal Issues in IT",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT343",
            "title": "Network Servers and Infrastructures",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "400": {
        "1": [
          {
            "code": "CSC433",
            "title": "Research Methodology and Technical Report Writing",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT431",
            "title": "Project Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT432",
            "title": "Mobile and Pervasive Computing",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT433",
            "title": "Network Security I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT434",
            "title": "Integrative Programming and Technology",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT435",
            "title": "Enterprise Systems",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWS411",
            "title": "SIWES (12 Weeks)",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "CSC436",
            "title": "Data Management II",
            "units": 3,
            "status": "Elective"
          },
          {
            "code": "IFT439",
            "title": "Database Administration",
            "units": 3,
            "status": "Elective"
          }
        ],
        "2": [
          {
            "code": "IFT441",
            "title": "Systems Administration and Management",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT442",
            "title": "System integration and Architecture",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT433",
            "title": "Wireless Communication and Networking",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT447",
            "title": "Project I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT448",
            "title": "Project  II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT445",
            "title": "Data and Application Security",
            "units": 3,
            "status": "Elective"
          },
          {
            "code": "IFT446",
            "title": "Network Security II",
            "units": 3,
            "status": "Elective"
          },
          {
            "code": "IFT448",
            "title": "Information Storage and Management",
            "units": 3,
            "status": "Elective"
          }
        ]
      }
    }
  },
  "library-info-science": {
    "name": "Library and Information Science",
    "slug": "library-info-science",
    "iconName": "book-open",
    "summary": "The Department of Library and Information Science (LIS) prepares students to manage, organise, and distribute information in many settings. The program covers digital library systems, knowledge management, archiving, cataloguing, and research services.",
    "about": [
      "The Department of Library and Information Science (LIS) prepares students to manage, organise, and distribute information in many settings. The program covers digital library systems, knowledge management, archiving, cataloguing, and research services.",
      "LIS graduates play vital roles in universities, government agencies, healthcare, and the corporate sector — ensuring information is accessible, organised, and preserved for future generations."
    ],
    "careers": [
      "Librarian",
      "Information Architect",
      "Knowledge Manager",
      "Records Manager",
      "Digital Archivist",
      "Research Officer",
      "Academic Librarian",
      "Content Strategist"
    ],
    "skills": [
      {
        "title": "Cataloguing",
        "description": "Dewey Decimal, MARC, metadata"
      },
      {
        "title": "Digital Libraries",
        "description": "DSpace, Koha, e-resources"
      },
      {
        "title": "Information Retrieval",
        "description": "Search systems, indexing"
      },
      {
        "title": "Knowledge Management",
        "description": "KM frameworks, ontologies"
      },
      {
        "title": "Research Methods",
        "description": "Bibliometrics, reference services"
      },
      {
        "title": "Archiving",
        "description": "Records management, digitization"
      }
    ],
    "courses": {
      "100": {
        "1": [
          {
            "code": "CSC131",
            "title": "Introduction to Computing Sciences",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS131",
            "title": "Introduction to Library and Information Science",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS132",
            "title": "Basic Skills for Library and Information work",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS133",
            "title": "Introduction to Digital Libraries",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS134",
            "title": "Information User",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST131",
            "title": "Communication in English",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "MTH131",
            "title": "Elementary Mathematics I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "STA131",
            "title": "Descriptive Statistics",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC142",
            "title": "Introduction to Problem Solving",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST141",
            "title": "Nigerian People and Culture",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "CSC142",
            "title": "Fundamentals of Data Science",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS141",
            "title": "Introduction to Library and Information Resources",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS142",
            "title": "Information in Library and Society",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS143",
            "title": "Introduction to Library Application Packages",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "STA141",
            "title": "Probability I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST142",
            "title": "Leadership Skills",
            "units": 1,
            "status": "Core"
          }
        ]
      },
      "200": {
        "1": [
          {
            "code": "ENT231",
            "title": "Entrepreneurship and Innovation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS233",
            "title": "Bibliography information Sources and services",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS234",
            "title": "Management of Libraries and information Centers",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS235",
            "title": "Management and Information Services for Children and Adolescents",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS236",
            "title": "Serials Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE235",
            "title": "Data Structure and Algorithm",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "IFT233",
            "title": "Introduction to Web Technology",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT231",
            "title": "Digital Logic Design",
            "units": 2,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "GST241",
            "title": "Philosophy, Logic, Environment and Sustainable Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS242",
            "title": "Organization of Knowledge I",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS243",
            "title": "Library and Information Services to the Rural Community",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS244",
            "title": "Introduction to ICT in LIS",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS245",
            "title": "Philosophy of Library and Information Science",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS246",
            "title": "Information Literacy",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS247",
            "title": "Indigenous Knowledge System",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SWE241",
            "title": "Introduction to Generative AI",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "300": {
        "1": [
          {
            "code": "LIS331",
            "title": "Organization of Knowledge II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS332",
            "title": "Reference and Information Services in LIS",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS333",
            "title": "Library Systems and Services",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "LIS334",
            "title": "Knowledge Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS335",
            "title": "Information Science",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "IFT334",
            "title": "Web Application Development using Content Management Systems",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS346",
            "title": "Library and Information Resource Development",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS347",
            "title": "Information Retrieval (Advanced Cataloguing)",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "SIWES",
            "title": "SIWES (12 Weeks)",
            "units": 3,
            "status": "Core"
          }
        ],
        "2": [
          {
            "code": "CSC343",
            "title": "Data Management I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS341",
            "title": "Collection Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS342",
            "title": "Hardware and Software Technologies",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS343",
            "title": "Research and Statistical Methods in LIS",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS344",
            "title": "Information Marketing and Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "GST341",
            "title": "Peace and Conflict Resolution",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "ENT341",
            "title": "Venture Creation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS345",
            "title": "Disaster Planning for Libraries",
            "units": 2,
            "status": "Core"
          }
        ]
      },
      "400": {
        "1": [
          {
            "code": "CSC433",
            "title": "Research Methodology and Technical Report Writing",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS431",
            "title": "Indexing and Abstracting",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS432",
            "title": "Publishing, Book Production and Book Trade",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS433",
            "title": "Database Design and Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS434",
            "title": "Infopreneurship",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS435",
            "title": "Information Architecture",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS436",
            "title": "Financial Management in Library and Information Centre",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS437",
            "title": "Knowledge Management",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "LIS438",
            "title": "Information Ethics and Law",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "LIS439",
            "title": "Government Publications",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "LIS430",
            "title": "Resource Sharing and Networking",
            "units": 2,
            "status": "Elective"
          }
        ],
        "2": [
          {
            "code": "LIS441",
            "title": "Introduction to Archives and Records Management",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS442",
            "title": "Preservation, Conservation and Security of Library and Information Resources",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS443",
            "title": "Library Automation",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS444",
            "title": "Personnel Management in Library and Information Centre",
            "units": 2,
            "status": "Core"
          },
          {
            "code": "LIS447",
            "title": "Research Project I",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS448",
            "title": "Research Project II",
            "units": 3,
            "status": "Core"
          },
          {
            "code": "LIS445",
            "title": "Advocacy andMarketing of Library and Information Services",
            "units": 2,
            "status": "Elective"
          },
          {
            "code": "LIS446",
            "title": "Politics and Economies of Information",
            "units": 2,
            "status": "Elective"
          }
        ]
      }
    }
  }
};

export const ALL_DEPARTMENTS = Object.values(DEPARTMENTS_DATA);
