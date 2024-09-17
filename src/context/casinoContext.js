import React, { createContext, useState, useContext } from "react";

const CasinoContext = createContext();

export const CasinoProvider = ({ children }) => {
  const [selectedCasinos, setSelectedCasinos] = useState(() => {
    const storedCasinos = localStorage.getItem("casinos");
    return storedCasinos ? JSON.parse(storedCasinos) : [];
  });

  const addCasino = (casino) => {
    setSelectedCasinos((prevSelectedCasinos) => {
      const newSet = [...prevSelectedCasinos, casino];
      localStorage.setItem("casinos", JSON.stringify(newSet));
      return newSet;
    });
  };

  const removeCasino = (casino) => {
    setSelectedCasinos((prevSelectedCasinos) => {
      const newSet = prevSelectedCasinos.filter((c) => c.id !== casino.id);
      localStorage.setItem("casinos", JSON.stringify(newSet));
      return newSet;
    });
  };

  const clearCasinos = () => {
    setSelectedCasinos([]);
  };

  return (
    <CasinoContext.Provider
      value={{
        selectedCasinos,
        addCasino,
        removeCasino,
        clearCasinos,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasinoContext = () => useContext(CasinoContext);
