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

// ================== DATA MAPPING HELPERS ===================

/**
 * Map dữ liệu từ backend API sang format frontend
 */
export const mapBackendDataToFrontend = (backendTest: any): Assessment => {
  console.log("Mapping backend test:", backendTest);

  // Map cấu trúc dữ liệu từ backend sang format mong muốn
  const mappedParts = (backendTest.reading_part || []).map((part: any) => ({
    id: part.id,
    title: part.title,
    order: part.order_num || part.orderNum || 1,
    instructions: part.instructions,
    titleDescription: part.titleDescription,
    headerContent: part.headerContent,
    content: part.content,
    groups: (part.reading_group || []).map((group: any) => ({
      id: group.id,
      partId: part.id,
      questionType:
        group.questionType || group.question_type || "multiple-choice",
      heading: group.heading,
      startNumber: group.startNumber || group.start_number || 1,
      endNumber: group.endNumber || group.end_number,
      questionText: group.questionText || group.question_text,
      questions: (group.reading_question || group.questions || []).map(
        (question: any) => ({
          id: question.id,
          groupId: group.id,
          questionText: question.questionText || question.question_text || "",
          options: question.options,
          correctAnswer: question.correctAnswer || question.correct_answer,
          explanation: question.explanation,
          type:
            question.type ||
            group.questionType ||
            group.question_type ||
            "multiple-choice",
          paragraphHeading:
            question.paragraphHeading || question.paragraph_heading,
          lineReference: question.lineReference || question.line_reference,
          showAnswer: question.showAnswer || question.show_answer,
        })
      ),
    })),
  }));

  console.log("Mapped parts:", mappedParts);

  const result: Assessment = {
    id: backendTest.id,
    name: backendTest.title || backendTest.name || "",
    time: backendTest.time || 60,
    description: backendTest.description || "",
    level: String(backendTest.level || "1"),
    isTest: backendTest.isTest || false,
    totalquestions: backendTest.totalquestions || 0,
    parts: mappedParts,
  };

  console.log("Final mapped result:", result);
  return result;
};

/**
 * Tìm reading test theo level và reading number
 */
export const findReadingTestByLevelAndNumber = (
  allTests: any[],
  level: string | number,
  readingNum: string | number
): any | null => {
  console.log("Searching for test:", { level, readingNum, allTests });

  const targetTest = allTests.find((test: any) => {
    const testLevel = Number(test.level);
    const targetLevel = Number(level);

    // Kiểm tra level match
    if (testLevel !== targetLevel) return false;

    // Kiểm tra title có chứa số readingNum
    const titleMatch = test.title?.match(/\d+/);
    if (titleMatch) {
      const titleNum = titleMatch[0];
      return titleNum === String(readingNum);
    }

    return false;
  });

  console.log("Found target test:", targetTest);
  return targetTest;
};
