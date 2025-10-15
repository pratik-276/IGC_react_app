import { useEffect, useState, useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";
import AnalyticsData from "../../services/AnalyticsApi";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin } from "antd";
import { FaGem, FaLock } from "react-icons/fa6";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./CompetitorDashboardMod.css";
import "./AccessBlur.css";

import GlobalCoverageTrendChart from "../../charts/AnalyticsPageCharts/GlobalCoverageTrendChart";
import KpiCard from "../../charts/AnalyticsPageCharts/KpiCard";
import ProviderCoverageTrendChart from "../../charts/AnalyticsPageCharts/providerCoverageTrendChart";
import AveragePositionTrendChart from "../../charts/AnalyticsPageCharts/averagePositionTrendChart";
import GameStabilityTrendChart from "../../charts/AnalyticsPageCharts/gameStabilityTrendChart";
import SectionMappingBarChart from "../../charts/AnalyticsPageCharts/sectionMappingBarChart";

const AnalyticsPage = () => {
  const { state } = useContext(ProfileSystem);
  console.log("Auth state:", state);
  const user_company = localStorage.getItem("user_company");
  const provider_id = localStorage.getItem("provider_id");

  const [regionsList, setRegionsList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  const [regionListLoader, setRegionListLoader] = useState(true);
  const [countryListLoader, setCountryListLoader] = useState(false);
  const [gameListLoader, setGameListLoader] = useState(false);

  const [kpiDataLoader, setKpiDataLoader] = useState(false);
  const [globalCoverageDataLoader, setGlobalCoverageDataLoader] =
    useState(false);
  const [providerCoverageDataLoader, setProviderCoverageDataLoader] =
    useState(false);
  const [averagePositionDataLoader, setAveragePositionDataLoader] =
    useState(false);
  const [gameStabilityDataLoader, setGameStabilityDataLoader] = useState(false);
  const [sectionMappingDataLoader, setSectionMappingDataLoader] =
    useState(false);
  const [casinoTableDataLoader, setCasinoTableDataLoader] = useState(false);

  const [kpiData, setKpiData] = useState([]);
  const [globalCoverageData, setGlobalCoverageData] = useState([]);
  const [providerCoverageData, setProviderCoverageData] = useState([]);
  const [averagePositionData, setAveragePositionData] = useState([]);
  const [gameStabilityData, setGameStabilityData] = useState([]);
  const [sectionMappingData, setSectionMappingData] = useState([]);
  const [casinoTableData, setCasinoTableData] = useState([]);

  const [expandedRows, setExpandedRows] = useState(null);
  const [rowDetails, setRowDetails] = useState({});
  const [loadingRows, setLoadingRows] = useState({});

  const isPlanExpired = state?.plan === "trial_expired";
  // const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  const getRegionsList = () => {
    setRegionListLoader(true);
    const payload = {
      provider_id: provider_id,
      search_term: "",
    };
    AnalyticsData.post_region_filters(payload)
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((item) => item?.region && typeof item.region === "string")
            .map((item) => ({
              label: item.region,
              value: item.region,
            }));
          setRegionsList(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
        setRegionsList([]);
      })
      .finally(() => {
        setRegionListLoader(false);
      });
  };

  const countryDropdownData = () => {
    setCountryListLoader(true);
    const payload = {
      provider_id: provider_id,
      search_term: "",
      region: selectedRegion,
    };
    AnalyticsData.post_country_by_region(payload)
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((item) => item?.country && typeof item.country === "string")
            .map((item) => ({
              label: item.country,
              value: item.country,
            }));

          setCountryList(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setCountryListLoader(false);
      });
  };

  const gameDropdownData = () => {
    setGameListLoader(true);

    const payload = {
      provider_id: provider_id,
      search_term: "",
      region: selectedRegion,
      country: selectedCountry,
    };

    AnalyticsData.post_game_by_country(payload)
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((item) => item?.game && typeof item.game === "string")
            .map((item) => ({
              label: item.game,
              value: item.game,
            }));
          setGameList(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setGameListLoader(false));
  };

  const getKpiData = (payload) => {
    setKpiDataLoader(true);

    AnalyticsData.post_kpi_one(payload)
      .then((res) => {
        console.log("KPI Response:", res);
        if (res?.success === true) {
          console.log("KPI Data:", res.data);
          setKpiData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setKpiDataLoader(false));
  };

  const getGlobalCoverageData = (payload) => {
    setGlobalCoverageDataLoader(true);

    AnalyticsData.post_global_coverage_trend(payload)
      .then((res) => {
        if (res?.success === true) {
          setGlobalCoverageData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setGlobalCoverageDataLoader(false));
  };

  const getProviderCoverageData = (payload) => {
    setProviderCoverageDataLoader(true);

    AnalyticsData.post_provider_casino_covergae_trend(payload)
      .then((res) => {
        if (res?.success === true) {
          setProviderCoverageData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setProviderCoverageDataLoader(false));
  };

  const getAveragePositionData = (payload) => {
    setAveragePositionDataLoader(true);

    AnalyticsData.post_average_position_trend(payload)
      .then((res) => {
        if (res?.success === true) {
          setAveragePositionData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setAveragePositionDataLoader(false));
  };

  const getGameStabilityData = (payload) => {
    setGameStabilityDataLoader(true);

    AnalyticsData.post_game_stability_trend(payload)
      .then((res) => {
        if (res?.success === true) {
          setGameStabilityData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setGameStabilityDataLoader(false));
  };

  const getSectionMappingData = (payload) => {
    setSectionMappingDataLoader(true);
    AnalyticsData.post_section_mapping_distribution_trend(payload)
      .then((res) => {
        if (res?.success === true) {
          setSectionMappingData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setSectionMappingDataLoader(false));
  };

  const getCasinoTableData = (payload) => {
    setCasinoTableDataLoader(true);

    AnalyticsData.post_casino_table(payload)
      .then((res) => {
        if (res?.success === true) {
          setCasinoTableData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setCasinoTableDataLoader(false));
  };

  const getAnalyticsData = () => {
    if (!selectedRegion || !selectedCountry || !selectedGame) return;

    const payload = {
      provider_id: provider_id,
      region: selectedRegion,
      country: selectedCountry,
      game: selectedGame,
    };

    getKpiData(payload);
    getGlobalCoverageData(payload);
    getProviderCoverageData(payload);
    getAveragePositionData(payload);
    getGameStabilityData(payload);
    getSectionMappingData(payload);
    getCasinoTableData(payload);
  };

  const fetchCasinoSectionDetails = async (rowData) => {
    const payload = {
      provider_id: provider_id,
      game: selectedGame,
      region: selectedRegion,
      country: selectedCountry,
      casino_name: rowData.casino_name,
    };

    setLoadingRows((prev) => ({ ...prev, [rowData.casino_name]: true }));

    try {
      const res = await AnalyticsData.post_casino_section_details(payload);
      if (res?.success) {
        setRowDetails((prev) => ({
          ...prev,
          [rowData.casino_name]: res.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching section details", err);
    } finally {
      setLoadingRows((prev) => ({ ...prev, [rowData.casino_name]: false }));
    }
  };

  useEffect(() => {
    getRegionsList();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      countryDropdownData();
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedCountry) {
      gameDropdownData();
    }
  }, [selectedCountry]);

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

  const rowExpansionTemplate = (rowData) => {
    if (loadingRows[rowData.casino_name]) {
      return (
        <div className="text-center p-3">
          <Spin size="default" />
        </div>
      );
    }

    const details = rowDetails[rowData.casino_name] || [];

    return (
      <DataTable
        scrollable
        scrollHeight="200px"
        value={details}
        size="small"
        className="p-datatable-sm"
      >
        <Column field="scan_date" header="Scan Date" />
        <Column field="section" header="Section" />
        <Column field="game_position" header="Game Position" />
      </DataTable>
    );
  };

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="d-flex flex-column gap-3 justify-content-between">
            <div className="pb-3">
              <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
                Analytics
              </h4>
              <span className="text-black" style={{ fontSize: "1rem" }}>
                View game analytics by region, casino and games.
              </span>
            </div>

            <div className="d-flex flex-column gap-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <FloatLabel>
                    <Dropdown
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Region"
                      loading={regionListLoader}
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.value);
                        setSelectedCountry(null);
                        setSelectedGame(null);
                      }}
                      options={regionsList}
                      className="w-100"
                      inputId="region"
                    />
                    <label className="fs-6" htmlFor="region">
                      Region
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-3">
                  <FloatLabel>
                    <Dropdown
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Country"
                      disabled={!selectedRegion}
                      loading={countryListLoader}
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.value);
                        setSelectedGame(null);
                      }}
                      options={countryList}
                      className="w-100"
                      inputId="country"
                    />
                    <label className="fs-6" htmlFor="country">
                      Country
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-3">
                  <FloatLabel>
                    <Dropdown
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Game"
                      disabled={!selectedCountry}
                      loading={gameListLoader}
                      value={selectedGame}
                      onChange={(e) => {
                        setSelectedGame(e.value);
                      }}
                      options={gameList}
                      className="w-100"
                      inputId="game"
                    />
                    <label className="fs-6" htmlFor="game">
                      Game
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-3 d-flex align-items-start gap-2">
                  <Button
                    type="button"
                    label="Apply"
                    // loading={loader}
                    icon="pi pi-filter"
                    disabled={!selectedGame}
                    onClick={getAnalyticsData}
                    className="btn-filter flex-1 h-100"
                    style={{ minWidth: "100px" }}
                  />

                  <Button
                    type="button"
                    label="Reset"
                    icon="pi pi-refresh"
                    disabled={!selectedRegion}
                    onClick={() => {
                      setSelectedRegion(null);
                      setSelectedCountry(null);
                      setSelectedGame(null);
                      setCountryList([]);
                      setGameList([]);

                      setGlobalCoverageData([]);
                      setProviderCoverageData([]);
                      setAveragePositionData([]);
                      setGameStabilityData([]);
                      setSectionMappingData([]);
                    }}
                    className="btn-filter flex-1 h-100"
                    style={{ minWidth: "100px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-secondary p-3 rounded-3 mt-3">
          <div className="flex gap-2 mt-2">
            {kpiData.map((item, index) => (
              <KpiCard
                key={index}
                header={item.title}
                tooltip={item.title}
                tooltipTarget={`tooltip-${index}`}
                value={item.value}
                trend={item.trend}
              />
            ))}
          </div>

          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <h5 className="font-semibold pl-2">Global Coverage Trend (%)</h5>
              <GlobalCoverageTrendChart
                data={globalCoverageData}
                loading={globalCoverageDataLoader}
              />
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="font-semibold pl-2">
                Provider Casino Coverage Trend (%)
              </h5>
              <ProviderCoverageTrendChart
                data={providerCoverageData}
                loading={providerCoverageDataLoader}
              />
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="font-semibold pl-2">Average Position Trend (%)</h5>
              <AveragePositionTrendChart
                data={averagePositionData}
                loading={averagePositionDataLoader}
              />
            </div>
            <div className="col-md-6 mb-3">
              <h5 className="font-semibold pl-2">Game Stability Trend</h5>
              <GameStabilityTrendChart
                data={gameStabilityData}
                loading={gameStabilityDataLoader}
              />
            </div>
          </div>

          <h5 className="font-semibold pl-2 mt-3">
            Section Mapping Distribution Over Time (%)
          </h5>
          <SectionMappingBarChart
            data={sectionMappingData}
            loading={sectionMappingDataLoader}
          />

          <h5 className="font-semibold pl-2 mt-3">Casino Table</h5>
          {casinoTableDataLoader ? (
            <div className="text-center py-3">
              <Spin size="default" />
            </div>
          ) : (
            <DataTable
              value={casinoTableData}
              scrollable
              scrollHeight="300px"
              size="small"
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              onRowExpand={(e) => fetchCasinoSectionDetails(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              className="table-bordered p-component p-datatable custom-table small"
            >
              <Column expander style={{ width: "3em" }} />
              <Column
                header={headerWithTooltip("Casino Name")}
                field="casino_name"
              />
              <Column header={headerWithTooltip("Country")} field="country" />
              <Column header={headerWithTooltip("Region")} field="region" />
              <Column
                header={headerWithTooltip("Visibility %")}
                field="visibility_percentage"
              />
              <Column
                header={headerWithTooltip("Average POS")}
                field="average_position"
              />
            </DataTable>
          )}

          {isPlanExpired && (
            <div
              className="d-flex flex-column align-items-center justify-content-center py-4"
              style={{
                background: "#f8f8f8",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "1rem",
              }}
            >
              <FaLock
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                  color: "#392f6c",
                }}
              />
              <p className="fw-bold m-1">
                To access the complete data, please upgrade your plan.
              </p>
              <Button
                className="btn-upgrade"
                onClick={showContactSalesConfirmation}
              >
                <FaGem /> <span>Upgrade Plan</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
