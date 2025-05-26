// src/components/sections/HowItWorksSection.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  UserPlusIcon,
  DocumentMagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface StepItemProps {
  stepNumber: string;
  icon: React.ElementType;
  title: string;
  description: string;
  isLast?: boolean;
  index: number;
}

const stepsData: Omit<StepItemProps, "index" | "isLast">[] = [
  {
    stepNumber: "01",
    icon: UserPlusIcon,
    title: "Đăng Ký Nhanh Chóng",
    description:
      "Tạo tài khoản miễn phí chỉ trong vài bước đơn giản để bắt đầu hành trình chinh phục IELTS.",
  },
  {
    stepNumber: "02",
    icon: DocumentMagnifyingGlassIcon,
    title: "Kiểm Tra Trình Độ",
    description:
      "Thực hiện bài kiểm tra đầu vào để hệ thống đánh giá năng lực và xây dựng lộ trình phù hợp.",
  },
  {
    stepNumber: "03",
    icon: AdjustmentsHorizontalIcon,
    title: "Học Theo Lộ Trình",
    description:
      "Tiếp cận các bài học, bài tập được cá nhân hóa, tập trung vào điểm yếu cần cải thiện.",
  },
  {
    stepNumber: "04",
    icon: PencilSquareIcon,
    title: "Luyện Tập Chuyên Sâu",
    description:
      "Thực hành không giới hạn với kho đề thi đa dạng và các dạng bài tập kỹ năng phong phú.",
  },
  {
    stepNumber: "05",
    icon: CheckCircleIcon,
    title: "Chinh Phục Mục Tiêu",
    description:
      "Theo dõi sát sao tiến độ, nhận phản hồi chi tiết và tự tin đạt điểm số IELTS Reading mơ ước.",
  },
];

const stepVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.2,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const StepCard: React.FC<StepItemProps> = ({
  stepNumber,
  icon: Icon,
  title,
  description,
  isLast,
  index,
}) => {
  return (
    <motion.div
      className="flex items-start group"
      variants={stepVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="flex flex-col items-center mr-6 md:mr-8">
        <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-xl md:text-2xl rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
          {stepNumber}
        </div>
        {!isLast && (
          <div className="mt-2 w-1 h-24 md:h-32 bg-gradient-to-b from-red-500/50 via-orange-400/30 to-amber-300/10 rounded-full" />
        )}
      </div>
      <div className="pt-1 md:pt-2 group-hover:bg-white/30 p-4 rounded-lg transition-colors duration-300 backdrop-blur-sm group-hover:shadow-lg">
        <div className="flex items-center mb-2">
          <Icon className="w-6 h-6 text-orange-600 mr-3 group-hover:text-red-600 transition-colors duration-300" />
          <h3 className="text-lg md:text-xl font-bold text-gray-800 font-be-vietnam-pro">
            {title}
          </h3>
        </div>
        <p className="text-sm md:text-base text-gray-600 font-inter leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background decorative shapes */}
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-0 right-0 w-72 h-72 bg-red-100/30 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-4 text-gray-800 font-be-vietnam-pro">
            Bắt Đầu{" "}
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Hành Trình
            </span>{" "}
            Của Bạn
          </h2>
          <p className="text-base sm:text-lg text-center text-gray-600 font-inter max-w-2xl mx-auto mb-12 md:mb-16 lg:mb-20">
            Chỉ với vài bước đơn giản, bạn đã sẵn sàng để nâng cao kỹ năng đọc
            hiểu IELTS và tiến gần hơn đến mục tiêu của mình.
          </p>
        </motion.div>

        <div className="max-w-2xl lg:max-w-3xl mx-auto space-y-10 md:space-y-12">
          {stepsData.map((step, index) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === stepsData.length - 1}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
