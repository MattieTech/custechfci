import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Built-in intelligent academic knowledge base for CUSTECH FCI
function generateCurriculumFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('oop') || q.includes('object-oriented') || q.includes('inheritance') || q.includes('polymorphism')) {
    return `### Object-Oriented Programming (OOP) in CUSTECH Computing

OOP is organized around **objects** (data structures containing fields and methods) rather than pure actions and logic. Here are the 4 fundamental pillars tested in **CSC 233**:

1. **Encapsulation**: Bundling data (attributes) and methods that manipulate that data into a single class while restricting direct access from outside.
   \`\`\`python
   class Student:
       def __init__(self, matric_no, cgpa):
           self.__matric = matric_no  # private attribute
           self.cgpa = cgpa
           
       def get_matric(self):
           return self.__matric
   \`\`\`

2. **Inheritance**: Mechanism where a new class (subclass) derives characteristics and behaviors from an existing parent class (superclass).
   \`\`\`python
   class ComputingStudent(Student):
       def write_code(self):
           return "Compiling CUSTECH project..."
   \`\`\`

3. **Polymorphism**: The ability of different classes to respond to the same method call in distinct ways (runtime method overriding or compile-time overloading).

4. **Abstraction**: Hiding internal implementation complexity and exposing only necessary high-level interfaces (e.g., using abstract base classes or interfaces).

**Exam Tip**: In your CSC 233 exams, remember that Python achieves abstraction via the \`abc\` module (\`from abc import ABC, abstractmethod\`).`;
  }

  if (q.includes('von neumann') || q.includes('architecture') || q.includes('csc 231') || q.includes('alu') || q.includes('cache')) {
    return `### Von Neumann Architecture (CSC 231 Review)

Proposed in 1945 by John von Neumann, this design serves as the foundation for modern general-purpose digital computers.

#### Key Architectural Components:
1. **Central Processing Unit (CPU)**:
   - **Control Unit (CU)**: Directs flow of data and sequence of instructions.
   - **Arithmetic Logic Unit (ALU)**: Executes arithmetic operations (+, -, *, /) and Boolean logic (AND, OR, NOT).
   - **Registers**: Ultra-fast, tiny internal memory cells (e.g. Program Counter \`PC\`, Instruction Register \`IR\`, Memory Address Register \`MAR\`, Accumulator \`ACC\`).

2. **Main Memory (RAM)**: Stores both program **instructions** and **data** in the same shared address space (the "Stored-Program Concept").

3. **Input / Output (I/O) Mechanisms**: Interfaces with external peripherals.

4. **System Bus**:
   - **Data Bus**: Bi-directional transfer of operands/results.
   - **Address Bus**: Uni-directional transmission of physical memory addresses.
   - **Control Bus**: Carries synchronization clock pulses and read/write signals.

**Von Neumann Bottleneck**: Because instructions and data share the same bus, CPU processing speed is limited by data bus throughput between the processor and main memory. Harvard architecture addresses this by using separated instruction and data memory buses.`;
  }

  if (q.includes('cgpa') || q.includes('gpa') || q.includes('first class') || q.includes('grading scale')) {
    return `### CUSTECH 5.0 CGPA Scale & Degree Classification

In the Faculty of Computing and Informatics, your academic standing is determined on the standard Nigerian university **5.00 grade point scale**:

| Score Range | Letter Grade | Grade Points | Performance Verdict |
| :--- | :---: | :---: | :--- |
| **70% - 100%** | **A** | **5.0** | Distinction / Excellent |
| **60% - 69%** | **B** | **4.0** | Very Good |
| **50% - 59%** | **C** | **3.0** | Good / Credit |
| **45% - 49%** | **D** | **2.0** | Fair / Pass |
| **40% - 44%** | **E** | **1.0** | Weak Pass |
| **0% - 39%** | **F** | **0.0** | Fail (Must Retake) |

#### Degree Classification Benchmarks:
- **4.50 - 5.00**: First Class Honours
- **3.50 - 4.49**: Second Class Honours (Upper Division / 2:1)
- **2.40 - 3.49**: Second Class Honours (Lower Division / 2:2)
- **1.50 - 2.39**: Third Class Honours
- **1.00 - 1.49**: Pass Degree
- **Below 1.00**: Academic Probation / Withdrawal Warning

**Pro Tip**: Use our **Smart CGPA Calculator & Degree Forecaster** on the FCI portal (\`/cgpa\`) to automatically load your registered courses and calculate your exact required GPA!`;
  }

  if (q.includes('flashcard') || q.includes('gst 111') || q.includes('english')) {
    return `### GST 111 Exam Revision Flashcards

Here are 5 high-yield revision flashcards for **GST 111 (Communication in English)**:

**Card 1: Subject-Verb Agreement (Indefinite Pronouns)**
- *Question*: "Neither of the candidates (has / have) submitted credentials." Which verb is correct?
- *Answer*: **has**. "Neither", "either", "each", and "everyone" are singular and take singular verbs.

**Card 2: Figures of Speech**
- *Question*: What figure of speech is: "The classroom was an oven during the afternoon heat"?
- *Answer*: **Metaphor**. It makes a direct comparison without using "like" or "as".

**Card 3: Reading Techniques**
- *Question*: What is the difference between *Skimming* and *Scanning*?
- *Answer*: **Skimming** is reading rapidly to get the general gist or main idea. **Scanning** is searching quickly for a specific keyword, date, or piece of data.

**Card 4: Concord with Proximity**
- *Question*: "Neither the lecturer nor the students (was / were) present." Which is correct?
- *Answer*: **were**. Under the rule of proximity, the verb agrees with the subject closest to it ("students").

**Card 5: Registers**
- *Question*: What is a "register" in linguistics?
- *Answer*: The specialized vocabulary and stylistic tone associated with a particular professional domain (e.g. medical, legal, computing).`;
  }

  if (q.includes('sdlc') || q.includes('agile') || q.includes('swe 142') || q.includes('waterfall')) {
    return `### SWE 142: Software Development Methodologies

#### 1. The Classical Waterfall Model
- **Structure**: Linear and sequential phases (Requirements -> Design -> Implementation -> Verification -> Maintenance).
- **Pros**: Rigid discipline, precise documentation, clear milestones.
- **Cons**: Difficult to accommodate changes late in the lifecycle; working software is delivered only at the final stage.

#### 2. Agile Methodology (Scrum / Kanban)
- **Structure**: Iterative, sprint-based cycles (typically 2-4 weeks) delivering incremental working prototypes.
- **Core Values**:
  1. Individuals and interactions over processes and tools.
  2. Working software over comprehensive documentation.
  3. Customer collaboration over contract negotiation.
  4. Responding to change over following a fixed plan.

**Exam Question Highlight**: "In which SDLC model is testing treated as a continuous activity rather than an isolated phase at the end?" - **Agile Methodologies**!`;
  }

  // General assistant response
  return `### FCI Academic Study Copilot

I am grounded in the official CUSTECH curriculum for the Faculty of Computing and Informatics (Computer Science, Software Engineering, Cyber Security, Information Technology, and Library & Information Science).

Here are key ways I can help you prepare:
1. **CBT Revision**: Explain past questions, review question rationale, and provide concept drills.
2. **Code Explanations**: Break down C++, Python, Java, Data Structures, or SQL queries step-by-step.
3. **Curriculum Summaries**: Clarify course outlines and key definitions from 100L through 400L.
4. **CGPA Strategy**: Calculate target semester GPA requirements and study milestones.
5. **Flashcards**: Generate revision flashcards for GST 111, CSC 142, STA 131, CSC 231, and more.

What topic would you like to explore or practice right now?`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: messages.map((m: ChatMessage) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              })),
              systemInstruction: {
                parts: [{
                  text: `You are FCI AI, an expert academic tutor and study copilot for students in the Faculty of Computing and Informatics at Confluence University of Science and Technology (CUSTECH), Osara, Kogi State, Nigeria. 
You teach courses across Computer Science, Software Engineering, Cyber Security, Information Technology, and Library & Information Science. 
Provide clear, pedagogically structured explanations with code snippets where appropriate, reference CUSTECH syllabus standards, encourage students, and provide flashcards or quick check questions when asked.
CRITICAL FORMATTING INSTRUCTION: Do NOT use any emojis or emoticons in your answers under any circumstance. Use clean professional Markdown headings, lists, tables, bold text, and code blocks only.`
                }]
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({ reply: replyText });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call fell back to local curriculum engine:', geminiError);
      }
    }

    // High-quality local curriculum fallback
    const fallbackReply = generateCurriculumFallback(latestUserMessage);
    return NextResponse.json({ reply: fallbackReply });

  } catch (error: any) {
    console.error('AI Tutor API error:', error);
    return NextResponse.json({ error: 'Failed to process AI Tutor request' }, { status: 500 });
  }
}

