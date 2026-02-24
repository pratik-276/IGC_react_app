import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Carousel } from "primereact/carousel";
import { Skeleton } from "primereact/skeleton";

import { Spin } from "antd";

import { MdInfoOutline } from "react-icons/md";
import {
  FaGem,
  FaLock,
  FaCaretUp,
  FaCaretDown,
  FaFilter,
} from "react-icons/fa6";

import dayjs from "dayjs";
import Papa from "papaparse";

import InfoCard from "../../charts/InfoCard";
import GameData from "../../services/GameTracker";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";
import VerticalBarChart from "../../charts/PositionDashbaordPage/VerticalBarChart";

import { useOutletContext } from "react-router-dom";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./DashboardMod.css";
import "./AccessBlur.css";
import PageHeader from "../../component/PageHeader";

const DashboardModTest = () => {
  const { toggleChat, isChatOpen } = useOutletContext();

  const user_id = localStorage.getItem("user_id");
  const user_company = localStorage.getItem("user_company");
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState(null);
  const [loader, setLoader] = useState(false);
  const [providerLatestDetails, setProviderLatestDetails] = useState([]);

  const [gamesList, setGamesList] = useState([]);
  const [casinosList, setCasinosList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [gamesLoader, setGamesLoader] = useState(true);
  const [casinosLoader, setCasinosLoader] = useState(true);
  const [countryLoader, setCountryLoader] = useState(true);

  const [summaryGameCount, setSummaryGameCount] = useState(null);
  const [summaryCasinoCount, setSummaryCasinoCount] = useState(null);
  const [summaryTotalPositions, setSummaryTotalPositions] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGames, setSelectedGames] = useState(null);
  const [selectedCasinos, setSelectedCasinos] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [videoDialogVisible, setVideoDialogVisible] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const arrayFromValues = Object.values(providerLatestDetails);

  const PAGE_SIZE = 20;
  const tableWrapperRef = useRef(null);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const searchRef = useRef("");
  const searchDebounceRef = useRef(null);
  const sortFieldRef = useRef("last_observed_date");
  const sortOrderRef = useRef("desc");

  const [hasMore, setHasMore] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const wrapper = tableWrapperRef.current?.querySelector(
      ".p-datatable-wrapper",
    );

    if (!wrapper) return;

    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;

      if (pageRef.current === 1) return;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchTableData();
      }
    };

    wrapper.addEventListener("scroll", handleScroll);
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchTableData = async ({ reset = false } = {}) => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setTableLoading(true);

    setTableData((prev) => [
      ...prev,
      ...Array.from({ length: PAGE_SIZE }, (_, i) => ({
        __skeleton: true,
        comb_id: `skeleton-${pageRef.current}-${i}`,
      })),
    ]);

    try {
      const res = await GameData.provider_dashboard_main_mod({
        game_provider: user_company,
        limit: PAGE_SIZE,
        page: pageRef.current,
        search: searchRef.current,
        sort_by: sortFieldRef.current,
        order: sortOrderRef.current,
        games: Array.isArray(selectedGames) ? selectedGames.map(String) : [],
        casinos: Array.isArray(selectedCasinos)
          ? selectedCasinos.map(String)
          : [],
        countries: Array.isArray(selectedCountry)
          ? selectedCountry.map(String)
          : [],
      });

      if (res?.success) {
        setTableData((prev) => {
          // remove skeleton rows
          const clean = prev.filter((r) => !r.__skeleton);
          return reset ? res.data : [...clean, ...res.data];
        });

        hasMoreRef.current =
          res.pagination.current_page < res.pagination.total_pages;

        pageRef.current = res.pagination.current_page + 1;
      }
    } finally {
      loadingRef.current = false;
      setTableLoading(false);
    }
  };

  const onSort = (e) => {
    sortFieldRef.current = e.sortField;
    sortOrderRef.current = e.sortOrder === 1 ? "asc" : "desc";

    // reset pagination
    pageRef.current = 1;
    hasMoreRef.current = true;
    setHasMore(true);
    setTableData([]);

    fetchTableData({ reset: true });
  };

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    getSummaryProviders();

    searchDebounceRef.current = setTimeout(() => {
      searchRef.current = searchTerm.trim();

      pageRef.current = 1;
      hasMoreRef.current = true;
      setHasMore(true);
      setTableData([]);
      fetchTableData({ reset: true });
    }, 500);

    return () => clearTimeout(searchDebounceRef.current);
  }, [selectedGames, selectedCasinos, selectedCountry]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      searchRef.current = searchTerm.trim();

      pageRef.current = 1;
      hasMoreRef.current = true;
      setHasMore(true);
      setTableData([]);
      fetchTableData({ reset: true });
    }, 500);

    return () => clearTimeout(searchDebounceRef.current);
  }, [searchTerm]);

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  //const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

  const handleGameBarClick = (entry) => {
    const gameName = entry.game_name;

    setSelectedGames([{ name: gameName, code: gameName }]);
  };

  const handleCasinoBarClick = (entry) => {
    const casinoName = entry.casino_name;

    setSelectedCasinos([{ name: casinoName, code: casinoName }]);
  };

  useEffect(() => {
    getSummaryProviders();
    getCountryProviders();
    getCasinosProviders();
    getGamesProviders();
  }, []);

  const getSummaryProviders = async () => {
    try {
      const response = await GameData.get_summary_provider_dashboard({
        game_provider: user_company,
        games: Array.isArray(selectedGames) ? selectedGames.map(String) : [],
        casinos: Array.isArray(selectedCasinos)
          ? selectedCasinos.map(String)
          : [],
        countries: Array.isArray(selectedCountry)
          ? selectedCountry.map(String)
          : [],
      });

      if (response?.success === true) {
        console.log(response);
        setSummaryGameCount(response?.data?.game_count || null);
        setSummaryCasinoCount(response?.data?.casino_count || null);
        setSummaryTotalPositions(response?.data?.total_positions || null);
      } else {
        console.log("Failed to fetch summary data");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCountryProviders = async () => {
    try {
      const response = await GameData.get_countries_provider_dashboard({
        game_provider: user_company,
      });

      if (response?.success === true) {
        console.log(response);
        setCountryList(response?.data || []);
      } else {
        console.log("Failed to fetch casinos list");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCountryLoader(false);
    }
  };

  const getCasinosProviders = async () => {
    try {
      const response = await GameData.get_casinos_provider_dashboard({
        game_provider: user_company,
      });

      if (response?.success === true) {
        console.log(response);
        setCasinosList(response?.data || []);
      } else {
        console.log("Failed to fetch casinos list");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCasinosLoader(false);
    }
  };

  const getGamesProviders = async () => {
    try {
      const response = await GameData.get_games_provider_dashboard({
        game_provider: user_company,
      });

      if (response?.success === true) {
        console.log(response);
        setGamesList(response?.data || []);
      } else {
        console.log("Failed to fetch games list");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setGamesLoader(false);
    }
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
    //setVideoURL(rowData?.video_url);
    //console.log(rowData?.video_url);
    const label =
      "As on " + dayjs(rowData?.video_created_at).format("MMM D, YYYY");
    if (rowData?.video_url) {
      return (
        <Button
          label={label}
          icon="pi pi-play"
          className="p-button-text"
          onClick={() => {
            setVideoURL(rowData?.video_url);
            setVideoDialogVisible(true);
          }}
        />
      );
    } else {
      return (
        <Button
          label={"No video"}
          icon="pi pi-play"
          className="p-button-text"
          disabled
        />
      );
    }
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

  const skeletonBody = () => {
    return (
      <Skeleton width="80%" height="1rem" style={{ margin: "0.25rem 0" }} />
    );
  };

  const exportCSV = async () => {
    const downloadData = {
      game_provider: user_company,
      games: Array.isArray(selectedGames) ? selectedGames.map(String) : [],
      casinos: Array.isArray(selectedCasinos)
        ? selectedCasinos.map(String)
        : [],
      countries: Array.isArray(selectedCountry)
        ? selectedCountry.map(String)
        : [],
    };
    const downloadRes =
      await GameData.provider_latest_details_download(downloadData);
    //console.log("downloadRes", downloadRes?.data);
    if (downloadRes?.success === true) {
      const csv = Papa.unparse(downloadRes?.data);
      const link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      link.download = "game_tracker_data.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div>
        <div>
          {/* <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="m-md-0 font-semibold" style={{ color: "#392f6c" }}>
                Positions Dashboard
              </h4>
              <span>
                Track latest positions of all your games across all casinos
              </span>
            </div>

            <div className="d-flex align-items-center justify-content-between">
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
                  />
                </>
              ) : (
                <div className="d-flex align-items-center gap-1 mb-2">
                  <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText
                      placeholder="Search..."
                      className="w-12rem"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </IconField>
                  <Button
                    onClick={() => setShowFilter(!showFilter)}
                    className="d-flex align-items-center gap-1"
                    style={{ backgroundColor: "#392f6c", border: "none" }}
                  >
                    <FaFilter /> <span>Filters</span>
                  </Button>

                  <Button
                    icon="pi pi-download"
                    tooltip="Download Report"
                    tooltipOptions={{ position: "top" }}
                    rounded
                    onClick={() => exportCSV()}
                    style={{ backgroundColor: "#392f6c", border: "none" }}
                  />

                  <Button
                    icon="pi pi-comments"
                    label={isChatOpen ? "Close" : "Chat"}
                    onClick={toggleChat}
                    style={{ backgroundColor: "#392f6c", border: "none" }}
                  />
                </div>
              )}
            </div>
          </div> */}

          <PageHeader
            title="Positions Dashboard"
            subtitle="Track latest positions of all your games across all casinos"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onDownload={exportCSV}
            onToggleFilter={() => setShowFilter((v) => !v)}
            onToggleChat={toggleChat}
            isPlanExpired={isPlanExpired}
            features={{
              search: true,
              filters: true,
              download: true,
              chat: true,
            }}
          />
        </div>

        <div className={`filter-wrapper ${showFilter ? "open" : "closed"}`}>
          <div className="d-flex gap-2 mt-2 w-100 align-items-center justify-content-between">
            <MultiSelect
              options={countryList}
              optionLabel="country_name"
              optionValue="country_name"
              filter
              placeholder="Select Country"
              loading={countryLoader}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.value)}
              className="w-100"
            />
            <MultiSelect
              options={casinosList}
              optionLabel="casino_name"
              optionValue="operator_id"
              filter
              placeholder="Select Casinos"
              loading={casinosLoader}
              value={selectedCasinos}
              onChange={(e) => setSelectedCasinos(e.value)}
              className="w-100"
            />
            <MultiSelect
              options={gamesList}
              optionLabel="game_name"
              optionValue="game_id"
              filter
              placeholder="Select Games"
              loading={gamesLoader}
              value={selectedGames}
              onChange={(e) => setSelectedGames(e.value)}
              className="w-100"
            />
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
            {providerLatestDetails ? (
              <>
                <div>
                  <div className="flex gap-2 mt-3">
                    <InfoCard
                      header="Game Count"
                      tooltip="Shows total count of unique games found across all casinos"
                      tooltipTarget="game_count"
                      value={summaryGameCount}
                    />

                    <InfoCard
                      header="Casino Count"
                      tooltip="Shows total count of unique casinos hosting your games"
                      tooltipTarget="casino_count"
                      value={summaryCasinoCount}
                    />

                    <InfoCard
                      header="Total Positions"
                      tooltip="Shows total count of unique game positions across all casinos"
                      tooltipTarget="combination_count"
                      value={summaryTotalPositions}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  {/* Tracker Details Table */}

                  <div>
                    <div ref={tableWrapperRef}>
                      <DataTable
                        value={tableData}
                        dataKey="comb_id"
                        size="small"
                        lazy
                        scrollable
                        scrollHeight="600px"
                        onSort={onSort}
                        sortField={sortFieldRef.current}
                        sortOrder={sortOrderRef.current === "asc" ? 1 : -1}
                        className="table-bordered p-datatable custom-table small"
                        onRowClick={(e) => {
                          const rowData = e.data;
                          navigate("/position-details", {
                            state: {
                              game_id: rowData.game_id,
                              game_name: rowData.game_name,
                              casino_id: rowData.casino_id,
                              casino_name: rowData.casino_name,
                              country_name: rowData.country_name,
                              state_name: rowData.state,
                            },
                          });
                        }}
                      >
                        <Column
                          field="game_name"
                          header={headerWithTooltip(
                            "Game",
                            "Name of Game",
                            "game_name",
                          )}
                          sortable
                          body={(rowData) =>
                            rowData.__skeleton
                              ? skeletonBody()
                              : rowData.game_name
                          }
                        // style={{ minWidth: "8rem" }}
                        ></Column>

                        <Column
                          field="casino_name"
                          header={headerWithTooltip(
                            "Casino",
                            "Name of casino",
                            "casino_name",
                          )}
                          body={(rowData) =>
                            rowData.__skeleton
                              ? skeletonBody()
                              : rowData.casino_name
                          }
                          sortable
                        ></Column>

                        <Column
                          field="country_name"
                          header={headerWithTooltip(
                            "Country",
                            "Country of Casino",
                            "country_name",
                          )}
                          sortable
                          body={(rowData) =>
                            rowData.__skeleton
                              ? skeletonBody()
                              : rowData.country_name
                          }
                        ></Column>

                        <Column
                          field="url_count"
                          header={headerWithTooltip(
                            "Total Positions",
                            "Count of pages where the game is found on this casino",
                            "url_count",
                          )}
                          sortable
                          body={(rowData) =>
                            rowData.__skeleton
                              ? skeletonBody()
                              : rowData.url_count
                          }
                        ></Column>

                        <Column
                          field="last_observed_date"
                          header={headerWithTooltip(
                            "LOD",
                            "Date when the game was last observed on the casino",
                            "last_observed_date",
                          )}
                          sortable
                          body={(rowData) => {
                            if (rowData.__skeleton) {
                              return <Skeleton width="60%" height="1rem" />;
                            }

                            return dayjs(rowData.last_observed_date).format(
                              "MMM D, YYYY",
                            );
                          }}
                        // style={{ minWidth: "7rem" }}
                        />
                      </DataTable>
                    </div>

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
          <source src={videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Dialog>
    </>
  );
};

export default DashboardModTest;
