import React from "react";
import Icon1 from "../../../assets/images/target-1.png";
import Icon2 from "../../../assets/images/target-2.png";
import Icon3 from "../../../assets/images/target-3.png";
import Icon4 from "../../../assets/images/target-4.png";

interface TargetItem {
  icon: string;
  title: string;
  description: string;
}

const targets: TargetItem[] = [
  {
    icon: Icon1,
    title: "Personalized",
    description:
      "Tailored reading paths based on each student's English level and learning goals",
  },
  {
    icon: Icon2,
    title: "Focused",
    description:
      "Practice academic reading skills aligned with standardized test formats and university requirements",
  },
  {
    icon: Icon3,
    title: "Accessible",
    description:
      "Simple, responsive interface for all students - available anytime, anywhere",
  },
  {
    icon: Icon4,
    title: "Motivating",
    description:
      "Boosts learing engagement through points rewards, and interactive experiences",
  },
];

const TargetSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white text-center">
      <h2
        className="text-3xl font-bold mb-10"
        style={{ fontFamily: "'Bubblegum Sans', cursive" }}
      >
        Our Target
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto mt-14">
        {targets.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center px-4"
          >
            <div className="bg-blue-100 w-20 h-20 flex items-center justify-center rounded-full mb-4">
              <img
                src={item.icon}
                alt={item.title}
                className="max-w-[60%] max-h-[60%] object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 font-serif">{item.title}</h3>
            <p className="text-sm text-gray-600 font-serif">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TargetSection;
