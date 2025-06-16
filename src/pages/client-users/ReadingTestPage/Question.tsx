import React from "react";
import { Select } from "antd";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Group } from "./reading";
const { Option } = Select;

interface QuestionProps {
  groups: Group[]; // Thay vì questions: Question[]
  answers: { [key: string]: string }; // Allow string keys for answers
  handleAnswer: (id: number | string, answer: string) => void;
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

  function getOptionKey(option: string) {
    // Nếu option là "C. ..." thì sẽ trả về "C"
    const match = option.trim().match(/^([A-Z])/i);
    return match ? match[1].toUpperCase() : option.trim();
  }

  function normalize(val: any) {
    if (val === undefined || val === null) return "";
    // Nếu là mảng, chỉ lấy phần tử đầu tiên
    if (Array.isArray(val) && val.length === 1) val = val[0];
    // Nếu là chuỗi dạng mảng JSON, parse ra
    if (
      typeof val === "string" &&
      val.trim().startsWith("[") &&
      val.trim().endsWith("]")
    ) {
      try {
        const arr = JSON.parse(val);
        if (Array.isArray(arr) && arr.length > 0) val = arr[0];
      } catch {}
    }
    // Nếu vẫn còn dạng '"B"' (nháy kép), bỏ tiếp nháy kép
    return String(val)
      .replace(/^['"]+|['"]+$/g, "")
      .trim()
      .toLowerCase();
  }

  // Render từng group câu hỏi theo loại
  return (
    <div
      className="p-4 h-full overflow-y-auto rounded-2xl bg-gradient-to-br from-violet-200  to-pink-200 space-y-8"
      style={{ fontFamily: "beVietnamProFont, sans-serif", color: "#18181b" }}
    >
      {groups.map((group) => {
        const startNumber = group.startNumber ?? 1;
        return (
          <div key={group.id} className="space-y-4">
            {group.heading && (
              <div
                className="text-lg font-semibold mb-1 text-gray-800"
                style={{ fontFamily: "beVietnamProFont, sans-serif" }}
              >
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
                const userAnswer = normalize(answers[q.id]);
                let correctAnswers: string[] = [];
                if (
                  typeof q.correctAnswer === "string" &&
                  q.correctAnswer.trim().startsWith("[") &&
                  q.correctAnswer.trim().endsWith("]")
                ) {
                  try {
                    const arr = JSON.parse(q.correctAnswer);
                    correctAnswers = arr.map(normalize);
                  } catch {
                    correctAnswers = [normalize(q.correctAnswer)];
                  }
                } else if (Array.isArray(q.correctAnswer)) {
                  correctAnswers = q.correctAnswer.map(normalize);
                } else {
                  correctAnswers = [normalize(q.correctAnswer)];
                }
                // console.log("Question.tsx MC:", {
                //   qid: q.id,
                //   options,
                //   userAnswer: answers[q.id],
                //   normUserAnswer: normalize(answers[q.id]),
                //   correctAnswers,
                // });

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] p-5 rounded-2xl shadow border border-gray-200">
                      <div
                        className="font-semibold mb-2 text-black"
                        style={{ fontFamily: "beVietnamProFont, sans-serif" }}
                      >
                        {showNumber && (
                          <span
                            className="text-black font-bold mr-1.5"
                            style={{
                              fontFamily: "beVietnamProFont, sans-serif",
                            }}
                          >
                            {questionNumber}.{" "}
                          </span>
                        )}
                        {q.questionText}
                      </div>
                      <div className="flex flex-col gap-2">
                        {options.map((option: string, idx: number) => {
                          const optionKey = getOptionKey(option); // "A"/"B"/"C"/"D"
                          const isSelected = answers[q.id] === optionKey;
                          const isCorrect = correctAnswers.includes(optionKey); // correctAnswers đã normalize đúng
                          const showWrong =
                            isSubmitted && isSelected && !isCorrect;
                          const showCorrect =
                            isSubmitted &&
                            isCorrect &&
                            (isReviewing || isSelected);

                          return (
                            <button
                              key={idx}
                              type="button"
                              className={`w-full text-left whitespace-normal break-words px-4 py-2 rounded-xl flex items-center gap-2 border-2 transition-colors duration-150 font-medium text-base md:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 cursor-pointer
    ${
      isSelected
        ? "bg-gradient-to-br from-[#f093fb] to-[#e5576c] !text-black border-none shadow-lg"
        : "bg-white text-black border-gray-200 hover:border-black hover:bg-purple-50"
    }
    ${showWrong ? "!bg-red-500 !text-white !border-red-500" : ""}
    ${showCorrect ? "!bg-green-500 !text-white !border-green-500" : ""}
    ${isSubmitted && !isReviewing ? "opacity-60 cursor-not-allowed" : ""}
  `}
                              style={{ minHeight: 48, fontSize: 16 }}
                              onClick={() =>
                                !isSubmitted && handleAnswer(q.id, optionKey)
                              }
                              disabled={isSubmitted && !isReviewing}
                            >
                              <span className="inline-block w-full">
                                {option}
                              </span>
                              {showCorrect && (
                                <FaCheckCircle className="text-green-200 ml-2" />
                              )}
                              {showWrong && (
                                <FaTimesCircle className="text-red-200 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Paragraph fill hoặc gap-fill
              if (q.type === "gap-fill" || q.type === "paragraph") {
                const blanks = q.questionText.split(/_{2,}/g);
                const numBlanks = blanks.length - 1;
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] px-6 py-4 rounded-2xl shadow border border-gray-200">
                      <p
                        className="text-base leading-8 text-black items-center gap-1"
                        style={{ fontFamily: "beVietnamProFont, sans-serif" }}
                      >
                        {blanks.map((part, idx) => (
                          <React.Fragment key={idx}>
                            {part && <span>{part}</span>}
                            {idx < numBlanks && (
                              <input
                                type="text"
                                className="px-4 !my-1 border-2 border-black rounded-md w-40 text-center font-normal !text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
                                value={answers[`${q.id}_${idx}`] || ""}
                                onChange={(e) =>
                                  handleAnswer(`${q.id}_${idx}`, e.target.value)
                                }
                                disabled={isSubmitted && !isReviewing}
                                placeholder={`${questionNumber + idx}`}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
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
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] p-5 rounded-2xl shadow border border-gray-200">
                      <div className="mb-2 text-black">
                        <div className="flex flex-col gap-2">
                          {statements.map((stmt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span
                                style={{
                                  minWidth: 30,
                                  color: "black",
                                  fontWeight: 600,
                                }}
                              >
                                {questionNumber + idx}.
                              </span>
                              <span className="flex-1 py-1">{stmt}</span>
                              <Select
                                value={answers[`${q.id}_${idx}`] || undefined}
                                onChange={(value) =>
                                  handleAnswer(`${q.id}_${idx}`, value)
                                }
                                className="min-w-[160px] max-w-[320px] !text-base !font-semibold "
                                dropdownStyle={{
                                  minWidth: 220,
                                  fontSize: 16,
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                                optionLabelProp="children"
                                placeholder="Select an option"
                                disabled={isSubmitted && !isReviewing}
                                style={{
                                  borderRadius: 12,
                                  borderColor: "#a78bfa",
                                }}
                              >
                                {options.map((op, opidx) => (
                                  <Option
                                    key={opidx}
                                    value={op[0]}
                                    style={{
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                      fontSize: 16,
                                    }}
                                  >
                                    {op}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // True-False-NotGiven
              if (q.type === "true-false-notgiven") {
                const options = ["True", "False", "Not Given"];
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] p-5 rounded-2xl shadow border border-gray-200">
                      <div
                        className="font-semibold mb-2 text-black"
                        style={{ fontFamily: "beVietnamProFont, sans-serif" }}
                      >
                        {showNumber && (
                          <span
                            className="text-black font-bold mr-1.5"
                            style={{
                              fontFamily: "beVietnamProFont, sans-serif",
                            }}
                          >
                            {questionNumber}.{" "}
                          </span>
                        )}
                        {q.questionText}
                      </div>
                      <div className="flex flex-row gap-3 mt-2">
                        {options.map((option) => {
                          const isSelected = answers[q.id] === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              className={`flex-1 px-0 py-0 rounded-2xl border-2 text-base md:text-lg font-bold transition-colors duration-150 h-12 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2
                                ${
                                  isSelected
                                    ? "bg-gradient-to-br from-[#f093fb] to-[#e5576c] !text-black border-none shadow-lg"
                                    : "bg-white text-purple-700 border-purple-200 hover:border-black hover:bg-purple-50"
                                }
                                ${
                                  isSubmitted && !isReviewing
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                              style={{ minWidth: 110 }}
                              onClick={() =>
                                !isSubmitted && handleAnswer(q.id, option)
                              }
                              disabled={isSubmitted && !isReviewing}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
