import { motion } from "framer-motion";
import pic1 from "../../../assets/images/pic1.png";
import pic2 from "../../../assets/images/pic2.png";
import pic3 from "../../../assets/images/pic3.jpg";
import pic4 from "../../../assets/images/pic4.png";
import pic5 from "../../../assets/images/pic5.jpg";
import pic6 from "../../../assets/images/pic6.jpg";

const courses = [
  {
    duration: "4 Tuần", // Level 1: Band 3.0
    level: "Level 1",
    author: "Nhóm Van Lang",
    title: "Cơ bản đọc hiểu",
    description:
      "Xây dựng nền tảng kỹ năng đọc tiếng Anh: từ vựng cơ bản, kỹ thuật quét ý chính (skimming) và tìm chi tiết (scanning).",
    image: pic1,
  },
  {
    duration: "4 Tuần", // Level 2: Band 3.5-4.0
    level: "Level 2",
    author: "Nhóm Van Lang",
    title: "Đọc học thuật cơ bản",
    description:
      "Thành thạo các chiến lược đọc học thuật cơ bản để hiểu bài báo nghiên cứu, sách giáo khoa và bài viết chuyên ngành.",
    image: pic2,
  },
  {
    duration: "6 Tuần", // Level 3: Band 4.0-4.5
    level: "Level 3",
    author: "Nhóm Van Lang",
    title: "Kỹ năng đọc phân tích",
    description:
      "Cải thiện tư duy phản biện qua đọc hiểu: phân tích luận điểm, nhận diện thành kiến và đánh giá nguồn thông tin.",
    image: pic3,
  },
  {
    duration: "6 Tuần", // Level 4: Band 4.5-5.0
    level: "Level 4",
    author: "Nhóm Van Lang",
    title: "Luyện đề mô phỏng",
    description:
      "Luyện đọc với các đoạn văn mô phỏng đề thi IELTS Reading để nâng cao chiến lược làm bài và tự tin hơn.",
    image: pic4,
  },
  {
    duration: "8 Tuần", // Level 5: Band 5.0-5.5
    level: "Level 5",
    author: "Nhóm Van Lang",
    title: "Từ vựng và đoán nghĩa nâng cao",
    description:
      "Mở rộng vốn từ chuyên sâu và học cách suy luận nghĩa từ ngữ cảnh — kỹ năng then chốt cho band 5.5 trở lên.",
    image: pic5,
  },
  {
    duration: "10 Tuần", // Level 6: Band 5.5-6.0+
    level: "Level 6",
    author: "Nhóm Van Lang",
    title: "Thành thạo đọc bài nghiên cứu",
    description:
      "Đào sâu vào cấu trúc bài báo khoa học và các văn bản học thuật cấp cao để hướng tới band 6.0+.",
    image: pic6,
  },
];

export default function ReadingCourses() {
  return (
    <motion.div
      className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#d32f2f] via-[#ffb300] to-[#d32f2f] bg-clip-text text-transparent drop-shadow-lg"
        style={{ fontFamily: "'Be Vietnam Pro', 'Bubblegum Sans', cursive" }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Các Khóa Học
      </motion.h2>
      <motion.p
        className="text-center text-gray-600 mb-10 text-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Nâng cao kỹ năng đọc tiếng Anh theo band IELTS từ 3.0 đến 6.0+
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-xl border border-[#ffe0b2]/40 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 8px 32px rgba(220,38,38,0.10)",
            }}
            transition={{ duration: 0.5, delay: 0.1 * idx }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="text-sm text-gray-500 flex justify-between mb-2">
                  <span className="font-bold text-[#d32f2f]">
                    {course.duration}
                  </span>
                  <span className="font-bold text-[#ffb300]">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-1 bg-gradient-to-r from-[#d32f2f] via-[#ffb300] to-[#d32f2f] bg-clip-text text-transparent">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-3 font-medium">
                  {course.author}
                </p>
                <p className="text-gray-700 text-base min-h-[96px] mb-4">
                  {course.description}
                </p>
              </div>
              <motion.a
                href="#"
                className="w-full inline-block bg-gradient-to-r from-[#d32f2f] via-[#ffb300] to-[#d32f2f] text-white font-bold py-3 rounded-full shadow-lg text-center text-lg mt-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                Tham gia ngay
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
