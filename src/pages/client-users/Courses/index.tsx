import React from "react";
import pic1 from "../../../assets/images/pic1.png";
import pic2 from "../../../assets/images/pic2.png";
import pic3 from "../../../assets/images/pic3.jpg";
import pic4 from "../../../assets/images/pic4.png";
import pic5 from "../../../assets/images/pic5.jpg";
import pic6 from "../../../assets/images/pic6.jpg";
const courses = [
  {
    duration: "4 Weeks",
    level: "Beginner",
    author: "By Van Lang Team",
    title: "Reading Comprehension Basics",
    description:
      "Build a strong foundation in English reading skills, including vocabulary building, skimming, and scanning techniques.",
    image: pic1,
  },
  {
    duration: "6 Weeks",
    level: "Intermediate",
    author: "By Van Lang Team",
    title: "Reading for Academic Purposes",
    description:
      "Master academic reading strategies to understand research papers, textbooks, and scholarly articles.",
    image: pic2,
  },
  {
    duration: "8 Weeks",
    level: "Intermediate",
    author: "By Van Lang Team",
    title: "Critical Reading Skills",
    description:
      "Improve critical thinking through reading. Learn to analyze arguments, identify bias, and evaluate sources.",
    image: pic3,
  },
  {
    duration: "10 Weeks",
    level: "Beginner",
    author: "By Van Lang Team",
    title: "Reading for General English Tests",
    description:
      "Practice with TOEIC, IELTS, and TOEFL-style passages to boost your test-taking strategies and confidence.",
    image: pic4,
  },
  {
    duration: "10 Weeks",
    level: "Intermediate",
    author: "By Van Lang Team",
    title: "Vocabulary and Context Clues",
    description:
      "Expand your vocabulary and learn to deduce meaning from context — a key skill for advanced reading.",
    image: pic5,
  },
  {
    duration: "6 Weeks",
    level: "Advanced",
    author: "By Van Lang Teams",
    title: "Research Article Reading Mastery",
    description:
      "Dive deep into research paper structures and academic language to become fluent in reading scientific literature.",
    image: pic6,
  },
];

export default function ReadingCourses() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2
        className="text-3xl font-bold text-center mb-2 "
        style={{ fontFamily: "'Bubblegum Sans', cursive" }}
      >
        Our Courses
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Enhance your English reading skills for academic and professional
        success.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex flex-col justify-between flex-grow">
              <div>
                <div className="text-sm text-gray-500 flex justify-between mb-2">
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                <p className="text-gray-600 mb-3">{course.author}</p>
                <p className="text-gray-700 text-sm min-h-[96px] mb-4">
                  {course.description}
                </p>
              </div>
              <button className="w-full bg-gray-200 text-gray-700 font-medium py-2 rounded hover:bg-gray-300 transition">
                Get It Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
