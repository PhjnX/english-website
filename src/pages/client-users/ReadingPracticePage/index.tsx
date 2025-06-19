import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Paragraph from "./Paragraph";
import QuestionList from "./Question";
import { motion, AnimatePresence } from "framer-motion";
import testGif from "../../../assets/testGif.gif";
import hourglassgif from "../../../assets/hourglass.gif";
import { getReadingTestByLevelAndNumber } from "../../../apis/reading-api";
import { Assessment, Part } from "./reading";

export interface Answers {
  [key: number]: string;
}

const ReadingPracticePage: React.FC = () => {
  const { level, readingNum } = useParams<{
    level: string;
    readingNum: string;
  }>();
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
  const [readingTitle, setReadingTitle] = useState<string>("");
  const [totalQuestions, setTotalQuestions] = useState<number>(40);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    if (level && readingNum) {
      // Extract number from readingNum (e.g., "reading1" -> "1")
      const readingNumber = readingNum.replace(/\D/g, "") || "1";
      console.log("Fetching reading test:", { level, readingNumber });
      getReadingTestByLevelAndNumber(level, readingNumber)
        .then((data: Assessment) => {
          console.log("API Response:", data);
          if (data && data.parts && data.parts.length > 0) {
            setParts(data.parts);
            setActiveKey(data.parts[0]?.id?.toString() || "1");
            setReadingTitle(data.name || "");
            // Tính tổng số câu thực tế
            const total = data.parts.reduce(
              (sum, part) =>
                sum +
                part.groups.reduce(
                  (gSum, g) => gSum + (g.questions?.length || 0),
                  0
                ),
              0
            );
            setTotalQuestions(total > 0 ? total : 40);
          } else {
            console.warn("No parts found in response:", data);
            setParts([]);
            setReadingTitle(`Reading ${readingNum}`);
            setTotalQuestions(40);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reading test:", error);
          setParts([]);
          setReadingTitle(`Reading ${readingNum}`);
          setTotalQuestions(40);
          setIsLoading(false);
        });
    }
  }, [level, readingNum]);

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

  const handleAnswer = (id: string | number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: answer,
    }));
  };

  // Hàm normalize CHUẨN cho mọi so sánh đáp án
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

  const calculateScore = () => {
    let score = 0;
    parts.forEach((part) => {
      part.groups.forEach((group) => {
        group.questions.forEach((q) => {
          // MULTIPLE CHOICE
          if (q.type === "multiple-choice") {
            let correctAnswers = [];
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

            const userAnswer = normalize(answers[q.id]);
            if (userAnswer && correctAnswers.includes(userAnswer)) {
              score++;
            }
          }

          // TRUE/FALSE/NOTGIVEN
          else if (q.type === "true-false-notgiven") {
            let correctAnswers = [];
            if (Array.isArray(q.correctAnswer)) {
              correctAnswers = q.correctAnswer.map(normalizeTFNG);
            } else if (typeof q.correctAnswer === "string") {
              correctAnswers = [normalizeTFNG(q.correctAnswer)];
            } else {
              correctAnswers = [normalizeTFNG(q.correctAnswer)];
            }

            const userAnswer = normalizeTFNG(answers[q.id]);
            // console.log({
            //   userRaw: answers[q.id],
            //   user: normalizeTFNG(answers[q.id]),
            //   correctRaw: q.correctAnswer,
            //   correct: correctAnswers,
            // });
            if (userAnswer && correctAnswers.includes(userAnswer)) {
              score++;
            }
          }

          // GAP-FILL / PARAGRAPH
          else if (q.type === "gap-fill" || q.type === "paragraph") {
            let corrects = [];
            if (Array.isArray(q.correctAnswer)) {
              corrects = q.correctAnswer.map(normalize);
            } else if (typeof q.correctAnswer === "string") {
              try {
                const arr = JSON.parse(q.correctAnswer);
                if (Array.isArray(arr)) corrects = arr.map(normalize);
                else corrects = [normalize(q.correctAnswer)];
              } catch {
                corrects = [normalize(q.correctAnswer)];
              }
            } else {
              corrects = [normalize(q.correctAnswer)];
            }
            for (let idx = 0; idx < corrects.length; idx++) {
              const userAnswer = normalize(answers[`${q.id}_${idx}`]);
              const correct = normalize(corrects[idx]);
              if (userAnswer && userAnswer === correct) {
                score++;
              }
            }
          }

          // MATCHING
          else if (q.type === "matching") {
            let corrects = [];
            if (Array.isArray(q.correctAnswer)) {
              corrects = q.correctAnswer.map(normalize);
            } else if (typeof q.correctAnswer === "string") {
              try {
                const arr = JSON.parse(q.correctAnswer);
                if (Array.isArray(arr)) corrects = arr.map(normalize);
                else corrects = [normalize(q.correctAnswer)];
              } catch {
                corrects = [normalize(q.correctAnswer)];
              }
            } else {
              corrects = [normalize(q.correctAnswer)];
            }
            for (let idx = 0; idx < corrects.length; idx++) {
              const userAnswer = normalize(answers[`${q.id}_${idx}`]);
              if (userAnswer && userAnswer === corrects[idx]) {
                score++;
              }
            }
          }
        });
      });
    });
    return score;
  };

  const convertScoreToBand = (score: number): number | string => {
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

  const bandToLevel = (band: number | string): number => {
    if (band === "Below 3.0") return 1; // Dưới 3.0 luôn là level 1
    if (typeof band !== "number") return 1; // Trường hợp nếu band lỗi, vẫn là 1
    if (band >= 5.5) return 6;
    if (band >= 5.0) return 5;
    if (band >= 4.5) return 4;
    if (band >= 4.0) return 3;
    if (band >= 3.5) return 2;
    if (band >= 3.0) return 1;
    return 1; // fallback, trường hợp ngoài ý muốn vẫn trả về level 1
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const score = calculateScore();
    const band = convertScoreToBand(score);
    const levelNum = bandToLevel(band);

    const completed = JSON.parse(
      localStorage.getItem("reading_completed") || "[]"
    );
    const newResult = {
      readingId: `${level}_${readingNum}`,
      readingNum: Number((readingNum || "1").replace(/\D/g, "")),
      title: readingTitle,
      level: Number(level),
      score,
      total: totalQuestions,
      submittedAt: new Date().toISOString(),
    };

    // Xoá bản cũ (nếu có) rồi push mới
    const updated = [
      ...completed.filter((x: any) => x.readingId !== newResult.readingId),
      newResult,
    ];
    localStorage.setItem("reading_completed", JSON.stringify(updated));
    // --------------------------------------

    // Tiếp tục như cũ (lưu kết quả tạm cho trang kết quả)
    const resultData = {
      answers,
      score,
      band: String(band),
      level: String(levelNum),
      timeSpent: 60 * 60 - timeLeft,
      isSubmitted: true,
      questions: [],
      parts,
      testLevel: levelNum,
      readingNum,
    };
    localStorage.setItem("reading_practice_result", JSON.stringify(resultData));
    navigate(`/reading-practice-score/${levelNum}/${readingNum}`, {
      state: resultData,
    });
  };

  const handleTabChange = (key: string) => {
    setPrevKey(activeKey);
    setActiveKey(key);
  };

  // Custom Tab UI
  const renderTabs = () => (
    <div
      className="flex flex-wrap gap-2 md:gap-4 px-2 md:px-6 pt-3 pb-1"
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
      className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#e0e7ef] text-black font-inter"
      style={{ fontFamily: "beVietnamProFont, sans-serif" }}
    >
      {/* Header */}
      <header
        className="relative z-10 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-5 bg-gradient-to-r from-[#fad0c4] to-[#ffd1ff] shadow-xl border-b border-gray-200 rounded-b-3xl gap-4 drop-shadow-lg"
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
            READING PRACTICE
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
                className={
                  "flex-1 flex flex-col overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white via-purple-50 to-purple-100 border border-purple-200 my-0"
                }
              >
                <div className="flex flex-col md:flex-row flex-1 h-full bg-transparent rounded-xl overflow-hidden">
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

export default ReadingPracticePage;
