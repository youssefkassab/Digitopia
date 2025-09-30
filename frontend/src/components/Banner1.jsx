import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Animations
import playlearnanim from "../assets/Vids/play ‘n learn-anim.mp4";
import card1anim from "../assets/Vids/Book-anim-Light.mp4";
import card1animdark from "../assets/Vids/Book-anim-Dark.mp4";
import card2anim from "../assets/Vids/Gamepad-anim-Light.mp4";
import card2animdark from "../assets/Vids/Gamepad-anim-Dark.mp4";
import card3anim from "../assets/Vids/Target-anim-Light.mp4";
import card3animdark from "../assets/Vids/Target-anim-Dark.mp4";

const Banner1 = () => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="banner-container"
        initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: -15 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.9,
          ease: [0.25, 0.8, 0.25, 1], // smooth cubic bezier
        }}
      >
        <video
          className="banner-video"
          src={playlearnanim}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <h1 className="phases-title">{t("banner1.learningPhases")}</h1>

      <div className="cards-wrapper">
        {/* Left Card */}
        <motion.div
          className="banner-card"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Video */}
          <video
            className="banner-video light-vid"
            src={card1anim}
            autoPlay
            loop
            muted
            playsInline
          />
          <video
            className="banner-video dark-vid"
            src={card1animdark}
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Text Area */}
          <h1 className="card-textarea">{t("banner1.cards.learn")}</h1>
        </motion.div>

        {/* Middle Card */}
        <motion.div
          className="banner-card middle-card"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 20 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <video
            className="banner-video light-vid"
            src={card2anim}
            autoPlay
            loop
            muted
            playsInline
          />
          <video
            className="banner-video dark-vid"
            src={card2animdark}
            autoPlay
            loop
            muted
            playsInline
          />

          <h1 className="card-textarea">{t("banner1.cards.play")}</h1>
        </motion.div>

        {/* Right Card */}
        <motion.div
          className="banner-card"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <video
            className="banner-video light-vid"
            src={card3anim}
            autoPlay
            loop
            muted
            playsInline
          />
          <video
            className="banner-video dark-vid"
            src={card3animdark}
            autoPlay
            loop
            muted
            playsInline
          />

          <h1 className="card-textarea">{t("banner1.cards.target")}</h1>
        </motion.div>
      </div>
    </>
  );
};

export default Banner1;
