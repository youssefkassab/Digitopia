import React, { useRef, useEffect } from "react";
import "../FloatingIcons.css";

// Import your 22 SVGs
import ICO1 from "../assets/FloatingIcons/ICO1.svg";
import ICO2 from "../assets/FloatingIcons/ICO2.svg";
import ICO3 from "../assets/FloatingIcons/ICO3.svg";
import ICO4 from "../assets/FloatingIcons/ICO4.svg";
import ICO5 from "../assets/FloatingIcons/ICO5.svg";
import ICO6 from "../assets/FloatingIcons/ICO6.svg";
import ICO7 from "../assets/FloatingIcons/ICO7.svg";
import ICO8 from "../assets/FloatingIcons/ICO8.svg";
import ICO9 from "../assets/FloatingIcons/ICO9.svg";
import ICO10 from "../assets/FloatingIcons/ICO10.svg";
import ICO11 from "../assets/FloatingIcons/ICO11.svg";
import ICO12 from "../assets/FloatingIcons/ICO12.svg";
import ICO13 from "../assets/FloatingIcons/ICO13.svg";
import ICO14 from "../assets/FloatingIcons/ICO14.svg";
import ICO15 from "../assets/FloatingIcons/ICO15.svg";
import ICO16 from "../assets/FloatingIcons/ICO16.svg";
import ICO17 from "../assets/FloatingIcons/ICO17.svg";
import ICO18 from "../assets/FloatingIcons/ICO18.svg";
import ICO19 from "../assets/FloatingIcons/ICO19.svg";
import ICO20 from "../assets/FloatingIcons/ICO20.svg";
import ICO21 from "../assets/FloatingIcons/ICO21.svg";
import ICO22 from "../assets/FloatingIcons/ICO22.svg";

const icons = [
  ICO1,
  ICO2,
  ICO3,
  ICO4,
  ICO5,
  ICO6,
  ICO7,
  ICO8,
  ICO9,
  ICO10,
  ICO11,
  ICO12,
  ICO13,
  ICO14,
  ICO15,
  ICO16,
  ICO17,
  ICO18,
  ICO19,
  ICO20,
  ICO21,
  ICO22,
];

export default function FloatingIcons() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Preload images
    const images = icons.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Medium-sized floating icons (dense but performant)
    const floatingIcons = Array.from({ length: 180 }).map(() => ({
      img: images[Math.floor(Math.random() * images.length)],
      x: Math.random() * width,
      y: Math.random() * height,
      size: 18 + Math.random() * 12, // 18-30px
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: 0.15 + Math.random() * 0.15,
    }));

    let animationFrame;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      floatingIcons.forEach((icon) => {
        ctx.globalAlpha = icon.opacity;
        ctx.drawImage(icon.img, icon.x, icon.y, icon.size, icon.size);
        icon.x += icon.dx;
        icon.y += icon.dy;

        // Wrap around edges
        if (icon.x > width) icon.x = -icon.size;
        if (icon.x < -icon.size) icon.x = width;
        if (icon.y > height) icon.y = -icon.size;
        if (icon.y < -icon.size) icon.y = height;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Dense CSS background for tiny icons */}
      <div className="floating-icons-bg"></div>
      {/* Canvas for medium floating icons */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
}
