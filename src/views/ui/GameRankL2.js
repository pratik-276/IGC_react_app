import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { FloatLabel } from "primereact/floatlabel";

import { Spin } from "antd";

import { FaGem, FaLock } from "react-icons/fa6";
import { MdInfoOutline } from "react-icons/md";

import GameTrendChart from "../../charts/GameTrendChart";
import GameRankData from "../../services/GameRank";

import { useContext } from "react";
import { useContactSales } from "../../context/confirmationContext";
import { ProfileSystem } from "../../context/ProfileContext";

import "./DashboardMod.css";
import "./AccessBlur.css";

const GameRankL2 = () => {
  const location = useLocation();
  console.log(location.state);
  const { game_id } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);

  const [regions, setRegions] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("United States");
  const [selectedGame, setSelectedGame] = useState(game_id);

  const [data, setData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [casinosData, setCasinosData] = useState([]);

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  // const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  useEffect(() => {
    getRegionsList();
    getGamesList();
    getData();
  }, [selectedRegion, selectedGame]);

  useEffect(() => {
    const savedRegion = localStorage.getItem("gameRegion");
    if (savedRegion) {
      setSelectedRegion(savedRegion);
    }
  }, []);

  async function getRegionsList() {
    setRegionLoading(true);
    GameRankData.get_regions()
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((region) => region !== null && typeof region === "string")
            .map((region) => ({ label: region, value: region }));

          setRegions(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
        setRegions([]);
      })
      .finally(() => {
        setRegionLoading(false);
      });
  }

  async function getGamesList() {
    setGameLoading(true);

    const payload = {
      region: selectedRegion,
    };

    GameRankData.get_games(payload)
      .then((res) => {
        if (res?.success === true && Array.isArray(res.data)) {
          const cleaned = res.data.map((game) => ({
            label: game.game,
            value: game.game_id,
          }));
          setGames(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
        setGames([]);
      })
      .finally(() => {
        setGameLoading(false);
      });
  }

  async function getData() {
    const payload = {
      game_id: selectedGame,
      region: selectedRegion,
    };

    setLoading(true);
    await getGameRankDetails(payload);
    await getGameRankTrend(payload);
    await getGameRankCasinos(payload);
    setLoading(false);
  }

  async function getGameRankDetails(payload) {
    return GameRankData.get_game_rank_details(payload)
      .then((res) => {
        if (res?.success === true) {
          console.log(res.data);
          setData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setData([]);
      });
  }

  async function getGameRankTrend(payload) {
    return GameRankData.get_game_rank_trend(payload)
      .then((res) => {
        if (res?.success === true) {
          setTrendData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setTrendData([]);
      });
  }

  async function getGameRankCasinos(payload) {
    return GameRankData.get_game_rank_casinos(payload)
      .then((res) => {
        if (res?.success === true) {
          setCasinosData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setCasinosData([]);
      });
  }

  const headerWithTooltip = (headerText) => (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ width: "100%" }}
    >
      <div className="d-flex align-items-center m-1">
        <h5 style={{ margin: 0 }}>{headerText}</h5>
      </div>
    </div>
  );

  return (
    <>
      <div className={`content ${isPlanExpired ? "show" : ""}`}>
        <FaLock
          style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#392f6c" }}
        />
        <p className="fw-bold">Your plan has expired</p>
        <Button className="btn-upgrade" onClick={showContactSalesConfirmation}>
          <FaGem /> <span>Upgrade Plan</span>
        </Button>
      </div>

      <div className={`w-100 h-100 ${isPlanExpired ? "overlay active" : ""}`}>
        <div className="compass">
          <div className="compass-data">
            <div className="d-flex flex-column gap-3 justify-content-between">
              <div className="d-flex align-items-center justify-content-between pt-3">
                <div>
                  <h4
                    className="m-md-0 font-semibold"
                    style={{ color: "#392f6c" }}
                  >
                    Game Rank Details
                  </h4>
                  <span className="text-black" style={{ fontSize: "1rem" }}>
                    Details of the game rank in the selected region
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <FloatLabel>
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    filter
                    placeholder="Select Region"
                    loading={regionLoading}
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.value)}
                    options={regions}
                  />
                                                                          <label className="fs-6" htmlFor="region">
                                                                            Select Region
                                                                          </label>
                                                                        </FloatLabel>

                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    filter
                    placeholder="Select Game"
                    loading={gameLoading}
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.value)}
                    options={games}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <>
              <div
                className="row align-items-center justify-content-center"
                style={{ height: "500px" }}
              >
                <div className="col-md-5">
                  <div className="text-center">
                    <Spin size="large" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="border border-secondary p-3 rounded-3 mt-3">
                <h5 className="font-semibold pl-2">Game Rank Details</h5>
                <div className="row g-2">
                  <div className="col-md-3">
                    <div
                      className="d-flex flex-column w-100 h-100 pl-2 pt-2"
                      style={{
                        borderTop: "1px solid #392f6c",
                        borderRight: "1px solid #392f6c",
                        borderBottom: "1px solid #392f6c",
                        borderLeft: "6px solid #392f6c",
                      }}
                    >
                      <h5>Game Image</h5>
                      {data.game_image_base64 ? (
                        <img
                          src={data.game_image_base64}
                          alt="Game"
                          className="img-fluid mb-1"
                          style={{
                            maxHeight: "100px",
                            objectFit: "scale-down",
                          }}
                        />
                      ) : (
                        <h5 className="font-semibold">N/A</h5>
                      )}
                    </div>
                  </div>

                  <div className="col-md-9">
                    <div className="row g-2 h-100">
                      {[
                        {
                          label: "Game Name",
                          value: data.game_name,
                          tooltip: "Game Name",
                          tooltipTarget: "game_name",
                        },
                        {
                          label: "Provider Name",
                          value: data.provider_name,
                          tooltip: "Game Provider Name",
                          tooltipTarget: "provider_name",
                        },
                        {
                          label: "Casinos Present",
                          value: data.casinos_present,
                          tooltip: "Casinos Present",
                          tooltipTarget: "casinos_present",
                        },
                        {
                          label: "Lobby %",
                          value: data.loby_perc,
                          tooltip: "Lobby %",
                          tooltipTarget: "loby_perc",
                        },
                        {
                          label: "visibility %",
                          value: data.visibility,
                          tooltip: "Game visibility",
                          tooltipTarget: "visibility",
                        },
                      ].map((item, idx) => (
                        <div className="col-md-4 d-flex" key={idx}>
                          <div
                            className="d-flex flex-column w-100 pl-2 pt-2 justify-content-center"
                            style={{
                              borderTop: "1px solid #392f6c",
                              borderRight: "1px solid #392f6c",
                              borderBottom: "1px solid #392f6c",
                              borderLeft: "6px solid #392f6c",
                              flex: 1,
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <h5 className="mb-0">{item.label}</h5>
                              <Tooltip
                                target={`.${item.tooltipTarget}`}
                                content={item.tooltip}
                                position="top"
                                className="custom-tooltip"
                              />
                              <MdInfoOutline
                                className={`${item.tooltipTarget} m-2`}
                                style={{
                                  fontSize: "16px",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                }}
                              />
                            </div>
                            <h5
                              className="font-semibold"
                              title={
                                item.label === "Game Theme"
                                  ? item.value ?? "N/A"
                                  : ""
                              }
                              style={
                                item.label === "Game Theme"
                                  ? {
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }
                                  : {}
                              }
                            >
                              {item.value ?? "N/A"}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <h5 className="font-semibold pl-2 mt-3">Rank Trend</h5>
                {Array.isArray(trendData) && trendData.length === 0 ? (
                  <div
                    className="d-flex justify-content-center align-items-center w-100 border"
                    style={{ height: "100px" }}
                  >
                    <h5>Trend data not availble.</h5>
                  </div>
                ) : (
                  <GameTrendChart data={trendData} />
                )}

                <h5 className="font-semibold pl-2 mt-3">Top Casinos</h5>
                <DataTable
                  value={casinosData}
                  scrollable
                  size="small"
                  className="table-bordered p-component p-datatable custom-table small"
                >
                  <Column
                    header={headerWithTooltip("Casino Name")}
                    field="casino_name"
                  />
                  <Column header={headerWithTooltip("State")} field="state" />
                  <Column
                    header={headerWithTooltip("Casino URL")}
                    field="casino_url"
                    body={(rowData) => (
                      <a
                        href={rowData.casino_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          maxWidth: "200px",
                          color: "#0066cc",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={rowData.casino_url}
                      >
                        {rowData.casino_url}
                      </a>
                    )}
                  />
                  <Column
                    header={headerWithTooltip("Lobby Pos")}
                    field="lobby_position"
                  />
                  <Column
                    header={headerWithTooltip("Sec Name")}
                    field="section_name"
                  />
                  <Column
                    header={headerWithTooltip("Sec Pos")}
                    field="section_position"
                  />
                  <Column
                    header={headerWithTooltip("Sec Game Pos")}
                    field="section_game_position"
                  />
                </DataTable>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameRankL2;
