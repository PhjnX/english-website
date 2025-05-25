import React from "react";
import Carousel from "../Carousel";
import Target from "../Target";
import Benefits from "../Benefits";
import Courses from "../Courses";

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff7f7] via-[#f9fafb] to-[#fffbe7] overflow-x-hidden">
      <main className="relative z-10">
        <Carousel />
        <Target />
        <Benefits />
        <Courses />
      </main>
    </div>
  );
};

export default HomePage;
