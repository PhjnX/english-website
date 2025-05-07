import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "antd";

const bandMapping = [
  { score: 39, band: 9 },
  { score: 37, band: 8.5 },
  { score: 35, band: 8 },
  { score: 33, band: 7.5 },
  { score: 30, band: 7 },
  { score: 27, band: 6.5 },
  { score: 23, band: 6 },
  { score: 19, band: 5.5 },
  { score: 15, band: 5 },
  { score: 13, band: 4.5 },
  { score: 10, band: 4 },
  { score: 8, band: 3.5 },
  { score: 6, band: 3 },
];

const getBand = (score: number) => {
  for (let i = 0; i < bandMapping.length; i++) {
    if (score >= bandMapping[i].score) return bandMapping[i].band;
  }
  return "Below 3";
};

const ReadingScore: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, timeSpent, answers } = location.state || {};
  const band = getBand(score);

  const handleReview = () => {
    navigate("/assessment", {
      state: {
        answers,
        isSubmitted: true,
        isReviewing: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <Confetti recycle={false} numberOfPieces={250} />

      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img src="/logo.svg" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🎉 Chúc mừng bạn đã hoàn thành bài kiểm tra!
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center">
            <CircularProgressbarWithChildren
              value={(score / 40) * 100}
              styles={buildStyles({
                pathColor: "#36d399",
                trailColor: "#d1d5db",
              })}
            >
              <div className="text-sm text-gray-600">Correct Answers</div>
              <div className="text-xl font-semibold text-green-500">
                {score}/40
              </div>
            </CircularProgressbarWithChildren>
          </div>

          <div className="flex flex-col items-center">
            <CircularProgressbarWithChildren
              value={100}
              styles={buildStyles({
                pathColor: "#3b82f6",
                trailColor: "#d1d5db",
              })}
            >
              <div className="text-sm text-gray-600">Band</div>
              <div className="text-xl font-semibold text-blue-500">{band}</div>
            </CircularProgressbarWithChildren>
          </div>

          <div className="flex flex-col items-center">
            <CircularProgressbarWithChildren
              value={100}
              styles={buildStyles({
                pathColor: "#f97316",
                trailColor: "#d1d5db",
              })}
            >
              <div className="text-sm text-gray-600">Time Spent</div>
              <div className="text-base font-semibold text-orange-500">
                {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3].map((b) => (
              <span
                key={b}
                className={`px-3 py-1 rounded-full border text-sm font-semibold ${
                  b === band
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/")}>🏠 Về trang chủ</Button>
            <Button onClick={() => navigate("/assessment")}>🔁 Làm lại</Button>
            <Button onClick={handleReview}>👁️ Xem lại bài</Button>
          </div>
          <Button
            type="primary"
            className="mt-4 !bg-green-500 hover:!bg-green-600 !text-white"
            onClick={() => navigate("/lessons")}
          >
            🚀 Bắt đầu ôn luyện
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReadingScore;
