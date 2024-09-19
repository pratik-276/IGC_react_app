import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { FiMinusCircle } from "react-icons/fi";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, DatePicker } from "antd";
import moment from "moment";
import GameData from "../../services/CompassApi";
import toast from "react-hot-toast";

const Configure = ({
  configure,
  onConfigueDrawerClose,
  setConfigure,
  setOpen,
}) => {
  const user_id = localStorage.getItem("user_id");
  const TrackingTime = ["7 days", "1 month", "3 months", "custom"];
  const [trackTime, setTrackTime] = useState("");

  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");

  const [casinos, setCasinos] = useState([]);
  const [game, setGame] = useState([]);
  const [displayedGames, setDisplayedGames] = useState({});

  const casinoJSON = localStorage.getItem("casinos");
  const gameJson = localStorage.getItem("games");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  const handleClose = () => {
    onConfigueDrawerClose();
    setStartDate(null);
    setEndDate(null);
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

  const onStartDateChange = (date, dateString) => {
    setStartDate(date?.format("YYYY-MM-DD"));
    setEndDate(null);
  };

  const onEndDateChange = (date, dateString) => {
    setEndDate(date?.format("YYYY-MM-DD"));
  };

  const disableStartDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const disableEndDate = (current) => {
    return current && startDate && current <= moment(startDate, "YYYY-MM-DD");
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleTrackTimeChange = (option) => {
    const selectedTime = option.value;
    setTrackTime(selectedTime);

    const today = new Date();
    setInitialDate(formatDate(today));

    let calculatedFinalDate = new Date(today);
    switch (selectedTime) {
      case "7 days":
        calculatedFinalDate.setDate(today.getDate() + 6);
        break;
      case "1 month":
        calculatedFinalDate.setMonth(today.getMonth() + 1);
        break;
      case "3 months":
        calculatedFinalDate.setMonth(today.getMonth() + 3);
        break;
      case "custom":
        calculatedFinalDate = "";
        break;
      default:
        break;
    }

    setFinalDate(calculatedFinalDate ? formatDate(calculatedFinalDate) : "");
  };

  const handleSaveCasinoGame = () => {
    const data = [];
    casinos?.forEach((casino) => {
      game?.forEach((g) => {
        data.push({
          user_id: user_id,
          operator_id: casino.id,
          game_id: g.id,
          start_date: trackTime === "custom" ? startDate : initialDate,
          end_date: trackTime === "custom" ? endDate : finalDate,
        });
      });
    });

    GameData.compass_create(data)
      .then((res) => {
        if (res?.success === true) {
          toast.success("Combination Create Successfully!");
          onConfigueDrawerClose();
          setStartDate(null);
          setEndDate(null);
          setTrackTime("");
          localStorage.removeItem("games");
          localStorage.removeItem("casinos");
          setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
              onClick={handleSaveCasinoGame}
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
                      <div className="col-md-4">
                        <div className="form-group tracking_time_dropdown credit-field">
                          <label className="">Select Tracking Time</label>
                          <Dropdown
                            options={TrackingTime}
                            placeholder="Select tracking Time"
                            onChange={handleTrackTimeChange}
                            value={trackTime}
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tracking_csm_date">
                    {trackTime === "custom" && (
                      <>
                        <div className="start-end-date-selection">
                          <div className="form-group credit-field">
                            <label>Tracking starts on</label>
                            <div className="tracking-game-credit">
                              <DatePicker
                                onChange={onStartDateChange}
                                className="w-100"
                                allowClear={false}
                                format="DD-MM-YYYY"
                                disabledDate={disableStartDate}
                                value={
                                  startDate
                                    ? moment(startDate, "YYYY-MM-DD")
                                    : null
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group credit-field">
                            <label>Tracking ends on</label>
                            <div className="tracking-game-credit">
                              <DatePicker
                                onChange={onEndDateChange}
                                className="w-100"
                                format="DD-MM-YYYY"
                                allowClear={false}
                                disabled={!startDate}
                                disabledDate={disableEndDate}
                                value={
                                  endDate ? moment(endDate, "YYYY-MM-DD") : null
                                }
                              />
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
