export interface CBTQuestion {
  id: string;
  courseCode: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
}

export interface CBTCourse {
  code: string;
  title: string;
  level: string;
  semester: 'First' | 'Second';
  questionCount: number;
  durationMinutes: number;
  description: string;
}

export const CBT_COURSES: CBTCourse[] = [
  {
    code: 'GST 111',
    title: 'Communication in English',
    level: '100L',
    semester: 'First',
    questionCount: 30,
    durationMinutes: 25,
    description: 'Grammar, registers, phonetics, sentence concord, idioms, and reading comprehension.',
  },
  {
    code: 'CSC 142',
    title: 'Computers and Society',
    level: '100L',
    semester: 'Second',
    questionCount: 25,
    durationMinutes: 20,
    description: 'Computing history, cybersecurity ethics, digital divide, social impacts of AI and automation.',
  },
  {
    code: 'SWE 142',
    title: 'Introduction to Software Engineering',
    level: '100L',
    semester: 'Second',
    questionCount: 25,
    durationMinutes: 20,
    description: 'SDLC methodologies, Agile, requirements engineering, testing, debugging, and software metrics.',
  },
  {
    code: 'STA 131',
    title: 'Inference I / Probability',
    level: '100L',
    semester: 'First',
    questionCount: 20,
    durationMinutes: 30,
    description: 'Measures of dispersion, probability axioms, permutations, combinations, and conditional probability.',
  },
  {
    code: 'MTH 141',
    title: 'General Mathematics I (Algebra & Trigonometry)',
    level: '100L',
    semester: 'First',
    questionCount: 20,
    durationMinutes: 30,
    description: 'Set theory, quadratic equations, progressions (AP & GP), matrices, and trigonometric identities.',
  },
  {
    code: 'CSC 231',
    title: 'Computer Architecture and Organization',
    level: '200L',
    semester: 'First',
    questionCount: 20,
    durationMinutes: 20,
    description: 'Von Neumann architecture, ALU, instruction cycles, memory hierarchy, cache, and pipelining.',
  },
  {
    code: 'CSC 233',
    title: 'Object-Oriented Programming (OOP)',
    level: '200L',
    semester: 'First',
    questionCount: 20,
    durationMinutes: 20,
    description: 'Encapsulation, inheritance, polymorphism, abstraction, exception handling, and design patterns.',
  }
];

export const CBT_QUESTIONS: Record<string, CBTQuestion[]> = {
  'GST 111': [
    {
      id: 'gst111-1',
      courseCode: 'GST 111',
      question: 'Which of the following sentences exhibits correct subject-verb agreement (concord)?',
      options: [
        'The committee have decided to adjourn the meeting.',
        'Neither the lecturer nor the students was present.',
        'Each of the candidates is expected to present their credential.',
        'The team of researchers are publishing their findings tomorrow.'
      ],
      correctAnswer: 2,
      explanation: '"Each" is an indefinite singular pronoun and always requires a singular verb ("is expected").'
    },
    {
      id: 'gst111-2',
      courseCode: 'GST 111',
      question: 'Identify the figure of speech in: "The wind whispered secrets through the trees."',
      options: [
        'Hyperbole',
        'Metaphor',
        'Personification',
        'Synecdoche'
      ],
      correctAnswer: 2,
      explanation: 'Personification gives human qualities or actions (whispering secrets) to non-human entities (the wind).'
    },
    {
      id: 'gst111-3',
      courseCode: 'GST 111',
      question: 'In academic writing, what is the primary purpose of a literature review?',
      options: [
        'To summarize random articles without critique',
        'To demonstrate the research gap and situate the current study within existing scholarship',
        'To increase the word count of the thesis dissertation',
        'To copy verbatim the hypotheses of pioneer scientists'
      ],
      correctAnswer: 1,
      explanation: 'A literature review critically evaluates prior academic work to identify knowledge gaps that the current study seeks to fill.'
    },
    {
      id: 'gst111-4',
      courseCode: 'GST 111',
      question: 'Choose the word nearest in meaning to "Ephemeral":',
      options: [
        'Enduring',
        'Transient',
        'Permanent',
        'Pervasive'
      ],
      correctAnswer: 1,
      explanation: '"Ephemeral" means lasting for a very short time, which is synonymous with "transient".'
    },
    {
      id: 'gst111-5',
      courseCode: 'GST 111',
      question: 'Which vowel sound is heard in the word "plumb"?',
      options: [
        '/u:/',
        '/ʌ/',
        '/ʊ/',
        '/ɒ/'
      ],
      correctAnswer: 1,
      explanation: 'The word "plumb" is pronounced /plʌm/, featuring the short central open-mid vowel /ʌ/.'
    },
    {
      id: 'gst111-6',
      courseCode: 'GST 111',
      question: 'Which punctuation mark is correctly used to introduce a formal list or explanation following an independent clause?',
      options: [
        'Semicolon (;)',
        'Colon (:)',
        'Hyphen (-)',
        'Comma (,)'
      ],
      correctAnswer: 1,
      explanation: 'A colon is used after an independent clause to direct attention to a list, an appositive, or an illustrative quotation.'
    },
    {
      id: 'gst111-7',
      courseCode: 'GST 111',
      question: 'Choose the correct preposition: "The Dean congratulated the guild executives ___ their electoral victory."',
      options: [
        'for',
        'at',
        'on',
        'with'
      ],
      correctAnswer: 2,
      explanation: 'The verb "congratulate" takes the preposition "on" (to congratulate someone on an achievement).'
    },
    {
      id: 'gst111-8',
      courseCode: 'GST 111',
      question: 'What is a "dangling modifier"?',
      options: [
        'A clause that has no clear noun or pronoun to logically modify',
        'An adjective placed directly preceding a noun',
        'A subordinate conjunction joining two dependent clauses',
        'A pronoun without gender designation'
      ],
      correctAnswer: 0,
      explanation: 'A dangling modifier occurs when the intended subject of the modifying phrase is missing from the sentence, leading to grammatical error.'
    },
    {
      id: 'gst111-9',
      courseCode: 'GST 111',
      question: 'Which of the following is an example of an antonym pair?',
      options: [
        'Pragmatic - Realistic',
        'Superfluous - Necessary',
        'Altruistic - Benevolent',
        'Meticulous - Thorough'
      ],
      correctAnswer: 1,
      explanation: '"Superfluous" means redundant or more than needed, while "necessary" means required; hence they are antonyms.'
    },
    {
      id: 'gst111-10',
      courseCode: 'GST 111',
      question: 'The reading technique used to quickly locate specific information (such as a date or name) in a passage is known as:',
      options: [
        'Skimming',
        'Scanning',
        'Critical evaluation',
        'Extensive reading'
      ],
      correctAnswer: 1,
      explanation: 'Scanning is rapid reading with the singular objective of locating a specific fact or detail.'
    }
  ],
  'CSC 142': [
    {
      id: 'csc142-1',
      courseCode: 'CSC 142',
      question: 'What is the term "Digital Divide" primarily used to describe?',
      options: [
        'The gap between hardware components and operating systems',
        'The socio-economic disparity between those who have access to modern ICT and those who do not',
        'The difference between analogue and digital computing architectures',
        'The division of computer science into theoretical and applied subfields'
      ],
      correctAnswer: 1,
      explanation: 'The Digital Divide refers to the inequalities between groups in their access to information and communication technologies and the internet.'
    },
    {
      id: 'csc142-2',
      courseCode: 'CSC 142',
      question: 'Who is widely acknowledged as the "World’s First Computer Programmer" for her work on Babbage\'s Analytical Engine?',
      options: [
        'Grace Hopper',
        'Ada Lovelace',
        'Margaret Hamilton',
        'Katherine Johnson'
      ],
      correctAnswer: 1,
      explanation: 'Ada Lovelace created the first published algorithm intended for processing by Babbage\'s Analytical Engine.'
    },
    {
      id: 'csc142-3',
      courseCode: 'CSC 142',
      question: 'Which ethical framework emphasizes doing the greatest good for the greatest number of people in technology decisions?',
      options: [
        'Deontology',
        'Utilitarianism',
        'Virtue Ethics',
        'Egoism'
      ],
      correctAnswer: 1,
      explanation: 'Utilitarian ethics assesses moral rightness based on outcomes that maximize overall happiness or societal utility.'
    },
    {
      id: 'csc142-4',
      courseCode: 'CSC 142',
      question: 'Under Nigerian law, which Act provides the statutory framework for the prohibition, prevention, and prosecution of cybercrimes?',
      options: [
        'Companies and Allied Matters Act 2020',
        'Cybercrimes (Prohibition, Prevention, Etc) Act 2015',
        'Freedom of Information Act 2011',
        'Nigerian Communications Act 2003'
      ],
      correctAnswer: 1,
      explanation: 'The Cybercrimes (Prohibition, Prevention, Etc) Act 2015 is Nigeria\'s principal legislation tackling online fraud, hacking, and cyber threats.'
    },
    {
      id: 'csc142-5',
      courseCode: 'CSC 142',
      question: 'What does GDPR stand for in global data protection and privacy standards?',
      options: [
        'General Data Protection Regulation',
        'Global Digital Privacy Requirement',
        'General Device Processing Rule',
        'Global Data Protection Registry'
      ],
      correctAnswer: 0,
      explanation: 'GDPR stands for General Data Protection Regulation, enacted by the European Union and adopted as a global benchmark for privacy.'
    },
    {
      id: 'csc142-6',
      courseCode: 'CSC 142',
      question: 'Which generation of computers introduced integrated circuits (ICs) replacing discrete transistors?',
      options: [
        'First Generation',
        'Second Generation',
        'Third Generation',
        'Fourth Generation'
      ],
      correctAnswer: 2,
      explanation: 'Third generation computers (1964-1971) adopted integrated circuits, drastically shrinking size and raising processing speed.'
    },
    {
      id: 'csc142-7',
      courseCode: 'CSC 142',
      question: 'A malicious program that disguises itself as legitimate software to deceive users into installing it is a:',
      options: [
        'Worm',
        'Trojan Horse',
        'Ransomware',
        'Rootkit'
      ],
      correctAnswer: 1,
      explanation: 'Trojan Horses mislead users of their true intent by appearing useful while harboring malicious payload.'
    },
    {
      id: 'csc142-8',
      courseCode: 'CSC 142',
      question: 'In computer ethics, "Whistleblowing" refers to:',
      options: [
        'An unauthorized penetration test on external servers',
        'The disclosure by an employee of confidential information relating to illegal, immoral, or hazardous organizational practices',
        'Auditing computer hardware inventories',
        'Publishing open-source code under GPL licenses'
      ],
      correctAnswer: 1,
      explanation: 'Whistleblowing is the act of exposing illicit, unethical, or unsafe activities within an organization to authorities or the public.'
    }
  ],
  'SWE 142': [
    {
      id: 'swe142-1',
      courseCode: 'SWE 142',
      question: 'Which of the following is NOT one of the 4 core values of the Agile Manifesto?',
      options: [
        'Individuals and interactions over processes and tools',
        'Comprehensive documentation over working software',
        'Customer collaboration over contract negotiation',
        'Responding to change over following a plan'
      ],
      correctAnswer: 1,
      explanation: 'The Agile Manifesto values "Working software over comprehensive documentation", not the reverse.'
    },
    {
      id: 'swe142-2',
      courseCode: 'SWE 142',
      question: 'What is the primary distinguishing characteristic of the Waterfall software development model?',
      options: [
        'Continuous sprint cycles with frequent releases',
        'Sequential, linear phase progression where each phase must be completed before the next begins',
        'Pair programming and test-driven development',
        'No requirements gathering phase'
      ],
      correctAnswer: 1,
      explanation: 'Waterfall is a rigid sequential methodology where milestones progress downward through requirements, design, implementation, and testing.'
    },
    {
      id: 'swe142-3',
      courseCode: 'SWE 142',
      question: 'What type of software requirement specifies "The system shall process a search query in under 500 milliseconds"?',
      options: [
        'Functional Requirement',
        'Non-Functional Requirement',
        'User Story',
        'Business Domain Rule'
      ],
      correctAnswer: 1,
      explanation: 'Performance, latency, security, and scalability constraints are Non-Functional Requirements (NFRs).'
    },
    {
      id: 'swe142-4',
      courseCode: 'SWE 142',
      question: 'In software testing, what is "Regression Testing"?',
      options: [
        'Testing performed exclusively by end users before release',
        'Re-running functional and non-functional tests to ensure previously developed software still works after changes',
        'Testing only database connection speed',
        'Testing code without executing it via static analysis'
      ],
      correctAnswer: 1,
      explanation: 'Regression testing confirms that recent code modifications, bug fixes, or additions have not broken existing functionality.'
    },
    {
      id: 'swe142-5',
      courseCode: 'SWE 142',
      question: 'What is "Coupling" in software design, and what is considered best engineering practice?',
      options: [
        'The degree of internal focus within a single module; high coupling is preferred',
        'The level of interdependence between software modules; low coupling is preferred',
        'The linking of git repositories; bidirectional coupling is preferred',
        'The speed of API response; maximum coupling is preferred'
      ],
      correctAnswer: 1,
      explanation: 'Coupling measures how closely connected modules are. Good design seeks "High Cohesion, Loose Coupling" to maximize modularity and maintainability.'
    },
    {
      id: 'swe142-6',
      courseCode: 'SWE 142',
      question: 'Which of the following is a Black-Box testing technique?',
      options: [
        'Statement Coverage Testing',
        'Equivalence Partitioning',
        'Branch Coverage Testing',
        'Cyclomatic Complexity Analysis'
      ],
      correctAnswer: 1,
      explanation: 'Equivalence Partitioning divides input data into valid and invalid partitions without inspecting internal source code structure.'
    }
  ],
  'STA 131': [
    {
      id: 'sta131-1',
      courseCode: 'STA 131',
      question: 'If events A and B are mutually exclusive, what is P(A ∩ B)?',
      options: [
        '1',
        'P(A) × P(B)',
        '0',
        'P(A) + P(B)'
      ],
      correctAnswer: 2,
      explanation: 'Mutually exclusive events cannot happen simultaneously; thus the probability of their intersection P(A ∩ B) = 0.'
    },
    {
      id: 'sta131-2',
      courseCode: 'STA 131',
      question: 'What is the variance of a dataset if the standard deviation is 7?',
      options: [
        '14',
        '3.5',
        '49',
        '2.64'
      ],
      correctAnswer: 2,
      explanation: 'Variance is the square of the standard deviation: Variance = σ² = 7² = 49.'
    },
    {
      id: 'sta131-3',
      courseCode: 'STA 131',
      question: 'In how many ways can 4 executive committee members be chosen from a guild of 10 students?',
      options: [
        '5,040',
        '210',
        '120',
        '40'
      ],
      correctAnswer: 1,
      explanation: 'This is a combination problem: 10C4 = 10! / (4! * 6!) = (10 × 9 × 8 × 7) / (4 × 3 × 2 × 1) = 5040 / 24 = 210.'
    },
    {
      id: 'sta131-4',
      courseCode: 'STA 131',
      question: 'Which measure of central tendency is least affected by extreme outlier values?',
      options: [
        'Mean',
        'Median',
        'Midrange',
        'Geometric Mean'
      ],
      correctAnswer: 1,
      explanation: 'The median represents the 50th percentile rank and is resistant (robust) against skewed values or extreme outliers.'
    }
  ],
  'CSC 231': [
    {
      id: 'csc231-1',
      courseCode: 'CSC 231',
      question: 'In the classic Von Neumann architecture, which component coordinates and directs the activities of all other units?',
      options: [
        'Arithmetic Logic Unit (ALU)',
        'Control Unit (CU)',
        'Memory Unit',
        'Input/Output Bus'
      ],
      correctAnswer: 1,
      explanation: 'The Control Unit (CU) interprets instructions fetched from memory and orchestrates their execution across the ALU and registers.'
    },
    {
      id: 'csc231-2',
      courseCode: 'CSC 231',
      question: 'Which memory hierarchy level exhibits the fastest access time?',
      options: [
        'L1 Cache',
        'CPU Registers',
        'Main Memory (DRAM)',
        'Solid State Drive (SSD)'
      ],
      correctAnswer: 1,
      explanation: 'CPU registers are located directly inside the processor core and offer the highest throughput and lowest latency of all storage.'
    },
    {
      id: 'csc231-3',
      courseCode: 'CSC 231',
      question: 'What is the purpose of instruction pipelining in modern microprocessors?',
      options: [
        'To reduce power consumption during sleep states',
        'To achieve instruction-level parallelism by overlapping the execution phases of consecutive instructions',
        'To increase DRAM storage capacity',
        'To convert 32-bit instructions into 64-bit microcode'
      ],
      correctAnswer: 1,
      explanation: 'Pipelining overlaps fetch, decode, execute, memory access, and writeback steps so multiple instructions are processed concurrently.'
    }
  ],
  'CSC 233': [
    {
      id: 'csc233-1',
      courseCode: 'CSC 233',
      question: 'Which OOP principle is implemented when a subclass provides a specific implementation of a method already declared in its parent class?',
      options: [
        'Method Overloading',
        'Method Overriding',
        'Data Encapsulation',
        'Data Hiding'
      ],
      correctAnswer: 1,
      explanation: 'Method Overriding is runtime polymorphism where a subclass provides its own specialized behavior for an inherited parent method.'
    },
    {
      id: 'csc233-2',
      courseCode: 'CSC 233',
      question: 'What does the SOLID principle "S" stand for?',
      options: [
        'Systematic Design Principle',
        'Single Responsibility Principle',
        'Sequential Architecture Principle',
        'Static Polymorphism Principle'
      ],
      correctAnswer: 1,
      explanation: 'The Single Responsibility Principle (SRP) states that a class or module should have one, and only one, reason to change.'
    },
    {
      id: 'csc233-3',
      courseCode: 'CSC 233',
      question: 'In Java or C++, what access modifier ensures a member is accessible only within its own class and its derived (sub) classes?',
      options: [
        'private',
        'public',
        'protected',
        'default / package-private'
      ],
      correctAnswer: 2,
      explanation: 'The "protected" modifier restricts visibility to the defining class and any derived child classes.'
    }
  ],
  'MTH 141': [
    {
      id: 'mth141-1',
      courseCode: 'MTH 141',
      question: 'If the roots of the quadratic equation ax² + bx + c = 0 are real and equal, what must be the value of the discriminant (b² - 4ac)?',
      options: [
        'b² - 4ac > 0',
        'b² - 4ac = 0',
        'b² - 4ac < 0',
        'b² - 4ac = 1'
      ],
      correctAnswer: 1,
      explanation: 'When b² - 4ac = 0, the quadratic formula yields a single repeated real root (-b / 2a).'
    },
    {
      id: 'mth141-2',
      courseCode: 'MTH 141',
      question: 'Find the 8th term of an Arithmetic Progression (AP) whose first term is 3 and common difference is 4.',
      options: [
        '28',
        '31',
        '35',
        '27'
      ],
      correctAnswer: 1,
      explanation: 'The nth term of an AP is Un = a + (n - 1)d. Here U8 = 3 + (8 - 1) × 4 = 3 + 28 = 31.'
    }
  ]
};

