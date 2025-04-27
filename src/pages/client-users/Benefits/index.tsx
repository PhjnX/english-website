import React from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

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
    <section className="bg-gray-50 py-16 px-4 md:px-8 text-center">
      <h2
        className="text-3xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "'Bubblegum Sans', cursive" }}
      >
        Lợi ích
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        Khai phá tiềm năng đọc với nền tảng ôn luyện tiếng Anh dành cho sinh
        viên:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 text-left relative border border-gray-100"
          >
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {item.number}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-6">{item.description}</p>
            <button className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-md">
              <ArrowUpRightIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
