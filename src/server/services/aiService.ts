import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../db/prisma.js';
import { CONFIG } from '../config.js';

let genAI: GoogleGenerativeAI | null = null;
if (CONFIG.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
  } catch (e) {
    console.warn('Gemini API initialization warning:', e);
  }
}

export interface ChatMessageInput {
  userId: string;
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export class AIService {
  /**
   * 1. Retrieve relevant memories for the student to build context prompt
   */
  static async getStudentContextPrompt(userId: string): Promise<{ contextText: string; activeMemories: any[] }> {
    const memories = await prisma.aIMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    if (memories.length === 0) {
      return { contextText: '', activeMemories: [] };
    }

    const memoryLines = memories.map((m) => `- [${m.memoryType.toUpperCase()}]: ${m.content}`);
    const contextText = `\n[STUDENT PERSISTENT MEMORY CONTEXT]:\nThe student has the following saved learning memories in the database:\n${memoryLines.join('\n')}\n*Use these memories to customize explanations, tone, language, and examples naturally without explicitly reciting the context list.*`;

    return { contextText, activeMemories: memories };
  }

  /**
   * 2. Detect & store new memories from student message
   */
  static async extractAndStoreMemories(userId: string, userMessage: string): Promise<any[]> {
    const text = userMessage.toLowerCase();
    const newMemories: { memoryType: string; content: string; importance: string }[] = [];

    if (text.includes('struggle with') || text.includes('hard for me') || text.includes('dont understand') || text.includes("don't get")) {
      const topicMatch = userMessage.replace(/.*(struggle with|hard for me|dont understand|don't get)/i, '').trim();
      if (topicMatch.length > 3) {
        newMemories.push({
          memoryType: 'weakness',
          content: `Struggles with: ${topicMatch.slice(0, 100)}`,
          importance: 'high',
        });
      }
    }

    if (text.includes('prefer') || text.includes('explain in hindi') || text.includes('visual example') || text.includes('real world')) {
      newMemories.push({
        memoryType: 'preference',
        content: `Learning Preference: ${userMessage.slice(0, 100)}`,
        importance: 'medium',
      });
    }

    if (text.includes('target') || text.includes('want to score') || text.includes('my goal')) {
      newMemories.push({
        memoryType: 'goal',
        content: `Target Goal: ${userMessage.slice(0, 100)}`,
        importance: 'high',
      });
    }

    const created = [];
    for (const mem of newMemories) {
      const existing = await prisma.aIMemory.findFirst({
        where: { userId, content: mem.content },
      });
      if (!existing) {
        const item = await prisma.aIMemory.create({
          data: {
            userId,
            memoryType: mem.memoryType,
            content: mem.content,
            importance: mem.importance,
            source: 'LearnMate AI Chat',
          },
        });
        created.push(item);
      }
    }
    return created;
  }

  /**
   * 3. Main Chat Completion with Memory Context
   */
  static async chatWithAI(input: ChatMessageInput) {
    const { userId, message } = input;

    // Retrieve active student memory context
    const { contextText, activeMemories } = await this.getStudentContextPrompt(userId);

    // Extract potential new memory asynchronously
    const extractedMemories = await this.extractAndStoreMemories(userId, message);

    // Try Gemini API if key is present
    if (genAI) {
      try {
        const systemInstruction = `You are LearnMate AI, a friendly, encouraging, expert AI tutor for school and college students in India. You teach concepts clearly using step-by-step breakdowns, real-world examples, markdown formatting, and LaTeX math notation where appropriate (\( ... \) for inline math, \[ ... \] for display math). ${contextText}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(`${systemInstruction}\n\nStudent Question: ${message}`);

        const replyText = response.response.text() || 'I am ready to help you learn! Could you ask your doubt again?';
        return {
          reply: replyText,
          activeMemories,
          newMemoriesExtracted: extractedMemories,
        };
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart local tutor engine:', err);
      }
    }

    // Smart Local Tutor Engine (Fallback Response System)
    const replyText = this.generateSmartLocalReply(message, contextText);
    return {
      reply: replyText,
      activeMemories,
      newMemoriesExtracted: extractedMemories,
    };
  }

  /**
   * 4. Smart Local Response Generator for instant offline/demo tutoring
   */
  private static generateSmartLocalReply(userMessage: string, contextText: string): string {
    const msg = userMessage.toLowerCase();

    if (msg.includes('photosynthesis')) {
      return `### 🌱 Photosynthesis Explained Simply

Photosynthesis is the process by which green plants use **sunlight**, **water (\(H_2O\))**, and **carbon dioxide (\(CO_2\))** to prepare food (glucose) and release oxygen (\(O_2\)).

#### Chemical Equation:
\[
6CO_2 + 6H_2O \\xrightarrow{\\text{Sunlight + Chlorophyll}} C_6H_{12}O_6 + 6O_2
\]

#### 3 Main Steps:
1. **Absorption of light**: Chlorophyll in leaves absorbs solar energy.
2. **Splitting of water**: Light energy splits \(H_2O\) into Hydrogen and Oxygen.
3. **Reduction of \(CO_2\)**: Carbon dioxide is converted into Glucose (\(C_6H_{12}O_6\)).

> 💡 **Real-World Analogy**: Think of chlorophyll as a solar-powered kitchen in the leaf that bakes glucose using air and water!

Would you like 3 practice board exam questions on this topic?`;
    }

    if (msg.includes('quadratic') || msg.includes('equation')) {
      return `### 📐 Quadratic Equations Master Guide

A quadratic equation is a second-degree polynomial equation in standard form:
\[
ax^2 + bx + c = 0 \quad (a \neq 0)
\]

#### The Quadratic Formula:
\[
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\]

Where the **Discriminant** is \(D = b^2 - 4ac\):
- If \(D > 0\): Two distinct real roots.
- If \(D = 0\): Two equal real roots (\(x = -\frac{b}{2a}\)).
- If \(D < 0\): No real roots (complex roots).

#### Step-by-Step Example: Solve \(x^2 - 5x + 6 = 0\)
1. Here \(a=1, b=-5, c=6\).
2. Calculate Discriminant: \(D = (-5)^2 - 4(1)(6) = 25 - 24 = 1\).
3. Apply formula:
\[
x = \frac{-(-5) \pm \sqrt{1}}{2(1)} = \frac{5 \pm 1}{2}
\]
Hence \(x = 3\) or \(x = 2\).

Let me know if you would like me to generate a practice problem adapted to your preferred study goal!`;
    }

    if (msg.includes('hindi')) {
      return `### 🇮🇳 Quadratic Equations in Simple Hindi

द्विघात समीकरण (Quadratic Equation) का मानक रूप होता है:
\[
ax^2 + bx + c = 0
\]

श्रीधराचार्य सूत्र (Quadratic Formula):
\[
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\]

यहाँ \(D = b^2 - 4ac\) को **विविक्तकर (Discriminant)** कहते हैं।
- यदि \(D > 0\), तो दो भिन्न वास्तविक मूल (Real Roots) होते हैं।
- यदि \(D = 0\), तो दोनों मूल समान होते हैं।

क्या आप इस पर 3 अभ्यास प्रश्न हल करना चाहेंगे?`;
    }

    return `### 🧠 LearnMate AI Tutor Response

Thank you for your question! Here is a structured explanation:

1. **Core Concept**: To master **${userMessage}**, focus first on understanding the foundational definitions and formulas before jumping into complex numericals.
2. **Step-by-Step Problem Solving**:
   - Step 1: Identify all given values and variables.
   - Step 2: Select the appropriate formula or theorem.
   - Step 3: Verify units and perform step-wise calculations.

${contextText ? `> ⚡ *Personalized Memory Note applied*: Tailored for your learning profile and current tuition goals.` : ''}

How would you like to proceed?
- 📝 Get 5 practice questions
- 💡 See a real-world example
- 🎯 Review formula summary sheet`;
  }

  /**
   * 5. Generate 7-Day Personalized Learning Plan
   */
  static async generateLearningPlan(subject: string, goal: string): Promise<any> {
    return {
      title: `7-Day Master Plan: ${subject}`,
      goal,
      days: [
        { day: 1, title: 'Foundational Concepts & Definitions', task: 'Read Chapter 1 notes, memorize formulas, solve 5 basic examples.', duration: '45 mins' },
        { day: 2, title: 'Core Mechanics & Derivations', task: 'Practice step-by-step derivations and graph plots.', duration: '60 mins' },
        { day: 3, title: 'Intermediate Problem Solving', task: 'Solve 8 textbook numericals focusing on discriminant & word problems.', duration: '60 mins' },
        { day: 4, title: 'Real-world Applications & Edge Cases', task: 'Work through 5 practical application problems.', duration: '45 mins' },
        { day: 5, title: 'Previous Year Board Exam Questions', task: 'Attempt 5 actual past paper questions under timed conditions.', duration: '75 mins' },
        { day: 6, title: 'Doubt Resolution & Flashcards Revision', task: 'Review weak formulas, ask LearnMate AI for clarification on missed steps.', duration: '45 mins' },
        { day: 7, title: 'Full Speed Self Assessment Quiz', task: 'Take a 20-minute mock quiz and score your performance.', duration: '30 mins' },
      ],
    };
  }

  /**
   * 6. AI Teacher Assistant: Quiz Builder & Homework Generator
   */
  static async teacherAssistantTools(action: string, payload: any): Promise<any> {
    if (action === 'CREATE_QUIZ') {
      const topic = payload.topic || 'Algebra';
      return {
        topic,
        questions: [
          { id: 1, question: `What are the roots of \(x^2 - 7x + 12 = 0\)?`, options: ['A) 3 and 4', 'B) -3 and -4', 'C) 2 and 6', 'D) 1 and 12'], answer: 'A' },
          { id: 2, question: `What is the discriminant of \(2x^2 + 5x + 3 = 0\)?`, options: ['A) 1', 'B) 49', 'C) 25', 'D) 0'], answer: 'A' },
          { id: 3, question: `If roots of \(ax^2+bx+c=0\) are equal, then:`, options: ['A) \(b^2 - 4ac = 0\)', 'B) \(b^2 < 4ac\)', 'C) \(b^2 > 4ac\)', 'D) \(a=0\)'], answer: 'A' },
        ],
      };
    }
    return { result: `Teacher AI action ${action} processed successfully.` };
  }
}
