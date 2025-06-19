// ================== INTERFACE CHUẨN CHO READING TEST API ===================
export interface Assessment {
  id: number;
  name: string;
  time: number;
  description: string;
  level: string;
  isTest: boolean;
  totalquestions: number;
  parts: Part[];
}

export interface Part {
  id: number;
  title: string;
  order: number;
  instructions?: string | null;
  titleDescription?: string | null;
  headerContent?: string | null;
  content?: string | null;
  groups: Group[];
}

// Chỉ giữ các loại hiện tại: multiple-choice, paragraph, gap-fill, matching, true-false-notgiven
export type QuestionType =
  | "multiple-choice"
  | "paragraph"
  | "gap-fill"
  | "matching"
  | "true-false-notgiven";

export interface Group {
  id: number;
  partId: number;
  questionType: QuestionType;
  heading?: string | null;
  startNumber?: number | null;
  endNumber?: number | null;
  questions: Question[];
  questionText?: string | null; // Dùng cho các loại câu hỏi không có phần heading
}

export interface Question {
  id: number;
  groupId: number;
  questionText: string;
  options?: string | string[] | null; // Có thể là string dạng JSON hoặc mảng
  correctAnswer: string | string[];
  explanation?: string | null;
  type: QuestionType;
  paragraphHeading?: string | null;
  lineReference?: string | null;
  showAnswer?: boolean;
}
