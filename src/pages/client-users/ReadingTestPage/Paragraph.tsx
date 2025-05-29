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
  partId,
  highlightedSentence,
  isLoading,
  questionStart,
  questionEnd,
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        {title}
      </h2>
      <p className="text-gray-700 italic mb-4">{titleDescription}</p>
      {image && (
        <img
          src={image}
          alt="Illustration"
          className="mb-4 w-full max-h-72 object-cover rounded-3xl shadow"
        />
      )}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        {headerContent}
      </h2>
      <div className="text-gray-800 text-justify space-y-4 leading-relaxed">
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-300 rounded w-full" />
              ))}
          </div>
        ) : passage ? (
          passage.split("\n").map((line, idx) => {
            if (
              highlightedSentence &&
              highlightedSentence.length > 0 &&
              line.includes(highlightedSentence)
            ) {
              // Tách dòng thành 3 phần: trước, highlight, sau
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
                >
                  {parts.map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < parts.length - 1 && (
                        <span className="bg-yellow-200 px-2 rounded font-semibold">
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
