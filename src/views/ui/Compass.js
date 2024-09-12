import React, { useEffect, useState } from "react";
import "./index.css";
import { Drawer } from "antd";

import { CiCirclePlus } from "react-icons/ci";
import { CloseOutlined } from "@ant-design/icons";
import { FiMinusCircle } from "react-icons/fi";

import NewCasino from "../modules/NewCasino";
import CompassDataPage from "../modules/CompassDataPage";
import ChooseCasinoPage from "../modules/ChooseCasinoPage";
import ChooseGamePage from "../modules/ChooseGamePage";
import { Link } from "react-router-dom";
import Configure from "../modules/Configure";

const Compass = () => {
  const [casinos, setCasinos] = useState([]);
  const [game, setGame] = useState([]);

  const casinoJSON = localStorage.getItem("casinos");
  const gameJson = localStorage.getItem("games");

  useEffect(() => {
    if (casinoJSON) {
      const parsedCasinos = JSON.parse(casinoJSON);
      setCasinos(parsedCasinos);
    }
  }, [casinoJSON]);

  useEffect(() => {
    if (gameJson) {
      const allGames = JSON.parse(gameJson);
      setGame(allGames);
    }
  }, [gameJson]);

  const handleRemoveCasino = (id) => {
    const updatedCasinos = casinos.filter((casino) => casino.id !== id);
    setCasinos(updatedCasinos);
    localStorage.setItem("casinos", JSON.stringify(updatedCasinos));
  };

  const handleRemoveGame = (id) => {
    const updatedGames = game.filter((g) => g.id !== id);
    setGame(updatedGames);
    localStorage.setItem("games", JSON.stringify(updatedGames));
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const [open, setOpen] = useState(false);

  const [casinoDrawer, setCasinoDrawer] = useState(false);
  const [gameDrawer, setGameDrawer] = useState(false);
  const [newCasino, setNewCasino] = useState(false);
  const [configure, setConfigure] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const onClose = () => {
    setOpen(false);
    setSelectedOption("");
  };

  const showSelectedCasino = () => {
    setOpen(false);
    setConfigure(true);
  };

  // CASINO DRAWER OPEN
  const showCasinoDrawer = () => {
    setCasinoDrawer(true);
    setSelectedOption("");
  };

  // CASINO DRAWER CLOSE
  const onCasinoDrawerClose = () => {
    setCasinoDrawer(false);
    setSearchQuery("");
  };

  // GAME DRAWER OPEN
  const showGameDrawer = () => {
    // if (casinoJSON?.length > 0 && gameJson?.length > 0) {
    //   setOpen(false);
    //   setConfigure(true);
    // } else {
    //   setGameDrawer(true);
    //   setSelectedOption("");
    // }
    setGameDrawer(true);
    setSelectedOption("");
  };

  const onConfigueDrawerClose = () => {
    setConfigure(false);
  };

  // GAME DRAWER CLOSE
  const onGameDrawerClose = () => {
    setGameDrawer(false);
  };

  // NEW DRAWER OPEN
  const onNewCasinoDrawerClose = () => {
    setNewCasino(false);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    if (option == "Casino 1") {
      showCasinoDrawer();
    } else {
      showGameDrawer();
    }
  };

  return (
    <>
      {/* CALIBRATE COMPASS FIRST PAGE */}
      <CompassDataPage open={open} setOpen={setOpen} />

      {/* CALIBRATE COMPASS FIRST OFF CANVAS FOR CHOOSE CASINO OR GAME IN ANTD */}
      <div className="casino_game_selection">
        <Drawer
          title="Configure"
          width={casinoDrawer || gameDrawer || newCasino ? "89%" : "70%"}
          closable={true}
          onClose={onClose}
          maskClosable={false}
          open={open}
          closeIcon={<CloseOutlined className="custom-close-icon" />}
          // footer={
          //   <div style={{ textAlign: "right" }}>
          //     <button
          //       onClick={onClose}
          //       style={{ marginRight: 8 }}
          //       className="compass-sidebar-back"
          //     >
          //       Back
          //     </button>
          //     {selectedOption === "Casino 1" ? (
          //       <button
          //         className={`compass-sidebar-next ${
          //           !selectedOption ? "btn-disabled" : ""
          //         }`}
          //         disabled={!selectedOption}
          //         onClick={showCasinoDrawer}
          //       >
          //         Next
          //       </button>
          //     ) : (
          //       <button
          //         className={`compass-sidebar-next ${
          //           !selectedOption ? "btn-disabled" : ""
          //         }`}
          //         disabled={!selectedOption}
          //         onClick={showGameDrawer}
          //       >
          //         Next
          //       </button>
          //     )}
          //   </div>
          // }
          className={
            casinoDrawer || gameDrawer || newCasino
              ? "show_children_drawer"
              : ""
          }
        >
          <div
            className={`calibrate-title ${
              selectedOption === "Casino 1" ? "selected" : ""
            }`}
          >
            <span>Select Casino</span>
            <div className="casino-select-listing mt-4">
              {casinos?.map((data, index) => (
                <div
                  className="calibrate-casino-data-display"
                  key={index}
                  style={{ cursor: "pointer" }}
                >
                  <FiMinusCircle
                    style={{ fontSize: "22px" }}
                    onClick={() => handleRemoveCasino(data?.id)}
                  />
                  <div className="casino-data-bar" onClick={showSelectedCasino}>
                    <label htmlFor={data?.id}>{data?.name}</label>
                    <Link>{data?.site_url}</Link>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="calibrate-content mt-4"
              onClick={() => handleSelectOption("Casino 1")}
            >
              <div className="calibrate-icon">
                <CiCirclePlus />
              </div>
              <p>Start configuration by adding operator first</p>
            </div>
          </div>
          <div
            className={`calibrate-title mt-4 ${
              selectedOption === "Casino 2" ? "selected" : ""
            }`}
          >
            <span>Select Game</span>
            <div className="casino-select-listing mt-4">
              {game?.map((data, index) => (
                <div
                  className="calibrate-casino-data-display"
                  key={index}
                  style={{ cursor: "pointer" }}
                >
                  <FiMinusCircle
                    style={{ fontSize: "22px" }}
                    onClick={() => handleRemoveGame(data?.id)}
                  />
                  <div className="casino-data-bar" onClick={showSelectedCasino}>
                    <label htmlFor={data?.id}>{data?.game_original_name}</label>
                    <Link>{data?.game_provider_name}</Link>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="calibrate-content mt-4"
              onClick={() => handleSelectOption("Casino 2")}
            >
              <div className="calibrate-icon">
                <CiCirclePlus />
              </div>
              <div>
                <p>Start configuration by adding Casino game first</p>
              </div>
            </div>
          </div>

          {/* FOR SELECT CASINO DRAWER */}
          <ChooseCasinoPage
            setNewCasino={setNewCasino}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onCasinoDrawerClose={onCasinoDrawerClose}
            casinoDrawer={casinoDrawer}
            setCasinoDrawer={setCasinoDrawer}
          />

          {/* FOR SELECT GAME DRAWER */}
          <ChooseGamePage
            setNewCasino={setNewCasino}
            onGameDrawerClose={onGameDrawerClose}
            gameDrawer={gameDrawer}
            setGameDrawer={setGameDrawer}
          />

          {/* FOR ADD NEW CASINO DRAWER HERE */}
          <NewCasino
            onNewCasinoDrawerClose={onNewCasinoDrawerClose}
            newCasino={newCasino}
            setCasinoDrawer={setCasinoDrawer}
            setSearchQuery={setSearchQuery}
            setNewCasino={setNewCasino}
          />
        </Drawer>

        {/* FOR VIEW Tracking list DRAWER HERE */}
        <Configure
          setConfigure={setConfigure}
          configure={configure}
          setOpen={setOpen}
          onConfigueDrawerClose={onConfigueDrawerClose}
        />
      </div>
    </>
  );
};

export default Compass;
