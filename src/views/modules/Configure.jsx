import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { FiMinusCircle } from "react-icons/fi";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

const TrackingTime = ["7 days", "1 month", "3 months", "custom"];

const Configure = ({ configure, onConfigueDrawerClose, setConfigure }) => {
  const [trackTime, setTrackTime] = useState("");

  const [casinos, setCasinos] = useState([]);
  const [game, setGame] = useState([]);
  const [displayedGames, setDisplayedGames] = useState({});

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

      const casinoandgamedisplay = {};
      casinos.forEach((casino) => {
        allGames.forEach((game) => {
          casinoandgamedisplay[`${casino.id}-${game.id}`] = true;
        });
      });
      setDisplayedGames(casinoandgamedisplay);
    }
  }, [gameJson, casinos]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const SelectTime = (option) => {
    setTrackTime(option);
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (!startDate || date >= startDate) {
      setEndDate(date);
    }
  };

  const handleClose = () => {
    onConfigueDrawerClose();
  };

  const generateTableRows = () => {
    const rows = [];

    for (const casino of casinos) {
      for (const gameItem of game) {
        const uniqueCasinoGameId = `${casino.id}-${gameItem.id}`;

        if (displayedGames[uniqueCasinoGameId]) {
          rows.push(
            <tr key={uniqueCasinoGameId} className="table-body-items-table">
              <td scope="row" style={{ width: "40%", fontSize: "14px" }}>
                <p className="m-0">{casino.name}</p>
                <Link to={casino.site_url}>{casino.site_url}</Link>
              </td>
              <td style={{ width: "20%", fontSize: "14px" }}>
                <p className="m-0">{gameItem.game_original_name}</p>
                <Link to="/">{gameItem.game_provider_name}</Link>
              </td>
              <td className="text-end">
                <span className="badge rounded-pill me-5">
                  Combination already exists
                </span>
                <FiMinusCircle
                  style={{
                    fontSize: "25px",
                    color: "#607290",
                    cursor: "pointer",
                  }}
                  onClick={() => removeCombination(casino.id, gameItem.id)}
                />
              </td>
            </tr>
          );
        }
      }
    }

    return rows;
  };

  const removeCombination = (casinoId, gameId) => {
    const uniqueId = `${casinoId}-${gameId}`;

    setDisplayedGames((prev) => ({
      ...prev,
      [uniqueId]: false,
    }));

    const updatedGames = game.filter((game) => game.id !== gameId);

    const updatedCasinos = casinos.filter((casino) => {
      if (casino.id === casinoId) {
        return updatedGames.length > 0;
      }
      return true;
    });

    localStorage.setItem("casinos", JSON.stringify(updatedCasinos));
    localStorage.setItem("games", JSON.stringify(updatedGames));

    if (updatedGames.length > 0) {
      return setConfigure(true);
    }
  };

  return (
    <>
      <Drawer
        title="Choose Casino"
        width="75%"
        className="bg-white"
        closable={true}
        maskClosable={false}
        onClose={handleClose}
        open={configure}
        closeIcon={<CloseOutlined className="custom-close-icon" />}
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={handleClose}
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Back
            </button>
            <button
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
              onClick={handleClose}
              disabled={!(casinos?.length > 0 && game?.length > 0)}
            >
              Save
            </button>
          </div>
        }
      >
        <div className="Tracking-game-model-content">
          <div className="col-md-12">
            <h6>Tracking list will contain:</h6>
            <span>
              All the combination below are formed according to your selection
              of games and casino. You can remove combination that you don’t
              want to track.
            </span>
          </div>
          <div className="compass-data-table track_game_table pt-3">
            <table className="table table-bordered m-0">
              <thead className="table-heading-name">
                <tr>
                  <th scope="col" style={{ width: "40%" }}>
                    Operator Name
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    Game Name{" "}
                  </th>
                  <th scope="col" style={{ width: "40%" }} className="text-end">
                    ACTION
                  </th>
                </tr>
              </thead>
            </table>
            <div className="table-scroll-container">
              <table className="table table-bordered m-0">
                <tbody className="table-body-items">
                  {casinos?.length > 0 && game?.length > 0 ? (
                    generateTableRows()
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        select first game and casino please
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tracking-game-time">
            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="tracking_gaming_date">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group tracking_time_dropdown credit-field">
                          <label className="">Select Tracking Time</label>
                          <Dropdown
                            options={TrackingTime}
                            placeholder="Select tracking Time"
                            onChange={(option) => SelectTime(option)}
                            value={trackTime}
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tracking_csm_date">
                    {trackTime?.label === "custom" && (
                      <>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group credit-field">
                              <label>Tracking starts on</label>
                              <div className="tracking-game-credit">
                                <DatePicker
                                  selected={startDate}
                                  showIcon
                                  onChange={(date) =>
                                    handleStartDateChange(date)
                                  }
                                  className="w-100"
                                  dateFormat="dd/MM/yyyy"
                                  dropdownMode="select"
                                  toggleCalendarOnIconClick
                                  placeholderText="Select date"
                                  closeOnScroll={false}
                                  selectsStart
                                  startDate={startDate}
                                  icon={
                                    <FaCalendarAlt
                                      style={{ color: "#ADB5BD" }}
                                    />
                                  }
                                  // endDate={endDate}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group credit-field">
                              <label>Tracking ends on</label>
                              <div className="tracking-game-credit">
                                <DatePicker
                                  selected={endDate}
                                  dateFormat="dd/MM/yyyy"
                                  toggleCalendarOnIconClick
                                  dropdownMode="select"
                                  placeholderText="Select date"
                                  showIcon
                                  onChange={(date) => handleEndDateChange(date)}
                                  className="w-100"
                                  closeOnScroll={false}
                                  selectsEnd
                                  startDate={startDate}
                                  endDate={endDate}
                                  minDate={startDate}
                                  disabled={!startDate}
                                  icon={
                                    <FaCalendarAlt
                                      style={{ color: "#ADB5BD" }}
                                    />
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group credit-field">
                        <label>Expected credits usage</label>
                        <input
                          type="text"
                          className="form-control"
                          value={356}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group credit-field">
                        <label>Credit Balance</label>
                        <input
                          type="text"
                          className="form-control"
                          value={356}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Configure;
