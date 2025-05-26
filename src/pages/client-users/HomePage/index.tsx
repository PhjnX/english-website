import React from "react";
import HeroCarousel from "../Carousel";
import TargetSection from "../Target";
import BenefitsSection from "../Benefits";
import ReadingCourses from "../Courses";
import Header from "../_components/Header";
import Footer from "../_components/Footer";

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <HeroCarousel />
      <TargetSection />
      <BenefitsSection />
      <ReadingCourses />
      <Footer />
    </div>
  );
};

export default HomePage;
