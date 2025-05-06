import React from "react";
import { motion } from "framer-motion";
import { parts } from "../../../data/readingTestData";

interface ParagraphProps {
  partId: number;
  highlightedSentence: string | null;
  setHighlightedSentence: (text: string | null) => void;
  isLoading: boolean;
  questionStart: number;
  questionEnd: number;
}

const Paragraph: React.FC<ParagraphProps> = ({
  partId,
  highlightedSentence,
  isLoading,
  questionStart,
  questionEnd,
}) => {
  const currentPart = parts.find((p) => p.partId === partId);

  if (!currentPart)
    return <div className="p-4 text-red-500">Part not found.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-indigo-700 mb-2">
        PART {currentPart.partId}
      </h2>

      <p className="text-gray-700 italic mb-4">
        You should spend about 20 minutes on{" "}
        <span className="font-semibold">
          Questions {questionStart}-{questionEnd}
        </span>
        , which are based on Reading Passage below.
      </p>
      {currentPart.image && (
        <img
          src={currentPart.image}
          alt="Illustration"
          className="mb-4 w-full max-h-72 object-cover rounded-3xl shadow"
        />
      )}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        {currentPart.title.toUpperCase()}
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
        ) : (
          currentPart.passage.split("\n").map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`${
                highlightedSentence === line.trim()
                  ? "bg-yellow-200 px-2 rounded"
                  : ""
              }`}
            >
              {line}
            </motion.p>
          ))
        )}
      </div>
    </div>
  );
};

export default Paragraph;
