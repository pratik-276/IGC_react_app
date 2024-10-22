import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState(() => {
    const storedGames = localStorage.getItem("games");
    return storedGames ? JSON.parse(storedGames) : [];
  });

  const addGame = (casino) => {
    setSelectedGame((prevSelectedCasinos) => {
      const newSet = [...prevSelectedCasinos, casino];
      localStorage.setItem("games", JSON.stringify(newSet));
      return newSet;
    });
  };

  const removeGame = (casino) => {
    setSelectedGame((prevSelectedCasinos) => {
      const newSet = prevSelectedCasinos.filter((c) => c.id !== casino.id);
      localStorage.setItem("games", JSON.stringify(newSet));
      return newSet;
    });
  };

  const clearGame = () => {
    setSelectedGame([]);
  };

  return (
    <GameContext.Provider
      value={{
        selectedGame,
        addGame,
        removeGame,
        clearGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
