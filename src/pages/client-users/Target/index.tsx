import React from "react";
import { motion } from "framer-motion";
import Icon1 from "../../../assets/images/target-1.png";
import Icon2 from "../../../assets/images/target-2.png";
import Icon3 from "../../../assets/images/target-3.png";
import Icon4 from "../../../assets/images/target-4.png";

interface TargetItem {
  icon: string;
  title: string;
  description: string;
}

const targets: TargetItem[] = [
  {
    icon: Icon1,
    title: "Cá nhân hóa",
    description:
      "Lộ trình đọc được điều chỉnh theo trình độ và mục tiêu học tập của từng sinh viên",
  },
  {
    icon: Icon2,
    title: "Tập trung",
    description:
      "Luyện kỹ năng đọc học thuật phù hợp với định dạng đề thi và yêu cầu của trường đại học",
  },
  {
    icon: Icon3,
    title: "Dễ tiếp cận",
    description:
      "Giao diện đơn giản, tương thích với mọi thiết bị – học bất cứ lúc nào, bất cứ nơi đâu",
  },
  {
    icon: Icon4,
    title: "Truyền cảm hứng",
    description:
      "Tăng động lực học thông qua hệ thống điểm thưởng và trải nghiệm tương tác",
  },
];

const TargetSection: React.FC = () => {
  return (
    <motion.section
      className="py-16 px-4 bg-white text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        className="text-3xl font-bold mb-10"
        style={{ fontFamily: "'Bubblegum Sans', cursive" }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Mục tiêu
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto mt-14">
        {targets.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center px-4"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 8px 32px rgba(59,130,246,0.15)",
            }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="bg-blue-100 w-20 h-20 flex items-center justify-center rounded-full mb-4 shadow-lg"
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="max-w-[60%] max-h-[60%] object-contain"
              />
            </motion.div>
            <h3 className="text-xl font-bold mb-2 font-stretch-100%">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 font-stretch-100%">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TargetSection;
