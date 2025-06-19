import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { Spin } from "antd";

import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { FaGem, FaLock, FaCaretUp, FaCaretDown } from "react-icons/fa6";

import dayjs from "dayjs";
import Papa from "papaparse";

import InfoCard from "../../charts/InfoCard";
import GameData from "../../services/GameTracker";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./DashboardMod.css";
import "./AccessBlur.css";

const VIDEO_URL =
  "https://igc-videos.blr1.cdn.digitaloceanspaces.com/browser_recording_6.mp4";

const DashboardMod = () => {
  const user_id = localStorage.getItem("user_id");
  const user_company = localStorage.getItem("user_company");
  console.log(user_company);
  const dt = useRef(null);
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState(null);
  const [loader, setLoader] = useState(true);
  const [providerSummary, setProviderSummary] = useState(null);
  const [providerLatestDetails, setProviderLatestDetails] = useState([]);
  const [selectedGames, setSelectedGames] = useState(null);
  const [selectedCasinos, setSelectedCasinos] = useState(null);
  const [selectedFreqs, setSelectedFreqs] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [videoDialogVisible, setVideoDialogVisible] = useState(false);

  const arrayFromValues = Object.values(providerLatestDetails);

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

  const freqsList =
    providerLatestDetails.length > 0
      ? Array.from(new Set(providerLatestDetails.map((item) => item.frequency)))
          .sort()
          .map((freq) => ({ name: freq, code: freq }))
      : [];

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  //const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem("selectedGames"));
    const savedCasinos = JSON.parse(localStorage.getItem("selectedCasinos"));
    const savedFreqs = JSON.parse(localStorage.getItem("selectedFreqs"));

    if (savedGames) {
      setSelectedGames(savedGames);
    }
    if (savedCasinos) {
      setSelectedCasinos(savedCasinos);
    }
    if (savedFreqs) {
      setSelectedFreqs(savedFreqs);
    }
  }, []);

  useEffect(() => {
    if (selectedGames !== null) {
      localStorage.setItem("selectedGames", JSON.stringify(selectedGames));
    }
    if (selectedCasinos !== null) {
      localStorage.setItem("selectedCasinos", JSON.stringify(selectedCasinos));
    }
    if (selectedFreqs !== null) {
      localStorage.setItem("selectedFreqs", JSON.stringify(selectedFreqs));
    }
  }, [selectedGames, selectedCasinos, selectedFreqs]);

  useEffect(() => {
    let filtered = [...providerLatestDetails];

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

    if (selectedFreqs && selectedFreqs.length > 0) {
      filtered = filtered.filter((item) =>
        selectedFreqs.some((freq) => freq.name === item.frequency)
      );
    }

    //console.log("filtered", filtered);
    setFilteredData(filtered);
  }, [providerLatestDetails, selectedGames, selectedCasinos, selectedFreqs]);

  const overviewDashboard = async () => {
    try {
      const summaryRes = await GameData.provider_summary({
        game_provider: user_company,
      });

      if (summaryRes?.success === true) {
        setProviderSummary(summaryRes?.data || null);

        const detailsRes = await GameData.provider_latest_details({
          game_provider: user_company,
        });

        if (detailsRes?.success === true) {
          setProviderLatestDetails(detailsRes?.data || []);
        } else {
          console.log("Failed to fetch latest details");
        }
      } else {
        console.log("Failed to fetch provider summary");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    overviewDashboard();
  }, [user_id, user_company]);

  const actionBodyTemplate = (rowData) => {
    return (
      <MdArrowForwardIos
        style={{ fontSize: "16px" }}
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
      growth = parseFloat(growth).toFixed(0);
    }
    return (
      <h6 className="text-secondary font-normal" style={{ fontSize: "1rem" }}>
        {growth < 0 ? (
          <span
            style={{
              display: "inline-block",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc3545",
            }}
          >
            {growth} <FaCaretDown />
          </span>
        ) : (
          ""
        )}
        {growth == 0 ? (
          <span
            style={{
              display: "inline-block",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc9b00",
            }}
          >
            {growth}{" "}
          </span>
        ) : (
          ""
        )}
        {growth > 0 ? (
          <span
            style={{
              display: "inline-block",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              color: "#28a745",
            }}
          >
            {growth} <FaCaretUp />
          </span>
        ) : (
          ""
        )}
      </h6>
    );
  };

  const evidanceTemplate = (rowData) => {
    return (
      <Button
        label="Watch"
        icon="pi pi-play"
        className="p-button-text"
        onClick={() => setVideoDialogVisible(true)}
      />
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
          className={`info-icon-${id} ms-2`}
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

  const exportCSV = (filteredData) => {
    const csv = Papa.unparse(filteredData);
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = "game_tracker_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div>
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
                Tracker Dashboard
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
              <MultiSelect
                value={selectedFreqs}
                onChange={(e) => setSelectedFreqs(e.value)}
                options={freqsList}
                optionLabel="name"
                filter
                placeholder="Site Frequency"
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
            {providerSummary ? (
              <>
                <div className="border border-secondary p-3 rounded-3 mt-3">
                  <div>
                    <h5 className="font-semibold pl-2">Summary</h5>
                    <div className="flex gap-2 mt-2">
                      <InfoCard
                        header="Game Count"
                        tooltip="Shows total game count"
                        tooltipTarget="game_count"
                        //value={providerSummary.game_count}
                        value={
                          new Set(filteredData.map((item) => item.game_name))
                            .size
                        }
                      />

                      <InfoCard
                        header="Casino Count"
                        tooltip="Shows total casino count"
                        tooltipTarget="casino_count"
                        //value={providerSummary.casino_count}
                        value={
                          new Set(
                            filteredData.map(
                              (item) =>
                                `${item.casino_name}|${item.country_name}`
                            )
                          ).size
                        }
                      />

                      <InfoCard
                        header="Casino-Game Combinations"
                        tooltip="Shows total Casino-Game Combinations"
                        tooltipTarget="combination_count"
                        //value={providerSummary.combination_count}
                        value={
                          new Set(
                            filteredData.map(
                              (item) =>
                                `${item.casino_name}|${item.country_name}|${item.game_name}`
                            )
                          ).size
                        }
                      />
                    </div>
                  </div>

                  {/* Tracker Details Table */}
                  <div className="mt-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="font-semibold pl-2">Latest Details</h5>
                      <span
                        className="text-primary cursor-pointer"
                        onClick={() => exportCSV(filteredData)}
                      >
                        Download Report
                      </span>
                    </div>

                    <div>
                      <DataTable
                        ref={dt}
                        //value={filteredData}
                        value={
                          isPlanExpired
                            ? filteredData.slice(0, 3)
                            : filteredData
                        }
                        selection={selectedRows}
                        onSelectionChange={(e) => setSelectedRows(e.value)}
                        dataKey="comb_id"
                        removableSort
                        paginator={!isPlanExpired}
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                        size="small"
                        className="table-bordered p-component p-datatable custom-table small"
                        scrollable
                        sortIcon={sortIconTemplate}
                        sortField="last_observed_date"
                        sortOrder={-1}
                      >
                        <Column
                          field="game_name"
                          header={headerWithTooltip(
                            "Game",
                            "Name of Game",
                            "game_name"
                          )}
                          sortable
                          style={{ minWidth: "8rem" }}
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
                          style={{ minWidth: "10rem" }}
                        ></Column>

                        <Column
                          field="section_position"
                          header={headerWithTooltip(
                            "Sec Pos",
                            "Position of the section within casino page",
                            "section_position"
                          )}
                          sortable
                          style={{ minWidth: "8rem" }}
                        ></Column>

                        <Column
                          field="sectional_game_position"
                          header={headerWithTooltip(
                            "Game Pos",
                            "Position of game within the section",
                            "sectional_game_position"
                          )}
                          sortable
                          style={{ minWidth: "9rem" }}
                        ></Column>

                        <Column
                          field="overall_position"
                          header={headerWithTooltip(
                            "Overall Pos",
                            "Overall position of the game on the casino page",
                            "overall_position"
                          )}
                          sortable
                          style={{ minWidth: "10rem" }}
                        ></Column>

                        <Column
                          field="growth"
                          header={headerWithTooltip(
                            "Growth",
                            "Change in overall position of the game on casino page since last scan",
                            "growth"
                          )}
                          sortable
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
                                display: "inline-block",
                                maxWidth: "200px",
                                color: "#0066cc",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={rowData.site_url}
                            >
                              {rowData.site_url}
                            </a>
                          )}
                        ></Column>

                        <Column
                          field="frequency"
                          header={headerWithTooltip(
                            "Site Freq",
                            "Frequency at which the site is scanned",
                            "frequency"
                          )}
                          sortable
                          style={{ minWidth: "10rem" }}
                        ></Column>

                        <Column
                          field="last_observed_date"
                          header={headerWithTooltip(
                            "LOD",
                            "Date when the game was last observed on the casino",
                            "last_observed_date"
                          )}
                          sortable
                          body={(rowData) => {
                            return dayjs(rowData.last_observed_date).format(
                              "MMM D, YYYY"
                            );
                          }}
                          style={{ minWidth: "7rem" }}
                        ></Column>

                        <Column
                          field="evidance"
                          header={headerWithTooltip(
                            "Evidence",
                            "Evidence",
                            "evidance"
                          )}
                          body={evidanceTemplate}
                        ></Column>

                        <Column
                          field="details"
                          header={headerWithTooltip(
                            "Details",
                            "Check historical movement of the game",
                            "details"
                          )}
                          className="text-center"
                          body={actionBodyTemplate}
                        ></Column>
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
                            To access the complete data, please upgrade your
                            plan.
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
                </div>
              </>
            ) : (
              <>
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "15%" }}
                >
                  <h4>
                    {arrayFromValues?.length > 0
                      ? "No trackers configured"
                      : ""}
                  </h4>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Dialog
        header="Evidence Video"
        visible={videoDialogVisible}
        style={{ width: "60vw" }}
        modal
        onHide={() => setVideoDialogVisible(false)}
      >
        <video width="100%" height="auto" controls>
          <source src={VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Dialog>
    </>
  );
};

export default DashboardMod;
