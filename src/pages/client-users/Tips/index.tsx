// src/components/sections/TipsSection.tsx
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxTextProps {
  children: string;
  baseVelocity: number;
  className?: string;
}

function ParallaxText({
  children,
  baseVelocity = 100,
  className,
}: ParallaxTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const numberOfRepetitions = 6;
  const wrapRangePercentage = 100 / numberOfRepetitions;
  const x = useTransform(baseX, (v) => `${wrap(0, -wrapRangePercentage, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax overflow-hidden whitespace-nowrap flex flex-nowrap my-2 md:my-3">
      <motion.div
        className={`scroller flex whitespace-nowrap flex-nowrap items-center
                    font-plaster uppercase
                    text-5xl md:text-6xl lg:text-7xl
                    tracking-[-0.04em]
                    leading-none
                    ${className}`}
        style={{ x }}
      >
        {[...Array(numberOfRepetitions)].map((_, i) => (
          <span key={i} className="block mx-5 md:mx-7">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// GIỮ NGUYÊN TIPS TIẾNG ANH SIÊU NGẮN để dùng với font Plaster
const ieltsTipsEnglish: { text: string; velocity: number }[] = [
  { text: "SKIM & SCAN", velocity: -4 },
  { text: "KEYWORD MAGIC", velocity: 4 },
  { text: "TIME IS SCORE", velocity: -3.5 },
  { text: "CONTEXT CLUES", velocity: 3.5 },
];

const TipsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 relative text-gray-800 overflow-x-hidden">
      {/* Blobs trang trí cho nền sáng - màu nhạt và tinh tế */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-0 w-3/5 h-3/5 bg-gradient-to-r from-orange-300/30 via-red-200/20 to-transparent rounded-full blur-3xl animate-pulse-slow -translate-x-1/3"></div>
        <div className="absolute bottom-1/4 right-0 w-3/5 h-3/5 bg-gradient-to-l from-amber-300/30 via-yellow-200/20 to-transparent rounded-full blur-3xl animate-pulse-slower translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "circOut", delay: 0.1 }}
        >
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-10 md:mb-14
                       font-be-vietnam-pro uppercase text-slate-800"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
          >
            BÍ KÍP{" "}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
              READING
            </span>{" "}
            THẦN TỐC
          </h2>
        </motion.div>

        {ieltsTipsEnglish.map((tip, index) => (
          <ParallaxText
            key={index}
            baseVelocity={tip.velocity}
            // Màu cho text cuộn - đảm bảo tương phản tốt trên nền sáng
            className="text-orange-600 hover:text-orange-400 transition-colors duration-300"
            // style={{ textShadow: "0px 0px 1px rgba(0,0,0,0.2)" }} // Shadow tối nhẹ nếu cần
          >
            {tip.text}
          </ParallaxText>
        ))}
      </div>
      {/* Keyframes animations cho blobs - có thể điều chỉnh opacity */}
      <style>{`
      .font-plaster {
          font-family: 'Plaster', cursive;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.08) rotate(3deg);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1.05) rotate(0deg);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.12) rotate(-3deg);
          }
        }
        .animate-pulse-slower {
          animation: pulse-slower 22s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
};

export default TipsSection;
