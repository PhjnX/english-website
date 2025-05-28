// src/components/carousels/NewHeroCarousel.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"; // Sử dụng Heroicons
import carousel1 from "../../../assets/images/carousel_1.png";
import carousel2 from "../../../assets/images/carousel_2.png";
import carousel3 from "../../../assets/images/carousel_3.png";

// Dữ liệu cho các slide (Tiếng Việt)
const slidesData = [
  {
    id: 1,
    headline: "Chinh Phục IELTS Reading Cùng Readify",
    description:
      "Lộ trình được cá nhân hóa, kho bài tập đa dạng và những chiến lược làm bài hiệu quả nhất đang chờ bạn khám phá.",
    ctaText: "Tìm Hiểu Thêm",
    ctaLink: "/features",
    imageUrl: carousel1,
    altText: "Học viên Readify đang học tập",
  },
  {
    id: 2,
    headline: "Từ Vựng Chuyên Sâu, Nền Tảng Vững Chắc",
    description:
      "Nắm vững từ vựng học thuật cốt lõi qua các bài học tương tác, flashcards thông minh và trò chơi thử thách.",
    ctaText: "Bắt Đầu Học Từ",
    ctaLink: "/vocabulary",
    imageUrl: carousel2,
    altText: "Flashcards từ vựng Readify",
  },
  {
    id: 3,
    headline: "Luyện Đề Như Thi Thật, Tự Tin Tối Đa",
    description:
      "Trải nghiệm các bộ đề thi thử chuẩn format quốc tế, nhận phân tích chi tiết và chiến lược cải thiện điểm số.",
    ctaText: "Làm Bài Thi Thử",
    ctaLink: "/mock-tests",
    imageUrl: carousel3,
    altText: "Học viên làm bài thi thử trên Readify",
  },
];

// Component cho một chi tiết trang trí nhỏ
const FloatingShape: React.FC<{
  className: string;
  delay?: number;
  duration?: number;
  yRange?: string[];
  rotateRange?: number[];
}> = ({
  className,
  delay = 0,
  duration = 5,
  yRange = ["0%", "-8%", "0%"],
  rotateRange,
}) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: yRange,
      rotate: rotateRange,
    }}
    transition={{
      delay,
      duration: duration + Math.random() * 2 - 1, // Thêm chút ngẫu nhiên cho duration
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    }}
  />
);

const NewHeroCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 7000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect(); // Set initial selected index
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: i * 0.1 },
    }),
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    initial: { scale: 0.8, opacity: 0, y: 50 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.2 },
    },
    float: {
      // Kết hợp hiệu ứng float vào đây nếu muốn icon chính cũng float
      y: ["0%", "-3%", "0%"],
      transition: {
        delay: 0.8,
        duration: 4,
        ease: [0.42, 0, 0.58, 1], // cubic-bezier for easeInOut
        repeat: Infinity,
        repeatType: "mirror" as "mirror",
      },
    },
  };

  const combinedImageAnimate = (index: number) => {
    if (selectedIndex === index) {
      return ["animate", "float"]; // Chạy cả hai animation
    }
    return "initial";
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-purple-50 via-fuchsia-50 to-indigo-100 overflow-hidden">
      <div className="embla_new" ref={emblaRef}>
        <div className="embla__container_new flex">
          {slidesData.map((slide, index) => (
            <div
              className="embla__slide_new flex-[0_0_100%] min-h-[80vh] md:min-h-[90vh] lg:min-h-screen relative p-8 md:p-16 flex items-center"
              key={slide.id}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-white to-fuchsia-100/70 opacity-80"></div>

              {/* Các chi tiết trang trí */}
              <FloatingShape
                className="w-16 h-16 bg-purple-300/50 rounded-full top-[15%] left-[10%] "
                delay={0.2}
                yRange={["0%", "-10%", "0%"]}
              />
              <FloatingShape
                className="w-8 h-8 bg-indigo-300/50 rounded-lg top-[20%] right-[15%] "
                delay={0.5}
                duration={7}
                rotateRange={[0, 90, 0]}
              />
              <FloatingShape
                className="w-12 h-12 border-2 border-purple-400/60 rounded-full bottom-[15%] left-[20%]"
                delay={0.8}
                yRange={["0%", "12%", "0%"]}
              />
              <FloatingShape
                className="w-10 h-10 bg-fuchsia-300/50 rounded-xl bottom-[25%] right-[10%]"
                delay={0.4}
                duration={6}
                rotateRange={[0, -80, 0]}
              />
              <FloatingShape
                className="hidden md:block w-24 h-1 bg-purple-400/70 top-[50%] left-[5%]"
                delay={1}
                yRange={["0%", "5%", "0%"]}
              />
              <FloatingShape
                className="hidden md:block w-1 h-20 bg-indigo-400/70 bottom-[10%] right-[5%]"
                delay={0.6}
                yRange={["0%", "-7%", "0%"]}
              />

              <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 relative z-10">
                {/* Cột Text */}
                <motion.div
                  className="text-center lg:text-left"
                  key={`text-${slide.id}`} // Key để AnimatePresence hoạt động đúng khi slide thay đổi
                  variants={textContainerVariants}
                  initial="hidden"
                  animate={selectedIndex === index ? "visible" : "hidden"}
                >
                  <motion.h1
                    variants={textItemVariants}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-purple-800 mb-6 font-be-vietnam-pro leading-tight"
                    style={{ fontFamily: "Be Vietnam Pro", fontWeight: 800 }}
                  >
                    {slide.headline}
                  </motion.h1>
                  <motion.p
                    variants={textItemVariants}
                    className="text-lg md:text-xl text-purple-700/90 mb-8 font-inter leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>
                  <motion.div variants={textItemVariants}>
                    <motion.a
                      href={slide.ctaLink}
                      className="inline-block px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      whileHover={{
                        y: -3,
                        boxShadow: "0px 10px 20px rgba(128, 90, 213, 0.3)",
                      }} // Thêm hiệu ứng đổ bóng khi hover
                    >
                      {slide.ctaText}
                    </motion.a>
                  </motion.div>
                </motion.div>

                {/* Cột Hình Ảnh */}
                <motion.div
                  className="flex justify-center items-center"
                  key={`image-container-${slide.id}`} // Key riêng cho container ảnh
                >
                  <motion.img
                    key={`image-${slide.id}`} // Key để Framer Motion nhận diện thay đổi ảnh
                    src={slide.imageUrl}
                    alt={slide.altText}
                    className="w-full max-w-lg rounded-3xl shadow-2xl object-cover h-[300px] md:h-[400px] lg:h-[500px]"
                    variants={imageVariants}
                    initial="initial"
                    animate={combinedImageAnimate(index)} // Kết hợp animate và float
                    exit="initial" // Để ảnh cũ biến mất khi chuyển slide
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút điều hướng */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 z-20 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition-all duration-300 focus:outline-none group cursor-pointer"
        aria-label="Slide trước"
      >
        <ChevronLeftIcon className="w-6 h-6 text-purple-600 group-hover:text-purple-800" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-20 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition-all duration-300 focus:outline-none group cursor-pointer"
        aria-label="Slide tiếp theo"
      >
        <ChevronRightIcon className="w-6 h-6 text-purple-600 group-hover:text-purple-800" />
      </button>

      {/* Chấm điều hướng */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex !space-x-5">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ease-out shadow-md
                        ${
                          index === selectedIndex
                            ? "bg-purple-600 scale-125"
                            : "bg-purple-300/70 hover:bg-purple-400"
                        }`}
            aria-label={`Đi đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewHeroCarousel;
