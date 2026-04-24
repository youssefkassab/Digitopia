import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./GameCard.css";

const GameCard = ({ game, onPlay }) => {
  const { t } = useTranslation();

  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(game);
    }
  };

  // Check if image URL is external (starts with http/https) or internal
  const isExternalImage =
    game.img &&
    (game.img.startsWith("http://") || game.img.startsWith("https://"));
  const imageUrl = isExternalImage ? game.img : `/img/${game.img}`;

  return (
    <motion.div
      className="game-card"
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Game Image */}
      <div className="game-image-container">
        {game.img ? (
          <img
            src={imageUrl}
            alt={game.name}
            className="game-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback for failed images */}
        <div
          className={`w-full h-full ${
            game.img ? "hidden" : "flex"
          } items-center justify-center`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-2xl font-bold">
                {game.name.charAt(0)}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("gameCard.noImage")}
            </p>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="opacity-0 hover:opacity-100 bg-white bg-opacity-95 hover:bg-opacity-100 text-gray-800 font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            {t("gameCard.playGame")}
          </button>
        </div>
      </div>

      {/* Game Info */}
      <div className="game-info">
        <h3 className="game-title">{game.name}</h3>

        {game.description && (
          <p className="game-description">{game.description}</p>
        )}

        {/* Game Details */}
        <div className="game-tags">
          <span className="game-tag">
            {t("gameCard.grade")} {game.grade}
          </span>
          <span className="game-tag">
            {t("gameCard.unit")} {game.unit}
          </span>
          {game.lesson && (
            <span className="game-tag">
              {t("gameCard.lesson")} {game.lesson}
            </span>
          )}
        </div>

        {/* Play Button */}
        <button onClick={handlePlayClick} className="play-button">
          {t("gameCard.playGame")}
        </button>
      </div>
    </motion.div>
  );
};

export default GameCard;
