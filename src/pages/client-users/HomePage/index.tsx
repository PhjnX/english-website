import React from "react";
import HeroCarousel from "../Carousel";
import TargetSection from "../Target";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import KeyFeaturesSection from "../KeyFeatures";
import HowItWorksSection from "../HowItWork";
import Tips from "../Tips";

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <HeroCarousel />
      <TargetSection />
      <KeyFeaturesSection />
      <Tips />
      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default HomePage;
