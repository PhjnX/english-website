// src/components/HeroCarousel.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// Dữ liệu slide giữ nguyên như phiên bản trước
const slidesData = [
  {
    id: 1,
    title: "Nắm Vững IELTS Reading",
    subtitle: "Mở khóa cánh cửa du học & định cư",
    description:
      "Khám phá phương pháp đọc hiệu quả, chinh phục mọi dạng bài IELTS Reading với VlearnReading.",
    // imageUrl: "...", // Đã bỏ qua vì không sử dụng
    ctaText: "Bắt đầu học ngay!",
    ctaLink: "/courses",
    theme: {
      bgColor: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
      textColor: "text-white",
      blob1Color: "rgba(251, 191, 36, 0.3)",
      blob2Color: "rgba(239, 68, 68, 0.25)",
      squareColor: "rgba(255, 255, 255, 0.15)",
      dotColors: ["#fbbf24", "#ef4444", "#f97316"],
      ctaGradient:
        "bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 hover:from-red-600 hover:via-orange-600 hover:to-amber-500",
    },
  },
  {
    id: 2,
    title: "Tăng Điểm Thần Tốc",
    subtitle: "Chiến thuật làm bài IELTS Reading",
    description:
      "Học hỏi từ chuyên gia, rèn luyện kỹ năng Skimming, Scanning và đọc hiểu sâu sắc để đạt điểm cao nhất.",
    // imageUrl: "...",
    ctaText: "Xem lộ trình học",
    ctaLink: "/roadmap",
    theme: {
      bgColor: "bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600",
      textColor: "text-white",
      blob1Color: "rgba(14, 165, 233, 0.3)",
      blob2Color: "rgba(59, 130, 246, 0.25)",
      squareColor: "rgba(255, 255, 255, 0.15)",
      dotColors: ["#0ea5e9", "#06b6d4", "#3b82f6"],
      ctaGradient:
        "bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 hover:from-blue-700 hover:via-cyan-600 hover:to-sky-600",
    },
  },
  {
    id: 3,
    title: "Thực Hành Không Giới Hạn",
    subtitle: "Nguồn đề thi IELTS Reading chuẩn quốc tế",
    description:
      "Truy cập kho đề thi phong phú, đa dạng, được cập nhật liên tục giúp bạn làm quen và tự tin hơn.",
    // imageUrl: "...",
    ctaText: "Thử sức ngay!",
    ctaLink: "/practice",
    theme: {
      bgColor: "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600",
      textColor: "text-white",
      blob1Color: "rgba(16, 185, 129, 0.3)",
      blob2Color: "rgba(101, 163, 13, 0.25)",
      squareColor: "rgba(255, 255, 255, 0.15)",
      dotColors: ["#10b981", "#22c55e", "#84cc16"],
      ctaGradient:
        "bg-gradient-to-r from-lime-600 via-green-500 to-emerald-500 hover:from-lime-700 hover:via-green-600 hover:to-emerald-600",
    },
  },
];

const HeroCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const animateSlideContent = useCallback((index: number) => {
    const currentContent = contentRefs.current[index];
    if (currentContent) {
      gsap.set(
        currentContent.querySelectorAll(
          ".carousel-title, .carousel-subtitle, .carousel-description, .carousel-cta-button"
        ),
        { opacity: 0, y: 50, scale: 1 }
      );

      gsap.to(currentContent.querySelectorAll(".carousel-title"), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.to(currentContent.querySelectorAll(".carousel-subtitle"), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.to(currentContent.querySelectorAll(".carousel-description"), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.7,
      });
      gsap.to(currentContent.querySelectorAll(".carousel-cta-button"), {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        delay: 0.9,
      });
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelectHandler = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setPreviousIndex(selectedIndex);
      setSelectedIndex(newIndex);
      animateSlideContent(newIndex);
    };

    emblaApi.on("select", onSelectHandler);
    emblaApi.on("init", onSelectHandler);

    return () => {
      emblaApi.off("select", onSelectHandler);
      emblaApi.off("init", onSelectHandler);
    };
  }, [emblaApi, selectedIndex, animateSlideContent]);

  const currentSlideTheme = slidesData[selectedIndex]?.theme;

  return (
    <div className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[580px] md:min-h-[620px] lg:min-h-[680px] bg-neutral-50 pt-10">
      <AnimatePresence initial={false}>
        <motion.div
          key={selectedIndex}
          className={`absolute inset-0 z-0 ${
            currentSlideTheme?.bgColor || "bg-gray-200"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }} // Lớp nền mờ tổng thể
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {slidesData.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="embla__slide relative flex-[0_0_100%] flex items-center justify-center min-h-[460px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[640px] p-4 sm:p-8 lg:p-12 overflow-hidden"
            >
              {/* ĐÃ BỎ RENDER HÌNH ẢNH <motion.img ... /> */}

              {/* Gradient nền cho từng slide, tăng opacity khi không có ảnh */}
              <motion.div
                className={`absolute inset-0 ${slide.theme.bgColor}`}
                style={{ zIndex: 2 }} // zIndex này giờ là nền chính của slide
                initial={{ opacity: 0 }}
                animate={{ opacity: selectedIndex === index ? 0.9 : 0 }} // Tăng opacity để gradient rõ hơn
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              {/* Các element SVG trang trí */}
              {selectedIndex === index && (
                <>
                  <motion.svg /* Blob 1 */
                    width="250"
                    height="250"
                    viewBox="0 0 250 250"
                    fill="none"
                    className="absolute left-[-80px] top-[-80px] opacity-80"
                    style={{ zIndex: 3 }}
                    animate={{
                      y: [0, -20, 10, 0],
                      rotate: [0, 10, -5, 0],
                      scale: [1, 1.05, 0.95, 1],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ellipse
                      cx="125"
                      cy="125"
                      rx="110"
                      ry="90"
                      fill={slide.theme.blob1Color}
                    />
                  </motion.svg>
                  <motion.svg /* Blob 2 */
                    width="150"
                    height="150"
                    viewBox="0 0 150 150"
                    fill="none"
                    className="absolute right-[-50px] bottom-[-50px] opacity-70"
                    style={{ zIndex: 3 }}
                    animate={{
                      y: [0, 25, -10, 0],
                      rotate: [0, -12, 8, 0],
                      scale: [1, 0.9, 1.1, 1],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <circle
                      cx="75"
                      cy="75"
                      r="70"
                      fill={slide.theme.blob2Color}
                    />
                  </motion.svg>
                  <motion.div /* Square shape */
                    className="absolute left-1/2 top-16 -translate-x-1/2 w-20 h-20 rounded-2xl opacity-50"
                    style={{
                      zIndex: 3,
                      backgroundColor: slide.theme.squareColor,
                    }}
                    animate={{
                      x: [0, 10, -10, 0],
                      rotate: [0, 90, 180, 270, 360],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div /* Animated Dots */
                    className="absolute right-8 sm:right-12 top-10 sm:top-12 flex flex-col gap-2.5 opacity-70"
                    style={{ zIndex: 3 }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
                  >
                    <span
                      className="block w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: slide.theme.dotColors[0] }}
                    />
                    <span
                      className="block w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: slide.theme.dotColors[1] }}
                    />
                    <span
                      className="block w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: slide.theme.dotColors[2] }}
                    />
                  </motion.div>
                </>
              )}

              {/* Content */}
              <div
                className={`relative z-10 max-w-xl lg:max-w-3xl text-center ${slide.theme.textColor} flex flex-col items-center justify-center font-inter`}
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
              >
                <h1 className="carousel-title text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-xl font-be-vietnam-pro">
                  {slide.title}
                </h1>
                <h2 className="carousel-subtitle text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 drop-shadow-lg font-be-vietnam-pro">
                  {slide.subtitle}
                </h2>
                <p className="carousel-description text-base sm:text-lg lg:text-xl mb-10 leading-relaxed max-w-md lg:max-w-xl drop-shadow-md">
                  {slide.description}
                </p>
                <div className="carousel-cta-button">
                  <a
                    href={slide.ctaLink}
                    className={`inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl font-bold rounded-full shadow-lg 
                                 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50
                                 border-none text-white relative overflow-hidden group
                                 ${slide.theme.ctaGradient} focus:ring-white/50`}
                    style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}
                  >
                    <span className="relative z-10">{slide.ctaText}</span>
                    <span className="absolute inset-0 block bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
                    <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-shine rounded-full" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={useCallback(
          () => emblaApi && emblaApi.scrollPrev(),
          [emblaApi]
        )}
        className="absolute top-1/2 left-3 sm:left-4 transform -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full
                   bg-white/25 backdrop-blur-md text-white shadow-xl
                   hover:bg-white/35 hover:scale-110 hover:shadow-2xl transition-all duration-300 border-none focus:outline-none group cursor-pointer"
        aria-label="Previous slide"
        type="button"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          className="group-hover:animate-bounce-x-left"
        >
          <path
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={useCallback(
          () => emblaApi && emblaApi.scrollNext(),
          [emblaApi]
        )}
        className="absolute top-1/2 right-3 sm:right-4 transform -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full
                   bg-white/25 backdrop-blur-md text-white shadow-xl
                   hover:bg-white/35 hover:scale-110 hover:shadow-2xl transition-all duration-300 border-none focus:outline-none group cursor-pointer"
        aria-label="Next slide"
        type="button"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          className="group-hover:animate-bounce-x-right"
        >
          <path
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Navigation - sử dụng !mx-3 cho từng button */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex">
        {slidesData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 !mx-3 rounded-full transition-all duration-300 ease-out cursor-pointer shadow-md
                        ${
                          index === selectedIndex
                            ? "bg-white scale-125 ring-2 ring-white/50"
                            : "bg-white/60 hover:bg-white/80"
                        }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-120%) skewX(-20deg); opacity: 0.5; }
          30% { transform: translateX(-100%) skewX(-20deg); opacity: 0.7; }
          100% { transform: translateX(120%) skewX(-20deg); opacity: 0; }
        }
        .group:hover .animate-shine { animation: shine 1.0s forwards ease-in-out; }

        @keyframes bounce-x-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes bounce-x-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .group-hover\\:animate-bounce-x-left { animation: bounce-x-left 0.7s ease-in-out infinite alternate; }
        .group-hover\\:animate-bounce-x-right { animation: bounce-x-right 0.7s ease-in-out infinite alternate; }
        
        /* Nhắc nhở: Đảm bảo bạn đã định nghĩa font-be-vietnam-pro và font-inter trong tailwind.config.js và import chúng. */
      `}</style>
    </div>
  );
};

export default HeroCarousel;
