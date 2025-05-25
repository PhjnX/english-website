import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  mainClassName?: string;
  splitLevelClassName?: string;
  staggerFrom?: "first" | "last";
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts = [],
  rotationInterval = 2000,
  mainClassName = "",
  splitLevelClassName = "overflow-hidden",
  staggerFrom = "last",
  initial = { y: "100%", opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: "-100%", opacity: 0 },
  transition = { type: "spring", stiffness: 300, damping: 25 },
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(timer);
  }, [rotationInterval, texts.length]);

  return (
    <span className={`inline-block ${mainClassName}`}>
      <span
        className={`relative h-[1.2em] inline-block align-bottom ${splitLevelClassName}`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={texts[index]}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            className="absolute left-0 w-full whitespace-nowrap"
          >
            {texts[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

export default RotatingText;
