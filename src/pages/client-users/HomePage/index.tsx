import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from "../Carousel";
import TargetSection from "../Target";
import BenefitsSection from "../Benefits";
import ReadingCourses from "../Courses";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const token = localStorage.getItem('token');



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

