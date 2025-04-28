// src/pages/client-users/ReadingTestPage/index.tsx
import React, { useState, useEffect } from "react";
import { Button, Tabs, Modal, Progress, Card } from "antd";
import { parts } from "../../../data/readingTestData"; // <-- Phải import đúng parts nhé!

const { TabPane } = Tabs;

interface Answers {
  [key: number]: string;
}

const ReadingTest: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  const handleAnswer = (questionId: number, option: string) => {
    if (!isSubmitted) {
      setAnswers({ ...answers, [questionId]: option });
    }
  };

  const calculateScore = () => {
    let score = 0;
    parts.forEach((part) => {
      part.questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          score++;
        }
      });
    });
    return score;
  };

  const convertScoreToBand = (score: number) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    if (score >= 15) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    if (score >= 8) return 3.5;
    if (score >= 6) return 3.0;
    return "Below 3.0";
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const band = convertScoreToBand(score);
    Modal.success({
      title: "Test Result",
      content: `✅ You answered ${score}/40 correctly.\n🏆 Estimated Band Score: ${band}`,
      okText: "OK",
    });
  };

  return (
    <div className="p-4 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">IELTS Reading Practice Test 01</h1>
        <div className="flex items-center gap-4">
          <Progress
            type="circle"
            percent={(timeLeft / (60 * 60)) * 100}
            format={() => formatTime(timeLeft)}
            width={80}
          />
          <Button
            onClick={handleSubmit}
            type="primary"
            danger
            disabled={isSubmitted}
          >
            Submit Test
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey="1">
        {parts.map((part) => (
          <TabPane tab={part.title} key={part.partId.toString()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN: Passage */}
              <div className="bg-white p-4 rounded shadow overflow-y-auto h-[80vh]">
                <h2 className="text-lg font-semibold mb-2">Passage</h2>
                <p className="text-gray-700 whitespace-pre-line text-justify leading-relaxed">
                  {part.passage}
                </p>
              </div>

              {/* RIGHT COLUMN: Questions */}
              <div className="space-y-6 overflow-y-auto h-[80vh]">
                {part.questions.map((q) => (
                  <Card key={q.id} className="shadow">
                    <p className="font-semibold mb-2">
                      {q.id}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((option, idx) => {
                        const isSelected = answers[q.id] === option;
                        const isCorrect = option === q.correctAnswer;
                        const showCorrect = isSubmitted && isCorrect;
                        const showWrong =
                          isSubmitted && isSelected && !isCorrect;

                        return (
                          <Button
                            key={idx}
                            type={isSelected ? "primary" : "default"}
                            className={`w-full ${
                              showCorrect ? "border-green-500" : ""
                            } ${showWrong ? "border-red-500" : ""}`}
                            onClick={() => handleAnswer(q.id, option)}
                          >
                            {option}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {isSubmitted && (
                      <p className="text-sm text-gray-600 mt-2">
                        💡 Explanation: {q.explanation}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ReadingTest;
