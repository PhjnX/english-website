// src/data/readingTestData.ts

export interface Question {
  id: number;
  question: string;
  questionType: "multiple-choice" | "select" | "input" | "true-false-notgiven";
  options?: string[]; // chỉ dùng cho multiple-choice & select
  correctAnswer: string;
  explanation: string;
}

export interface Part {
  partId: number;
  title: string;
  passage: string;
  questions: Question[];
}

export const parts: Part[] = [
  {
    partId: 1,
    title: "Part 1: Sample Reading Passage",
    passage: `Paragraph A: Music has been part of human culture for thousands of years.
  Paragraph B: Scientists study why certain melodies stick in our brains.
  Paragraph C: Researchers found emotional connection influences memory.
  Paragraph D: Some songs trigger stronger neural reactions than others.`,
    questions: [
      {
        id: 1,
        question: "Which paragraph discusses emotional connection?",
        questionType: "select",
        options: ["A", "B", "C", "D"],
        correctAnswer: "C",
        explanation: "Paragraph C mentions emotional connection.",
      },
      {
        id: 2,
        question:
          "Music has been part of human culture for thousands of years.",
        questionType: "true-false-notgiven",
        options: ["True", "False", "Not Given"],
        correctAnswer: "True",
        explanation: "Paragraph A states music has been part of culture.",
      },
      {
        id: 3,
        question: "Which letter corresponds to strong neural reactions?",
        questionType: "select",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
        explanation: "Paragraph D talks about neural reactions.",
      },
      {
        id: 4,
        question:
          "Which word best describes the brain's response to music? (Hint: Strong / Weak / Slow)",
        questionType: "input",
        correctAnswer: "Strong",
        explanation: "Passage mentions strong reactions.",
      },
      {
        id: 5,
        question: "What is the main reason certain melodies stick?",
        questionType: "multiple-choice",
        options: ["Memory", "Culture", "Rhythm", "Emotion"],
        correctAnswer: "Emotion",
        explanation: "Paragraph C links memory with emotion.",
      },
    ],
  },
];
