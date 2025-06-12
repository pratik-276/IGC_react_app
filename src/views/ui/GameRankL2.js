import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";

import { Spin } from "antd";
import "./DashboardMod.css";
import { Tooltip } from "primereact/tooltip";
import { MdInfoOutline } from "react-icons/md";

import GameTrendChart from "../../charts/GameTrendChart";
import GameRankData from "../../services/GameRank";

const GameRankL2 = () => {
  const location = useLocation();
  console.log(location.state);
  const { selected_region, game_id } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);

  const [regions, setRegions] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(selected_region);
  const [selectedGame, setSelectedGame] = useState(game_id);

  const [data, setData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [casinosData, setCasinosData] = useState([]);

  useEffect(() => {
    getRegionsList();
    getGamesList();
    getData();
  }, [selectedRegion, selectedGame]);

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
      <div className="compass">
        <div className="compass-data">
          <div className="d-flex flex-column gap-3 justify-content-between">
            <div className="d-flex align-items-center justify-content-between">
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
                        style={{ maxHeight: "100px", objectFit: "scale-down" }}
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
                        label: "RTP",
                        value: data.rt,
                        tooltip: "Game RTP",
                        tooltipTarget: "rt",
                      },
                      {
                        label: "Max Win",
                        value: data.max_win,
                        tooltip: "Game Max Win",
                        tooltipTarget: "max_win",
                      },
                      {
                        label: "visibility %",
                        value: data.visibility,
                        tooltip: "Game visibility",
                        tooltipTarget: "visibility",
                      },
                      {
                        label: "Game Theme",
                        value: data.theme,
                        tooltip: "Game theme",
                        tooltipTarget: "theme",
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
                <Column
                  header={headerWithTooltip("Casino URL")}
                  field="casino_url"
                />
                <Column
                  header={headerWithTooltip("Avg Position")}
                  field="avg_position"
                />
              </DataTable>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GameRankL2;
