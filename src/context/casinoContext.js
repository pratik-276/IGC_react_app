import React, { createContext, useState, useContext } from "react";

const CasinoContext = createContext();

export const CasinoProvider = ({ children }) => {
  const [selectedCasinos, setSelectedCasinos] = useState(new Set());

  const addCasino = (casino) => {
    setSelectedCasinos((prev) => new Set(prev.add(casino)));
  };

  const removeCasino = (casino) => {
    setSelectedCasinos((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(casino);
      return newSelected;
    });
  };

  const clearCasinos = () => {
    setSelectedCasinos(new Set());
  };

  const casinoList = (casino) => {
    const casinoJSON = JSON.stringify(casino);
    localStorage.setItem("casinos", casinoJSON);
  };

  return (
    <CasinoContext.Provider
      value={{
        selectedCasinos,
        addCasino,
        removeCasino,
        clearCasinos,
        casinoList,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};

export const useCasinoContext = () => useContext(CasinoContext);
