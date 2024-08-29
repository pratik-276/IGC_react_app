import React, { useState } from "react";
import "./index.css";
import { data } from "./dummydata";
import { Link } from "react-router-dom";
import { Drawer } from "antd";

import { CiCirclePlus } from "react-icons/ci";
import { FiMinusCircle } from "react-icons/fi";
import { CloseOutlined } from "@ant-design/icons";

import NewCasino from "../modules/NewCasino";
import CompassDataPage from "../modules/CompassDataPage";
import ChooseCasinoPage from "../modules/ChooseCasinoPage";
import ChooseGamePage from "../modules/ChooseGamePage";

const Compass = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const [open, setOpen] = useState(false);

  const [casinoDrawer, setCasinoDrawer] = useState(false);
  const [gameDrawer, setGameDrawer] = useState(false);
  const [newCasino, setNewCasino] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const onClose = () => {
    setOpen(false);
    setSelectedOption("");
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
    setGameDrawer(true);
    setSelectedOption("");
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
  };

  return (
    <>
      {/* CALIBRATE COMPASS FIRST PAGE */}
      <CompassDataPage open={open} setOpen={setOpen} />

      {/* CALIBRATE COMPASS FIRST OFF CANVAS FOR CHOOSE CASINO OR GAME IN ANTD */}
      <Drawer
        title="Configure"
        width={casinoDrawer || gameDrawer || newCasino ? "100%" : "70%"}
        closable={true}
        onClose={onClose}
        maskClosable={false}
        open={open}
        closeIcon={<CloseOutlined className="custom-close-icon" />}
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={onClose}
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Back
            </button>
            {selectedOption === "Casino 1" ? (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                disabled={!selectedOption}
                onClick={showCasinoDrawer}
              >
                Next
              </button>
            ) : (
              <button
                className={`compass-sidebar-next ${
                  !selectedOption ? "btn-disabled" : ""
                }`}
                disabled={!selectedOption}
                onClick={showGameDrawer}
              >
                Next
              </button>
            )}
          </div>
        }
        className={
          casinoDrawer || gameDrawer || newCasino ? "show_children_drawer" : ""
        }
      >
        <div
          className={`calibrate-title ${
            selectedOption === "Casino 1" ? "selected" : ""
          }`}
          onClick={() => handleSelectOption("Casino 1")}
        >
          <span>Select Casino</span>
          {/* <div className="casino-select-listing mt-4">
            {data?.map((data, index) => (
              <div className="calibrate-casino-data-display" key={data.id}>
                <FiMinusCircle style={{ fontSize: "22px" }} />
                <div className="casino-data-bar">
                  <label htmlFor={data.id}>{data.name}</label>
                  <Link>{data.link}</Link>
                </div>
              </div>
            ))}
          </div> */}
          <div className="calibrate-content mt-4">
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
          onClick={() => handleSelectOption("Casino 2")}
        >
          <span>Select Game</span>
          <div className="casino-select-listing mt-4">
            {/* {data?.map((data, index) => (
              <div className="calibrate-casino-data-display" key={data.id}>
                <FiMinusCircle style={{ fontSize: "22px" }} />
                <div className="casino-data-bar">
                  <label htmlFor={data.id}>{data.name}</label>
                  <Link>{data.link}</Link>
                </div>
              </div>
            ))} */}
          </div>
          <div className="calibrate-content mt-4">
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
        />

        {/* FOR SELECT GAME DRAWER */}
        <ChooseGamePage
          setNewCasino={setNewCasino}
          onGameDrawerClose={onGameDrawerClose}
          gameDrawer={gameDrawer}
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
    </>
  );
};

export default Compass;
