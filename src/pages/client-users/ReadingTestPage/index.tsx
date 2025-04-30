"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Tabs,
  Modal,
  Progress,
  Card,
  Skeleton,
  Select,
  Input,
  Radio,
  Flex,
  Splitter,
} from "antd";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { parts } from "../../../data/readingTestData";

const { TabPane } = Tabs;
const { Option } = Select;

interface Answers {
  [key: number]: string;
}

const ReadingTest: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedSentence, setHighlightedSentence] = useState<string | null>(
    null
  );
  const [splitSizes, setSplitSizes] = useState<(string | number)[]>([
    "50%",
    "50%",
  ]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const loadData = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(loadData);
  }, []);

  useEffect(() => {
    if (isSubmitted && timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!isSubmitted) {
      timerRef.current = setInterval(
        () => setTimeLeft((prev) => prev - 1),
        1000
      );
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted]);

  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  const handleAnswer = (questionId: number, option: string) => {
    if (!isSubmitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: option,
      }));
    }
  };

  const calculateScore = () => {
    let score = 0;
    parts.forEach((part) => {
      part.questions.forEach((q) => {
        if (
          answers[q.id]?.trim().toLowerCase() ===
          q.correctAnswer.trim().toLowerCase()
        ) {
          score++;
        }
      });
    });
    return score;
  };

  const convertScoreToBand = (score: number) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    if (score >= 15) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    if (score >= 8) return 3.5;
    if (score >= 6) return 3.0;
    return "Below 3.0";
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const score = calculateScore();
    const band = convertScoreToBand(score);
    Modal.success({
      title: "🎉 Chúc mừng bạn đã hoàn thành bài kiểm tra!",
      content: (
        <div className="space-y-2">
          <p>✅ Số câu đúng: {score}/40 câu</p>
          <p>🏆 Band ước lượng: {band}</p>
        </div>
      ),
      okText: "Tuyệt vời!",
    });
  };

  return (
    <div className="p-4 max-w-[1440px] mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">IELTS Reading Practice Test</h1>
        <div className="flex items-center gap-4">
          <Progress
            type="circle"
            percent={(timeLeft / (60 * 60)) * 100}
            format={() => formatTime(timeLeft)}
            width={80}
            status={timeLeft <= 300 ? "exception" : "normal"}
          />
          <Button
            onClick={handleSubmit}
            type="primary"
            danger
            disabled={isSubmitted}
          >
            Nộp bài
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="1" className="flex-grow">
        {parts.map((part) => (
          <TabPane tab={part.title} key={part.partId.toString()}>
            {/* Mobile Layout */}
            {isMobile ? (
              <div className="flex flex-col gap-6">
                {/* Passage */}
                <div className="h-full p-4 bg-white overflow-y-auto rounded shadow">
                  <h2 className="text-lg font-semibold mb-4">Đoạn văn</h2>
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 10 }} />
                  ) : (
                    <div className="text-gray-700 whitespace-pre-line text-justify leading-relaxed">
                      {part.passage.split("\n").map((line, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`mb-3 ${
                            highlightedSentence === line.trim()
                              ? "bg-yellow-200 px-2 rounded"
                              : ""
                          }`}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Questions */}
                <div className="h-full p-4 bg-white overflow-y-auto rounded shadow space-y-6">
                  {isLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, idx) => (
                          <Skeleton.Input
                            key={idx}
                            active
                            className="h-24 w-full"
                          />
                        ))
                    : part.questions.map((q) => (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Card
                            className="shadow"
                            onMouseEnter={() =>
                              setHighlightedSentence(q.highlightSentence)
                            }
                            onMouseLeave={() => setHighlightedSentence(null)}
                          >
                            <p className="font-semibold mb-2">
                              {q.id}. {q.question}
                            </p>
                            {/* Render by questionType */}
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
                                      className={`w-full ${
                                        showCorrect ? "border-green-500" : ""
                                      } ${showWrong ? "border-red-500" : ""}`}
                                      onClick={() => handleAnswer(q.id, option)}
                                    >
                                      {option}
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
                                placeholder="Chọn đáp án"
                                disabled={isSubmitted}
                              >
                                {q.options?.map((option, idx) => (
                                  <Option key={idx} value={option}>
                                    {option}
                                  </Option>
                                ))}
                              </Select>
                            )}
                            {q.questionType === "input" && (
                              <Input
                                placeholder="Nhập câu trả lời"
                                value={answers[q.id]}
                                onChange={(e) =>
                                  handleAnswer(q.id, e.target.value)
                                }
                                disabled={isSubmitted}
                                className="mt-2"
                              />
                            )}
                            {q.questionType === "true-false-notgiven" && (
                              <Radio.Group
                                onChange={(e) =>
                                  handleAnswer(q.id, e.target.value)
                                }
                                value={answers[q.id]}
                                className="mt-2"
                                disabled={isSubmitted}
                              >
                                <Radio.Button value="True">True</Radio.Button>
                                <Radio.Button value="False">False</Radio.Button>
                                <Radio.Button value="Not Given">
                                  Not Given
                                </Radio.Button>
                              </Radio.Group>
                            )}
                            {/* Explanation */}
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
                      ))}
                </div>
              </div>
            ) : (
              <Splitter
                style={{
                  height: "75vh",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
                onResize={setSplitSizes}
              >
                {/* Left: Passage */}
                <Splitter.Panel size={splitSizes[0]}>
                  <div className="p-4 h-full overflow-y-auto bg-white rounded">
                    <h2 className="text-lg font-semibold mb-4">Đoạn văn</h2>
                    {isLoading ? (
                      <Skeleton active paragraph={{ rows: 10 }} />
                    ) : (
                      <div className="text-gray-700 whitespace-pre-line text-justify leading-relaxed">
                        {part.passage.split("\n").map((line, idx) => (
                          <motion.p
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`mb-3 ${
                              highlightedSentence === line.trim()
                                ? "bg-yellow-200 px-2 rounded"
                                : ""
                            }`}
                          >
                            {line}
                          </motion.p>
                        ))}
                      </div>
                    )}
                  </div>
                </Splitter.Panel>

                {/* Right: Questions */}
                <Splitter.Panel size={splitSizes[1]}>
                  <div className="p-4 h-full overflow-y-auto bg-white rounded space-y-6">
                    {isLoading
                      ? Array(5)
                          .fill(0)
                          .map((_, idx) => (
                            <Skeleton.Input
                              key={idx}
                              active
                              className="h-24 w-full"
                            />
                          ))
                      : part.questions.map((q) => (
                          <motion.div
                            key={q.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Card
                              className="shadow"
                              onMouseEnter={() =>
                                setHighlightedSentence(q.highlightSentence)
                              }
                              onMouseLeave={() => setHighlightedSentence(null)}
                            >
                              <p className="font-semibold mb-2">
                                {q.id}. {q.question}
                              </p>
                              {/* (Câu hỏi như mobile) */}
                              ...
                            </Card>
                          </motion.div>
                        ))}
                  </div>
                </Splitter.Panel>
              </Splitter>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ReadingTest;
