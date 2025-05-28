import React from "react";
import HeroCarousel from "../Carousel";
import TargetSection from "../Target";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import HowItWorksSection from "../HowItWork";
import ResourceSection from "../ResourceSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <HeroCarousel />
      <TargetSection />
      <ResourceSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default HomePage;
