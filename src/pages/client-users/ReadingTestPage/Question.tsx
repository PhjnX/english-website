import React from "react";
import { Card, Button, Select, Input, Radio } from "antd";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Question } from "./reading";

const { Option } = Select;

interface QuestionProps {
  questions: Question[];
  answers: { [key: number]: string };
  handleAnswer: (id: number, answer: string) => void;
  highlightedSentence: string | null;
  setHighlightedSentence: (text: string | null) => void;
  isSubmitted: boolean;
  isLoading: boolean;
  isReviewing?: boolean;
  partId: number;
}

const QuestionList: React.FC<QuestionProps> = ({
  questions,
  answers,
  handleAnswer,
  highlightedSentence,
  setHighlightedSentence,
  isSubmitted,
  isLoading,
  isReviewing = false,
  partId,
}) => {
  // Nhóm câu hỏi theo type
  const groupedQuestions = questions.reduce<Record<string, Question[]>>(
    (acc, q) => {
      const type = q.type ? q.type.toLowerCase() : "unknown";
      if (!acc[type]) acc[type] = [];
      acc[type].push(q);
      return acc;
    },
    {}
  );

  // Xác định số thứ tự câu hỏi tiếp theo cho các dạng fill
  let globalQuestionNumber =
    Math.min(...questions.map((q) => q.id).filter(Boolean)) || 1;

  // Instructions cho từng dạng (giữ lại nếu muốn)
  const questionInstructions: Record<string, React.ReactNode> = {
    "multiple-choice": (
      <div className="mb-2">
        <b>Choose the correct answer.</b>
      </div>
    ),
    "true-false-notgiven": (
      <div className="mb-2">
        <b>
          Do the following statements agree with the information given in the
          Reading Passage?
        </b>
      </div>
    ),
    paragraph: (
      <div className="mb-2">
        <b>
          Complete the summary below.{" "}
          <span className="text-red-500">ONE WORD ONLY</span> for each answer.
        </b>
      </div>
    ),
    "gap-fill": (
      <div className="mb-2">
        <b>
          Complete the sentences below.{" "}
          <span className="text-red-500">ONE WORD ONLY</span> for each answer.
        </b>
      </div>
    ),
    matching: (
      <div className="mb-2">
        <b>Match each statement with the correct option.</b>
      </div>
    ),
  };

  // Hàm tìm tất cả vị trí blank ___ trong chuỗi (trả về index array)
  function getAllBlankIndexes(text: string) {
    // Dấu ___ hoặc {n}
    const regex = /_{2,}/g;
    let match;
    let indexes: number[] = [];
    while ((match = regex.exec(text)) !== null) {
      indexes.push(match.index);
    }
    return indexes;
  }

  // Hàm để parse options nếu là string dạng JSON
  function parseOptions(options?: string | string[] | null): string[] {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    try {
      const arr = JSON.parse(options);
      if (Array.isArray(arr)) return arr;
      return [];
    } catch {
      // fallback tách theo dấu ; hoặc ,
      return options.split(/;|,/).map((s) => s.trim());
    }
  }

  // Render từng group câu hỏi theo loại
  return (
    <div className="p-4 h-full overflow-y-auto bg-white rounded space-y-8">
      {Object.entries(groupedQuestions)
        .sort(([, aGroup], [, bGroup]) => {
          const aStart = aGroup?.[0]?.id ?? Infinity;
          const bStart = bGroup?.[0]?.id ?? Infinity;
          return aStart - bStart;
        })
        .map(([type, group]) => (
          <div key={type} className="space-y-4">
            {questionInstructions[type]}
            {group.map((q, qidx) => {
              // Xác định có render số thứ tự không
              const showNumber = ![
                "paragraph",
                "matching",
                "gap-fill",
              ].includes(q.type);

              // Multiple choice (A, B, C, D)
              if (q.type === "multiple-choice") {
                const options = parseOptions(q.options);
                return (
                  <motion.div key={q.id}>
                    <Card className="shadow">
                      <div className="font-semibold mb-2">
                        {showNumber && (
                          <span className="text-blue-600">{q.id}. </span>
                        )}
                        {q.questionText}
                      </div>
                      <div className="flex flex-col gap-2">
                        {options.map((option: string, idx: number) => {
                          const isSelected = answers[q.id] === option;
                          const correctAnswers = Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.map((a: string) =>
                                a.trim().toLowerCase()
                              )
                            : [q.correctAnswer.trim().toLowerCase()];
                          const isCorrect = correctAnswers.includes(
                            option.trim().toLowerCase()
                          );
                          const showCorrect =
                            isSubmitted &&
                            isReviewing &&
                            isCorrect &&
                            isSelected;
                          const showWrong =
                            isSubmitted &&
                            isReviewing &&
                            isSelected &&
                            !isCorrect;
                          return (
                            <Button
                              key={idx}
                              type={isSelected ? "primary" : "default"}
                              className={`w-full text-left whitespace-normal break-words px-4 py-2 rounded-md flex items-center gap-2 border-2 ${
                                showWrong ? "border-red-500" : ""
                              }`}
                              style={{
                                backgroundColor: showWrong
                                  ? "#ef4444"
                                  : showCorrect && isSelected
                                  ? "#22c55e"
                                  : undefined,
                                color:
                                  showWrong || (showCorrect && isSelected)
                                    ? "#fff"
                                    : undefined,
                                minHeight: 48,
                                fontSize: 16,
                              }}
                              onClick={() => handleAnswer(q.id, option)}
                              disabled={isSubmitted && !isReviewing}
                            >
                              <span className="inline-block w-full">
                                {option}
                              </span>
                              {showCorrect && isSelected && (
                                <FaCheckCircle className="text-green-200 ml-2" />
                              )}
                              {showWrong && (
                                <FaTimesCircle className="text-red-200 ml-2" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </Card>
                  </motion.div>
                );
              }

              // Paragraph fill hoặc gap-fill
              if (q.type === "paragraph" || q.type === "gap-fill") {
                // Split by ___ và render input tương ứng, label input là số thứ tự tăng dần (VD: Đáp án 4, 5, 6...)
                const blanks = q.questionText.split(/_{2,}/g);
                const numBlanks = blanks.length - 1;
                const firstId = q.id; // id đầu tiên cho ô input
                return (
                  <motion.div key={q.id}>
                    <Card className="shadow">
                      <div className="mb-2 font-semibold">
                        {/* KHÔNG render số thứ tự đầu câu */}
                        {/* Đoạn văn bản với input */}
                        <span className="block">
                          {blanks.map((part, idx) => (
                            <React.Fragment key={idx}>
                              <span style={{ whiteSpace: "pre-line" }}>
                                {part}
                              </span>
                              {idx < numBlanks && (
                                <input
                                  type="text"
                                  className="mx-1 px-3 py-2 min-w-[110px] border border-gray-400 rounded shadow-sm inline-block"
                                  value={answers[firstId + idx] || ""}
                                  onChange={(e) =>
                                    handleAnswer(firstId + idx, e.target.value)
                                  }
                                  placeholder={`${firstId + idx}`}
                                  disabled={isSubmitted && !isReviewing}
                                  style={{
                                    verticalAlign: "middle",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                );
              }

              // Matching (liệt kê statement, mỗi statement 1 dropdown hoặc input)
              if (q.type === "matching") {
                // parse option (A. Name, B. Name ...)
                const options = parseOptions(q.options);
                // Mỗi dòng statement là 1 dòng trong questionText, mỗi dòng là 1 câu hỏi (id liên tục)
                const statements = q.questionText
                  .split(/\n/)
                  .filter((s) => s.trim());
                return (
                  <motion.div key={q.id}>
                    <Card className="shadow">
                      <div className="mb-2 font-semibold">
                        {/* Không render số đầu dòng */}
                        <div className="flex flex-col gap-2">
                          {statements.map((stmt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span
                                style={{
                                  minWidth: 30,
                                  color: "#2563eb",
                                  fontWeight: 600,
                                }}
                              >
                                {/* Số câu hỏi tăng liên tục theo id */}
                                {q.id + idx}
                              </span>
                              <span className="flex-1">{stmt}</span>
                              <Select
                                value={answers[q.id + idx] || undefined}
                                onChange={(value) =>
                                  handleAnswer(q.id + idx, value)
                                }
                                className="min-w-[80px]"
                                placeholder="Chọn"
                                disabled={isSubmitted && !isReviewing}
                              >
                                {options.map((op, opidx) => (
                                  <Option key={opidx} value={op[0]}>
                                    {op}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              }

              // True-False-NotGiven
              if (q.type === "true-false-notgiven") {
                const options = ["True", "False", "Not Given"];
                return (
                  <motion.div key={q.id}>
                    <Card className="shadow">
                      <div className="font-semibold mb-2">
                        {showNumber && (
                          <span className="text-blue-600">{q.id}. </span>
                        )}
                        {q.questionText}
                      </div>
                      <Radio.Group
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        value={answers[q.id]}
                        className="mt-2 !flex !flex-row !gap-4"
                        disabled={isSubmitted && !isReviewing}
                      >
                        {options.map((option) => (
                          <Radio.Button
                            key={option}
                            value={option}
                            className={`!w-28 !h-12 !flex !items-center !justify-center !text-base !font-semibold !border-2 !mx-1 !rounded-md !py-0 !px-4 !leading-none`}
                          >
                            {option}
                          </Radio.Button>
                        ))}
                      </Radio.Group>
                    </Card>
                  </motion.div>
                );
              }

              // Trường hợp không xác định
              return null;
            })}
          </div>
        ))}
    </div>
  );
};

export default QuestionList;
