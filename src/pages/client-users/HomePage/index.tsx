import React from "react";
import HeroCarousel from "../Carousel";
import TargetSection from "../Target";
import BenefitsSection from "../Benefits";
import ReadingCourses from "../Courses";
export default function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <TargetSection />
      <BenefitsSection />
      <ReadingCourses />
    </div>
  );
}
