import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paragraph from "./Paragraph";
import QuestionList from "./Question";
import { motion, AnimatePresence } from "framer-motion";
import testGif from "../../../assets/testGif.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { getAllAssessments } from "../../../apis/assessment-api";
import { Assessment, Part } from "./reading";

export interface Answers {
  [key: number]: string;
}

const tabColors = [
  "from-blue-100 to-blue-50",
  "from-green-100 to-green-50",
  "from-yellow-100 to-yellow-50",
];

const ReadingTestPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [highlightedSentence, setHighlightedSentence] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState("1");
  const [prevKey, setPrevKey] = useState("1");
  const [parts, setParts] = useState<Part[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    getAllAssessments().then((all: Assessment[]) => {
      const data = all && all.length > 0 ? all[0] : null;
      if (data && data.parts) {
        setParts(data.parts);
        setActiveKey(data.parts[0]?.id?.toString() || "1");
      } else {
        setParts([]);
      }
      setIsLoading(false);
    });
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

  const handleAnswer = (id: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: answer,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    parts.forEach((part) => {
      part.groups.forEach((group) => {
        group.questions.forEach((q) => {
          const correctAnswers = Array.isArray(q.correctAnswer)
            ? q.correctAnswer.map((a) => a.trim().toLowerCase())
            : [q.correctAnswer.trim().toLowerCase()];
          if (
            answers[q.id] &&
            correctAnswers.includes(answers[q.id].trim().toLowerCase())
          ) {
            score++;
          }
        });
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
        questions: [],
      },
    });
  };

  const handleTabChange = (key: string) => {
    setPrevKey(activeKey);
    setActiveKey(key);
  };

  // Custom Tab UI
  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 md:gap-4 px-2 md:px-6 pt-4">
      {parts.map((part: Part) => (
        <motion.button
          key={part.id}
          onClick={() => handleTabChange(part.id.toString())}
          className={`px-4 py-2 rounded-full font-semibold shadow transition-all duration-200 text-base md:text-lg focus:outline-none border-1 cursor-pointer
            ${
              activeKey === part.id.toString()
                ? "bg-gradient-to-r from-[#EC6F66] to-[#F3A183] !text-white border-black "
                : "bg-gradient-to-r from-gray-100 to-gray-50 !text-gray-700 border-gray-300  hover:border-[#EC6F66]"
            }
          `}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.07 }}
        >
          Part {part.order || part.id}: {part.title}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="p-0 w-full  h-screen flex flex-col overflow-hidden bg-gradient-to-br from-white to-orange-50 text-gray-800 font-inter">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
        className="relative z-10 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-5 bg-[#FFDCDC] backdrop-blur-md shadow-xl border-b border-orange-200 rounded-b-3xl gap-4 drop-shadow-lg"
        style={{ boxShadow: "0 8px 32px 0 rgba(255, 183, 94, 0.15)" }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
            className="bg-gradient-to-tr from-[#FFD6A5] to-[#FFB085] rounded-full p-2 shadow-md"
          >
            <img
              src={testGif}
              alt="Test Icon"
              className="w-12 h-12 rounded-full object-cover"
            />
          </motion.div>
          <span
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-orange-700 font-sans select-none"
            style={{ letterSpacing: "0.02em" }}
          >
            IELTS Reading Test
          </span>
        </div>
        <div className="flex items-center gap-5">
          {/* Timer */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
            className="relative w-16 h-16 flex items-center justify-center"
          >
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#ffe5c2"
                strokeWidth="4"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={timeLeft <= 300 ? "#cf2411" : "#38b814"}
                strokeWidth="4"
                strokeDasharray={100}
                strokeDashoffset={100 - (timeLeft / (60 * 60)) * 100}
                initial={false}
                animate={{
                  strokeDashoffset: 100 - (timeLeft / (60 * 60)) * 100,
                }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <span
              className={`absolute text-base font-bold ${
                timeLeft <= 300 ? "text-orange-500" : "text-gray-800"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </motion.div>
          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl font-semibold shadow transition-all duration-200 text-white bg-gradient-to-r from-[#FFB347] to-[#FFD6A5] hover:from-[#FFA500] hover:to-[#FFD6A5] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-lg border-2 border-black backdrop-blur-md cursor-pointer flex items-center gap-2"
            disabled={isSubmitted}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.07 }}
          >
            <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
            <span>Submit</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Tabs */}
      {renderTabs()}

      {/* Tab Content */}
      <div className="flex-grow overflow-hidden px-0 md:px-6 pt-2">
        <AnimatePresence mode="wait">
          {parts.map((part: Part, idx: number) =>
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
                className={`h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] overflow-hidden rounded-xl shadow-lg bg-gradient-to-br ${
                  tabColors[idx % tabColors.length]
                } border border-gray-200 flex flex-col`}
              >
                <div className="flex flex-col md:flex-row h-full bg-transparent rounded-xl">
                  <motion.div
                    key={`para-${activeKey}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-blue-200 w-full md:w-1/2"
                  >
                    <Paragraph
                      title={part.title}
                      partId={part.id}
                      passage={part.content || ""}
                      image={undefined}
                      titleDescription={part.titleDescription ?? ""}
                      highlightedSentence={
                        isSubmitted ? highlightedSentence : null
                      }
                      headerContent={part.headerContent ?? ""}
                      setHighlightedSentence={setHighlightedSentence}
                      isLoading={isLoading}
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
                  </motion.div>
                  <motion.div
                    key={`ques-${activeKey}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-green-200 w-full md:w-1/2"
                  >
                    {/* Đặt log ở đây */}
                    {(() => {
                      const questionsOfPart =
                        part.groups?.flatMap((g: any) => g.questions) || [];
                      console.log(
                        `Part "${part.title}" (id: ${part.id}) - Số câu hỏi: ${questionsOfPart.length}`,
                        questionsOfPart
                      );
                      return (
                        <QuestionList
                          groups={part.groups || []}
                          answers={answers}
                          handleAnswer={handleAnswer}
                          isSubmitted={isSubmitted}
                          setHighlightedSentence={setHighlightedSentence}
                          highlightedSentence={highlightedSentence}
                          isLoading={isLoading}
                          partId={part.id}
                        />
                      );
                    })()}
                  </motion.div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReadingTestPage;
