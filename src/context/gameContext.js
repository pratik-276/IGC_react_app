import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(new Set());

  const addGame = (casino) => {
    setSelectedGame((prev) => new Set(prev.add(casino)));
  };

  const removeGame = (casino) => {
    setSelectedGame((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(casino);
      return newSelected;
    });
  };

  const clearGame = () => {
    setSelectedGame(new Set());
  };

  const gameList = (game) => {
    const gameJSON = JSON.stringify(game);
    localStorage.setItem("games", gameJSON);
  };

  return (
    <GameContext.Provider
      value={{
        selectedGame,
        addGame,
        removeGame,
        clearGame,
        gameList,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
