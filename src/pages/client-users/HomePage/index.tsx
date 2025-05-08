import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "../Carousel";
import TargetSection from "../Target";
import BenefitsSection from "../Benefits";
import ReadingCourses from "../Courses";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleAssessmentClick = () => {
    if (!token) {
      navigate("/login", { state: { from: { pathname: "/assessment" } } });
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  return (
    <div>
      <HeroCarousel />
      <TargetSection />
      <BenefitsSection />
      <ReadingCourses />
      <button onClick={handleAssessmentClick}>
        Làm bài test đánh giá trình độ
      </button>
    </div>
  );
};

export default HomePage;
