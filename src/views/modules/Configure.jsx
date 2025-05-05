import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-dropdown/style.css";
import { FiMinusCircle } from "react-icons/fi";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import GameData from "../../services/CompassApi";
import toast from "react-hot-toast";

const Configure = ({
  configure,
  onConfigueDrawerClose,
  setConfigure,
  setOpen,
  getCompassReadData,
}) => {
  const user_id = localStorage.getItem("user_id");

  const [casinos, setCasinos] = useState([]);
  const [game, setGame] = useState([]);
  const [displayedGames, setDisplayedGames] = useState({});

  const casinoJSON = localStorage.getItem("casinos");
  const gameJson = localStorage.getItem("games");

  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(sevenDaysLater));

  const [section_title, setSectionTitle] = useState("");
  const [minimum_position, setMinPosition] = useState(1);
  const [maximum_position, setMaxPosition] = useState(50);

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
    setStartDate(formatDate(today));
    setEndDate(formatDate(sevenDaysLater));
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
                {/* <span className="badge rounded-pill me-5">
                  Combination already exists
                </span> */}
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

    // const updatedGames = game.filter((game) => game.id !== gameId);

    // const updatedCasinos = casinos.filter((casino) => {
    //   if (casino.id === casinoId) {
    //     return updatedGames.length > 0;
    //   }
    //   return true;
    // });

    // localStorage.setItem("casinos", JSON.stringify(updatedCasinos));
    // localStorage.setItem("games", JSON.stringify(updatedGames));

    // if (updatedGames.length > 0) {
    //   return setConfigure(true);
    // }
  };

  const onStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const onEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSaveCasinoGame = () => {
    const data = [];

    // casinos?.forEach((casino) => {
    //   game?.forEach((g) => {
    //     data.push({
    //       user_id: user_id,
    //       operator_id: casino.id,
    //       game_id: g.id,
    //       start_date: startDate,
    //       end_date: endDate,
    //       game_name: g.game_original_name,
    //       game_provider: g.game_provider_name,
    //       section_name: section_title,
    //       min_position: minimum_position,
    //       max_position: maximum_position,
    //     });
    //   });
    // });

    casinos?.forEach((casino) => {
      game?.forEach((g) => {
        const uniqueId = `${casino.id}-${g.id}`;
        if (displayedGames[uniqueId]) {
          data.push({
            user_id: user_id,
            operator_id: casino.id,
            game_id: g.id,
            start_date: startDate,
            end_date: endDate,
            game_name: g.game_original_name,
            game_provider: g.game_provider_name,
            section_name: section_title,
            min_position: minimum_position,
            max_position: maximum_position,
          });
        }
      });
    });

    if (data.length === 0) {
      toast.error("No combinations selected to save.");
      return;
    }

    GameData.compass_create(data)
      .then((res) => {
        if (res?.success === true) {
          toast.success("Combination Create Successfully!");
          onConfigueDrawerClose();
          localStorage.removeItem("games");
          localStorage.removeItem("casinos");
          setOpen(false);
          setStartDate(formatDate(today));
          setEndDate(formatDate(sevenDaysLater));
          getCompassReadData();
          setCasinos([]);
          setGame([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Drawer
        title="Enter Tracker Details"
        width="75%"
        className="bg-white configure_add_drawer"
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
              className={`compass-sidebar-back ${(!startDate || !endDate || casinos.length === 0 || game.length === 0)
                ? "btn-disabled"
                : ""
                }`}
              onClick={handleSaveCasinoGame}
              disabled={!startDate || !endDate || casinos.length === 0 || game.length === 0}
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
                    Action
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
            <div className="d-flex align-items-center gap-2">

              <div className="form-group credit-field">
                <label>Tracking starts on</label>
                <div className="tracking-game-credit date-input-wrapper">
                  <input
                    type="date"
                    className="form-control"
                    onChange={onStartDateChange}
                    required
                    value={startDate}
                    style={{ color: startDate ? "black" : "gray" }}
                  />
                  {!startDate && (
                    <div className="placeholder-text">
                      Select a date
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group credit-field">
                <label>Tracking ends on</label>
                <div className="tracking-game-credit date-input-wrapper">
                  <input
                    type="date"
                    className="form-control"
                    onChange={onEndDateChange}
                    value={endDate}
                    required
                    style={{ color: endDate ? "black" : "gray" }}
                  />
                  {!endDate && (
                    <div className="placeholder-text">
                      Select a date
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group credit-field">
                <label>Section Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={section_title}
                  onChange={(e) => setSectionTitle(e.target.value)}
                />
              </div>

              <div className="form-group credit-field">
                <label>Min Position</label>
                <input
                  type="text"
                  className="form-control"
                  value={minimum_position}
                  onChange={(e) => setMinPosition(e.target.value)}
                />
              </div>

              <div className="form-group credit-field">
                <label>Max Position</label>
                <input
                  type="text"
                  className="form-control"
                  value={maximum_position}
                  onChange={(e) => setMaxPosition(e.target.value)}
                />
              </div>

            </div>
          </div>

        </div>
      </Drawer>
    </>
  );
};

export default Configure;
