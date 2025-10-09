import React, { useEffect, useState } from "react";
import CompetitorData from "../../services/Competitor";
import GameRankData from "../../services/GameRank";

import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { FloatLabel } from "primereact/floatlabel";
import { Slider } from "primereact/slider";

import { Spin } from "antd";

import { FaGem, FaLock } from "react-icons/fa6";
import { MdInfoOutline } from "react-icons/md";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./CompetitorDashboardMod.css";
import "./AccessBlur.css";

import Papa from "papaparse";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";

const CompetitorDashboardMod = () => {
  const user_company = localStorage.getItem("user_company");
  const [zoom, setZoom] = useState(1);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("United States");

  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const [siteData, setSiteData] = useState([]);
  const [siteId, setSiteId] = useState(null);
  const [selectedSiteDetails, setSelectedSiteDetails] = useState(null);

  const [providerData, setProviderData] = useState([]);
  const [providersName, setProvidersName] = useState(null);

  const [gameData, setGameData] = useState([]);
  const [gamesName, setGamesName] = useState(null);

  const [data, setData] = useState([]);

  const [loader, setLoader] = useState(false);
  const [regionLoading, setRegionLoading] = useState(true);
  const [operatorDataLoader, setOperatorDataLoader] = useState(false);
  const [siteDataLoader, setSiteDataLoader] = useState(false);
  const [providerDataLoader, setProviderDataLoader] = useState(false);
  const [gameDataLoader, setGameDataLoader] = useState(false);

  const [uniquePositions, setUniquePositions] = useState([]);
  const [tableData, setTableData] = useState([]);

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  // const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  const getRegionsList = () => {
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
  };

  const operatorDropdownData = () => {
    setOperatorDataLoader(true);

    const payload = {
      region: selectedRegion,
    };

    CompetitorData.post_operator_by_geography_lists(payload)
      .then((res) => {
        if (res?.success === true) {
          setOperators(res?.data || null);
          setOperatorDataLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setOperatorDataLoader(false);
      });
  };

  const siteDropdownData = () => {
    setSiteDataLoader(true);

    const payload = {
      game_provider: user_company,
      operator_id: selectedOperator,
      geography: selectedRegion,
    };

    CompetitorData.get_operator_sites_list(payload)
      .then((res) => {
        if (res?.success === true) {
          setSiteData(res?.data || null);
          setSiteDataLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSiteDataLoader(false);
      });
  };

  const providerDropdownData = () => {
    setProviderDataLoader(true);

    const payload = {
      //operator_site_id: siteId,
      operator_id: selectedOperator,
      geography: selectedRegion,
    };

    CompetitorData.get_providers_by_site(payload)
      .then((res) => {
        if (res?.success?.success === true) {
          const formatted = (res.success.data || [])
            .map((item) => item.provider_name)
            .filter(Boolean);
          setProviderData(formatted);
          setProviderDataLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setProviderDataLoader(false));
  };

  const gameDropdownData = () => {
    setGameDataLoader(true);

    const payload = {
      //operator_site_id: siteId,
      operator_id: selectedOperator,
      geography: selectedRegion,
    };

    CompetitorData.get_games_by_site(payload)
      .then((res) => {
        if (res?.success?.success === true) {
          const formatted = (res.success.data || [])
            .map((item) => item.game_name)
            .filter(Boolean);
          setGameData(formatted);
          setGameDataLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setGameDataLoader(false));
  };

  const getCompitatorData = () => {
    setLoader(true);

    const payload = {
      //operator_site_id: siteId,
      operator_id: selectedOperator,
      geography: selectedRegion,
      ...(providersName?.length ? { provider_name: providersName } : {}),
      ...(gamesName?.length ? { game_name: gamesName } : {}),
    };

    CompetitorData.get_competitor_data(payload)
      .then((res) => {
        if (res?.success?.success === true) {
          setData(res.success.data || null);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getRegionsList();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      operatorDropdownData();
    }
  }, [selectedRegion]);

  // useEffect(() => {
  //   if (selectedOperator) {
  //     siteDropdownData();
  //   }
  // }, [selectedOperator]);

  useEffect(() => {
    if (selectedOperator) {
      setProvidersName(null);
      setGamesName(null);
      providerDropdownData();
      gameDropdownData();
    }
  }, [selectedOperator]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Step 1: Extract unique sorted game positions
    const positions = [
      ...new Set(data.map((item) => item.game_position.toFixed(1))),
    ].sort((a, b) => parseFloat(a) - parseFloat(b));
    setUniquePositions(positions);

    // Step 2: Group by section_title
    const sectionMap = {};

    data.forEach((item) => {
      const section = item.section_title;
      const pos = item.game_position.toFixed(1);

      const gameName = item.game_name?.trim() || "-";
      const providerName = item.provider_name?.trim() || "-";
      const displayText =
        gameName === "-" && providerName === "-"
          ? "-"
          : `${gameName} (${providerName})`;

      const isHighlighted = providerName === user_company;

      if (!sectionMap[section]) {
        sectionMap[section] = { section_title: section };
      }

      //sectionMap[section][pos] = displayText;
      sectionMap[section][pos] = {
        text: displayText,
        highlight: isHighlighted,
      };
    });

    // Step 3: Convert to array and sort alphabetically by section_title
    const sortedTableData = Object.values(sectionMap).sort((a, b) =>
      a.section_title.localeCompare(b.section_title)
    );

    setTableData(sortedTableData);
  }, [data]);

  const headerWithTooltip = (headerText, tooltipText, id) => (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ width: "100%" }}
    >
      <div className="d-flex align-items-center m-1">
        <h5 style={{ margin: 0 }}>{headerText}</h5>
        <Tooltip
          target={`.info-icon-${id}`}
          content={tooltipText}
          position="top"
          className="custom-tooltip"
        />
        <MdInfoOutline
          className={`info-icon-${id} ms-2`}
          style={{ fontSize: "16px", cursor: "pointer", flexShrink: 0 }}
        />
      </div>
    </div>
  );

  const headerWithoutTooltip = (headerText) => (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ width: "100%" }}
    >
      <div className="d-flex align-items-center m-1">
        <h5 style={{ margin: 0 }}>{headerText}</h5>
      </div>
    </div>
  );

  const sortIconTemplate = (options) => {
    let icon = options.sorted ? (
      options.sortOrder < 0 ? (
        <i className="pi pi-sort-up" style={{ fontSize: "14px" }} />
      ) : (
        <i className="pi pi-sort-down" style={{ fontSize: "14px" }} />
      )
    ) : (
      <i className="pi pi-sort" style={{ fontSize: "14px" }} />
    );
    return icon;
  };

  const exportCSV = (data) => {
    if (!data || data.length === 0) return;

    const formattedData = data.map((row) => {
      const formattedRow = {
        "Section Title": row.section_title,
      };

      uniquePositions.forEach((pos) => {
        formattedRow[pos] = row[pos] || "";
      });

      return formattedRow;
    });

    const csv = Papa.unparse(formattedData);
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = "competitor_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="d-flex flex-column gap-3 justify-content-between">
            <div className="pb-3">
              <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
                Casino View Dashboard
              </h4>
              <span className="text-black" style={{ fontSize: "1rem" }}>
                View game positions for a casino
              </span>
            </div>

            <div className="d-flex flex-column gap-4">
              <div className="row g-3">
                <div className="col-md-6">
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
                        setSelectedOperator(null);
                        setSiteData([]);
                        setSiteId(null);
                        setProviderData([]);
                        setProvidersName(null);
                        setGameData([]);
                        setGamesName(null);
                      }}
                      options={regions}
                      className="w-100"
                      inputId="region"
                    />
                    <label className="fs-6" htmlFor="region">
                      Region
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-6">
                  <FloatLabel>
                    <Dropdown
                      optionLabel="operator_name"
                      optionValue="operator_id"
                      filter
                      placeholder="Select Casino"
                      disabled={!selectedRegion}
                      loading={operatorDataLoader}
                      value={selectedOperator}
                      onChange={(e) => {
                        setSelectedOperator(e.value);
                        setSiteId(null);
                      }}
                      options={operators}
                      itemTemplate={(option) => (
                        <div title={option.operator_name}>
                          {option.operator_name}
                        </div>
                      )}
                      className="w-100"
                      inputId="operator"
                    />
                    <label className="fs-6" htmlFor="operator">
                      Casino
                    </label>
                  </FloatLabel>
                </div>

                {/* <div className="col-md-4">
                  <FloatLabel>
                    <Dropdown
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Site URL"
                      loading={siteDataLoader}
                      disabled={!selectedOperator}
                      value={siteId}
                      onChange={(e) => {
                        setSiteId(e.value);
                        const site = siteData.find((s) => s.value === e.value);
                        setSelectedSiteDetails(site || null);
                      }}
                      options={siteData}
                      itemTemplate={(option) => (
                        <div title={option.label}>{option.label}</div>
                      )}
                      className="w-100"
                      inputId="siteUrl"
                    />
                    <label className="fs-6" htmlFor="siteUrl">
                      Site URL
                    </label>
                  </FloatLabel>
                </div> */}
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <FloatLabel>
                    <MultiSelect
                      value={providersName}
                      onChange={(e) => setProvidersName(e.value)}
                      options={providerData}
                      loading={providerDataLoader}
                      placeholder="Select Providers"
                      filter
                      disabled={!selectedOperator}
                      maxSelectedLabels={1}
                      className="w-100"
                      inputId="providers"
                    />
                    <label className="fs-6" htmlFor="providers">
                      Providers
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-4">
                  <FloatLabel>
                    <MultiSelect
                      value={gamesName}
                      onChange={(e) => setGamesName(e.value)}
                      options={gameData}
                      loading={gameDataLoader}
                      placeholder="Select Games"
                      filter
                      disabled={!selectedOperator}
                      maxSelectedLabels={1}
                      className="w-100"
                      inputId="game"
                    />
                    <label className="fs-6" htmlFor="game">
                      Games
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-md-4 d-flex align-items-start gap-3">
                  <Button
                    type="button"
                    label="Apply"
                    loading={loader}
                    icon="pi pi-filter"
                    disabled={!selectedOperator}
                    onClick={getCompitatorData}
                    className="btn-filter flex-1 h-100"
                    style={{ minWidth: "100px" }}
                  />

                  <Button
                    type="button"
                    label="Reset"
                    icon="pi pi-refresh"
                    disabled={!selectedOperator}
                    onClick={() => {
                      setSelectedOperator(null);
                      setSiteId(null);
                      setProvidersName(null);
                      setGamesName(null);
                      setSiteData([]);
                      setData([]);
                      setTableData([]);
                      setUniquePositions([]);
                    }}
                    className="btn-filter flex-1 h-100"
                    style={{ minWidth: "100px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {data?.length > 0 ? (
          loader ? (
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
          ) : (
            <>
              <div className="border border-secondary p-3 rounded-3 mt-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="font-semibold pl-2">Latest Details</h5>
                  {isPlanExpired ? (
                    <>
                      <span
                        className="text-muted"
                        id="download-disabled"
                        style={{
                          cursor: "not-allowed",
                          textDecoration: "underline dotted",
                        }}
                      >
                        Download Report
                      </span>
                      <Tooltip
                        target="#download-disabled"
                        content="Upgrade your plan to download the report"
                        position="top"
                        className="custom-tooltip"
                      />
                    </>
                  ) : (
                    <span
                      className="text-primary cursor-pointer"
                      onClick={() => exportCSV(tableData)}
                    >
                      Download Report
                    </span>
                  )}
                </div>

                {/* {selectedSiteDetails && (
                  <div className="d-flex justify-content-between pl-2 mb-2">
                    <div>
                      <strong>Site URL : </strong>
                      <a href={selectedSiteDetails.label}>
                        {selectedSiteDetails.label}
                      </a>
                    </div>
                    <div>
                      <strong>Period : </strong>
                      {selectedSiteDetails.latest_date
                        ? new Date(
                            selectedSiteDetails.latest_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </div>
                  </div>
                )} */}

                {/* <div className="flex align-items-center gap-3 mb-3">
                  <label htmlFor="zoomSlider" style={{ minWidth: "80px" }}>
                    Zoom
                  </label>
                  <Slider
                    id="zoomSlider"
                    value={zoom}
                    onChange={(e) => setZoom(e.value)}
                    step={0.1}
                    min={0.5}
                    max={2}
                    style={{ width: "200px" }}
                  />
                  <span>{(zoom * 100).toFixed(0)}%</span>
                </div> */}

                <DataTable
                  value={isPlanExpired ? tableData.slice(0, 3) : tableData}
                  scrollable
                  paginator={!isPlanExpired}
                  rows={25}
                  rowsPerPageOptions={[5, 10, 25]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                  sortIcon={sortIconTemplate}
                  size="small"
                  className="table-bordered p-component p-datatable custom-competitor-table small fixed-row-height"
                >
                  <Column
                    frozen
                    header={headerWithTooltip(
                      "Section Title",
                      "Name of Section Title",
                      "section_title"
                    )}
                    field="section_title"
                    sortable
                    body={(rowData) => <strong>{rowData.section_title}</strong>}
                    style={{
                      minWidth: "200px",
                      whiteSpace: "normal",
                    }}
                  />

                  {/* {uniquePositions.map((pos) => (
                    <Column
                      key={pos}
                      field={pos}
                      header={headerWithoutTooltip(pos)}
                      style={{
                        minWidth: "120px",
                        whiteSpace: "normal",
                      }}
                    />
                  ))} */}
                  {uniquePositions.map((pos) => (
                    <Column
                      key={pos}
                      field={pos}
                      header={headerWithoutTooltip(pos)}
                      style={{
                        minWidth: "120px",
                        whiteSpace: "normal",
                      }}
                      body={(rowData) => {
                        const cell = rowData[pos];

                        if (!cell) return null;

                        if (typeof cell === "string") {
                          return <span>{cell}</span>;
                        }

                        return (
                          <span
                            style={{
                              backgroundColor: cell.highlight
                                ? "#ffeeba"
                                : "transparent",

                              padding: "2px 6px",
                              borderRadius: "4px",
                              display: "inline-block",
                            }}
                          >
                            {cell.text}
                          </span>
                        );
                      }}
                    />
                  ))}
                </DataTable>

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
            </>
          )
        ) : (
          <>
            <div
              className="d-flex justify-content-center"
              style={{ marginTop: "15%" }}
            >
              <h4>No competitor configured</h4>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CompetitorDashboardMod;
