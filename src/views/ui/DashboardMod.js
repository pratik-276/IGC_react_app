import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { Tooltip } from "primereact/tooltip";
import dayjs from "dayjs";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./DashboardMod.css";

import GameData from "../../services/GameTracker";
import { Spin } from "antd";

import { useNavigate } from "react-router-dom";

const TrackingTime = [
  {
    value: "7 days",
    label: "7 days",
  },
  {
    value: "1 month",
    label: "1 month",
  },
  {
    value: "3 months",
    label: "3 months",
  },
  {
    value: "custom",
    label: "custom",
  },
];

const TrackingStatus = [
  { value: "live", label: "Live" },
  { value: "old", label: "Old" },
];

const DashboardMod = () => {
  const user_id = localStorage.getItem("user_id");
  const user_company = localStorage.getItem("user_company");
  console.log(user_company);
  const dt = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedRows, setSelectedRows] = useState(null);

  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(true);

  const [trackTime, setTrackTime] = useState(null);
  const [status, setStatus] = useState(null);

  const [providerSummary, setProviderSummary] = useState(null);
  const [providerLatestDetails, setProviderLatestDetails] = useState([]);
  const [trackingDetails, setTrackingDetails] = useState([]);
  const [trackingFilters, setTrackingFilters] = useState([]);
  const [loader2, setLoader2] = useState(true);

  const [selectedGames, setSelectedGames] = useState(null);
  const [selectedCasinos, setSelectedCasinos] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const arrayFromValues = Object.values(providerLatestDetails);

  const latest_details_fetch = () => {
    const data = {
      game_provider: user_company,
    };

    GameData.provider_latest_details(data)
      .then((res) => {
        if (res?.success === true) {
          //console.log(res?.data);
          setProviderLatestDetails(res?.data || []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const gamesList =
    providerLatestDetails.length > 0
      ? Array.from(new Set(providerLatestDetails.map((item) => item.game_name)))
          .sort()
          .map((gameName) => ({ name: gameName, code: gameName }))
      : [];

  const casinosList =
    providerLatestDetails.length > 0
      ? Array.from(
          new Set(providerLatestDetails.map((item) => item.casino_name))
        )
          .sort()
          .map((casinoName) => ({ name: casinoName, code: casinoName }))
      : [];

  useEffect(() => {
    let filtered = [...providerLatestDetails];

    //console.log("selectedGames", selectedGames);
    //console.log("selectedCasinos", selectedCasinos);

    if (selectedGames && selectedGames.length > 0) {
      filtered = filtered.filter((item) =>
        selectedGames.some((game) => game.name === item.game_name)
      );
    }

    if (selectedCasinos && selectedCasinos.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCasinos.some((casino) => casino.name === item.casino_name)
      );
    }

    //console.log("filtered", filtered);
    setFilteredData(filtered);
  }, [providerLatestDetails, selectedGames, selectedCasinos]);

  const overviewDashboard = () => {
    const data = {
      game_provider: user_company,
    };

    GameData.provider_summary(data)
      .then((res) => {
        if (res?.success === true) {
          setProviderSummary(res?.data || null);
          setLoader(false);
          latest_details_fetch();
        } else {
          console.log("Failed to fetch provider summary");
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    overviewDashboard();
  }, [user_id, user_company]);

  const navigate = useNavigate();

  const header = (
    <div className="d-flex align-items-center justify-content-between">
      <h4 className="pl-2">Latest Details</h4>

      <button
        type="button"
        class="btn btn-primary"
        onClick={() => exportCSV(false)}
      >
        Export Data
      </button>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <MdArrowForwardIos
        style={{ fontSize: "24px" }}
        onClick={() => {
          console.log(rowData);
          navigate("/game-details-mod", {
            state: {
              operator_site_id: rowData.operator_site_id,
              game_name: rowData.game_name,
              casino_name: rowData.casino_name,
              country_name: rowData.country_name,
              state_name: rowData.state,
            },
          });
          console.log(rowData.game_name, rowData.operator_site_id);
        }}
      />
    );
  };

  const changeTemplate = (row) => {
    let growth = ";";
    if (row != null) {
      growth = row?.growth;
      growth = parseFloat(growth).toFixed(1);
    }
    return (
      <h6 className="text-secondary font-normal" style={{ fontSize: "1rem" }}>
        {growth < 0 ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              //backgroundColor: "#f8d7da",
              color: "#dc3545",
            }}
          >
            {growth}% <FaCaretDown />
          </span>
        ) : (
          ""
        )}
        {growth == 0 ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              //backgroundColor: "#faf3e8",
              color: "#dc9b00",
            }}
          >
            {growth}%{" "}
          </span>
        ) : (
          ""
        )}
        {growth > 0 ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              //backgroundColor: "#e6f9e6",
              color: "#28a745",
            }}
          >
            {growth}% <FaCaretUp />
          </span>
        ) : (
          ""
        )}
      </h6>
    );
  };

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
          className={`info-icon-${id} ms-2`} // Unique class for each tooltip
          style={{ fontSize: "16px", cursor: "pointer", flexShrink: 0 }}
        />
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

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly }, "test.csv");
  };

  return (
    <>
      <div>
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="font-semibold" style={{ color: "#392f6c" }}>
                {trackingDetails?.operator_name != undefined
                  ? `${trackingDetails?.operator_name} Dashboard`
                  : `Tracker Dashboard`}
              </h4>
              <span>
                Track latest positions of all your games across all casinos
              </span>
            </div>
            <div className="d-flex gap-2">
              <MultiSelect
                value={selectedGames}
                onChange={(e) => setSelectedGames(e.value)}
                options={gamesList}
                optionLabel="name"
                filter
                placeholder="Select Games"
                maxSelectedLabels={3}
              />
              <MultiSelect
                value={selectedCasinos}
                onChange={(e) => setSelectedCasinos(e.value)}
                options={casinosList}
                optionLabel="name"
                filter
                placeholder="Select Casinos"
                maxSelectedLabels={3}
              />
            </div>
          </div>
        </div>

        {loader ? (
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
            {arrayFromValues?.length > 0 ? (
              <>
                {show === false && providerSummary && (
                  <>
                    <div className="border border-secondary p-3 rounded-3 mt-3">
                      <div>
                        <h5 className="font-semibold pl-2">Summary</h5>
                        <div className="flex gap-3 mt-2">
                          <div className="flex-1">
                            <div
                              className="d-flex flex-column w-100 pl-3 pt-2"
                              style={{
                                borderTop: "1px solid #392f6c",
                                borderRight: "1px solid #392f6c",
                                borderBottom: "1px solid #392f6c",
                                borderLeft: "6px solid #392f6c",
                              }}
                            >
                              <h5>Game Count</h5>
                              <h5 className="font-semibold">
                                {providerSummary.game_count}
                              </h5>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div
                              className="d-flex flex-column w-100 pl-3 pt-2"
                              style={{
                                borderTop: "1px solid #392f6c",
                                borderRight: "1px solid #392f6c",
                                borderBottom: "1px solid #392f6c",
                                borderLeft: "6px solid #392f6c",
                              }}
                            >
                              {" "}
                              <h5>Casino Count</h5>
                              <h5 className="font-semibold">
                                {providerSummary.casino_count}
                              </h5>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div
                              className="d-flex flex-column w-100 pl-3 pt-2"
                              style={{
                                borderTop: "1px solid #392f6c",
                                borderRight: "1px solid #392f6c",
                                borderBottom: "1px solid #392f6c",
                                borderLeft: "6px solid #392f6c",
                              }}
                            >
                              {" "}
                              <h5>Casino-Game Combinations</h5>
                              <h5 className="font-semibold">
                                {providerSummary.combination_count}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tracker Details Table */}
                      <div className="mt-3">
                        <h5 className="font-semibold pl-2">Latest Details</h5>
                        <div>
                          <DataTable
                            ref={dt}
                            value={filteredData}
                            selection={selectedRows}
                            onSelectionChange={(e) => setSelectedRows(e.value)}
                            dataKey="comb_id"
                            removableSort
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                            globalFilter={globalFilter}
                            size="small"
                            className="table-bordered p-component p-datatable custom-table small"
                            scrollable
                            sortIcon={sortIconTemplate}
                            sortField="last_observed_date" // Sort by last_observed_date field
                            sortOrder={-1} // Sort in descending order by default
                          >
                            <Column
                              field="game_name"
                              header={headerWithTooltip(
                                "Game",
                                "Name of Game",
                                "game_name"
                              )}
                              sortable
                            ></Column>
                            <Column
                              field="casino_name"
                              header={headerWithTooltip(
                                "Casino",
                                "Name of casino",
                                "casino_name"
                              )}
                              sortable
                            ></Column>
                            <Column
                              field="country_name"
                              header={headerWithTooltip(
                                "Country",
                                "Country of Casino",
                                "country_name"
                              )}
                              sortable
                            ></Column>
                            <Column
                              field="section_name"
                              header={headerWithTooltip(
                                "Sec Name",
                                "Section within casino where game was found",
                                "section_name"
                              )}
                              sortable
                            ></Column>
                            <Column
                              field="section_position"
                              header={headerWithTooltip(
                                "Sec Position",
                                "Position of the section within casino page",
                                "section_position"
                              )}
                              sortable
                              style={{ maxWidth: "8rem" }}
                            ></Column>
                            <Column
                              field="sectional_game_position"
                              header={headerWithTooltip(
                                "Game Position",
                                "Position of game within the section",
                                "sectional_game_position"
                              )}
                              sortable
                              style={{ maxWidth: "8rem" }}
                            ></Column>
                            <Column
                              field="overall_position"
                              header={headerWithTooltip(
                                "Overall Position",
                                "Overall position of the game on the casino page",
                                "overall_position"
                              )}
                              sortable
                              style={{ maxWidth: "8rem" }}
                            ></Column>
                            <Column
                              field="growth"
                              header={headerWithTooltip(
                                "Growth",
                                "WoW Growth in overall position of the game on casino page",
                                "growth"
                              )}
                              sortable
                              style={{ maxWidth: "8rem" }}
                              body={changeTemplate}
                            ></Column>
                            <Column
                              field="site_url"
                              header={headerWithTooltip(
                                "Site URL",
                                "URL for the casino page",
                                "site_url"
                              )}
                              body={(rowData) => (
                                <a
                                  href={rowData.site_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#0066cc",
                                  }}
                                >
                                  {rowData.site_url}
                                </a>
                              )}
                            ></Column>
                            <Column
                              field="last_observed_date"
                              header={headerWithTooltip(
                                "Last Observed Date",
                                "Date when the game was last observed on the casino",
                                "last_observed_date"
                              )}
                              sortable
                              body={(rowData) => {
                                return dayjs(rowData.last_observed_date).format(
                                  "MMM D, YYYY"
                                );
                              }}
                              style={{ maxWidth: "9rem" }}
                            ></Column>

                            <Column
                              field="details"
                              header={headerWithTooltip(
                                "Details",
                                "Check historical momentum of the game",
                                "details"
                              )}
                              className="text-center"
                              body={actionBodyTemplate}
                            ></Column>
                          </DataTable>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "15%" }}
                >
                  <h4>No trackers configured</h4>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DashboardMod;
