import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { Button } from "antd";
import { LeftOutlined, RightOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const readingParts = [
  {
    title: "Part 1",
    passage: `Modern education has evolved significantly with the rise of technology. From online classes to interactive simulations, students now have more access to learning tools than ever before. This shift has allowed for personalized learning paths, better engagement, and improved outcomes in many cases.`,
    questions: [
      {
        id: 1,
        question: "What is the main idea of the passage?",
        options: ["A. Technology trends", "B. Climate change", "C. Education methods", "D. Space exploration"],
        correctAnswer: "C. Education methods",
        explanation: "Câu trả lời đúng là 'Education methods' vì đoạn văn nói về các phương pháp giáo dục hiện đại. Các lựa chọn khác không liên quan trực tiếp đến nội dung đoạn văn."
      },
      {
        id: 2,
        question: "Why is online learning considered effective?",
        options: ["A. It's cheaper", "B. Students can learn anytime", "C. It is fast", "D. Teachers prefer it"],
        correctAnswer: "B. Students can learn anytime",
        explanation: "Câu trả lời đúng là 'Students can learn anytime' vì đoạn văn nhấn mạnh sự linh hoạt trong việc học mọi lúc mọi nơi. Các lựa chọn khác không được đề cập hoặc không phải là lý do chính."
      }
    ]
  },
  {
    title: "Part 2",
    passage: `Global warming has been a topic of concern for decades. Human activities, especially the burning of fossil fuels, have led to increased levels of carbon dioxide in the atmosphere, trapping heat and causing the Earth's temperature to rise.`,
    questions: [
      {
        id: 1,
        question: "What causes global warming?",
        options: ["A. Natural weather", "B. Human activity", "C. Volcanoes", "D. Ocean currents"],
        correctAnswer: "B. Human activity",
        explanation: "Câu trả lời đúng là 'Human activity' vì đoạn văn nói rõ rằng hoạt động con người là nguyên nhân chính. Các đáp án khác không được nêu ra trong đoạn văn."
      },
      {
        id: 2,
        question: "What is the main greenhouse gas mentioned?",
        options: ["A. Oxygen", "B. Nitrogen", "C. Carbon dioxide", "D. Hydrogen"],
        correctAnswer: "C. Carbon dioxide",
        explanation: "Câu trả lời đúng là 'Carbon dioxide' vì đoạn văn đề cập rõ đây là loại khí giữ nhiệt gây hiện tượng nóng lên toàn cầu."
      }
    ]
  }
];

const totalTime = 10 * 60;

const ReadingTestPage: React.FC = () => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [partIdx: number]: { [qIdx: number]: string } }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentPartIndex]: {
        ...prev[currentPartIndex],
        [currentQuestionIndex]: answer
      }
    }));
  };

  const handlePartChange = (direction: "next" | "prev") => {
    const newIndex = direction === "next" ? currentPartIndex + 1 : currentPartIndex - 1;
    if (newIndex >= 0 && newIndex < readingParts.length) {
      setCurrentPartIndex(newIndex);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <motion.div
          className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-red-600">Reading Test</h2>
            <span className="text-gray-700 font-medium flex items-center gap-2">
              <ClockCircleOutlined className="text-lg" /> {formatTime(timeLeft)}
            </span>
          </div>

          {!isSubmitted ? (
            <>
              <motion.h3 className="text-xl font-semibold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {readingParts[currentPartIndex].title}
              </motion.h3>
              <motion.p className="text-gray-800 mb-6 whitespace-pre-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {readingParts[currentPartIndex].passage}
              </motion.p>

              <h4 className="text-lg font-medium mb-3">
                Question {currentQuestionIndex + 1} of {readingParts[currentPartIndex].questions.length}
              </h4>
              <p className="text-gray-700 mb-4">
                {readingParts[currentPartIndex].questions[currentQuestionIndex].question}
              </p>
              <ul className="space-y-3">
                {readingParts[currentPartIndex].questions[currentQuestionIndex].options.map((opt, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(opt)}
                    className={`p-3 rounded-md cursor-pointer border transition duration-300 ${
                      selectedAnswers[currentPartIndex]?.[currentQuestionIndex] === opt
                        ? "bg-red-100 border-red-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {opt}
                  </motion.li>
                ))}
              </ul>

              <div className="flex justify-between mt-6">
                <Button
                  type="default"
                  icon={<LeftOutlined />}
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Previous
                </Button>
                {currentQuestionIndex < readingParts[currentPartIndex].questions.length - 1 ? (
                  <Button
                    type="primary"
                    icon={<RightOutlined />}
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    danger
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="link"
                  icon={<LeftOutlined />}
                  disabled={currentPartIndex === 0}
                  onClick={() => handlePartChange("prev")}
                >
                  Previous Part
                </Button>
                <Button
                  type="link"
                  icon={<RightOutlined />}
                  disabled={currentPartIndex === readingParts.length - 1}
                  onClick={() => handlePartChange("next")}
                >
                  Next Part
                </Button>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mb-6">📝 Result Review</h3>
              {readingParts.map((part, partIdx) => (
                <div key={partIdx} className="mb-8">
                  <h4 className="text-lg font-semibold text-red-600 mb-2">{part.title}</h4>
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">{part.passage}</p>
                  <ul className="space-y-6">
                    {part.questions.map((q, qIdx) => {
                      const userAnswer = selectedAnswers[partIdx]?.[qIdx];
                      const isCorrect = userAnswer === q.correctAnswer;
                      return (
                        <motion.li
                          key={q.id}
                          className="p-4 bg-gray-50 border-l-4 rounded-md"
                          initial={{ opacity: 0, x: -40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: qIdx * 0.2 }}
                        >
                          <p className="font-medium text-gray-800">
                            {qIdx + 1}. {q.question}
                          </p>
                          <p className="mt-1 flex items-center gap-2">
                            Your answer: {" "}
                            <span
                              className={`font-semibold flex items-center gap-1 ${
                                isCorrect ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {userAnswer || "No answer"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-gray-700 mt-1">
                              ✅ Đáp án đúng: <strong>{q.correctAnswer}</strong>
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2 italic">
                            💡 {q.explanation}
                          </p>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default ReadingTestPage;
