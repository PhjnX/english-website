import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paragraph from "./Paragraph";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Part } from "./reading";

export interface Answers {
  [key: number]: string;
}

function normalize(val: any) {
  if (val === undefined || val === null) return "";
  if (Array.isArray(val) && val.length === 1) val = val[0];
  if (
    typeof val === "string" &&
    val.trim().startsWith("[") &&
    val.trim().endsWith("]")
  ) {
    try {
      const arr = JSON.parse(val);
      if (Array.isArray(arr) && arr.length > 0) val = arr;
    } catch {}
  }
  // Trả về nguyên bản nếu là string có \n để các hàm khác xử lý
  return val;
}

function normalizeTFNG(val: any) {
  if (!val) return "";
  return String(val)
    .trim()
    .toLowerCase()
    .replace(/\s|_/g, "") // bỏ hết khoảng trắng và _
    .replace(/^t$/, "true")
    .replace(/^f$/, "false")
    .replace(/^ng$/, "notgiven"); // nếu chọn nhanh gõ ng
}

const ReadingPracticeReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    answers = {},
    parts = [],
    score = 0,
    band = "N/A",
    level = "1",
    readingNum = "reading1",
  } = location.state || {};

  const [highlightedSentence, setHighlightedSentence] = useState<string | null>(
    null
  );
  const [activeKey, setActiveKey] = useState("1");
  const [prevKey, setPrevKey] = useState("1");

  useEffect(() => {
    if (parts && parts.length > 0) {
      setActiveKey(parts[0]?.id?.toString() || "1");
    }
  }, [parts]);

  const handleTabChange = (key: string) => {
    setPrevKey(activeKey);
    setActiveKey(key);
  };
  const handleGoBack = () => {
    navigate(`/reading-practice-score/${level}/${readingNum}`);
  };

  // UI render cho đáp án đúng + giải thích (giống hệt ReviewPage.tsx)
  const renderAnswerExplain = (q: any, idxStart = 1) => {
    // MULTIPLE CHOICE
    if (q.type === "multiple-choice") {
      let correct = normalize(q.correctAnswer);
      if (Array.isArray(correct)) correct = correct[0];
      // Tìm chỉ số của đáp án đúng (A, B, C, D)
      let optionIndex = -1;
      if (q.options) {
        const options = Array.isArray(q.options)
          ? q.options
          : JSON.parse(q.options);
        optionIndex = options.findIndex(
          (o: string) =>
            o.trim().toLowerCase() === correct.toString().trim().toLowerCase()
        );
      }
      return (
        <div className="mt-3 text-[18px] font-semibold text-green-700 gap-2">
          <span>Đáp án đúng:</span>
          <span className="inline-block min-w-[40px] px-3 py-1 border-2 border-green-600 bg-green-50 text-green-700 rounded-lg font-bold text-[17px] shadow">
            {optionIndex !== -1
              ? String.fromCharCode(65 + optionIndex)
              : (correct || "").toUpperCase()}
          </span>
          {q.explanation && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <span className="text-[16px] font-bold text-green-800">
                  Giải thích:
                </span>
              </div>
              <div className="text-[15px] text-green-700 leading-relaxed whitespace-pre-line pl-8">
                {q.explanation}
              </div>
            </div>
          )}
        </div>
      );
    } // PARAGRAPH
    if (q.type === "paragraph") {
      let corrects = normalize(q.correctAnswer);
      // Xử lý trường hợp correctAnswer có \n để tách từng dòng
      if (typeof corrects === "string" && corrects.includes("\n")) {
        corrects = corrects.split("\n").filter((ans: string) => ans.trim());
      } else if (!Array.isArray(corrects)) {
        corrects = [corrects];
      }
      return (
        <div className="mt-2 text-[18px] font-semibold text-green-700">
          Đáp án đúng:
          <div className="pl-2 mt-1">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 max-w-md">
              {corrects.map((ans: any, idx: number) => (
                <>
                  <span
                    key={`num-${idx}`}
                    className="text-right pr-1 font-semibold"
                  >
                    {idxStart + idx}.
                  </span>
                  <span
                    key={`ans-${idx}`}
                    className="inline-block min-w-[60px] px-3 py-1 border-2 border-green-600 bg-green-50 text-green-700 rounded-lg font-bold text-[17px] shadow justify-self-start"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    {String(ans)
                      .replace(/^['"]+|['"]+$/g, "")
                      .trim()}
                  </span>
                </>
              ))}
            </div>
          </div>
          {q.explanation && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <span className="text-[16px] font-bold text-green-800">
                  Giải thích:
                </span>
              </div>
              <div className="text-[15px] text-black leading-relaxed whitespace-pre-line pl-8">
                {q.explanation}
              </div>
            </div>
          )}
        </div>
      );
    } // GAP-FILL
    if (q.type === "gap-fill") {
      let corrects = normalize(q.correctAnswer);
      // Xử lý trường hợp correctAnswer có \n để tách từng dòng
      if (typeof corrects === "string" && corrects.includes("\n")) {
        corrects = corrects.split("\n").filter((ans: string) => ans.trim());
      } else if (!Array.isArray(corrects)) {
        corrects = [corrects];
      }
      return (
        <div className="mt-2 text-[18px] font-semibold text-green-700 flex items-center gap-3 flex-wrap">
          <span>Đáp án đúng:</span>
          {corrects.map((ans: any, idx: number) => (
            <span
              key={idx}
              className="inline-block min-w-[50px] px-3 py-1 border-2 border-green-600 bg-green-50 text-green-700 rounded-lg font-bold text-[17px] shadow"
            >
              {String(ans)
                .replace(/^['"]+|['"]+$/g, "")
                .trim()}
            </span>
          ))}
          {q.explanation && (
            <div className="w-full mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <span className="text-[16px] font-bold text-green-800">
                  Giải thích:
                </span>
              </div>
              <div className="text-[15px] text-black leading-relaxed whitespace-pre-line pl-8">
                {q.explanation}
              </div>
            </div>
          )}
        </div>
      );
    } // MATCHING
    if (q.type === "matching") {
      let corrects = normalize(q.correctAnswer);
      // Xử lý trường hợp correctAnswer có \n để tách từng dòng
      if (typeof corrects === "string" && corrects.includes("\n")) {
        corrects = corrects.split("\n").filter((ans: string) => ans.trim());
      } else if (!Array.isArray(corrects)) {
        corrects = [corrects];
      }
      return (
        <div className="mt-2 text-[18px] font-semibold text-green-700">
          Đáp án đúng:
          <div className="pl-2 mt-1">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 max-w-md">
              {corrects.map((ans: any, idx: number) => (
                <>
                  <span
                    key={`num-${idx}`}
                    className="text-right pr-1 font-semibold"
                  >
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span
                    key={`ans-${idx}`}
                    className="inline-block min-w-[50px] px-3 py-1 border-2 border-green-600 bg-green-50 text-green-700 rounded-lg font-bold text-[17px] shadow justify-self-start"
                  >
                    {String(ans)
                      .replace(/^['"]+|['"]+$/g, "")
                      .trim()}
                  </span>
                </>
              ))}
            </div>
          </div>
          {q.explanation && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <span className="text-[16px] font-bold text-green-800">
                  Giải thích:
                </span>
              </div>
              <div className="text-[15px] text-black leading-relaxed whitespace-pre-line pl-8">
                {q.explanation}
              </div>
            </div>
          )}
        </div>
      );
    } // TRUE/FALSE/NOT GIVEN
    if (q.type === "true-false-notgiven") {
      let correct = normalize(q.correctAnswer);
      if (Array.isArray(correct)) correct = correct[0];
      return (
        <div className="mt-3 text-[18px] font-semibold text-green-700">
          <div className="flex items-center gap-2 mb-2">
            <span>Đáp án đúng:</span>
            <span className="inline-block min-w-[40px] px-3 py-1 border-2 border-green-600 bg-green-50 text-green-700 rounded-lg font-bold text-[17px] shadow">
              {(correct || "").toUpperCase()}
            </span>
          </div>{" "}
          {q.explanation && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <span className="text-[16px] font-bold text-green-800">
                  Giải thích:
                </span>
              </div>
              <div className="text-[15px] text-black leading-relaxed whitespace-pre-line pl-8">
                {q.explanation}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // UI câu hỏi (giống hệt ReviewPage.tsx)
  const renderQuestion = (group: any, answers: any) => {
    const startNumber = group.startNumber ?? 1;
    return group.questions.map((q: any, idx: number) => {
      const questionNumber = startNumber + idx;

      // Multiple choice
      if (q.type === "multiple-choice") {
        const options = Array.isArray(q.options)
          ? q.options
          : q.options
          ? JSON.parse(q.options)
          : [];
        const userAnswer = normalize(answers[q.id]);
        let correct: string[] = [];
        if (
          typeof q.correctAnswer === "string" &&
          q.correctAnswer.trim().startsWith("[") &&
          q.correctAnswer.trim().endsWith("]")
        ) {
          try {
            const arr = JSON.parse(q.correctAnswer);
            correct = arr.map(normalize);
          } catch {
            correct = [normalize(q.correctAnswer)];
          }
        } else if (Array.isArray(q.correctAnswer)) {
          correct = q.correctAnswer.map(normalize);
        } else {
          correct = [normalize(q.correctAnswer)];
        }

        return (
          <div
            key={q.id}
            className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] p-5 rounded-2xl shadow border border-gray-200 mb-4"
          >
            <div className="font-semibold mb-2 text-black">
              <span className="text-black font-bold mr-1.5">
                {questionNumber}.
              </span>
              {q.questionText}
            </div>
            <div className="flex flex-col gap-2">
              {options.map((option: string, idx2: number) => {
                // Lấy ký tự đáp án (A/B/C/D...)
                const optionKey = String.fromCharCode(65 + idx2); // "A", "B", ...
                // Lấy đáp án đúng (có thể là "A", "B", ...)
                const correctKey = Array.isArray(correct)
                  ? correct[0]
                  : correct; // (ví dụ: "C")
                // Đáp án người dùng chọn (giả sử là "C")
                const userKey =
                  typeof userAnswer === "string"
                    ? userAnswer.toUpperCase()
                    : "";

                // Xác định trạng thái
                const isCorrect = optionKey === correctKey.toUpperCase();
                const isSelected = optionKey === userKey;

                return (
                  <button
                    key={idx2}
                    type="button"
                    disabled
                    className={`w-full text-left whitespace-normal break-words px-4 py-2 rounded-xl flex items-center gap-2 border-2 transition-colors duration-150 font-medium text-base md:text-lg
        ${
          isSelected && isCorrect
            ? "bg-green-600 !text-white border-black shadow"
            : isSelected && !isCorrect
            ? "bg-red-400 border-black shadow"
            : !isSelected && isCorrect
            ? "bg-green-100 text-green-900 border-green-400"
            : "bg-white text-black border-gray-300"
        }
      `}
                    style={{ minHeight: 48, fontSize: 16 }}
                  >
                    <span className="inline-block w-5">{optionKey}.</span>
                    <span className="inline-block w-full">
                      {option.replace(/^[A-Z]\.\s*/, "")}
                    </span>
                    {isSelected && isCorrect && (
                      <span className="ml-2 text-white font-bold text-xl">
                        ✓
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="ml-2 text-white font-bold text-xl">
                        ✗
                      </span>
                    )}
                    {!isSelected && isCorrect && (
                      <span className="ml-2 text-green-700 text-lg font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {renderAnswerExplain(q)}
          </div>
        );
      }

      // Gap-fill hoặc paragraph
      if (q.type === "gap-fill" || q.type === "paragraph") {
        const blanks = q.questionText.split(/_{2,}/g);
        const numBlanks = blanks.length - 1;
        return (
          <div
            key={q.id}
            className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] px-6 py-4 rounded-2xl shadow border border-gray-200 mb-4"
          >
            <p className="text-base leading-8 text-black items-center gap-1">
              {blanks.map((part: string, idx2: number) => (
                <React.Fragment key={idx2}>
                  {part}
                  {idx2 < numBlanks && (
                    <span className="inline-block min-w-[60px] px-2 py-1 border-b-2 border-purple-400 bg-white rounded text-purple-700 font-semibold text-center">
                      {answers[`${q.id}_${idx2}`] || "___"}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
            {renderAnswerExplain(q, questionNumber)}
          </div>
        );
      }

      // Matching
      if (q.type === "matching") {
        const statements = q.questionText
          .split(/\n/)
          .filter((s: string) => s.trim());
        return (
          <div
            key={q.id}
            className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] p-5 rounded-2xl shadow border border-gray-200 mb-4"
          >
            <div className="mb-2 text-black">
              <div className="flex flex-col gap-2">
                {statements.map((statement: string, idx2: number) => (
                  <div key={idx2} className="flex items-center gap-2">
                    <span className="font-bold">
                      {String.fromCharCode(65 + idx2)}.
                    </span>{" "}
                    {statement}
                    <span className="ml-2 px-2 py-1 bg-white border border-purple-300 rounded">
                      {answers[`${q.id}_${idx2}`] || "___"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {renderAnswerExplain(q)}
          </div>
        );
      }

      // True/False/NotGiven
      if (q.type === "true-false-notgiven") {
        const options = ["True", "False", "Not Given"];
        const correct = Array.isArray(q.correctAnswer)
          ? q.correctAnswer.map(normalizeTFNG)
          : [normalizeTFNG(q.correctAnswer)];
        const userAnswer = normalizeTFNG(answers[q.id]);
        return (
          <div
            key={q.id}
            className="bg-gradient-to-br from-[#fdcbf1] to-[#e6dee9] p-5 rounded-2xl shadow border border-gray-200 mb-4"
          >
            <div className="font-semibold mb-2 text-black">
              <span className="text-black font-bold mr-1.5">
                {questionNumber}.
              </span>
              {q.questionText}
            </div>
            <div className="flex flex-row gap-3 mt-2">
              {options.map((option) => {
                // Normalize để so sánh cho chắc chắn (cả hai đều lowercase)
                const isCorrect = correct.includes(normalizeTFNG(option));
                const isSelected = userAnswer === normalizeTFNG(option);

                return (
                  <button
                    key={option}
                    type="button"
                    disabled
                    className={`flex-1 px-0 py-0 rounded-2xl border-2 text-base md:text-lg font-bold transition-colors duration-150 h-12 flex items-center justify-center
                ${
                  isSelected && isCorrect
                    ? "bg-green-600 !text-white border-black shadow"
                    : isSelected && !isCorrect
                    ? "bg-red-400 !text-white border-black shadow"
                    : !isSelected && isCorrect
                    ? "bg-green-100 text-green-900 border-green-400"
                    : "bg-white text-purple-700 border-purple-200"
                }
              `}
                    style={{ minWidth: 110 }}
                  >
                    {option}
                    {isSelected && isCorrect && (
                      <span className="ml-2 text-white font-bold text-xl">
                        ✓
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="ml-2 text-white font-bold text-xl">
                        ✗
                      </span>
                    )}
                    {!isSelected && isCorrect && (
                      <span className="ml-2 text-green-700 text-lg font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {renderAnswerExplain(q)}
          </div>
        );
      }

      // Default
      return null;
    });
  };
  // Custom Tab UI (giống ReviewPage.tsx)
  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 md:gap-4 px-2 md:px-6 pt-3 pb-1">
      {parts.map((part: Part) => (
        <motion.button
          key={part.id}
          onClick={() => handleTabChange(part.id.toString())}
          className={`px-4 py-2 rounded-full font-semibold shadow transition-all duration-200 text-base md:text-lg focus:outline-none border-2 cursor-pointer
            ${
              activeKey === part.id.toString()
                ? "bg-gradient-to-r from-[#c471f5] to-[#fa71cd] !text-black border-black !shadow-2xl"
                : "bg-gradient-to-r from-white to-[#f3e8ff] text-black border-gray-200 hover:border-[#eb82a7]"
            }
          `}
        >
          {part.title}
        </motion.button>
      ))}
    </div>
  );
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#e0e7ef] text-black font-inter">
      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-5 bg-gradient-to-r from-[#fad0c4] to-[#ffd1ff] shadow-xl border-b border-gray-200 rounded-b-3xl gap-4 drop-shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-400 via-purple-200 to-white rounded-full p-2 shadow-md">
            <span className="text-3xl">📖</span>
          </div>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-500 font-sans select-none drop-shadow-md">
            Reading Practice Review
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-2 shadow-md">
            <FaCheckCircle className="text-purple-500 text-xl" />
            <span className="text-lg font-bold text-purple-700">
              Correct Answers: {score} | Band: {band}
            </span>
          </div>
          <button
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition cursor-pointer"
            onClick={handleGoBack}
          >
            Quay lại kết quả
          </button>
        </div>
      </header>
      {/* Tabs */}
      {renderTabs()}

      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {parts.map((part: Part) =>
            activeKey === part.id.toString() ? (
              <motion.div
                key={activeKey}
                initial={{
                  opacity: 0,
                  x: parseInt(prevKey) < parseInt(activeKey) ? 100 : -100,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: parseInt(prevKey) < parseInt(activeKey) ? -100 : 100,
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex-1 flex flex-col overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white via-purple-50 to-purple-100 border border-purple-200 my-0"
              >
                <div className="flex flex-col md:flex-row flex-1 h-full bg-transparent rounded-xl overflow-hidden">
                  {/* Paragraph */}
                  <div className="overflow-y-auto p-4 md:p-6 w-full md:w-1/2">
                    <Paragraph
                      title={part.title}
                      partId={part.id}
                      passage={part.content || ""}
                      image={undefined}
                      titleDescription={part.titleDescription ?? ""}
                      highlightedSentence={highlightedSentence}
                      headerContent={part.headerContent ?? ""}
                      setHighlightedSentence={setHighlightedSentence}
                      isLoading={false}
                      questionStart={part.groups?.[0]?.questions?.[0]?.id || 0}
                      questionEnd={
                        part.groups &&
                        part.groups.length > 0 &&
                        part.groups[part.groups.length - 1].questions &&
                        part.groups[part.groups.length - 1].questions.length > 0
                          ? part.groups[part.groups.length - 1].questions[
                              part.groups[part.groups.length - 1].questions
                                .length - 1
                            ].id
                          : 0
                      }
                    />
                  </div>
                  {/* Questions + Answers */}
                  <div className="overflow-y-auto p-4 md:p-6 w-full md:w-1/2">
                    {part.groups.map((group: any) => (
                      <div key={group.id} className="mb-7">
                        {group.heading && (
                          <div className="text-lg font-semibold mb-2 text-gray-800">
                            {group.heading}
                          </div>
                        )}
                        {renderQuestion(group, answers)}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReadingPracticeReview;
