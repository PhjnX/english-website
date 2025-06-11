import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paragraph from "./Paragraph";
import QuestionList from "./Question";
import { motion, AnimatePresence } from "framer-motion";
import testGif from "../../../assets/testGif.gif";
import hourglassgif from "../../../assets/hourglass.gif";
import { getAllAssessments } from "../../../apis/assessment-api";
import { Assessment, Part } from "./reading";

export interface Answers {
  [key: number]: string;
}

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
          // Parse correctAnswer nếu là JSON string hoặc mảng
          let correctAnswers: string[] = [];
          if (Array.isArray(q.correctAnswer)) {
            correctAnswers = q.correctAnswer.map((a: string) =>
              a.trim().toLowerCase()
            );
          } else if (typeof q.correctAnswer === "string") {
            try {
              const arr = JSON.parse(q.correctAnswer);
              if (Array.isArray(arr)) {
                correctAnswers = arr.map((a: string) => a.trim().toLowerCase());
              } else {
                correctAnswers = [q.correctAnswer.trim().toLowerCase()];
              }
            } catch {
              correctAnswers = [q.correctAnswer.trim().toLowerCase()];
            }
          }
          // Xác định key của answers: q.id (luôn là id thực tế của câu hỏi)
          const userAnswer = answers[q.id]?.trim().toLowerCase();
          if (userAnswer && correctAnswers.includes(userAnswer)) {
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

  // Hàm chuyển band sang level đúng như hình
  const bandToLevel = (band: number | string) => {
    if (typeof band !== "number") return null;
    if (band >= 6.0) return 6; // Level 6: 6.0 trở lên
    if (band >= 5.0) return 5; // Level 5: 5.0 - 5.5
    if (band >= 4.5) return 4; // Level 4: 4.5
    if (band >= 4.0) return 3; // Level 3: 4.0
    if (band >= 3.5) return 2; // Level 2: 3.5
    if (band >= 3.0) return 1; // Level 1: 3.0
    return null;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const score = calculateScore();
    const band = convertScoreToBand(score);
    // Gửi band và score lên API user
    const user_name = localStorage.getItem("user_name");
    if (user_name && typeof band === "number") {
      const level = bandToLevel(band);
      fetch(`/api/users/update-band-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name, band, score, level }),
      });
    }
    navigate("/reading-score", {
      state: {
        answers,
        score,
        band,
        timeSpent: 60 * 60 - timeLeft,
        isSubmitted: true,
        questions: [],
        parts,
      },
    });
  };

  const handleTabChange = (key: string) => {
    setPrevKey(activeKey);
    setActiveKey(key);
  };

  // Custom Tab UI
  const renderTabs = () => (
    <div
      className="flex flex-wrap gap-2 md:gap-4 px-2 md:px-6 pt-4"
      style={{ fontFamily: "beVietnamProFont, sans-serif" }}
    >
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
    <div
      className="p-0 w-full h-screen flex flex-col !overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#e0e7ef] text-black font-inter"
      style={{ fontFamily: "beVietnamProFont, sans-serif" }}
    >
      {/* Header */}
      <header
        className="relative z-10 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-6 bg-gradient-to-r from-[#fad0c4] to-[#ffd1ff] shadow-xl border-b border-gray-200 rounded-b-3xl gap-4 drop-shadow-lg"
        style={{ fontFamily: "beVietnamProFont, sans-serif" }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-400 via-purple-200 to-white rounded-full p-2 shadow-md">
            <img
              src={testGif}
              alt="Test Icon"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <span
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-500 font-sans select-none drop-shadow-md"
            style={{
              letterSpacing: "0.02em",
              fontFamily: "beVietnamProFont, sans-serif",
            }}
          >
            Reading Test
          </span>
        </div>
        <div className="flex items-center gap-5">
          <img
            src={hourglassgif}
            alt="Test Icon"
            className="w-12 h-12 rounded-full object-cover"
          />
          {/* Timer */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#a3a3a3"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={timeLeft <= 300 ? "#b0260e" : "#0dba3c"}
                strokeWidth="4"
                strokeDasharray={100}
                strokeDashoffset={100 - (timeLeft / (60 * 60)) * 100}
              />
            </svg>
            <span
              className={`absolute text-base font-bold ${
                timeLeft <= 300 ? "text-red-500" : "text-black"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            style={{
              backgroundImage:
                "linear-gradient(to right, #FEAC5E 0%, #C779D0 51%, #FEAC5E 100%)",
              margin: "10px",
              padding: "15px 45px",
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              transition: "background-position 0.5s, color 0.5s",
              backgroundSize: "200% auto",
              color: "white",
              boxShadow: "0 0 20px #eee",
              borderRadius: "10px",
              display: "block",
              border: "none",
              backgroundPosition: isSubmitted ? "right center" : "left center", // Ban đầu
              cursor: isSubmitted ? "not-allowed" : "pointer",
              opacity: isSubmitted ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitted)
                e.currentTarget.style.backgroundPosition = "right center";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitted)
                e.currentTarget.style.backgroundPosition = "left center";
            }}
          >
            Submit
          </button>
        </div>
      </header>

      {/* Tabs */}
      {renderTabs()}

      {/* Tab Content */}
      <div className="flex-grow overflow-hidden px-0 md:px-6 pt-2">
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
                className={`h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white via-purple-50 to-purple-100 border border-purple-200 flex flex-col`}
              >
                <div className="flex flex-col md:flex-row h-full bg-transparent rounded-xl">
                  <motion.div
                    key={`para-${activeKey}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-purple-200 w-full md:w-1/2"
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
                    className="overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-purple-200 w-full md:w-1/2"
                  >
                    {(() => {
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
