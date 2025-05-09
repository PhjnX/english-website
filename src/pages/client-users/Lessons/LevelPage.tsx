import { useParams } from "react-router-dom";
import ExerciseList from "./ExerciseList";
import { levelData } from "../../../data/ExerciseListData";
import LevelHeader from "./LevelHeader";
import { FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

const LevelPage = () => {
  const { level } = useParams(); // level1, level2, ...
  const tests = levelData[(level as keyof typeof levelData) || "level1"] || [];
  const levelNum = Number(level?.replace("level", "")) || 1;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-4">
      {/* Header nằm trong vùng nội dung chính */}
      <div className="w-full max-w-6xl mx-auto">
        <LevelHeader level={levelNum} />
        <ExerciseList
          title={`Reading Test ${
            level?.replace("level", "Level ") || "Level 1"
          }`}
          tests={tests}
        />
      </div>
      {/* Footer động lực chỉ xuất hiện 1 lần */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-6 flex items-center gap-4 shadow-lg"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-30 mr-4">
          <FaTrophy className="text-yellow-500 text-4xl drop-shadow" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-1">
            Chinh phục Reading IELTS
          </h2>
          <p className="text-white/90 text-base md:text-lg font-medium">
            Luyện tập các đề thi thật, nâng cao kỹ năng đọc hiểu và bứt phá band
            điểm!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelPage;
