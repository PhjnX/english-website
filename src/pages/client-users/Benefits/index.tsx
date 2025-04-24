import React from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

interface Benefit {
  number: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    number: "01",
    title: "Personalized Learning Experience",
    description:
      "Smart algorithms adapt the content to your strengths and weaknesses, ensuring every session is relevant and efficient.",
  },
  {
    number: "02",
    title: "Flexible and Accessible",
    description:
      "Study on your own schedule, from any location or device — perfect for busy student life.",
  },
  {
    number: "03",
    title: "Test-Aligned Practice",
    description:
      "Practice with reading formats modeled after real exams such as IELTS, TOEIC, and CEFR B2 — build confidence with familiarity.",
  },
  {
    number: "04",
    title: "Progress Monitoring Tools",
    description:
      "Track your performance with clear stats, insights, and recommendations — stay motivated and focused.",
  },
  {
    number: "05",
    title: "Rich, Curated Reading Resources",
    description:
      "Explore academic, scientific, and real-world texts chosen to enhance your vocabulary and comprehension step-by-step.",
  },
  {
    number: "06",
    title: "Interactive & Motivating Environment",
    description:
      "Gamified elements and user-friendly design make self-study enjoyable, boosting consistency and productivity.",
  },
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8 text-center">
      <h2
        className="text-3xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "'Bubblegum Sans', cursive" }}
      >
        Benefits
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        Unlock your reading potential with our smart, student-focused English
        reading platform:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 text-left relative border border-gray-100"
          >
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {item.number}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-6">{item.description}</p>
            <button className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-md">
              <ArrowUpRightIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
