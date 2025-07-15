import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { FloatLabel } from "primereact/floatlabel";
import { Spin } from "antd";

import { FaGem, FaLock } from "react-icons/fa6";

import GetApiData from "../../services/GameProvideMarketshare";
import InfoCard from "../../charts/InfoCard";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";

import "./DashboardMod.css";
import "./AccessBlur.css";

const GameProvideMarketshareL2 = () => {
  const location = useLocation();
  const regionName = location?.state?.regionName || null;
  const providerId = location?.state?.providerId || null;

  const [regionLoading, setRegionLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(regionName);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);

  const [data, setData] = useState({});
  const [gameData, setGameData] = useState([]);
  const [latestReleasesData, setLatestReleasesData] = useState([]);
  const [casinosData, setCasinosData] = useState([]);

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  // const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  useEffect(() => {
    getGeographyList();
    setSelectedRegion(regionName);
    GetProvidersList(regionName, providerId);
  }, []);

  useEffect(() => {
    const savedRegion = localStorage.getItem("marketshareRegion");
    if (savedRegion) {
      setSelectedRegion(savedRegion);
    }
  }, []);

  useEffect(() => {
    if (selectedRegion && selectedProvider) {
      getData();
    }
  }, [selectedRegion, selectedProvider]);

  async function getGeographyList() {
    setRegionLoading(true);
    GetApiData.get_geography_lists()
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((region) => region && region.geography)
            .map((region) => ({
              label: region.geography,
              value: region.geography,
            }));

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

  async function GetProvidersList(
    region_name = null,
    initialProviderId = null
  ) {
    setProviderLoading(true);

    const payload = {
      region: region_name ? region_name : selectedRegion,
    };

    GetApiData.post_provider_by_geography_lists(payload)
      .then((res) => {
        if (res?.success === true && Array.isArray(res.data)) {
          const cleaned = res.data.map((provider) => ({
            label: provider.provider_name,
            value: provider.provider_id,
          }));
          setProviders(cleaned);
          if (initialProviderId) {
            setSelectedProvider(initialProviderId);
          } else {
            setSelectedProvider(null);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setProviders([]);
      })
      .finally(() => {
        setProviderLoading(false);
      });
  }

  async function getData() {
    const payload = {
      provider_id: selectedProvider,
      region: selectedRegion,
    };

    setLoading(true);
    await getProviderMarketshareDetails(payload);
    await getProviderTopGames(payload);
    await getProviderTopCasinos(payload);
    setLoading(false);
  }

  async function getProviderMarketshareDetails(payload) {
    return GetApiData.post_provider_marketshare_details(payload)
      .then((res) => {
        if (res?.success === true) {
          setData(
            Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : {}
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setData({});
      });
  }

  async function getProviderTopGames(payload) {
    return GetApiData.post_provider_top_games(payload)
      .then((res) => {
        if (res?.success === true) {
          // console.log(res.data);
          setGameData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setGameData([]);
      });
  }

  async function getProviderLatestRelese(payload) {
    return GetApiData.post_provider_latest_relese(payload)
      .then((res) => {
        if (res?.success === true) {
          setLatestReleasesData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setLatestReleasesData([]);
      });
  }

  async function getProviderTopCasinos(payload) {
    return GetApiData.post_provider_top_casinos(payload)
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
                    Provider Details
                  </h4>
                  <span className="text-black" style={{ fontSize: "1rem" }}>
                    Details of the game provider in the selected region
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
                      onChange={(e) => {
                        setSelectedRegion(e.value);
                        setProviders([]);
                        GetProvidersList(e.value);
                      }}
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
                    placeholder="Select Provider"
                    loading={providerLoading}
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.value)}
                    options={providers}
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
              <div className="border border-secondary p-3 rounded-3 mt-3 d-flex flex-column">
                <div>
                  <h5 className="font-semibold pl-2">Details</h5>
                  <div className="flex gap-2 mt-2">
                    <InfoCard
                      header="Game Count"
                      tooltip="Shows total game count"
                      tooltipTarget="game_count"
                      value={data.game_count ?? "N/A"}
                    />

                    <InfoCard
                      header="Visibility"
                      tooltip="Shows Visibility"
                      tooltipTarget="visibility"
                      value={data.visibility ?? "N/A"}
                    />

                    <InfoCard
                      header="Current Market Share"
                      tooltip="Shows Current Market Share"
                      tooltipTarget="current_market_share"
                      value={data.current_market_share ?? "N/A"}
                    />

                    <InfoCard
                      header="Market Share Growth"
                      tooltip="Shows Market Share Growth"
                      tooltipTarget="market_share_growth"
                      value={data.market_share_growth ?? "N/A"}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <div className="flex-1">
                    <h5 className="font-semibold pl-2 mt-3">Top Games</h5>
                    {Array.isArray(gameData) && gameData.length === 0 ? (
                      <div
                        className="d-flex justify-content-center align-items-center w-100 border"
                        style={{ height: "200px" }}
                      >
                        <h5>Data not availble.</h5>
                      </div>
                    ) : (
                      <DataTable
                        value={gameData}
                        scrollable
                        scrollHeight="200px"
                        size="small"
                        className="table-bordered p-component p-datatable custom-table small"
                      >
                        <Column
                          header={headerWithTooltip("Game")}
                          field="game"
                        />
                        <Column
                          header={headerWithTooltip("Casino Count")}
                          field="casino_count"
                        />
                        <Column
                          header={headerWithTooltip("Lobby Casino Count")}
                          field="lobby_casino_count"
                        />
                        {/* <Column
                          header={headerWithTooltip("Avg Pos")}
                          field="average_position"
                        /> */}
                      </DataTable>
                    )}
                  </div>

                  {/* <div className="flex-1">
                    <h5 className="font-semibold pl-2 mt-3">Latest Releases</h5>
                    {Array.isArray(latestReleasesData) &&
                    latestReleasesData.length === 0 ? (
                      <div
                        className="d-flex justify-content-center align-items-center w-100 border"
                        style={{ height: "200px" }}
                      >
                        <h5>Data not availble.</h5>
                      </div>
                    ) : (
                      <DataTable
                        value={latestReleasesData}
                        scrollable
                        scrollHeight="200px"
                        size="small"
                        className="table-bordered p-component p-datatable custom-table small"
                      >
                        <Column
                          header={headerWithTooltip("Game")}
                          field="game"
                        />
                        <Column
                          header={headerWithTooltip("Release Date")}
                          field="release_date"
                        />
                      </DataTable>
                    )}
                  </div> */}
                </div>

                <div>
                  <h5 className="font-semibold pl-2 mt-3">Top Casinos</h5>
                  <DataTable
                    value={casinosData}
                    scrollable
                    scrollHeight="400px"
                    size="small"
                    className="table-bordered p-component p-datatable custom-table small"
                  >
                    <Column
                      header={headerWithTooltip("Casino")}
                      field="casino"
                    />
                    <Column
                      header={headerWithTooltip("Site URL")}
                      field="site_url"
                    />
                    <Column
                      header={headerWithTooltip("Game Count")}
                      field="game_count"
                    />
                    <Column
                      header={headerWithTooltip("Lobby Game Count")}
                      field="lobby_game_count"
                    />
                    {/* <Column
                      header={headerWithTooltip("Avg Pos")}
                      field="average_position"
                    /> */}
                  </DataTable>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameProvideMarketshareL2;
