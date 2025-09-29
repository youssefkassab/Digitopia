import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import GameCard from './GameCard';
import { fetchGames } from '../services/games';
import '../index.css';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameModal, setShowGameModal] = useState(false);

  // Filter states
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const gamesData = await fetchGames();
      setGames(gamesData);
    } catch (err) {
      setError('Failed to load games. Please try again later.');
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const closeGameModal = () => {
    setShowGameModal(false);
    setSelectedGame(null);
  };

  // Get unique grades and units for filters - only run when games is loaded
  const { grades, units } = useMemo(() => {
    if (!Array.isArray(games) || games.length === 0) {
      return { grades: ['All'], units: ['All'] };
    }

    const gradesList = ['All', ...new Set(games.map(game => game.grade).filter(Boolean))];
    const unitsList = ['All', ...new Set(games.map(game => game.unit).filter(Boolean))];

    return { grades: gradesList, units: unitsList };
  }, [games]);

  // Filter games based on selected filters
  const filteredGames = useMemo(() => {
    if (!Array.isArray(games) || games.length === 0) {
      return [];
    }

    return games.filter(game => {
      const matchesGrade = selectedGrade === 'All' || game.grade === selectedGrade;
      const matchesUnit = selectedUnit === 'All' || game.unit === selectedUnit;
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesGrade && matchesUnit && matchesSearch;
    });
  }, [games, selectedGrade, selectedUnit, searchTerm]);

  if (loading) {
    return (
      <div className="games-page">
        <div className="games-loading">
          <div className="games-loading-spinner"></div>
          <p className="text-lg font-medium">Loading amazing games...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest educational games</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-page">
        <div className="games-loading">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</p>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <button
            onClick={loadGames}
            className="games-empty-button"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Games - Digitopia</title>
        <meta name="description" content="Play interactive educational games for all grades" />
      </Helmet>
      <div className="games-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="games-header">
            <h1 className="games-title">
              🎮 Educational Games
            </h1>
            <p className="games-subtitle">
              Discover interactive learning experiences designed to make education fun and engaging for all ages
            </p>
          </div>

          {/* Search and Filters */}
          <div className="games-filters">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="games-search-input"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="games-select"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade === 'All' ? 'All Grades' : `Grade ${grade}`}</option>
                  ))}
                </select>

                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="games-select"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit === 'All' ? 'All Subjects' : unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {filteredGames.length === 0 ? (
                <span className="text-orange-600 dark:text-orange-400">
                  No games found matching your criteria
                </span>
              ) : (
                `Showing ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
              )}
            </p>
          </div>

          {/* Games Grid */}
          {filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map((game, index) => (
                <GameCard
                  key={game.id || index}
                  game={game}
                  onPlay={handlePlayGame}
                />
              ))}
            </div>
          ) : (
            <div className="games-empty">
              <div className="games-empty-icon">🎮</div>
              <h3 className="games-empty-title">No games found</h3>
              <p className="games-empty-message">
                Try adjusting your search criteria or browse all games
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGrade('All');
                  setSelectedUnit('All');
                }}
                className="games-empty-button"
              >
                Show All Games
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {showGameModal && selectedGame && (
          <motion.div
            className="game-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="game-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="game-modal-header">
                <div className="game-modal-header-content">
                  <h2 className="game-modal-title">{selectedGame.name}</h2>
                  <div className="game-modal-info">
                    Grade {selectedGame.grade} • Unit {selectedGame.unit} • Lesson {selectedGame.lesson}
                  </div>
                </div>
                <button
                  onClick={closeGameModal}
                  className="game-modal-close"
                >
                  ×
                </button>
              </div>

              <div className="game-modal-content">
                {selectedGame.gameurl ? (
                  <iframe
                    src={`/games/${selectedGame.gameurl}`}
                    title={selectedGame.name}
                    className="game-modal-iframe"
                    frameBorder="0"
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Game content not available</p>
                    <button
                      onClick={closeGameModal}
                      className="game-modal-close-button"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Games;
