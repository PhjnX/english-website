import { motion } from "framer-motion";
import { FaLeaf, FaBolt, FaFire } from "react-icons/fa";

const levelConfig = [
  {
    color: "from-green-400 to-green-600",
    icon: <FaLeaf className="text-green-700 text-4xl drop-shadow" />,
    desc: "Khởi động nhẹ nhàng, làm quen với bài đọc IELTS.",
  },
  {
    color: "from-yellow-400 to-orange-500",
    icon: <FaBolt className="text-yellow-700 text-4xl drop-shadow" />,
    desc: "Nâng cao kỹ năng, thử thách bản thân hơn.",
  },
  {
    color: "from-pink-500 to-red-500",
    icon: <FaFire className="text-red-600 text-4xl drop-shadow" />,
    desc: "Chinh phục những đề khó, bứt phá band điểm!",
  },
];

interface LevelHeaderProps {
  level: number; // 1-6
}

const LevelHeader: React.FC<LevelHeaderProps> = ({ level }) => {
  let idx = 0;
  if (level >= 5) idx = 2;
  else if (level >= 3) idx = 1;
  // level 1-2: 0, 3-4: 1, 5-6: 2
  const config = levelConfig[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full max-w-6xl mx-auto my-6 rounded-2xl bg-gradient-to-r ${config.color} p-6 flex items-center gap-4 shadow-lg`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-30 mr-4">
        {config.icon}
      </div>
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-1">
          Reading Test Level {level}
        </h2>
        <p className="text-white/90 text-base md:text-lg font-medium">
          {config.desc}
        </p>
      </div>
    </motion.div>
  );
};

export default LevelHeader;
