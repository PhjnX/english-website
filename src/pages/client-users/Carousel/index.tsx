import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const slides = [
  {
    title: "Nâng Cao Kỹ Năng Reading",
    subtitle: "Biến việc học tiếng Anh thành đam mê đích thực",
    description:
      "Khám phá khả năng đọc vượt trội với lộ trình cá nhân hóa, tương tác thông minh và cảm hứng học tập mỗi ngày.",
    className: "bg-[#fffbe7]",
  },
  {
    title: "Lộ Trình Cá Nhân Hóa",
    subtitle: "Luyện Reading hiệu quả theo chuẩn đầu ra",
    description:
      "Hệ thống bài học thông minh, phù hợp trình độ và mục tiêu riêng của bạn. Đánh giá tiến bộ từng ngày.",
    className: "bg-[#ffe082]",
  },
  {
    title: "Truyền Cảm Hứng Học Tập",
    subtitle: "Thành công bắt đầu từ sự chủ động",
    description:
      "Tăng động lực học với giao diện trực quan, dễ sử dụng và nội dung chất lượng, truyền cảm hứng mỗi ngày.",
    className: "bg-[#fff3e0]",
  },
];

const HeroCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-tr from-[#fffbe7] via-[#fff3e6] to-[#fefefe] flex items-center justify-center">
      <div className="embla w-full" ref={emblaRef}>
        <div className="embla__container h-screen">
          {slides.map((slide, index) => (
            <div
              className="embla__slide flex items-center justify-center px-6"
              key={index}
            >
              <motion.div
                className={`w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-10 py-12 md:py-20 ${slide.className} rounded-xl shadow-xl p-6`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-[#d32f2f] via-[#ffb300] to-[#d32f2f] bg-clip-text text-transparent">
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className="mr-3 text-[#d32f2f] animate-pulse"
                      size="lg"
                    />
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-[#333] font-semibold mb-2">
                    {slide.subtitle}
                  </p>
                  <p className="text-base md:text-lg text-gray-700 mb-6">
                    {slide.description}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#d32f2f] to-[#ffb300] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:from-[#ffb300] hover:to-[#d32f2f] transition text-lg flex items-center gap-2 mx-auto md:mx-0"
                  >
                    Bắt đầu học
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2 animate-bounce-x"
                    />
                  </motion.button>
                </div>
                <motion.div
                  className="w-60 md:w-80 lg:w-96"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="bg-orange-100 rounded-full p-6 shadow-inner animate-bounce-slow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-24 h-24 text-orange-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m5.25 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
        }
        .embla__slide {
          position: relative;
          min-width: 100%;
        }
        .animate-bounce-x {
          animation: bounceX 1.2s infinite alternate;
        }
        @keyframes bounceX {
          0% { transform: translateX(0); }
          100% { transform: translateX(8px); }
        }
        .animate-bounce-slow {
          animation: floatUpDown 6s ease-in-out infinite;
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;
