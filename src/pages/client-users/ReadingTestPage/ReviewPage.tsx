import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Paragraph from "./Paragraph";
import { Part } from "./reading";

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

function getOptionKey(option: string) {
  const match = option.trim().match(/^([A-Z])/i);
  return match ? match[1].toUpperCase() : option.trim();
}

const ReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers = {}, parts = [] } = location.state || {};

  // Nếu không có dữ liệu truyền qua thì quay lại trang điểm số
  React.useEffect(() => {
    if (!parts || parts.length === 0) {
      navigate("/reading-score");
    }
    // eslint-disable-next-line
  }, [parts]);

  // Tab logic
  const [activeKey, setActiveKey] = React.useState(
    parts && parts.length > 0 ? parts[0].id.toString() : "1"
  );
  const [prevKey, setPrevKey] = React.useState(activeKey);

  const [highlightedSentence, setHighlightedSentence] = React.useState<
    string | null
  >(null);

  const handleTabChange = (key: string) => {
    setPrevKey(activeKey);
    setActiveKey(key);
    setHighlightedSentence(null);
  };

  // UI render cho đáp án đúng + giải thích
  const renderAnswerExplain = (q: any) => (
    <div className="mt-2 text-[15px]">
      <div className="font-semibold text-green-700">
        Đáp án đúng:{" "}
        {Array.isArray(q.correctAnswer)
          ? q.correctAnswer.join(", ")
          : q.correctAnswer}
      </div>
      {q.explanation && (
        <div className="text-gray-700 mt-1 italic">
          Giải thích: {q.explanation}
        </div>
      )}
    </div>
  );

  // UI câu hỏi (tối ưu cho tất cả loại)
  const renderQuestion = (group: any, answers: any) => {
    const startNumber = group.startNumber ?? 1;
    return group.questions.map((q: any, idx: number) => {
      const questionNumber = startNumber + idx;
      const userAnswer = normalize(answers[q.id]);

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
        console.log("ReviewPage MC:", {
          qid: q.id,
          options,
          userAnswer: answers[q.id],
          normUserAnswer: normalize(answers[q.id]),
          correct,
        });

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
                const optionKey = getOptionKey(option); // "A", "B", ...
                const isCorrect = correct.includes(optionKey.toLowerCase());
                const isSelected = userAnswer === optionKey.toLowerCase();

                return (
                  <button
                    key={idx2}
                    type="button"
                    className={`w-full text-left whitespace-normal break-words px-4 py-2 rounded-xl flex items-center gap-2 border-2 transition-colors duration-150 font-medium text-base md:text-lg
        ${
          isSelected && isCorrect
            ? "bg-green-600 !text-white border-black shadow"
            : isSelected && !isCorrect
            ? "bg-red-400 text-white border-black shadow"
            : !isSelected && isCorrect
            ? "bg-green-100 text-green-900 border-green-400"
            : "bg-white text-black border-gray-300"
        }
      `}
                    style={{ minHeight: 48, fontSize: 16 }}
                    disabled
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
            {renderAnswerExplain(q)}
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
                    ? "bg-red-400 border-black shadow"
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

  // Tabs UI
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
            Reading Test Review
          </span>
        </div>
        <div className="flex items-center gap-5">
          <button
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition"
            onClick={() => navigate("/reading-score")}
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

export default ReviewPage;
