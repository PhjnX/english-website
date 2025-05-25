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
import { FaRedo, FaHome, FaEye, FaRocket } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import logo from "../../../assets/images/logo.jpg";

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
  const { score = 0, timeSpent = 0, answers } = location.state || {};
  const band = getBand(score);

  const handleReview = () => {
    navigate("/review", {
      state: {
        answers,
        isSubmitted: true,
        isReviewing: true,
      },
    });
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-6">
      <Confetti recycle={false} numberOfPieces={250} />
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl text-center mx-auto my-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="Logo" className="w-80 h-auto mx-auto mb-2" />
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <GiPartyPopper className="text-3xl text-yellow-400 animate-bounce" />
            <span className="text-2xl font-bold text-gray-800">
              Chúc mừng bạn đã hoàn thành bài kiểm tra!
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex flex-col items-center"
          >
            <CircularProgressbarWithChildren
              value={(score / 40) * 100}
              styles={buildStyles({
                pathColor: "#36d399",
                trailColor: "#d1d5db",
              })}
            >
              <div className="text-sm text-gray-600">Correct Answers</div>
              <div className="text-2xl font-bold text-green-500">
                {score}/40
              </div>
            </CircularProgressbarWithChildren>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex flex-col items-center"
          >
            <CircularProgressbarWithChildren
              value={100}
              styles={buildStyles({
                pathColor: "#3b82f6",
                trailColor: "#d1d5db",
              })}
            >
              <div className="text-sm text-gray-600">Band</div>
              <div className="text-2xl font-bold text-blue-500">{band}</div>
            </CircularProgressbarWithChildren>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex flex-col items-center"
          >
            <CircularProgressbarWithChildren
              value={100}
              styles={buildStyles({
                pathColor: "#f97316",
                trailColor: "#d1d5db",
              })}
            >
              <div className="text-sm text-gray-600">Time Spent</div>
              <div className="text-lg font-semibold text-orange-500">
                {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </div>
            </CircularProgressbarWithChildren>
          </motion.div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {[9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3].map((b) => (
              <span
                key={b}
                className={`px-3 py-1 rounded-full border text-sm font-semibold transition-all duration-200 ${
                  b === band
                    ? "bg-blue-500 text-white border-blue-500 scale-110 shadow"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              icon={<FaHome />}
              onClick={() => navigate("/")}
              className="font-semibold"
            >
              Về trang chủ
            </Button>
            <Button
              icon={<FaRedo />}
              onClick={() => navigate("/assessment")}
              className="font-semibold"
            >
              Làm lại
            </Button>
            <Button
              icon={<FaEye />}
              onClick={handleReview}
              className="font-semibold"
            >
              Xem lại bài
            </Button>
          </div>
          <Button
            type="primary"
            icon={<FaRocket />}
            className="mt-4 !bg-green-500 hover:!bg-green-600 !text-white text-lg font-bold py-2"
            onClick={() => navigate("/lessons")}
          >
            Bắt đầu ôn luyện
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReadingScore;
