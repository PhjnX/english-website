import React from "react";
import { Card, Button, Select, Input, Radio, Skeleton } from "antd";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const { Option } = Select;

interface Question {
  id: number;
  question: string;
  questionType: "multiple-choice" | "select" | "input" | "true-false-notgiven";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  highlightSentence: string;
  sectionTitle?: string;
  subSectionTitle?: string;
}

interface QuestionProps {
  questions: Question[];
  answers: { [key: number]: string };
  handleAnswer: (id: number, answer: string) => void;
  highlightedSentence: string | null;
  setHighlightedSentence: (text: string | null) => void;
  isSubmitted: boolean;
  isLoading: boolean;
  isReviewing?: boolean;
  partId: number; // <--- Thêm prop này để biết đang ở part nào
}

// Block config cho part 3
const blockConfigs = [
  {
    start: 28,
    end: 31,
    title: "Questions 28-31",
    instruction: (
      <>
        <p>
          The reading Passage has eight paragraphs, <b>A–H</b>.
        </p>
        <p>Which paragraph contains the following information?</p>
        <p>
          Write the correct letter, <b>A–H</b>, in boxes <b>28–31</b> on your
          answer sheet.
        </p>
      </>
    ),
  },
  {
    start: 32,
    end: 35,
    title: "Questions 32-35",
    instruction: (
      <>
        <p>Complete the summary below.</p>
        <p>
          Choose{" "}
          <span style={{ color: "#d32f2f", fontWeight: 600 }}>
            ONE WORD ONLY
          </span>{" "}
          from the passage for each answer.
        </p>
        <p>
          Write your answers in boxes <b>32–35</b> on your answer sheet.
        </p>
      </>
    ),
  },
  {
    start: 36,
    end: 40,
    title: "Questions 36-40",
    instruction: (
      <>
        <p>
          Look at the following statements and the list of researcher below.
        </p>
        <p>
          Match each statement with the correct person, <b>A, B, C</b> or{" "}
          <b>D</b>.
        </p>
        <p>
          Write the correct letter, <b>A, B, C</b> or <b>D</b>, in boxes{" "}
          <b>36-40</b> on your answer sheet.
        </p>
        <p>
          <b>NB</b> You may use any letter more than once.
        </p>
        <div className="my-2 border rounded overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="bg-gray-100">
                <td className="font-bold px-3 py-2 w-10">A.</td>
                <td className="px-3 py-2">Lauren Stewart</td>
              </tr>
              <tr>
                <td className="font-bold px-3 py-2 w-10">B.</td>
                <td className="px-3 py-2">Ira Hyman</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="font-bold px-3 py-2 w-10">C.</td>
                <td className="px-3 py-2">Andrea Haiper</td>
              </tr>
              <tr>
                <td className="font-bold px-3 py-2 w-10">D.</td>
                <td className="px-3 py-2">John Seabrook</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
];

const getBlocks = (questions: Question[]) => {
  // Tự động chia block dựa vào blockConfigs
  return blockConfigs
    .map((block) => ({
      ...block,
      questions: questions.filter(
        (q) => q.id >= block.start && q.id <= block.end
      ),
    }))
    .filter((block) => block.questions.length > 0);
};

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
  // Nếu là part 3, dùng block logic
  if (partId === 3) {
    const blocks = getBlocks(questions);
    return (
      <div className="p-4 h-full overflow-y-auto bg-white rounded space-y-8">
        {isLoading
          ? Array(5)
              .fill(0)
              .map((_, idx) => (
                <Skeleton.Input key={idx} active className="h-24 w-full" />
              ))
          : blocks.map((block, blockIdx) => (
              <div key={blockIdx} className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-indigo-700 font-bold text-xl">
                    {block.title}
                  </h2>
                  <div className="text-base text-gray-800">
                    {block.instruction}
                  </div>
                </div>
                {block.questions
                  .filter((q) => q.question.trim() !== "{{paragraph}}")
                  .map((q) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Card
                        className="shadow"
                        onMouseEnter={() => {
                          if (isSubmitted && isReviewing) {
                            setHighlightedSentence(q.highlightSentence);
                          }
                        }}
                        onMouseLeave={() => {
                          if (isSubmitted && isReviewing) {
                            setHighlightedSentence(null);
                          }
                        }}
                      >
                        {/* Render nội dung câu hỏi */}
                        {q.questionType === "input" &&
                        q.question.includes("{{") ? (
                          <p className="mt-2 text-base text-gray-800 leading-7">
                            {q.question.split(/({{\d+}})/g).map((part, idx) => {
                              const match = part.match(/{{(\d+)}}/);
                              if (match) {
                                const id = parseInt(match[1], 10);
                                const userAnswer = answers[id] || "";
                                const blankQuestion = questions.find(
                                  (qq) => qq.id === id
                                );
                                const correctAnswer =
                                  blankQuestion?.correctAnswer || "";
                                const isCorrect =
                                  isSubmitted &&
                                  isReviewing &&
                                  userAnswer.trim().toLowerCase() ===
                                    correctAnswer.trim().toLowerCase();
                                const isWrong =
                                  isSubmitted &&
                                  isReviewing &&
                                  userAnswer &&
                                  userAnswer.trim().toLowerCase() !==
                                    correctAnswer.trim().toLowerCase();
                                return (
                                  <span
                                    key={id}
                                    className="inline-block align-middle"
                                  >
                                    <Input
                                      value={userAnswer}
                                      onChange={(e) =>
                                        handleAnswer(id, e.target.value)
                                      }
                                      disabled={isSubmitted && !isReviewing}
                                      placeholder={String(id)}
                                      className={`mx-2 text-center font-semibold !w-24 !inline-block !align-middle ${
                                        isCorrect
                                          ? "!border-green-600 !bg-green-100 !text-green-800"
                                          : ""
                                      } ${
                                        isWrong
                                          ? "!border-red-600 !bg-red-100 !text-red-800"
                                          : ""
                                      }`}
                                      style={{
                                        borderColor: isCorrect
                                          ? "#16a34a"
                                          : isWrong
                                          ? "#dc2626"
                                          : undefined,
                                        backgroundColor: isCorrect
                                          ? "#bbf7d0"
                                          : isWrong
                                          ? "#fecaca"
                                          : undefined,
                                        color: isCorrect
                                          ? "#166534"
                                          : isWrong
                                          ? "#991b1b"
                                          : undefined,
                                        fontWeight: 600,
                                      }}
                                    />
                                    {isCorrect && (
                                      <FaCheckCircle className="inline ml-1 text-green-500" />
                                    )}
                                    {isWrong && (
                                      <FaTimesCircle className="inline ml-1 text-red-500" />
                                    )}
                                  </span>
                                );
                              }
                              return <span key={idx}>{part}</span>;
                            })}
                          </p>
                        ) : (
                          <p className="font-semibold mb-2">
                            {q.id}. {q.question}
                          </p>
                        )}

                        {q.questionType === "multiple-choice" && (
                          <div className="flex flex-col gap-2">
                            {q.options?.map((option, idx) => {
                              const isSelected = answers[q.id] === option;
                              const isCorrect = option === q.correctAnswer;
                              const showCorrect =
                                isSubmitted && isReviewing && isCorrect;
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
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
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
                            {/* Đáp án đúng */}
                            {isSubmitted && isReviewing && (
                              <div className="mt-2 flex items-center gap-2 text-green-700 font-semibold">
                                <FaCheckCircle className="text-green-500" />
                                Đáp án đúng: <span>{q.correctAnswer}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {q.questionType === "select" && (
                          <Select
                            value={answers[q.id]}
                            onChange={(value) => handleAnswer(q.id, value)}
                            className="mt-2 min-w-[180px] max-w-[260px]"
                            style={{ width: 220 }}
                            placeholder="Choose an option"
                            disabled={isSubmitted && !isReviewing}
                          >
                            {q.options?.map((option, idx) => (
                              <Option key={idx} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        )}

                        {q.questionType === "input" &&
                          q.question.includes("{}") && (
                            <p className="mt-2 text-base text-gray-800 leading-7">
                              {q.question.split("{}").map((part, idx, arr) => (
                                <React.Fragment key={idx}>
                                  <span>{part}</span>
                                  {idx < arr.length - 1 && (
                                    <Input
                                      value={answers[q.id]}
                                      onChange={(e) =>
                                        handleAnswer(q.id, e.target.value)
                                      }
                                      disabled={isSubmitted && !isReviewing}
                                      className="mx-1 text-center font-semibold"
                                      style={{
                                        width: 90,
                                        display: "inline-block",
                                        verticalAlign: "middle",
                                      }}
                                      placeholder={String(q.id)}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </p>
                          )}

                        {q.questionType === "true-false-notgiven" && (
                          <>
                            <Radio.Group
                              onChange={(e) =>
                                handleAnswer(q.id, e.target.value)
                              }
                              value={answers[q.id]}
                              className="mt-2 !flex !flex-row !gap-4"
                              disabled={isSubmitted && !isReviewing}
                            >
                              {["True", "False", "Not Given"].map((option) => {
                                const isSelected = answers[q.id] === option;
                                const isCorrect = option === q.correctAnswer;
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
                                  <Radio.Button
                                    key={option}
                                    value={option}
                                    className={`!w-28 !h-12 !flex !items-center !justify-center !text-base !font-semibold !border-2 !mx-1 !rounded-md !py-0 !px-4 !leading-none
                                      ${
                                        showCorrect
                                          ? "!border-green-600 !bg-green-500 !text-white"
                                          : ""
                                      }
                                      ${
                                        showWrong
                                          ? "!border-red-600 !bg-red-500 !text-white"
                                          : ""
                                      }
                                    `}
                                    style={{
                                      borderColor: showCorrect
                                        ? "#16a34a"
                                        : showWrong
                                        ? "#dc2626"
                                        : undefined,
                                      backgroundColor: showCorrect
                                        ? "#22c55e"
                                        : showWrong
                                        ? "#ef4444"
                                        : undefined,
                                      color:
                                        showCorrect || showWrong
                                          ? "#fff"
                                          : undefined,
                                      padding: 0,
                                      lineHeight: 1,
                                    }}
                                  >
                                    {option}
                                    {showCorrect && (
                                      <FaCheckCircle className="inline ml-2 text-green-200" />
                                    )}
                                    {showWrong && (
                                      <FaTimesCircle className="inline ml-2 text-red-200" />
                                    )}
                                  </Radio.Button>
                                );
                              })}
                            </Radio.Group>
                            {/* Đáp án đúng/sai */}
                            {isSubmitted && isReviewing && (
                              <div
                                className={`mt-2 flex items-center gap-2 font-semibold ${
                                  answers[q.id] === q.correctAnswer
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {answers[q.id] === q.correctAnswer ? (
                                  <FaCheckCircle className="text-green-500" />
                                ) : (
                                  <FaTimesCircle className="text-red-500" />
                                )}
                                Đáp án{" "}
                                {answers[q.id] === q.correctAnswer
                                  ? "đúng"
                                  : "của bạn đã sai, đáp án đúng"}
                                : <span>{q.correctAnswer}</span>
                              </div>
                            )}
                          </>
                        )}

                        {isSubmitted && isReviewing && (
                          <div className="mt-8">
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-gray-600 font-bold"
                            >
                              💡 Giải thích: {q.explanation}
                            </motion.p>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
              </div>
            ))}
      </div>
    );
  }

  // Nếu là part 1 hoặc 2, giữ nguyên logic cũ (group theo questionType)
  const groupedQuestions = questions.reduce<Record<string, Question[]>>(
    (acc, q) => {
      const type = q.questionType.toLowerCase();
      if (!acc[type]) acc[type] = [];
      acc[type].push(q);
      return acc;
    },
    {}
  );

  const questionInstructions: Record<string, React.ReactNode> = {
    select: (() => {
      const selectGroup = groupedQuestions["select"];
      if (!selectGroup || selectGroup.length === 0) return null;
      const startId = selectGroup[0].id;
      const endId = selectGroup[selectGroup.length - 1].id;
      return (
        <div className="mb-4">
          <h2 className="text-indigo-700 font-bold text-xl">
            Questions {startId}–{endId}
          </h2>
          <p className="text-gray-800">
            The reading Passage has eight paragraphs,{" "}
            <span className="font-bold">A–H</span>.
          </p>
          <p>Which paragraph contains the following information?</p>
          <p>
            Choose the correct letter, <span className="font-bold">A–H</span>,
            in boxes{" "}
            <span className="font-semibold">
              {startId}–{endId}
            </span>{" "}
            on your answer sheet.
          </p>
        </div>
      );
    })(),
    "true-false-notgiven": (() => {
      const group = groupedQuestions["true-false-notgiven"];
      if (!group || group.length === 0) return null;
      const startId = group[0].id;
      const endId = group[group.length - 1].id;
      return (
        <div className="mb-4">
          <h2 className="text-indigo-700 font-bold text-xl">
            Questions {startId}–{endId}
          </h2>
          <p className="text-gray-800">
            Do the following statements agree with the information given in
            Reading Passage?
          </p>
          <p>
            In boxes{" "}
            <span className="font-semibold">
              {startId}–{endId}
            </span>{" "}
            on your answer sheet, choose correct Answer
          </p>
          <div className="my-4 border rounded overflow-hidden">
            <div className="bg-gray-100 p-2 font-bold">TRUE.</div>
            <div className="p-2">
              if the statement agrees with the information
            </div>
            <div className="bg-gray-100 p-2 font-bold">FALSE.</div>
            <div className="p-2">
              if the statement contradicts the information
            </div>
            <div className="bg-gray-100 p-2 font-bold">NOT GIVEN.</div>
            <div className="p-2">if there is no information on this</div>
          </div>
        </div>
      );
    })(),
    "multiple-choice": (() => {
      const group = groupedQuestions["multiple-choice"];
      if (!group || group.length === 0) return null;
      const startId = group[0].id;
      const endId = group[group.length - 1].id;
      return (
        <div className="mb-4">
          <h2 className="text-indigo-700 font-bold text-xl">
            Questions {startId}–{endId}
          </h2>
          <p>Choose the correct answer.</p>
          <p>
            Write the correct letter in boxes{" "}
            <span className="font-semibold">
              {startId}–{endId}
            </span>{" "}
            on your answer sheet.
          </p>
        </div>
      );
    })(),
    input: (() => {
      const group = groupedQuestions["input"];
      if (!group || group.length === 0) return null;
      const startId = group[0].id;
      const endId = group[group.length - 1].id;
      return (
        <div className="mb-4">
          <h2 className="text-indigo-700 font-bold text-xl">
            Questions {startId}–{endId}
          </h2>
          <p>Complete the summary below.</p>
          <p>
            Choose{" "}
            <span className="text-red-500 font-semibold">
              ONE WORD AND/OR A NUMBER
            </span>{" "}
            from the passage for each answer.
          </p>
          <p>
            Write your answers in boxes{" "}
            <span className="font-semibold">
              {startId}–{endId}
            </span>{" "}
            on your answer sheet.
          </p>
        </div>
      );
    })(),
  };

  const renderedSectionTitles = new Set<string>();
  const renderedSubSectionTitles = new Set<string>();

  return (
    <div className="p-4 h-full overflow-y-auto bg-white rounded space-y-8">
      {isLoading
        ? Array(5)
            .fill(0)
            .map((_, idx) => (
              <Skeleton.Input key={idx} active className="h-24 w-full" />
            ))
        : Object.entries(groupedQuestions)
            .sort(([, aGroup], [, bGroup]) => {
              const aStart = aGroup?.[0]?.id ?? Infinity;
              const bStart = bGroup?.[0]?.id ?? Infinity;
              return aStart - bStart;
            })
            .map(([type, group]) => (
              <div key={type} className="space-y-4">
                {questionInstructions[type]}
                {group
                  .filter((q) => q.question.trim() !== "{{paragraph}}")
                  .map((q) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {q.sectionTitle &&
                        !renderedSectionTitles.has(q.sectionTitle) && (
                          <h3 className="text-base font-bold mt-6">
                            {renderedSectionTitles.add(q.sectionTitle) &&
                              q.sectionTitle}
                          </h3>
                        )}
                      {q.subSectionTitle &&
                        !renderedSubSectionTitles.has(q.subSectionTitle) && (
                          <h4 className="text-sm font-semibold text-gray-700 mt-2">
                            {renderedSubSectionTitles.add(q.subSectionTitle) &&
                              q.subSectionTitle}
                          </h4>
                        )}

                      <Card
                        className="shadow"
                        onMouseEnter={() => {
                          if (isSubmitted && isReviewing) {
                            setHighlightedSentence(q.highlightSentence);
                          }
                        }}
                        onMouseLeave={() => {
                          if (isSubmitted && isReviewing) {
                            setHighlightedSentence(null);
                          }
                        }}
                      >
                        {q.questionType === "input" &&
                        q.question.includes("{{") ? (
                          <p className="mt-2 text-base text-gray-800 leading-7">
                            {q.question.split(/({{\d+}})/g).map((part, idx) => {
                              const match = part.match(/{{(\d+)}}/);
                              if (match) {
                                const id = parseInt(match[1], 10);
                                const userAnswer = answers[id] || "";
                                const blankQuestion = questions.find(
                                  (qq) => qq.id === id
                                );
                                const correctAnswer =
                                  blankQuestion?.correctAnswer || "";
                                const isCorrect =
                                  isSubmitted &&
                                  isReviewing &&
                                  userAnswer.trim().toLowerCase() ===
                                    correctAnswer.trim().toLowerCase();
                                const isWrong =
                                  isSubmitted &&
                                  isReviewing &&
                                  userAnswer &&
                                  userAnswer.trim().toLowerCase() !==
                                    correctAnswer.trim().toLowerCase();
                                return (
                                  <span
                                    key={id}
                                    className="inline-block align-middle"
                                  >
                                    <Input
                                      value={userAnswer}
                                      onChange={(e) =>
                                        handleAnswer(id, e.target.value)
                                      }
                                      disabled={isSubmitted && !isReviewing}
                                      placeholder={String(id)}
                                      className={`mx-2 text-center font-semibold !w-24 !inline-block !align-middle ${
                                        isCorrect
                                          ? "!border-green-600 !bg-green-100 !text-green-800"
                                          : ""
                                      } ${
                                        isWrong
                                          ? "!border-red-600 !bg-red-100 !text-red-800"
                                          : ""
                                      }`}
                                      style={{
                                        borderColor: isCorrect
                                          ? "#16a34a"
                                          : isWrong
                                          ? "#dc2626"
                                          : undefined,
                                        backgroundColor: isCorrect
                                          ? "#bbf7d0"
                                          : isWrong
                                          ? "#fecaca"
                                          : undefined,
                                        color: isCorrect
                                          ? "#166534"
                                          : isWrong
                                          ? "#991b1b"
                                          : undefined,
                                        fontWeight: 600,
                                      }}
                                    />
                                    {isCorrect && (
                                      <FaCheckCircle className="inline ml-1 text-green-500" />
                                    )}
                                    {isWrong && (
                                      <FaTimesCircle className="inline ml-1 text-red-500" />
                                    )}
                                  </span>
                                );
                              }
                              return <span key={idx}>{part}</span>;
                            })}
                          </p>
                        ) : (
                          <p className="font-semibold mb-2">
                            {q.id}. {q.question}
                          </p>
                        )}

                        {q.questionType === "multiple-choice" && (
                          <div className="flex flex-col gap-2">
                            {q.options?.map((option, idx) => {
                              const isSelected = answers[q.id] === option;
                              const isCorrect = option === q.correctAnswer;
                              const showCorrect =
                                isSubmitted && isReviewing && isCorrect;
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
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
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
                            {/* Đáp án đúng */}
                            {isSubmitted && isReviewing && (
                              <div className="mt-2 flex items-center gap-2 text-green-700 font-semibold">
                                <FaCheckCircle className="text-green-500" />
                                Đáp án đúng: <span>{q.correctAnswer}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {q.questionType === "select" && (
                          <Select
                            value={answers[q.id]}
                            onChange={(value) => handleAnswer(q.id, value)}
                            className="mt-2 min-w-[180px] max-w-[260px]"
                            style={{ width: 220 }}
                            placeholder="Choose an option"
                            disabled={isSubmitted && !isReviewing}
                          >
                            {q.options?.map((option, idx) => (
                              <Option key={idx} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        )}

                        {q.questionType === "input" &&
                          q.question.includes("{}") &&
                          !(q.id >= 1 && q.id <= 14) && (
                            <p className="mt-2 text-base text-gray-800 leading-7">
                              {q.question.split("{}").map((part, idx, arr) => (
                                <React.Fragment key={idx}>
                                  <span>{part}</span>
                                  {idx < arr.length - 1 && (
                                    <Input
                                      value={answers[q.id]}
                                      onChange={(e) =>
                                        handleAnswer(q.id, e.target.value)
                                      }
                                      disabled={isSubmitted && !isReviewing}
                                      className="mx-1 text-center font-semibold"
                                      style={{
                                        width: 90,
                                        display: "inline-block",
                                        verticalAlign: "middle",
                                      }}
                                      placeholder={String(q.id)}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </p>
                          )}

                        {q.questionType === "true-false-notgiven" && (
                          <>
                            <Radio.Group
                              onChange={(e) =>
                                handleAnswer(q.id, e.target.value)
                              }
                              value={answers[q.id]}
                              className="mt-2 !flex !flex-row !gap-4"
                              disabled={isSubmitted && !isReviewing}
                            >
                              {["True", "False", "Not Given"].map((option) => {
                                const isSelected = answers[q.id] === option;
                                const isCorrect = option === q.correctAnswer;
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
                                  <Radio.Button
                                    key={option}
                                    value={option}
                                    className={`!w-28 !h-12 !flex !items-center !justify-center !text-base !font-semibold !border-2 !mx-1 !rounded-md !py-0 !px-4 !leading-none
                                      ${
                                        showCorrect
                                          ? "!border-green-600 !bg-green-500 !text-white"
                                          : ""
                                      }
                                      ${
                                        showWrong
                                          ? "!border-red-600 !bg-red-500 !text-white"
                                          : ""
                                      }
                                    `}
                                    style={{
                                      borderColor: showCorrect
                                        ? "#16a34a"
                                        : showWrong
                                        ? "#dc2626"
                                        : undefined,
                                      backgroundColor: showCorrect
                                        ? "#22c55e"
                                        : showWrong
                                        ? "#ef4444"
                                        : undefined,
                                      color:
                                        showCorrect || showWrong
                                          ? "#fff"
                                          : undefined,
                                      padding: 0,
                                      lineHeight: 1,
                                    }}
                                  >
                                    {option}
                                    {showCorrect && (
                                      <FaCheckCircle className="inline ml-2 text-green-200" />
                                    )}
                                    {showWrong && (
                                      <FaTimesCircle className="inline ml-2 text-red-200" />
                                    )}
                                  </Radio.Button>
                                );
                              })}
                            </Radio.Group>
                            {/* Đáp án đúng/sai */}
                            {isSubmitted && isReviewing && (
                              <div
                                className={`mt-2 flex items-center gap-2 font-semibold ${
                                  answers[q.id] === q.correctAnswer
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                              >
                                {answers[q.id] === q.correctAnswer ? (
                                  <FaCheckCircle className="text-green-500" />
                                ) : (
                                  <FaTimesCircle className="text-red-500" />
                                )}
                                Đáp án{" "}
                                {answers[q.id] === q.correctAnswer
                                  ? "đúng"
                                  : "của bạn đã sai, đáp án đúng"}
                                : <span>{q.correctAnswer}</span>
                              </div>
                            )}
                          </>
                        )}

                        {isSubmitted && isReviewing && (
                          <div className="mt-8">
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-gray-600 font-bold"
                            >
                              💡 Giải thích: {q.explanation}
                            </motion.p>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
              </div>
            ))}
    </div>
  );
};

export default QuestionList;
