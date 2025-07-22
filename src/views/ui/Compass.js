import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NewCasino from "../modules/NewCasino";
import CompassDataPage from "../modules/CompassDataPage";
import ChooseCasinoPage from "../modules/ChooseCasinoPage";
import ChooseGamePage from "../modules/ChooseGamePage";
import Configure from "../modules/Configure";

import { Button } from "primereact/button";

import { Drawer } from "antd";

import { CiCirclePlus } from "react-icons/ci";
import { FaGem, FaLock } from "react-icons/fa6";
import { CloseOutlined } from "@ant-design/icons";
import { FiMinusCircle } from "react-icons/fi";

import CompassData from "../../services/CompassApi";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";

import "./index.css";
import "./Compass.css";
import "./AccessBlur.css";

const Compass = () => {
  const user_id = localStorage.getItem("user_id");
  const [casinos, setCasinos] = useState([]);
  const [game, setGame] = useState([]);

  const casinoJSON = localStorage.getItem("casinos");
  const gameJson = localStorage.getItem("games");

  const [open, setOpen] = useState(false);

  const [casinoDrawer, setCasinoDrawer] = useState(false);
  const [gameDrawer, setGameDrawer] = useState(false);
  const [newCasino, setNewCasino] = useState(false);
  const [configure, setConfigure] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  //const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  useEffect(() => {
    const parsedCasinos = JSON.parse(casinoJSON);
    setCasinos(parsedCasinos);
  }, [casinoJSON]);

  useEffect(() => {
    const allGames = JSON.parse(gameJson);
    setGame(allGames);
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

  const onClose = () => setOpen(false);

  const showCasinoDrawer = () => setCasinoDrawer(true);

  const onCasinoDrawerClose = () => {
    setCasinoDrawer(false);
    setSearchQuery("");
  };

  const showGameDrawer = () => setGameDrawer(true);

  const onGameDrawerClose = () => setGameDrawer(false);

  const onNewCasinoDrawerClose = () => setNewCasino(false);

  const onConfigueDrawerClose = () => setConfigure(false);

  const handleSelectOption = (option) => {
    if (option === "Casino 1") {
      showCasinoDrawer();
    } else {
      showGameDrawer();
    }
  };

  const showConfigueDrawer = () => setConfigure(true);

  const showNextButton = casinos?.length > 0 && game?.length > 0;

  // CODE FOR CALIBRATE COMPASS TABLE LISTING START
  const [compassRead, setCompassRead] = useState([]);
  const [loader, setLoader] = useState(true);

  const getCompassReadData = () => {
    setLoader(true);
    CompassData.compass_read({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res?.success) {
          setCompassRead(res?.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getCompassReadData();
  }, [user_id]);

  return (
    <>
      <div className={`w-100 h-100 ${isPlanExpired ? "overlay active" : ""}`}>
        {/* CALIBRATE COMPASS FIRST PAGE */}
        <CompassDataPage
          open={open}
          setOpen={setOpen}
          compassRead={compassRead}
          loader={loader}
          getCompassReadData={getCompassReadData}
        />
      </div>

      {/* CALIBRATE COMPASS FIRST DRAWER FOR CHOOSE CASINO OR GAME IN ANTD */}
      <div className="casino_game_selection">
        <Drawer
          title="Configure"
          width={casinoDrawer || gameDrawer || newCasino ? "89%" : "70%"}
          closable={true}
          onClose={onClose}
          maskClosable={false}
          classNames="casino_game_selection_drawer"
          open={open}
          closeIcon={<CloseOutlined className="custom-close-icon" />}
          footer={
            <>
              {showNextButton && (
                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={onClose}
                    style={{ marginRight: 8 }}
                    className="compass-sidebar-back"
                  >
                    Back
                  </button>
                  <button
                    className="compass-sidebar-next"
                    onClick={showConfigueDrawer}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          }
          className={`${
            casinoDrawer || gameDrawer || newCasino
              ? "show_children_drawer"
              : "drawer-mobile"
          }`}
        >
          <div className="calibrate-title" style={{ cursor: "pointer" }}>
            <span>Select Casino</span>
            <div className="casino-select-listing mt-2 mt-md-4">
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
                  <div className="casino-data-bar">
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
              <p>{casinos && casinos.length > 0 ? "Change casino selection" : "Start configuration by adding casino first"}</p>
            </div>
          </div>
          <div
            className="calibrate-title mt-md-4 mt-3"
            style={{ cursor: "pointer" }}
          >
            <span>Select Game</span>
            <div className="casino-select-listing mt-2 mt-md-4">
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
                  <div className="casino-data-bar">
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
                <p>{game && game.length > 0 ? "Add more games" : "Start configuration by adding games"}</p>
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
          getCompassReadData={getCompassReadData}
          setCasinos={setCasinos}
          setGame={setGame}
        />
      </div>
    </>
  );
};

export default Compass;
