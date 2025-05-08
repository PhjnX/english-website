import React, { useEffect, useRef, useState } from "react";
import { Tabs, Progress, Button } from "antd";
import Split from "react-split";
import { useNavigate } from "react-router-dom";
import { parts } from "../../../data/readingTestData";
import Paragraph from "./Paragraph";
import Question from "./Question";
import { motion, AnimatePresence } from "framer-motion";
export interface Answers {
  [key: number]: string;
}

const ReadingTestPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [highlightedSentence, setHighlightedSentence] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState("1");
  const [prevKey, setPrevKey] = useState("1");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(loadData);
  }, []);

  useEffect(() => {
    if (!isSubmitted) {
      timerRef.current = setInterval(
        () => setTimeLeft((prev) => prev - 1),
        1000
      );
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
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
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
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

    navigate("/reading-score", {
      state: {
        answers,
        score,
        band,
        timeSpent: 60 * 60 - timeLeft,
        isSubmitted: true,
        questions: parts.flatMap((p) => p.questions),
      },
    });
  };

  const handleTabChange = (key: string) => {
    setPrevKey(activeKey);
    setActiveKey(key);
  };

  return (
    <div className="p-0 max-w-[1440px] mx-auto h-screen flex flex-col overflow-hidden bg-gradient-to-br from-white to-gray-100 text-gray-800 font-inter">
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          📘 IELTS Reading Test
        </h1>
        <div className="flex items-center gap-4">
          <Progress
            type="circle"
            percent={(timeLeft / (60 * 60)) * 100}
            format={() => formatTime(timeLeft)}
            width={70}
            strokeColor={timeLeft <= 300 ? "#ef4444" : "#3b82f6"}
            trailColor="#e5e7eb"
          />
          <Button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white font-medium shadow"
            disabled={isSubmitted}
          >
            ✅ Submit
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        className="flex-grow overflow-hidden px-6 pt-2"
        tabBarGutter={24}
        tabBarStyle={{ fontWeight: 600 }}
      >
        {parts.map((part) => (
          <Tabs.TabPane
            tab={
              <span className="text-gray-700">
                Part {part.partId}: {part.title}
              </span>
            }
            key={part.partId.toString()}
            className="rounded"
          >
            <AnimatePresence mode="wait">
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
                className="h-[calc(100vh-160px)] overflow-hidden rounded"
              >
                <Split
                  className="flex h-full bg-white rounded shadow-md"
                  sizes={[50, 50]}
                  minSize={300}
                  gutterSize={10}
                  gutter={() => {
                    const gutter = document.createElement("div");
                    gutter.className =
                      "bg-gray-300 hover:bg-blue-400 transition-all duration-200 cursor-col-resize";
                    return gutter;
                  }}
                >
                  <motion.div
                    key={`para-${activeKey}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-blue-300"
                  >
                    <Paragraph
                      partId={part.partId}
                      highlightedSentence={
                        isSubmitted ? highlightedSentence : null
                      }
                      setHighlightedSentence={setHighlightedSentence}
                      isLoading={isLoading}
                      questionStart={part.questions[0]?.id}
                      questionEnd={
                        part.questions[part.questions.length - 1]?.id
                      }
                    />
                  </motion.div>
                  <motion.div
                    key={`ques-${activeKey}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-green-300"
                  >
                    <Question
                      questions={part.questions}
                      answers={answers}
                      handleAnswer={handleAnswer}
                      isSubmitted={isSubmitted}
                      setHighlightedSentence={setHighlightedSentence}
                      highlightedSentence={highlightedSentence}
                      isLoading={isLoading}
                      partId={part.partId}
                    />
                  </motion.div>
                </Split>
              </motion.div>
            </AnimatePresence>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ReadingTestPage;
