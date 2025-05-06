import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Card, Button, Select, Input, Radio, Skeleton } from "antd";

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
}) => {
  const groupedQuestions = questions.reduce<Record<string, Question[]>>(
    (acc, q) => {
      acc[q.questionType] = acc[q.questionType] || [];
      acc[q.questionType].push(q);
      return acc;
    },
    {}
  );

  const renderInterpolatedTextWithInputs = (text: string) => {
    const parts = text.split(/({{\d+}})/g); // Tách thành chuỗi và placeholder

    return parts.map((part, idx) => {
      const match = part.match(/{{(\d+)}}/);
      if (match) {
        const inputId = parseInt(match[1]);
        return (
          <Input
            key={`input-${idx}`}
            value={answers[inputId] || ""}
            onChange={(e) => handleAnswer(inputId, e.target.value)}
            placeholder={match[1]}
            disabled={isSubmitted && !isReviewing}
            className="mx-1 w-[80px] text-center"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        );
      }
      return (
        <span key={`text-${idx}`} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  const questionInstructions: Record<string, JSX.Element> = {
    "true-false-notgiven": (
      <div className="mb-4">
        <h2 className="text-indigo-700 font-bold text-xl">
          Questions {groupedQuestions["true-false-notgiven"]?.[0].id}–
          {groupedQuestions["true-false-notgiven"]?.at(-1)?.id}
        </h2>
        <p className="text-gray-800">
          Do the following statements agree with the information given in
          Reading Passage?
        </p>
        <p>
          In boxes{" "}
          <span className="font-semibold">
            {groupedQuestions["true-false-notgiven"]?.[0].id}–
            {groupedQuestions["true-false-notgiven"]?.at(-1)?.id}
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
    ),
    "multiple-choice": (
      <div className="mb-4">
        <h2 className="text-indigo-700 font-bold text-xl">
          Questions {groupedQuestions["multiple-choice"]?.[0].id}–
          {groupedQuestions["multiple-choice"]?.at(-1)?.id}
        </h2>
        <p>Choose the correct answer.</p>
        <p>
          Write the correct letter in boxes{" "}
          <span className="font-semibold">
            {groupedQuestions["multiple-choice"]?.[0].id}–
            {groupedQuestions["multiple-choice"]?.at(-1)?.id}
          </span>{" "}
          on your answer sheet.
        </p>
      </div>
    ),
    input: (
      <div className="mb-4">
        <h2 className="text-indigo-700 font-bold text-xl">
          Questions {groupedQuestions["input"]?.[0].id}–
          {groupedQuestions["input"]?.at(-1)?.id}
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
            {groupedQuestions["input"]?.[0].id}–
            {groupedQuestions["input"]?.at(-1)?.id}
          </span>{" "}
          on your answer sheet.
        </p>
      </div>
    ),
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
        : Object.entries(groupedQuestions).map(([type, group]) => (
            <div key={type} className="space-y-4">
              {questionInstructions[type]}

              {/* Handle paragraph-based input (Part 1) */}
              {type === "input" &&
              group[0].question.includes("{{paragraph}}") ? (
                <Card className="shadow">
                  <p className="text-base leading-8">
                    {group[0].question.split(/({{\d+}})/g).map((part, idx) => {
                      const match = part.match(/{{(\d+)}}/);
                      if (match) {
                        const id = parseInt(match[1], 10);
                        return (
                          <Input
                            key={id}
                            value={answers[id] || ""}
                            onChange={(e) => handleAnswer(id, e.target.value)}
                            disabled={isSubmitted && !isReviewing}
                            placeholder={String(id)}
                            className="mx-2 inline-block text-center font-semibold"
                            style={{
                              width: 90,
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          />
                        );
                      }
                      return <span key={idx}>{part}</span>;
                    })}
                  </p>
                </Card>
              ) : (
                group.map((q) => (
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
                      {q.questionType === "input" && q.id >= 9 && q.id <= 14 ? (
                        q.question.includes("{}") ? null : (
                          <p className="mt-2 text-base text-gray-800 leading-7">
                            {q.question
                              .split(/({{\d+}})/g)
                              .map((part, idx, arr) => {
                                const match = part.match(/{{(\d+)}}/);
                                if (match) {
                                  const id = parseInt(match[1]);
                                  return (
                                    <Input
                                      key={`input-${id}`}
                                      value={answers[id] || ""}
                                      onChange={(e) =>
                                        handleAnswer(id, e.target.value)
                                      }
                                      disabled={isSubmitted && !isReviewing}
                                      placeholder={String(id)}
                                      className="mx-1 text-center font-semibold"
                                      style={{
                                        width: 90,
                                        display: "inline-block",
                                        verticalAlign: "middle",
                                      }}
                                    />
                                  );
                                }
                                return (
                                  <span
                                    key={`text-${idx}`}
                                    className="whitespace-pre-wrap"
                                  >
                                    {part}
                                  </span>
                                );
                              })}
                          </p>
                        )
                      ) : q.questionType === "input" &&
                        q.question.includes("{}") ? null : (
                        <p className="font-semibold mb-2">
                          {q.id}. {q.question}
                        </p>
                      )}

                      {q.questionType === "multiple-choice" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options?.map((option, idx) => {
                            const isSelected = answers[q.id] === option;
                            const isCorrect = option === q.correctAnswer;
                            const showCorrect = isSubmitted && isCorrect;
                            const showWrong =
                              isSubmitted && isSelected && !isCorrect;
                            return (
                              <Button
                                key={idx}
                                type={isSelected ? "primary" : "default"}
                                className={`w-full text-left whitespace-pre-wrap break-words min-h-[56px] px-4 py-2 rounded-md ${
                                  showCorrect ? "border-green-500" : ""
                                } ${showWrong ? "border-red-500" : ""}`}
                                style={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                                onClick={() => handleAnswer(q.id, option)}
                                disabled={isSubmitted && !isReviewing}
                              >
                                <span className="inline-block w-full">
                                  {option}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      )}

                      {q.questionType === "select" && (
                        <Select
                          value={answers[q.id]}
                          onChange={(value) => handleAnswer(q.id, value)}
                          className="w-full mt-2"
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

                      {q.questionType === "true-false-notgiven" && (
                        <Radio.Group
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          value={answers[q.id]}
                          className="mt-2"
                          disabled={isSubmitted && !isReviewing}
                        >
                          <Radio.Button value="True">True</Radio.Button>
                          <Radio.Button value="False">False</Radio.Button>
                          <Radio.Button value="Not Given">
                            Not Given
                          </Radio.Button>
                        </Radio.Group>
                      )}

                      {isSubmitted && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-gray-600 mt-2"
                        >
                          💡 Giải thích: {q.explanation}
                        </motion.p>
                      )}
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          ))}
    </div>
  );
};

export default QuestionList;
