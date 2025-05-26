// src/components/HeroCarousel.tsx
import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import gsap from "gsap"; // Import GSAP - Đảm bảo thư viện GSAP đã được cài đặt trong dự án của bạn

// Tạm thời định nghĩa các slide
const slidesData = [
  {
    id: 1,
    title: "Nắm Vững IELTS Reading",
    subtitle: "Mở khóa cánh cửa du học & định cư",
    description:
      "Khám phá phương pháp đọc hiệu quả, chinh phục mọi dạng bài IELTS Reading với VlearnReading.",
    imageUrl:
      "https://images.unsplash.com/photo-1549429402-98319f395454?q=80&w=2940&auto=format&fit=cb&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Sách, thư viện
    ctaText: "Bắt đầu học ngay!",
    ctaLink: "/courses",
    theme: {
      bgColor: "bg-gradient-to-r from-[#F0A868] to-[#D6815B]", // Gradient cam ấm áp
      textColor: "text-white",
    },
  },
  {
    id: 2,
    title: "Tăng Điểm Thần Tốc",
    subtitle: "Chiến thuật làm bài IELTS Reading",
    description:
      "Học hỏi từ chuyên gia, rèn luyện kỹ năng Skimming, Scanning và đọc hiểu sâu sắc để đạt điểm cao nhất.",
    imageUrl:
      "https://images.unsplash.com/photo-1520623191176-a078041c3905?q=80&w=2940&auto=format&fit=cb&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Người học tập trung, sách vở
    ctaText: "Xem lộ trình học",
    ctaLink: "/roadmap",
    theme: {
      bgColor: "bg-gradient-to-r from-[#AE5C44] to-[#7B4230]", // Gradient nâu đỏ đậm
      textColor: "text-white",
    },
  },
  {
    id: 3,
    title: "Thực Hành Không Giới Hạn",
    subtitle: "Nguồn đề thi IELTS Reading chuẩn quốc tế",
    description:
      "Truy cập kho đề thi phong phú, đa dạng, được cập nhật liên tục giúp bạn làm quen và tự tin hơn.",
    imageUrl:
      "https://images.unsplash.com/photo-1517486804554-15964bb21f1d?q=80&w=2940&auto=format&fit=cb&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Máy tính, bàn làm việc, sách
    ctaText: "Thử sức ngay!",
    ctaLink: "/practice",
    theme: {
      bgColor: "bg-gradient-to-r from-[#7B4230] to-[#5C3026]", // Gradient nâu đậm
      textColor: "text-white",
    },
  },
];

const HeroCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref cho nội dung để reset animation

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(newIndex);
      // Reset và animate lại nội dung của slide mới
      animateSlideContent(newIndex);
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("init", onSelect); // Animate slide ban đầu khi khởi tạo

    // Cleanup function
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("init", onSelect);
    };
  }, [emblaApi]);

  // Hàm animation cho nội dung slide
  const animateSlideContent = (index: number) => {
    const currentContent = contentRefs.current[index];
    if (currentContent) {
      // Reset opacity và y trước khi animate lại
      gsap.set(
        currentContent.querySelectorAll(
          ".carousel-title, .carousel-subtitle, .carousel-description, .carousel-cta-button"
        ),
        { opacity: 0, y: 50, scale: 1 }
      );

      gsap.fromTo(
        currentContent.querySelectorAll(".carousel-title"),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        currentContent.querySelectorAll(".carousel-subtitle"),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 }
      );
      gsap.fromTo(
        currentContent.querySelectorAll(".carousel-description"),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.6 }
      );
      gsap.fromTo(
        currentContent.querySelectorAll(".carousel-cta-button"),
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.8,
        }
      );
    }
  };

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative w-full overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-vlearn-cream">
      {/* Lớp phủ gradient nhẹ cho nền */}
      <div className="absolute inset-0 bg-gradient-to-br from-vlearn-cream via-vlearn-cream/80 to-vlearn-orange-light/10 z-0"></div>

      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {slidesData.map((slide, index) => (
            <motion.div
              key={slide.id} // Key chỉ cần là slide.id
              className="embla__slide relative flex-[0_0_100%] flex items-center justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px] p-4 sm:p-8 lg:p-12 overflow-hidden"
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              // Animation cho toàn bộ slide khi chuyển đổi
              initial={{ opacity: 0, scale: 0.98 }}
              animate={
                selectedIndex === index
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.98 }
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                pointerEvents: selectedIndex === index ? "auto" : "none",
              }}
            >
              {/* Background Image with Parallax and Filter Animation */}
              <motion.img
                src={slide.imageUrl}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                initial={{ scale: 1.1, filter: "brightness(0.8)" }}
                animate={{
                  scale: selectedIndex === index ? 1 : 1.08,
                  filter:
                    selectedIndex === index
                      ? "brightness(1)"
                      : "brightness(0.8)", // Giảm độ sáng của ảnh không được chọn
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ zIndex: 1 }}
              />
              {/* Animated Gradient Overlay */}
              <motion.div
                className={`absolute inset-0 ${slide.theme.bgColor}`}
                style={{ zIndex: 2 }}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: selectedIndex === index ? 0.7 : 0.5 }} // Giảm độ trong suốt của overlay khi không được chọn
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              {/* Animated SVG Blobs & Shapes (Thêm đa dạng và tinh tế hơn) */}
              {/* Blob 1 */}
              <motion.svg
                width="220"
                height="220"
                viewBox="0 0 220 220"
                fill="none"
                className="absolute left-[-60px] top-[-60px] opacity-60"
                style={{ zIndex: 3 }}
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, 8, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ellipse
                  cx="110"
                  cy="110"
                  rx="100"
                  ry="80"
                  fill="#ffb300" // Màu cam vàng nhẹ
                  fillOpacity="0.25"
                />
              </motion.svg>
              {/* Blob 2 */}
              <motion.svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                className="absolute right-[-40px] bottom-[-40px] opacity-50"
                style={{ zIndex: 3 }}
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, -10, 0],
                  scale: [1, 0.95, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="60"
                  fill="#d32f2f" // Màu đỏ gạch nhẹ
                  fillOpacity="0.18"
                />
              </motion.svg>
              {/* Square shape */}
              <motion.svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                className="absolute left-1/2 top-10 -translate-x-1/2 opacity-40"
                style={{ zIndex: 3 }}
                animate={{ x: [0, 10, -10, 0], rotate: [0, 90, 180, 270, 360] }} // Thêm xoay
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <rect
                  x="10"
                  y="10"
                  width="70"
                  height="70"
                  rx="20"
                  fill="#fff"
                  fillOpacity="0.12"
                />
              </motion.svg>
              {/* Animated Dots (Thêm hiệu ứng float) */}
              <motion.div
                className="absolute right-10 top-10 flex flex-col gap-2 opacity-60 animate-float"
                style={{ zIndex: 3 }}
              >
                <span className="block w-2 h-2 rounded-full bg-white" />
                <span className="block w-2 h-2 rounded-full bg-[#ffb300]" />
                <span className="block w-2 h-2 rounded-full bg-[#d32f2f]" />
              </motion.div>

              {/* Content */}
              <div
                className={`relative z-10 max-w-4xl text-center ${slide.theme.textColor} font-sans flex flex-col items-center justify-center`}
                ref={(el) => {
                  contentRefs.current[index] = el;
                }} // Gắn ref cho nội dung
              >
                <motion.h1
                  className="carousel-title text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4 drop-shadow-lg"
                  style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                >
                  {slide.title}
                </motion.h1>
                <motion.h2
                  className="carousel-subtitle text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 drop-shadow-md"
                  style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                >
                  {slide.subtitle}
                </motion.h2>
                <motion.p
                  className="carousel-description text-base sm:text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl drop-shadow-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {slide.description}
                </motion.p>
                <motion.div className="carousel-cta-button">
                  <a
                    href={slide.ctaLink}
                    // Button với gradient và hiệu ứng shine/glow khi hover
                    className="inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl font-bold rounded-full shadow-lg transition-all duration-300 transform
                               hover:scale-105 hover:shadow-xl border-none text-white relative overflow-hidden group
                               bg-gradient-to-r from-[#E0A07B] via-[#F0C090] to-[#D6815B]" // Gradient màu cam-đỏ từ theme
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
                  >
                    <span className="relative z-10">{slide.ctaText}</span>
                    {/* Hiệu ứng shine khi hover */}
                    <span className="absolute inset-0 block bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
                    <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:animate-shine rounded-full" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-14 h-14 rounded-full
                   bg-white/20 backdrop-blur-sm text-white shadow-lg
                   hover:scale-110 hover:shadow-2xl transition-all duration-300 border-none focus:outline-none
                   group" // Thêm group để dùng cho hiệu ứng shine
        aria-label="Previous slide"
        type="button"
      >
        <svg
          width="36"
          height="36"
          fill="none"
          viewBox="0 0 24 24"
          className="group-hover:animate-bounce-x-left"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-14 h-14 rounded-full
                   bg-white/20 backdrop-blur-sm text-white shadow-lg
                   hover:scale-110 hover:shadow-2xl transition-all duration-300 border-none focus:outline-none
                   group" // Thêm group để dùng cho hiệu ứng shine
        aria-label="Next slide"
        type="button"
      >
        <svg
          width="36"
          height="36"
          fill="none"
          viewBox="0 0 24 24"
          className="group-hover:animate-bounce-x-right"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slidesData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === selectedIndex
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
      {/* Custom CSS for animations (should be in src/index.css or global CSS) */}
      <style>{`
        /* Keyframe cho hiệu ứng shine của button */
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(100%) skewX(-12deg);
          }
        }
        .group:hover .animate-shine {
          animation: shine 1.2s forwards;
        }

        /* Keyframe cho hiệu ứng float của các hình khối nền */
        @keyframes floatY {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-3deg); }
        }
        .animate-float { animation: floatY 6s ease-in-out infinite; }
        .animate-float2 { animation: floatY2 7s ease-in-out infinite; }

        /* Keyframe cho hiệu ứng bounce của mũi tên */
        @keyframes bounce-x-left {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-5px); }
        }
        @keyframes bounce-x-right {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
        }
        .group-hover\\:animate-bounce-x-left { animation: bounce-x-left 0.6s ease-in-out infinite alternate; }
        .group-hover\\:animate-bounce-x-right { animation: bounce-x-right 0.6s ease-in-out infinite alternate; }

        /* Keyframe cho hiệu ứng gradient text đã có trong src/index.css */
        /*
        @keyframes text-gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-gradient {
          background-size: 200% auto;
          animation: text-gradient-animation 4s ease infinite;
        }
        */
      `}</style>
    </div>
  );
};

export default HeroCarousel;
