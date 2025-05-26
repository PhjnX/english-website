import React from "react";
import HeroCarousel from "../Carousel";
import TargetSection from "../Target";
import BenefitsSection from "../Benefits";
import ReadingCourses from "../Courses";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroCarousel />
      <TargetSection />
      <BenefitsSection />
      <ReadingCourses />
    </div>
  );
};

export default HomePage;
