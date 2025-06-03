import React from "react";
import { Card, Button, Select, Radio } from "antd";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Group } from "./reading";
const { Option } = Select;

interface QuestionProps {
  groups: Group[]; // Thay vì questions: Question[]
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
  groups,
  answers,
  handleAnswer,
  isSubmitted,
  isReviewing = false,
}) => {
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
      {groups.map((group) => {
        const startNumber = group.startNumber ?? 1;
        return (
          <div key={group.id} className="space-y-4">
            {group.heading && (
              <div className="text-base font-semibold text-gray-800 mb-1">
                {group.heading}
              </div>
            )}
            {group.questions.map((q, qidx) => {
              const questionNumber = startNumber + qidx;
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
                          <span className="text-blue-600">
                            {questionNumber}.{" "}
                          </span>
                        )}
                        {q.questionText}
                      </div>
                      <div className="flex flex-col gap-2">
                        {options.map((option: string, idx: number) => {
                          const isSelected = answers[questionNumber] === option;
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
                              onClick={() =>
                                handleAnswer(questionNumber, option)
                              }
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
                const blanks = q.questionText.split(/_{2,}/g);
                const numBlanks = blanks.length - 1;
                return (
                  <motion.div key={q.id}>
                    <Card className="shadow">
                      <div className="mb-2 font-semibold">
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
                                  value={answers[questionNumber + idx] || ""}
                                  onChange={(e) =>
                                    handleAnswer(
                                      questionNumber + idx,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`${questionNumber + idx}`}
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
                const options = parseOptions(q.options);
                const statements = q.questionText
                  .split(/\n/)
                  .filter((s) => s.trim());
                return (
                  <motion.div key={q.id}>
                    <Card className="shadow">
                      <div className="mb-2 font-semibold">
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
                                {questionNumber + idx}
                              </span>
                              <span className="flex-1">{stmt}</span>
                              <Select
                                value={
                                  answers[questionNumber + idx] || undefined
                                }
                                onChange={(value) =>
                                  handleAnswer(questionNumber + idx, value)
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
                          <span className="text-blue-600">
                            {questionNumber}.{" "}
                          </span>
                        )}
                        {q.questionText}
                      </div>
                      <Radio.Group
                        onChange={(e) =>
                          handleAnswer(questionNumber, e.target.value)
                        }
                        value={answers[questionNumber]}
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

              return null;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
