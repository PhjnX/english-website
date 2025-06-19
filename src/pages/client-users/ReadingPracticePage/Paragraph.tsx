import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ParagraphProps {
  title: string;
  partId: number;
  highlightedSentence: string | null;
  setHighlightedSentence: (text: string | null) => void;
  isLoading: boolean;
  questionStart: number;
  questionEnd: number;
  passage: string;
  image?: string;
  titleDescription: string;
  headerContent: string;
}

const Paragraph: React.FC<ParagraphProps> = ({
  title,
  highlightedSentence,
  isLoading,
  passage,
  image,
  titleDescription,
  headerContent,
}) => {
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (highlightedSentence && lineRefs.current.length > 0) {
      // Tìm dòng chứa highlightSentence
      const idx = passage
        .split("\n")
        .findIndex((line) => line.includes(highlightedSentence));
      if (idx !== undefined && idx >= 0 && lineRefs.current[idx]) {
        lineRefs.current[idx]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [highlightedSentence, passage]);

  return (
    <div
      className="bg-gradient-to-br from-violet-200  to-pink-200 p-6 rounded-2xl shadow border border-gray-200"
      style={{ fontFamily: "beVietnamProFont, sans-serif", color: "#18181b" }}
    >
      <h2
        className="text-2xl md:text-3xl !font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-500"
        style={{ fontFamily: "beVietnamProFont, sans-serif" }}
      >
        {title}
      </h2>
      {titleDescription && (
        <p
          className="italic mb-4 text-center text-lg font-bold text-gray-800"
          style={{ fontFamily: "beVietnamProFont, sans-serif" }}
        >
          {titleDescription}
        </p>
      )}
      {image && (
        <img
          src={image}
          alt="Illustration"
          className="mb-4 w-full max-h-72 object-cover rounded-3xl shadow"
        />
      )}
      {headerContent && (
        <h3
          className="!text-3xl md:text-2xl !font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-500"
          style={{ fontFamily: "beVietnamProFont, sans-serif" }}
        >
          {headerContent}
        </h3>
      )}
      <div
        className="text-base md:text-lg leading-8 space-y-4"
        style={{ fontFamily: "beVietnamProFont, sans-serif", color: "#18181b" }}
      >
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-200 rounded w-full" />
              ))}
          </div>
        ) : passage ? (
          passage.split("\n").map((line, idx) => {
            if (
              highlightedSentence &&
              highlightedSentence.length > 0 &&
              line.includes(highlightedSentence)
            ) {
              const parts = line.split(highlightedSentence);
              return (
                <motion.p
                  key={idx}
                  ref={(el) => {
                    lineRefs.current[idx] = el;
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="rounded-xl px-2 py-1 bg-purple-100/60"
                >
                  {parts.map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < parts.length - 1 && (
                        <span className="bg-yellow-200 px-2 rounded font-semibold text-black">
                          {highlightedSentence}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </motion.p>
              );
            } else {
              return (
                <motion.p
                  key={idx}
                  ref={(el) => {
                    lineRefs.current[idx] = el;
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="px-2"
                >
                  {line}
                </motion.p>
              );
            }
          })
        ) : null}
      </div>
    </div>
  );
};

export default Paragraph;
