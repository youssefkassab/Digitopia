import api from './api';

export const fetchGames = async () => {
  try {
    const response = await api.get('/game/all');
    // Ensure we always return an array
    const games = Array.isArray(response.data) ? response.data : [];
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const createGame = async (gameData) => {
  try {
    const formData = new FormData();

    // Add text fields
    Object.keys(gameData).forEach(key => {
      if (key !== 'gameFile' && key !== 'imgFile') {
        formData.append(key, gameData[key]);
      }
    });

    // Add files
    if (gameData.gameFile) {
      formData.append('gameFile', gameData.gameFile);
    }
    if (gameData.imgFile) {
      formData.append('imgFile', gameData.imgFile);
    }

    const response = await api.post('/game/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

export const updateGame = async (gameData) => {
  try {
    const formData = new FormData();

    // Add text fields
    Object.keys(gameData).forEach(key => {
      if (key !== 'gameFile' && key !== 'imgFile') {
        formData.append(key, gameData[key]);
      }
    });

    // Add files
    if (gameData.gameFile) {
      formData.append('gameFile', gameData.gameFile);
    }
    if (gameData.imgFile) {
      formData.append('imgFile', gameData.imgFile);
    }

    const response = await api.patch('/game/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};

export const deleteGame = async (gameId) => {
  try {
    const response = await api.delete('/game/delete', {
      data: { id: gameId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
};
