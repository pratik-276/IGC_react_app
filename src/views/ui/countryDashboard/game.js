import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Papa from "papaparse";

import InfoCard from "../../../charts/InfoCard";
import PageHeader from "../../../component/PageHeader";
import headerWithTooltip from "../../../component/tableHeaders";
import ReusableLazyTable from "../../../component/ReusableLazyTable";
import PositionDashboard from "../../../services/PositionDashboard";

import { useContext } from "react";
import { ProfileSystem } from "../../../context/ProfileContext";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../DashboardMod.css";
import "../AccessBlur.css";
import "./posnDashboard.css";
import { textTemplate } from "../../../component/tableTemplates";

const GameDashboard1 = () => {
  const user_company = localStorage.getItem("user_company");
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  //const isPlanExpired = state?.plan === "trial";

  const PAGE_SIZE = 20;

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const searchRef = useRef("");

  const sortFieldRef = useRef("game_positions_count");
  const sortOrderRef = useRef("desc");

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);

  const [summaryGameCount, setSummaryGameCount] = useState(null);
  const [summaryCasinoCount, setSummaryCasinoCount] = useState(null);
  const [summaryCountryCount, setSummaryCountryCount] = useState(null);
  const [summaryTotalPositions, setSummaryTotalPositions] = useState(null);

  const {
    redirect_from,
    country_name_from_state,
    state_name_from_state,
    operator_id_from_state,
    operator_name_from_state,
  } = location.state || {};
  var redirectFrom = "game";
  if (redirect_from) {
    redirectFrom = redirect_from;
  }

  let items = [{ label: "Games" }];
  if (redirectFrom === "country") {
    items = [
      { label: "Countries", command: () => navigate("/country-dashboard") },
      { label: country_name_from_state },
      { label: "Operators", command: () => navigate(-1) },
      { label: operator_name_from_state },
      { label: "Games" },
    ];
  }

  if (redirectFrom === "operator") {
    items = [
      { label: "Operators", command: () => navigate("/operator-dashboard") },
      { label: operator_name_from_state },
      { label: "Countries", command: () => navigate(-1) },
      { label: country_name_from_state },
      { label: "Games" },
    ];
  }

  useEffect(() => {
    getSummary();
  }, []);

  useEffect(() => {
    getSummary();
  }, [redirectFrom]);

  const getSummary = async () => {
    try {
      if (redirectFrom === "country") {
        const response =
          await PositionDashboard.provider_game_dashboard_1_summary({
            game_provider: user_company,
            country_name: country_name_from_state,
            state: state_name_from_state,
            operator_id: operator_id_from_state,
          });

        if (response?.success === true) {
          console.log(response);
          setSummaryGameCount(response?.data?.game_count || null);
          setSummaryTotalPositions(
            response?.data?.game_positions_count || null,
          );
        } else {
          console.log("Failed to fetch summary data");
        }
      }
      if (redirectFrom === "operator") {
        const response =
          await PositionDashboard.provider_game_dashboard_2_summary({
            game_provider: user_company,
            country_name: country_name_from_state,
            state: state_name_from_state,
            operator_id: operator_id_from_state,
          });

        if (response?.success === true) {
          console.log(response);
          setSummaryGameCount(response?.data?.game_count || null);
          setSummaryTotalPositions(
            response?.data?.game_positions_count || null,
          );
        } else {
          console.log("Failed to fetch summary data");
        }
      }
      if (redirectFrom === "game") {
        const response =
          await PositionDashboard.provider_game_dashboard_3_summary({
            game_provider: user_company,
          });

        if (response?.success === true) {
          console.log(response);
          setSummaryGameCount(response?.data?.game_count || null);
          setSummaryCasinoCount(response?.data?.casino_count || null);
          setSummaryCountryCount(response?.data?.country_count || null);
          setSummaryTotalPositions(
            response?.data?.game_positions_count || null,
          );
        } else {
          console.log("Failed to fetch summary data");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    setTableData([]);

    fetchTableData({ reset: true });
  }, []);

  const fetchTableData = async ({ reset = false } = {}) => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    // skeleton rows
    setTableData((prev) => [
      ...prev,
      ...Array.from({ length: PAGE_SIZE }, (_, i) => ({
        __skeleton: true,
        provider_id: `skeleton-${pageRef.current}-${i}`,
      })),
    ]);

    try {
      let res;
      if (redirectFrom === "country") {
        res = await PositionDashboard.provider_game_dashboard_1({
          game_provider: user_company,
          country_name: country_name_from_state,
          state: state_name_from_state,
          operator_id: operator_id_from_state,
          limit: PAGE_SIZE,
          page: pageRef.current,
          search: searchRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        });
      } else if (redirectFrom === "operator") {
        res = await PositionDashboard.provider_game_dashboard_2({
          game_provider: user_company,
          country_name: country_name_from_state,
          state: state_name_from_state,
          operator_id: operator_id_from_state,
          limit: PAGE_SIZE,
          page: pageRef.current,
          search: searchRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        });
      } else if (redirectFrom === "game") {
        res = await PositionDashboard.provider_game_dashboard_3({
          game_provider: user_company,
          limit: PAGE_SIZE,
          page: pageRef.current,
          search: searchRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        });
      }

      if (res?.success) {
        setTableData((prev) => {
          const clean = prev.filter((r) => !r.__skeleton);
          return reset ? res.data : [...clean, ...res.data];
        });

        console.log("res.data : ", res);

        hasMoreRef.current =
          res.pagination.current_page < res.pagination.total_pages;

        pageRef.current = res.pagination.current_page + 1;
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const resetTable = () => {
    pageRef.current = 1;
    hasMoreRef.current = true;

    setTableData([]);
    fetchTableData({ reset: true });
  };

  const handleSort = (field, order) => {
    sortFieldRef.current = field;
    sortOrderRef.current = order;

    pageRef.current = 1;
    hasMoreRef.current = true;

    fetchTableData({ reset: true });
  };

  const columns = [
    {
      field: "game_name",
      header: headerWithTooltip("Game", "Name of Game", "game_name"),
      body: textTemplate("game_name"),
      sortable: true,
    },

    ...(redirectFrom === "game"
      ? [
          {
            field: "country_count",
            header: headerWithTooltip(
              "Country Count",
              "Number of countries where the game is found",
              "country_count",
            ),
            body: textTemplate("country_count"),
            sortable: true,
          },
        ]
      : []),

    ...(redirectFrom === "casino_count"
      ? [
          {
            field: "country_count",
            header: headerWithTooltip(
              "Operator Count",
              "Number of operators where the game is found",
              "casino_count",
            ),
            body: textTemplate("casino_count"),
            sortable: true,
          },
        ]
      : []),

    {
      field: "game_positions_count",
      header: headerWithTooltip(
        "Total Positions",
        "Overall count of positions where the game is found across all casinos in this country",
        "game_positions_count",
      ),
      body: textTemplate("game_positions_count"),
      sortable: true,
    },

    ...(redirectFrom === "game"
      ? [
          {
            field: "last_observed_date",
            header: headerWithTooltip(
              "LOD",
              "Date when the game was last observed on the operator",
              "last_observed_date",
            ),
            body: textTemplate("last_observed_date"),
            sortable: true,
          },
        ]
      : []),
  ];

  const exportCSV = async () => {
    let downloadRes;
    if (redirectFrom === "country") {
      const downloadData = {
        game_provider: user_company,
        search: searchTerm,
        country_name: country_name_from_state,
        state: state_name_from_state,
        operator_id: operator_id_from_state,
      };
      downloadRes =
        await PositionDashboard.provider_game_dashboard_1_download(
          downloadData,
        );
    }
    if (redirectFrom === "operator") {
      const downloadData = {
        game_provider: user_company,
        search: searchTerm,
        country_name: country_name_from_state,
        state: state_name_from_state,
        operator_id: operator_id_from_state,
      };
      downloadRes =
        await PositionDashboard.provider_game_dashboard_2_download(
          downloadData,
        );
    }
    if (redirectFrom === "game") {
      const downloadData = {
        game_provider: user_company,
        search: searchTerm,
      };
      downloadRes =
        await PositionDashboard.provider_game_dashboard_3_download(
          downloadData,
        );
    }

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
      <PageHeader
        title="Game Dashboard"
        breadcrumb={items}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onDownload={exportCSV}
        isPlanExpired={isPlanExpired}
        features={{
          search: true,
          filters: false,
          download: true,
          chat: false,
        }}
      />

      {loading || tableData.length > 0 ? (
        <>
          <div className="mb-3">
            <div>
              <div className="flex gap-2 mt-2">
                <InfoCard
                  header="Game Count"
                  tooltip="Shows total count of unique games across all casinos"
                  tooltipTarget="game_count"
                  value={summaryGameCount}
                />

                {redirectFrom === "game" && (
                  <InfoCard
                    header="Operator Count"
                    tooltip="Shows total count of unique operators across all games"
                    tooltipTarget="casino_count"
                    value={summaryCasinoCount}
                  />
                )}

                {redirectFrom === "game" && (
                  <InfoCard
                    header="Country Count"
                    tooltip="Shows total count of unique countries across all games"
                    tooltipTarget="country_count"
                    value={summaryCountryCount}
                  />
                )}

                <InfoCard
                  header="Total Positions"
                  tooltip="Shows total count of unique game positions across all casinos"
                  tooltipTarget="game_position_count"
                  value={summaryTotalPositions}
                />
              </div>
            </div>
          </div>

          <ReusableLazyTable
            data={tableData}
            loading={loading}
            hasMore={hasMoreRef.current}
            columns={columns}
            scrollHeight="600px"
            onLazyLoad={() => fetchTableData()}
            onSort={handleSort}
            sortField={sortFieldRef.current}
            sortOrder={sortOrderRef.current}
            onRowClick={(e) => {
              const rowData = e.data;
              if (redirectFrom !== "game") {
                navigate("/page-position-details", {
                  state: {
                    redirect_from: redirectFrom,
                    country_name: country_name_from_state,
                    state_name: state_name_from_state,
                    operator_id: operator_id_from_state,
                    operator_name: operator_name_from_state,
                    game_id: rowData.game_id,
                    game_name: rowData.game_name,
                  },
                });
              } else {
                navigate("/country-dashboard", {
                  state: {
                    redirect_from: "game",
                    game_id_from_state: rowData.game_id,
                    game_name_from_state: rowData.game_name,
                  },
                });
              }
            }}
          />
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
  );
};

export default GameDashboard1;
