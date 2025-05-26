import React from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

interface Benefit {
  number: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    number: "01",
    title: "Trải nghiệm học cá nhân hóa",
    description:
      "Thuật toán thông minh điều chỉnh nội dung phù hợp với điểm mạnh và điểm yếu của bạn, đảm bảo mỗi buổi học đều hiệu quả.",
  },
  {
    number: "02",
    title: "Linh hoạt và dễ tiếp cận",
    description:
      "Học theo lịch của bạn, trên mọi thiết bị và mọi nơi — lý tưởng cho cuộc sống sinh viên bận rộn.",
  },
  {
    number: "03",
    title: "Luyện tập theo đề thi",
    description:
      "Luyện kỹ năng đọc với định dạng mô phỏng đề thi thực tế như IELTS, TOEIC và CEFR B2 — xây dựng sự tự tin qua tính quen thuộc.",
  },
  {
    number: "04",
    title: "Công cụ theo dõi tiến trình",
    description:
      "Theo dõi hiệu suất với thống kê, phân tích và đề xuất rõ ràng — giữ động lực và tập trung.",
  },
  {
    number: "05",
    title: "Nguồn tư liệu phong phú",
    description:
      "Khám phá các văn bản học thuật, khoa học và thực tế được tuyển chọn để nâng cao từ vựng và khả năng hiểu dần từng bước.",
  },
  {
    number: "06",
    title: "Môi trường tương tác và truyền cảm hứng",
    description:
      "Yếu tố trò chơi hóa và thiết kế thân thiện giúp việc tự học trở nên thú vị, tăng tính kiên trì và hiệu suất.",
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <motion.section
      className="bg-[#f9f9f9] py-20 px-4 md:px-8 text-center relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#d32f2f] via-[#ffb300] to-[#d32f2f] bg-clip-text text-transparent drop-shadow-lg"
        style={{ fontFamily: "'Be Vietnam Pro', 'Bubblegum Sans', cursive" }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Lợi ích
      </motion.h2>
      <motion.p
        className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Khai phá tiềm năng đọc với nền tảng ôn luyện tiếng Anh dành cho sinh
        viên:
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {benefits.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-xl border border-[#ffe0b2]/40 p-8 text-left relative group overflow-hidden hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 8px 32px rgba(220,38,38,0.12)",
            }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ffb300] via-[#fffde7] to-[#d32f2f] text-white text-2xl font-extrabold shadow-lg mr-4">
                <span className="bg-gradient-to-r from-[#d32f2f] via-[#ffb300] to-[#d32f2f] bg-clip-text text-transparent text-2xl font-extrabold">
                  {item.number}
                </span>
              </div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-[#d32f2f] via-[#ffb300] to-[#d32f2f] bg-clip-text text-transparent">
                {item.title}
              </h3>
            </div>
            <p className="text-gray-700 text-base mb-8 min-h-[72px]">
              {item.description}
            </p>
            <motion.button
              className="absolute bottom-6 right-6 bg-gradient-to-br from-[#d32f2f] via-[#ffb300] to-[#d32f2f] hover:from-[#ffb300] hover:to-[#d32f2f] text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none"
              whileHover={{ scale: 1.15, rotate: 12 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              aria-label="Xem chi tiết"
            >
              <ArrowUpRightIcon className="w-5 h-5 text-white" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default BenefitsSection;
