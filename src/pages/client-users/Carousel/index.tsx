import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

const HeroCarousel: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          <span className="inline-flex items-center justify-center bg-white  text-red-600 font-bold px-3 py-1 rounded-md mr-2">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded mr-2">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-white text-xl font-sans"
              />
            </div>
            Improve
            <span className="text-black ml-2 font-sans">
              Your English Reading Skills
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl text-gray-700 mb-1 font-bold font-sans  ">
          with Online Reading Practice for University Students
        </p>
        <p className="text-sm text-gray-500 mb-6 font-sans">
          Learn with Custom Exercise and Track Your Progress
        </p>

        <div className="flex justify-center mt-10 font-sans">
          <button className="bg-red-500  !text-white px-4 py-3.5 rounded-full font-semibold hover:bg-red-700 transition duration-300 text-sm cursor-pointer">
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
