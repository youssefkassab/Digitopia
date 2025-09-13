import React, { useState, useEffect } from "react";
import "./AdminSlider.css";

const slides = [
  { id: 1, text: "Welcome to the Admin Dashboard 🚀" },
  { id: 2, text: "Manage Courses, Students, and Teachers in one place 📚" },
  { id: 3, text: "Stay in control with powerful admin tools ⚙️" },
];

const AdminSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div
        className="slides-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="slide" key={slide.id}>
            <h2>{slide.text}</h2>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default AdminSlider;
