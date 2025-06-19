import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paragraph from "./Paragraph";
import QuestionList from "./Question";
import { motion, AnimatePresence } from "framer-motion";
import testGif from "../../../assets/testGif.gif";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Part } from "./reading";

export interface Answers {
  [key: number]: string;
}

const ReadingPracticeReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    answers = {},
    parts = [],
    score = 0,
    band = "N/A",
    level = "1",
    readingNum = "reading1",
  } = location.state || {};

  const [highlightedSentence, setHighlightedSentence] = useState<string | null>(
    null
  );
  const [activeKey, setActiveKey] = useState("1");
  const [prevKey, setPrevKey] = useState("1");

  useEffect(() => {
    if (parts && parts.length > 0) {
      setActiveKey(parts[0]?.id?.toString() || "1");
    }
  }, [parts]);

  const handleTabChange = (key: string) => {
    setPrevKey(activeKey);
    setActiveKey(key);
  };

  const handleGoBack = () => {
    navigate(`/reading-practice-score/${level}/${readingNum}`);
  };

  // Custom Tab UI
  const renderTabs = () => (
    <div
      className="flex flex-wrap gap-2 md:gap-4 px-2 md:px-6 pt-3 pb-1"
      style={{ fontFamily: "beVietnamProFont, sans-serif" }}
    >
      {parts.map((part: Part) => (
        <motion.button
          key={part.id}
          onClick={() => handleTabChange(part.id.toString())}
          className={`px-4 py-2 rounded-full font-semibold shadow transition-all duration-200 text-base md:text-lg focus:outline-none border-2 cursor-pointer
            ${
              activeKey === part.id.toString()
                ? "bg-gradient-to-r from-[#4ade80] to-[#22c55e] !text-white border-green-600 !shadow-2xl"
                : "bg-gradient-to-r from-white to-[#f0fdf4] text-green-700 border-green-200 hover:border-green-400"
            }
          `}
        >
          {part.title}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0] text-black font-inter"
      style={{ fontFamily: "beVietnamProFont, sans-serif" }}
    >
      {/* Header */}
      <header
        className="relative z-10 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-5 bg-gradient-to-r from-[#bbf7d0] to-[#86efac] shadow-xl border-b border-gray-200 rounded-b-3xl gap-4 drop-shadow-lg"
        style={{ fontFamily: "beVietnamProFont, sans-serif" }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-green-400 via-green-200 to-white rounded-full p-2 shadow-md">
            <img
              src={testGif}
              alt="Review Icon"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <span
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-emerald-500 to-teal-500 font-sans select-none drop-shadow-md"
            style={{
              letterSpacing: "0.02em",
              fontFamily: "beVietnamProFont, sans-serif",
            }}
          >
            Reading Practice Review - Level {level} - Reading {readingNum?.replace(/\D/g, '') || "1"}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-2 shadow-md">
            <FaCheckCircle className="text-green-500 text-xl" />
            <span className="text-lg font-bold text-green-700">
              Score: {score} | Band: {band}
            </span>
          </div>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
          >
            <FaArrowLeft size={16} />
            <span>Back to Score</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      {renderTabs()}

      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {parts.map((part: Part) =>
            activeKey === part.id.toString() ? (
              <motion.div
                key={activeKey}
                initial={{
                  opacity: 0,
                  x: parseInt(prevKey) < parseInt(activeKey) ? 100 : -100,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: parseInt(prevKey) < parseInt(activeKey) ? -100 : 100,
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={
                  "flex-1 flex flex-col overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-white via-green-50 to-green-100 border border-green-200 my-0"
                }
              >
                <div className="flex flex-col md:flex-row flex-1 h-full bg-transparent rounded-xl overflow-hidden">
                  <motion.div
                    key={`para-${activeKey}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-green-200 w-full md:w-1/2"
                  >
                    <Paragraph
                      title={part.title}
                      partId={part.id}
                      passage={part.content || ""}
                      image={undefined}
                      titleDescription={part.titleDescription ?? ""}
                      highlightedSentence={highlightedSentence}
                      headerContent={part.headerContent ?? ""}
                      setHighlightedSentence={setHighlightedSentence}
                      isLoading={false}
                      questionStart={part.groups?.[0]?.questions?.[0]?.id || 0}
                      questionEnd={
                        part.groups &&
                        part.groups.length > 0 &&
                        part.groups[part.groups.length - 1].questions &&
                        part.groups[part.groups.length - 1].questions.length > 0
                          ? part.groups[part.groups.length - 1].questions[
                              part.groups[part.groups.length - 1].questions
                                .length - 1
                            ].id
                          : 0
                      }
                    />
                  </motion.div>
                  <motion.div
                    key={`ques-${activeKey}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-green-200 w-full md:w-1/2"
                  >
                    <QuestionList
                      groups={part.groups || []}
                      answers={answers}
                      handleAnswer={() => {}} // Không cho phép thay đổi đáp án
                      isSubmitted={true}
                      setHighlightedSentence={setHighlightedSentence}
                      highlightedSentence={highlightedSentence}
                      isLoading={false}
                      partId={part.id}
                      isReviewing={true}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReadingPracticeReview;
