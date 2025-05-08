import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Question from "./Question";
import Paragraph from "./Paragraph";
import { parts } from "../../../data/readingTestData";
import { Button } from "antd";
import {
  FaArrowLeft,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, isSubmitted, isReviewing } = location.state || {};

  // State cho highlight
  const [highlightedSentence, setHighlightedSentence] = React.useState<
    string | null
  >(null);
  // State cho part đang xem
  const [activePart, setActivePart] = React.useState(1);
  const [prevPart, setPrevPart] = React.useState(1);

  const currentPart = parts.find((p) => p.partId === activePart);
  if (!currentPart) return null;

  const handlePrev = () => {
    if (activePart > 1) {
      setPrevPart(activePart);
      setActivePart((p) => p - 1);
      setHighlightedSentence(null);
    }
  };
  const handleNext = () => {
    if (activePart < parts.length) {
      setPrevPart(activePart);
      setActivePart((p) => p + 1);
      setHighlightedSentence(null);
    }
  };

  return (
    <div className="p-0 w-screen h-screen flex flex-col overflow-hidden bg-gradient-to-br from-white to-gray-100 text-gray-800 font-inter">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight text-blue-700 flex items-center gap-2">
          <span className="text-3xl">📖</span> Xem lại bài làm của bạn
        </h1>
        <div className="flex gap-3">
          <Button
            icon={<FaArrowLeft />}
            size="large"
            className="font-semibold"
            onClick={() => navigate("/reading-score")}
          >
            Quay lại
          </Button>
          <Button
            icon={<FaHome />}
            size="large"
            className="font-semibold"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* AnimatePresence cho chuyển part */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePart}
            initial={{ opacity: 0, x: prevPart < activePart ? 120 : -120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prevPart < activePart ? -120 : 120 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="flex w-full h-full relative"
          >
            {/* Nút prev absolute trong box */}
            <Button
              shape="circle"
              size="large"
              icon={<FaChevronLeft className="text-2xl" />}
              className="absolute !mx-5 left-0 top-1/2 -translate-y-1/2 z-30 shadow-lg bg-white hover:bg-blue-100 border-none"
              onClick={handlePrev}
              disabled={activePart === 1}
            />

            {/* Paragraph */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow p-4 md:p-8 m-4 h-[80vh] overflow-y-auto">
              <Paragraph
                partId={currentPart.partId}
                highlightedSentence={highlightedSentence}
                setHighlightedSentence={setHighlightedSentence}
                isLoading={false}
                questionStart={currentPart.questions[0]?.id}
                questionEnd={
                  currentPart.questions[currentPart.questions.length - 1]?.id
                }
              />
            </div>
            {/* Question */}
            <div className="flex-1 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow p-4 md:p-8 m-4 h-[80vh] overflow-y-auto">
              <Question
                questions={currentPart.questions}
                answers={answers}
                handleAnswer={() => {}}
                isSubmitted={isSubmitted}
                isReviewing={isReviewing}
                setHighlightedSentence={setHighlightedSentence}
                highlightedSentence={highlightedSentence}
                isLoading={false}
                partId={currentPart.partId}
              />
            </div>

            {/* Nút next absolute trong box */}
            <Button
              shape="circle"
              size="large"
              icon={<FaChevronRight className="text-2xl" />}
              className="absolute !mx-5 right-4 top-1/2 -translate-y-1/2 z-30 shadow-lg bg-white hover:bg-blue-100 border-none"
              onClick={handleNext}
              disabled={activePart === parts.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewPage;
