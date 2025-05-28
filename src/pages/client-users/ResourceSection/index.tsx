// src/components/sections/ResourceSection.tsx
import React, { useRef, useState } from "react";
import {
  motion,
  useScroll, // Giữ lại nếu bạn vẫn muốn dùng cho các animation khác trong card
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import {
  ArrowDownTrayIcon,
  LinkIcon,
  DocumentTextIcon,
  SparklesIcon,
  PencilSquareIcon,
  BookmarkSquareIcon,
} from "@heroicons/react/24/outline";

// --- Resource Card Component (Cập nhật chiều cao và bỏ parallax scroll cá nhân) ---
interface ResourceItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  linkType: "download" | "external" | "internal";
  ctaText: string;
}

const ResourceCard: React.FC<ResourceItem> = ({
  icon: Icon,
  title,
  description,
  link,
  linkType,
  ctaText,
}) => {
  return (
    <motion.div
      className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-500/25 \
                 border border-purple-100/80 transition-all duration-350 ease-out \
                 flex flex-col w-72 md:w-[300px] h-60 md:h-64 flex-shrink-0   user-select-none"
      whileHover={{
        y: -8,
        scale: 1.02,
        borderColor: "rgba(168, 85, 247, 0.6)",
      }}
      transition={{ type: "spring", stiffness: 280, damping: 15 }}
    >
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 group-hover:opacity-70 group-hover:border-purple-400/60 transition-all duration-300 pointer-events-none -z-10"></div>

      {/* Entrance animation cho nội dung card có thể giữ lại nếu muốn */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col h-full" // Đảm bảo flex-col chiếm hết chiều cao
      >
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-100 via-indigo-100 to-fuchsia-100 rounded-lg mr-4 group-hover:scale-105 transition-transform duration-300">
            <Icon className="w-7 h-7 text-purple-600" />
          </div>
          <h3
            className="text-lg font-bold text-purple-800 font-be-vietnam-pro group-hover:text-indigo-700 transition-colors"
            style={{ fontFamily: "Be Vietnam Pro", fontWeight: 700 }}
          >
            {title}
          </h3>
        </div>
        <p className="text-sm text-slate-600 font-inter leading-relaxed flex-grow mb-5">
          {description}
        </p>
        <motion.a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          download={linkType === "download"}
          className="mt-auto self-start inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:via-indigo-600 hover:to-fuchsia-600 transform hover:scale-105 transition-all duration-300 group/button"
          whileHover={{
            y: -2,
            boxShadow: "0 7px 15px rgba(128, 90, 213, 0.3)",
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {ctaText}
          {linkType === "download" && (
            <ArrowDownTrayIcon className="w-4 h-4 ml-2 group-hover/button:animate-bounce" />
          )}
          {linkType === "external" && (
            <LinkIcon className="w-4 h-4 ml-2 group-hover/button:animate-pulse" />
          )}
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

const allResourcesData: ResourceItem[] = [
  {
    id: "pdf1",
    icon: DocumentTextIcon,
    title: "Từ Vựng IELTS Reading Chủ Đề",
    description:
      "Tổng hợp từ vựng thiết yếu, phân loại theo các chủ đề thường gặp trong bài thi.",
    link: "/src/assets/resources/Tu-vung-IELTS-33-chu-de.pdf",
    linkType: "download",
    ctaText: "Tải Về",
  },
  {
    id: "ex1",
    icon: PencilSquareIcon,
    title: "Bộ Đề Luyện True/False/NG",
    description:
      "Rèn luyện kỹ năng xử lý dạng bài khó nhằn này với các bài tập đa dạng và giải thích chi tiết.",
    link: "https://www.kanan.co/ielts/academic/reading/practice-test/",
    linkType: "internal",
    ctaText: "Luyện Tập",
  },
  {
    id: "tool1",
    icon: LinkIcon,
    title: "Từ Điển Collocations Online",
    description:
      "Tra cứu nhanh các cụm từ thường đi với nhau, giúp sử dụng từ vựng tự nhiên và chính xác hơn.",
    link: "https://dictionary.zim.vn/",
    linkType: "external",
    ctaText: "Truy Cập",
  },
  {
    id: "pdf2",
    icon: DocumentTextIcon,
    title: "Cấu Trúc Ngữ Pháp Trọng Tâm",
    description:
      "Ôn tập cấu trúc ngữ pháp quan trọng giúp hiểu sâu và phân tích bài đọc chính xác.",
    link: "/src/assets/resources/CambridgeGrammarforIELTS.pdf",
    linkType: "download",
    ctaText: "Tải Về",
  },
  {
    id: "ex2",
    icon: PencilSquareIcon,
    title: "Bài Tập Matching Headings",
    description:
      "Nâng cao khả năng tóm tắt ý chính và nối tiêu đề với các đoạn văn một cách chính xác.",
    link: "https://www.ieltstutor.me/blog/ielts-reading-heading-matching-exercises",
    linkType: "internal",
    ctaText: "Luyện Tập",
  },
  {
    id: "tool2",
    icon: BookmarkSquareIcon,
    title: "Ứng Dụng Flashcard Readify",
    description:
      "Ôn luyện từ vựng mọi lúc mọi nơi với ứng dụng flashcard thông minh (sắp ra mắt).",
    link: "#",
    linkType: "internal",
    ctaText: "Xem Thêm",
  },
];

const AnimatedShape: React.FC<{
  className: string;
  delay?: number;
  duration?: number;
  xRange?: string[];
  yRange?: string[];
}> = ({
  className,
  delay = 0,
  duration = 20,
  xRange = ["0%", "5%", "-5%", "0%"],
  yRange = ["0%", "-8%", "8%", "0%"],
}) => {
  return (
    <motion.div
      className={`absolute rounded-full filter blur-3xl ${className}`}
      animate={{ x: xRange, y: yRange }}
      transition={{
        delay,
        duration: duration + Math.random() * 10 - 5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
    />
  );
};

const ResourceSection: React.FC = () => {
  // --- Logic cho Marquee ---
  const CARD_WIDTH = 300; // Chiều rộng của card
  const GAP_X = 24; // Khoảng cách ngang giữa các card
  const ITEM_EFFECTIVE_WIDTH = CARD_WIDTH + GAP_X;

  const x = useMotionValue(0);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);

  const singleSetWidth = allResourcesData.length * ITEM_EFFECTIVE_WIDTH;
  const BASE_SPEED = 0.7;

  useAnimationFrame((time, delta) => {
    if (isMarqueeHovered) return;
    let moveBy = BASE_SPEED;
    x.set(x.get() - moveBy);
  });

  const wrappedX = useTransform(x, (latestX) => {
    return `${wrap(0, -singleSetWidth, latestX)}px`;
  });

  const duplicatedResources = React.useMemo(
    () => [...allResourcesData, ...allResourcesData, ...allResourcesData],
    []
  );

  return (
    <section
      id="resources-section"
      className="py-16 md:py-24 bg-gradient-to-b from-white via-purple-50/70 to-indigo-100/80 relative overflow-hidden"
    >
      <AnimatedShape
        className="w-72 h-72 bg-purple-200/30 top-[5%] -left-20 opacity-50"
        duration={30}
      />
      <AnimatedShape
        className="w-80 h-80 bg-indigo-200/20 bottom-[2%] -right-28 opacity-40"
        delay={2}
        duration={35}
      />

      <div className="container mx-auto px-0 md:px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 font-be-vietnam-pro uppercase"
            style={{ fontFamily: "Be Vietnam Pro", fontWeight: 800 }}
          >
            Khám Phá Kho Tài Nguyên
            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              <span> </span> Vô Tận
            </span>
          </h2>
          <p className="mt-5 text-lg md:text-xl text-slate-600 font-inter max-w-2xl mx-auto">
            Mọi thứ bạn cần để luyện tập và nâng cao kỹ năng IELTS Reading, tất
            cả tại một nơi, luôn sẵn sàng cho bạn.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div
          className="w-full overflow-hidden group py-4"
          onMouseEnter={() => setIsMarqueeHovered(true)}
          onMouseLeave={() => setIsMarqueeHovered(false)}
        >
          <motion.div className="flex" style={{ x: wrappedX }}>
            {duplicatedResources.map((resource, index) => (
              <div
                key={`${resource.id}-${index}`}
                className="flex-shrink-0"
                style={{
                  width: `${ITEM_EFFECTIVE_WIDTH}px`,
                  paddingLeft: `${GAP_X / 2}px`,
                  paddingRight: `${GAP_X / 2}px`,
                }}
              >
                <ResourceCard {...resource} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResourceSection;
