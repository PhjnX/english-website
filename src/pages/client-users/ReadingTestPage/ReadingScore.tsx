import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaHome, FaRedo, FaBookOpen } from "react-icons/fa";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import logo from "../../../assets/images/logo.png";

const bandScale = [9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3];

export default function ReadingScore() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 0, band = 3, timeSpent = 0 } = location.state || {};

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-8">
      <Confetti numberOfPieces={200} recycle={false} />

      <img src={logo} alt="Logo" className="w-100 h-30 mb-4 " />

      <motion.h1
        className="text-2xl md:text-3xl font-bold text-center text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Chúc mừng! Bạn đã hoàn thành bài kiểm tra đầu vào!
      </motion.h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="flex flex-col items-center">
          <CircularProgressbar
            value={score}
            maxValue={40}
            text={`${score}/40`}
            styles={buildStyles({
              textColor: "#111",
              pathColor: "#3b82f6",
              trailColor: "#dbeafe",
            })}
          />
          <p className="mt-2 font-semibold text-gray-600">Correct Answers</p>
        </div>

        <div className="flex flex-col items-center">
          <CircularProgressbar
            value={Number(band) * 10}
            maxValue={90}
            text={`${band}`}
            styles={buildStyles({
              textColor: "#111",
              pathColor: "#10b981",
              trailColor: "#d1fae5",
            })}
          />
          <p className="mt-2 font-semibold text-gray-600">Band Score</p>
        </div>

        <div className="flex flex-col items-center">
          <CircularProgressbar
            value={timeSpent}
            maxValue={60 * 60}
            text={formatTime(timeSpent)}
            styles={buildStyles({
              textColor: "#111",
              pathColor: "#f59e0b",
              trailColor: "#fef3c7",
            })}
          />
          <p className="mt-2 font-semibold text-gray-600">Time Spent</p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-xl">
        <div className="grid grid-cols-13 gap-2 text-xs text-center text-gray-500">
          {bandScale.map((b, i) => (
            <div
              key={b}
              className={`p-2 rounded-full border border-gray-300 ${
                Number(band) === b
                  ? "bg-green-500 text-white font-bold scale-110 shadow"
                  : "bg-white"
              }`}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4 w-full max-w-sm">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            <FaHome /> Trang chủ
          </button>
          <button
            onClick={() => navigate("/assessment")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            <FaRedo /> Làm lại
          </button>
        </div>
        <button
          onClick={() => navigate("/lessons")}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg text-lg"
        >
          <FaBookOpen /> Bắt đầu ôn luyện
        </button>
      </div>
    </div>
  );
}
