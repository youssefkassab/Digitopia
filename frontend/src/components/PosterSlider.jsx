import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { posters } from "../data/posters";

export default function PosterSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % posters.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="poster-slider">
      <AnimatePresence initial={false} custom={direction}>
        <motion.a
          key={posters[index].id}
          href={posters[index].link}
          className="poster-slide"
          style={{ backgroundImage: `url(${posters[index].image})` }}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="poster-top">
            <img
              src={posters[index].logo}
              alt={posters[index].title}
              className="poster-logo"
            />
          </div>
          <div className="poster-bottom">
            <button className="poster-button">...</button>
            <p className="poster-description">
              <span className="poster-genre">{posters[index].genre}</span> ·{" "}
              {posters[index].description}
            </p>
          </div>
        </motion.a>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        className="poster-arrow left"
        onClick={prevSlide}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        className="poster-arrow right"
        onClick={nextSlide}
        aria-label="Next"
      >
        ›
      </button>

      {/* Dots */}
      <div className="poster-dots">
        {posters.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`poster-dot ${i === index ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
