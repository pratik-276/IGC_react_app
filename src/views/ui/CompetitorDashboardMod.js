import { useEffect, useState } from "react";
import CompetitorData from "../../services/Competitor";
import GameRankData from "../../services/GameRank";

import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { ButtonGroup } from "primereact/buttongroup";
import { Dialog } from "primereact/dialog";

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
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import PageHeader from "../../component/PageHeader";

const DEFAULT_GAME_IMAGE = "https://placehold.co/60?text=No+Image";
const providerColors = [
  "#FFB3BA", // light red
  "#BAE1FF", // light blue
  "#BAFFC9", // light green
  "#FFFFBA", // light yellow
  "#E2BAFF", // light purple
];

const CompetitorDashboardMod = () => {
  const user_company = localStorage.getItem("user_company");
  const location = useLocation();
  const [incomingState, setIncomingState] = useState(location.state || null);
  const [initLoad, setInitLoad] = useState(true);

  const [zoom, setZoom] = useState(1);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");

  const [providerData, setProviderData] = useState([]);
  const [providersName, setProvidersName] = useState([]);

  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [data, setData] = useState([]);

  const [loader, setLoader] = useState(false);
  const [regionLoading, setRegionLoading] = useState(true);
  const [operatorDataLoader, setOperatorDataLoader] = useState(false);
  const [providerDataLoader, setProviderDataLoader] = useState(false);
  const [dateLoader, setDateLoader] = useState(false);

  const [uniquePositions, setUniquePositions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showImage, setShowImage] = useState(true);

  const DATE_WINDOW_SIZE = 6;
  const [dateStartIndex, setDateStartIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [visible, setVisible] = useState(false);

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  // const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  const providerColorMap = {};
  providersName.forEach((provId, index) => {
    providerColorMap[provId] = providerColors[index];
  });

  const getRegionsList = () => {
    setRegionLoading(true);
    GameRankData.get_regions()
      .then((res) => {
        if (res?.success === true) {
          const cleaned = res.data
            .filter((region) => region !== null && typeof region === "string")
            .map((region) => ({ label: region, value: region }));

          setRegions(cleaned);
          operatorDropdownData();
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
          // const formatted = (res.success.data || [])
          //   .map((item) => item.provider_name)
          //   .filter(Boolean);
          setProviderData(res.success.data);
          setProviderDataLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setProviderDataLoader(false));
  };

  const getCasinoDates = async () => {
    setDateLoader(true);

    try {
      const response = await CompetitorData.get_casino_dates({
        operator_id: selectedOperator,
        geography: selectedRegion,
      });

      if (response?.success === true) {
        console.log("getCasinoDates response : ", response);
        setDateList(response?.data || []);
      } else {
        console.log("Failed to fetch dates list");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDateLoader(false);
    }
  };

  const getCompitatorData = (date = null) => {
    setLoader(true);

    const payload = {
      //operator_site_id: siteId,
      operator_id: selectedOperator,
      geography: selectedRegion,
      ...(providersName?.length ? { provider_name: providersName } : {}),
      ...(date ? { date_selected: date } : {}),
    };

    CompetitorData.get_casino_data_2(payload).then((res) => {
      if (res?.success === true) {
        console.log("getCompitatorData rows : ", res.data.rows);
        setColumns(res?.data.columns || []);
        setRows(res?.data.rows || []);
      }
    });

    CompetitorData.get_casino_data(payload)
      .then((res) => {
        if (res?.success === true) {
          setData(res.data || null);
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
    setDateStartIndex(0);
  }, [dateList]);

  useEffect(() => {
    getRegionsList();
    if (!incomingState) {
      setInitLoad(false);
      setIncomingState(null);
    }
  }, []);

  useEffect(() => {
    console.log("Selected Region changed:", selectedRegion);
    console.log("Incoming State:", incomingState);
    console.log("Init Load:", initLoad);
    if (initLoad || incomingState) return;

    if (selectedRegion) {
      operatorDropdownData();
    }
  }, [selectedRegion]);

  useEffect(() => {
    console.log("Selected Operator changed:", selectedOperator);
    console.log("Incoming State:", incomingState);
    console.log("Init Load:", initLoad);
    if (initLoad || incomingState) return;

    if (selectedOperator) {
      getCasinoDates();
      setProvidersName([]);
      setSelectedDate(null);
      providerDropdownData();
    }
  }, [selectedOperator]);

  useEffect(() => {
    if (!initLoad || !incomingState || regions.length === 0) return;

    const initializeFlow = async () => {
      try {
        console.log("INIT ► Step 1: set region");
        setSelectedRegion(incomingState.geography);

        // Wait for region → operators API
        await CompetitorData.post_operator_by_geography_lists({
          region: incomingState.geography,
        }).then((res) => {
          if (res?.success === true) setOperators(res.data);
        });

        console.log("INIT ► Step 2: set operator");
        setSelectedOperator(incomingState.operator_id);

        // Wait for operator → providers API
        await CompetitorData.get_providers_by_site({
          operator_id: incomingState.operator_id,
          geography: incomingState.geography,
        }).then((res) => {
          if (res?.success?.success === true) {
            setProviderData(res.success.data);
          }
        });

        console.log("INIT ► Step 3: set providers");
        setProvidersName(incomingState.provider_name);

        console.log("INIT ► Step 4: fetch competitor data");
        await CompetitorData.get_casino_data({
          operator_id: incomingState.operator_id,
          geography: incomingState.geography,
          provider_name: incomingState.provider_name,
        }).then((res) => {
          if (res?.success === true) {
            setData(res.data);
          }
        });

        console.log("INIT ► Completed!");

        setInitLoad(false);
        setIncomingState(null);
      } catch (err) {
        console.error("Incoming initialization failed", err);
      }
    };

    initializeFlow();
  }, [incomingState, regions, initLoad]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Step 1: Extract unique sorted game positions
    const positions = [
      ...new Set(data.map((item) => item.game_position.toFixed(0))),
    ].sort((a, b) => parseFloat(a) - parseFloat(b));
    setUniquePositions(positions);

    // Step 2: Group by section_title
    const sectionMap = {};

    data.forEach((item) => {
      const section = item.section_title;
      const pos = item.game_position.toFixed(0);

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
        provider_id: item.provider_id,
        highlight: isHighlighted,
        image: item.stored_alias_url || DEFAULT_GAME_IMAGE,
      };
    });

    // Step 3: Convert to array and sort alphabetically by section_title
    const sortedTableData = Object.values(sectionMap).sort((a, b) =>
      a.section_title.localeCompare(b.section_title),
    );

    setTableData(sortedTableData);
    console.log("sortedTableData", sortedTableData);
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
      className="d-flex align-items-center justify-content-center"
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

  const gameCellTemplate = (rowData, columnId) => {
    const cell = rowData.cells?.[columnId];

    if (!cell) return null;

    return (
      <div className="matrix-cell" onClick={() => openGameModal(cell)}>
        <div className="matrix-img-wrapper">
          <img
            src={cell.stored_alias_url || "no-image.jpg"}
            alt={cell.game_name}
            className="matrix-img shadow-4"
          />
        </div>

        <div
          className="matrix-text"
          title={`${cell.game_name} (${cell.provider_name})`}
        >
          {cell.game_name} ({cell.provider_name})
        </div>
      </div>
    );
  };

  const sectionTemplate = (rowData) => {
    return <div style={{ fontWeight: 500 }}>{rowData.label}</div>;
  };

  const openGameModal = (cell) => {
    console.log("Selected Game Cell:", cell);
    setSelectedGame(cell);
    setVisible(true);
  };

  const exportCSV = (data) => {
    if (!data || data.length === 0) return;

    const formattedData = data.map((row) => {
      const formattedRow = {
        "Section Title": row.section_title,
      };

      uniquePositions.forEach((pos) => {
        formattedRow[pos] =
          typeof row[pos] === "string"
            ? row[pos]
            : row[pos]
              ? row[pos]["text"]
              : "";
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

  const options = { year: "numeric", month: "short", day: "numeric" };

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <PageHeader
            title="Casino View Dashboard"
            subtitle="View game positions for a casino"
            onClick={() => exportCSV(tableData)}
            onToggleFilter={() => setShowFilter((v) => !v)}
            isPlanExpired={isPlanExpired}
            features={{
              search: false,
              filters: true,
              download: true,
              chat: false,
            }}
          />
          <div className={`filter-wrapper ${showFilter ? "open" : "closed"}`}>
            <div className="d-flex gap-2 w-100 align-items-center justify-content-between mb-3">
              <Dropdown
                optionLabel="label"
                optionValue="value"
                filter
                placeholder="Select Country"
                loading={regionLoading}
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.value);
                  setSelectedOperator(null);
                  setProviderData([]);
                  setProvidersName([]);
                }}
                options={regions}
                className="w-100"
                inputId="region"
              />

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
                }}
                options={operators}
                itemTemplate={(option) => (
                  <div title={option.operator_name}>{option.operator_name}</div>
                )}
                className="w-100"
                inputId="operator"
              />

              <MultiSelect
                optionLabel="provider_name"
                optionValue="provider_id"
                value={providersName}
                onChange={(e) => {
                  if (e.value.length <= 5) {
                    setProvidersName(e.value);
                  } else {
                    toast.error("You can select up to 5 providers only.");
                  }
                }}
                options={providerData}
                loading={providerDataLoader}
                placeholder="Select Providers (up to 5)"
                filter
                disabled={!selectedOperator}
                maxSelectedLabels={1}
                className="w-100"
                inputId="providers"
              />

              <div className="d-flex align-items-start gap-2">
                <Button
                  type="button"
                  label="Apply"
                  loading={loader}
                  icon="pi pi-check"
                  disabled={!selectedOperator}
                  onClick={() => {
                    getCompitatorData(null);
                  }}
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
                    setProvidersName([]);
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
              <div>
                <div className="d-flex w-100 justify-content-center align-items-center gap-2 mb-3">
                  {dateList?.length > 0 && (
                    <div className="d-flex align-items-center gap-2">
                      {/* PREV BUTTON */}
                      <Button
                        icon="pi pi-chevron-left"
                        text
                        style={{ color: "#392f6c" }}
                        disabled={dateStartIndex === 0}
                        onClick={() =>
                          setDateStartIndex((prev) => Math.max(prev - 1, 0))
                        }
                      />

                      {/* DATE BUTTONS */}
                      <div className="d-flex gap-2 overflow-hidden date-carousel">
                        {dateList
                          .slice(
                            dateStartIndex,
                            dateStartIndex + DATE_WINDOW_SIZE,
                          )
                          .map((item) => (
                            <Button
                              key={item.dates}
                              label={item.dates}
                              size="small"
                              outlined={selectedDate !== item.dates}
                              severity={
                                selectedDate === item.dates
                                  ? "primary"
                                  : "secondary"
                              }
                              onClick={() => {
                                setSelectedDate(item.dates);
                                getCompitatorData(item.dates);
                              }}
                            />
                          ))}
                      </div>

                      {/* NEXT BUTTON */}
                      <Button
                        icon="pi pi-chevron-right"
                        text
                        style={{ color: "#392f6c" }}
                        disabled={
                          dateStartIndex + DATE_WINDOW_SIZE >= dateList.length
                        }
                        onClick={() =>
                          setDateStartIndex((prev) =>
                            Math.min(
                              prev + 1,
                              dateList.length - DATE_WINDOW_SIZE,
                            ),
                          )
                        }
                      />
                    </div>
                  )}

                  <ButtonGroup className="d-flex align-items-center">
                    <Button
                      icon="pi pi-search-minus"
                      tooltip="Zoom Out"
                      tooltipOptions={{ position: "top" }}
                      rounded
                      outlined
                      disabled={zoom <= 0.5}
                      onClick={() =>
                        setZoom((prev) =>
                          Math.max(0.5, +(prev - 0.1).toFixed(2)),
                        )
                      }
                      style={{
                        backgroundColor: "#392f6c",
                        borderColor: "#fff",
                        color: "#fff",
                      }}
                      className="btn-filter"
                    />

                    <Button
                      icon="pi pi-search-plus"
                      tooltip="Zoom In"
                      tooltipOptions={{ position: "top" }}
                      rounded
                      outlined
                      disabled={zoom >= 2}
                      onClick={() =>
                        setZoom((prev) => Math.min(2, +(prev + 0.1).toFixed(2)))
                      }
                      style={{
                        backgroundColor: "#392f6c",
                        borderColor: "#fff",
                        color: "#fff",
                      }}
                      className="btn-filter"
                    />
                  </ButtonGroup>
                </div>

                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    width: `${100 / zoom}%`,
                  }}
                >
                  <DataTable
                    value={rows}
                    scrollable
                    scrollHeight="flex"
                    sortIcon={sortIconTemplate}
                    size="small"
                    className="p-datatable-gridlines"
                  >
                    <Column
                      field="label"
                      header={headerWithTooltip(
                        "Section Title",
                        "Name of Section Title",
                        "section_title",
                      )}
                      body={sectionTemplate}
                      frozen
                      sortable
                      style={{ minWidth: "180px" }}
                    />

                    {columns.map((col) => (
                      <Column
                        key={col.id}
                        header={col.label}
                        body={(rowData) => gameCellTemplate(rowData, col.id)}
                        style={{ minWidth: "120px", textAlign: "center" }}
                      />
                    ))}
                  </DataTable>
                  {/* <DataTable
                    value={isPlanExpired ? tableData.slice(0, 3) : tableData}
                    scrollable
                    sortIcon={sortIconTemplate}
                    size="small"
                    className="table-bordered p-component p-datatable custom-competitor-table small fixed-row-height"
                  >
                    <Column
                      frozen
                      header={headerWithTooltip(
                        "Section Title",
                        "Name of Section Title",
                        "section_title",
                      )}
                      field="section_title"
                      sortable
                      body={(rowData) => (
                        <strong>{rowData.section_title}</strong>
                      )}
                      style={{
                        minWidth: "200px",
                        whiteSpace: "normal",
                      }}
                    />

                    {uniquePositions.map((pos) => (
                      <Column
                        key={pos}
                        field={pos}
                        header={headerWithoutTooltip(pos)}
                        align="center"
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                width: "100%",
                                textAlign: "center",
                                height: "181px",

                                backgroundColor:
                                  providerColorMap[cell.provider_id] ||
                                  "transparent",
                              }}
                            >
                              {showImage && (
                                <img
                                  src={cell.image}
                                  alt={cell.text}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "contain",
                                    marginBottom: "6px",
                                  }}
                                />
                              )}

                              <span
                                style={{
                                  backgroundColor:
                                    providerColorMap[cell.provider_id] ||
                                    "transparent",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                }}
                              >
                                {cell.text}
                              </span>
                            </div>
                          );
                        }}
                      />
                    ))}
                  </DataTable> */}
                </div>

                <Dialog
                  header="Game Details"
                  visible={visible}
                  style={{ width: "400px" }}
                  onHide={() => setVisible(false)}
                >
                  {selectedGame && (
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={selectedGame.stored_alias_url || "no-image.jpg"}
                        alt={selectedGame.game_name}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          marginBottom: "12px",
                        }}
                        className="shadow-6"
                      />

                      <h3 style={{ margin: 0 }} className="fw-semibold mb-1">
                        {selectedGame.game_name}
                      </h3>
                      <p style={{ margin: 0, color: "#666" }}>
                        Provider : {selectedGame.provider_name}
                      </p>
                    </div>
                  )}
                </Dialog>

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
