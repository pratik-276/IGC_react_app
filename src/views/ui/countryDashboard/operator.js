import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Papa from "papaparse";

import InfoCard from "../../../charts/InfoCard";
import PageHeader from "../../../component/PageHeader";
import ReusableLazyTable from "../../../component/ReusableLazyTable";
import headerWithTooltip from "../../../component/tableHeaders";
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

const OperatorDashboard1 = () => {
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

  const [summaryCasinoCount, setSummaryCasinoCount] = useState(null);
  const [summaryCasinoCoverage, setSummaryCasinoCoverage] = useState(null);
  const [summaryGameCount, setSummaryGameCount] = useState(null);
  const [summaryTotalPositions, setSummaryTotalPositions] = useState(null);
  const [summaryCountryCount, setSummaryCountryCount] = useState(null);

  const {
    redirect_from,
    country_name_from_state,
    state_name_from_state,
    game_id_from_state,
    game_name_from_state,
  } = location.state || {};
  var redirectFrom = "operator";
  if (redirect_from) {
    redirectFrom = redirect_from;
  }

  let items = [{ label: "Operators" }];

  if (redirectFrom === "country") {
    items = [
      { label: "Countries", command: () => navigate("/country-dashboard") },
      { label: country_name_from_state },
      { label: "Operators" },
    ];
  }

  if (redirectFrom === "game") {
    items = [
      { label: "Games", command: () => navigate("/game-dashboard") },
      { label: game_name_from_state },
      { label: "Countries", command: () => navigate(-1) },
      { label: country_name_from_state },
      { label: "Operators" },
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
          await PositionDashboard.provider_operator_dashboard_1_summary({
            game_provider: user_company,
            country_name: country_name_from_state,
            state: state_name_from_state,
          });
        if (response?.success === true) {
          setSummaryCasinoCount(response?.data?.casino_count || null);
          setSummaryCasinoCoverage(response?.data?.casino_coverage || null);
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
          await PositionDashboard.provider_operator_dashboard_2_summary({
            game_provider: user_company,
          });

        if (response?.success === true) {
          setSummaryCasinoCount(response?.data?.casino_count || null);
          setSummaryCountryCount(response?.data?.country_count || null);
          setSummaryTotalPositions(
            response?.data?.game_positions_count || null,
          );
        } else {
          console.log("Failed to fetch summary data");
        }
      }
      if (redirectFrom === "game") {
        const response =
          await PositionDashboard.provider_operator_dashboard_3_summary({
            game_provider: user_company,
            game_id: game_id_from_state,
            country_name: country_name_from_state,
            state: state_name_from_state,
          });

        if (response?.success === true) {
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
        res = await PositionDashboard.provider_operator_dashboard_1({
          game_provider: user_company,
          country_name: country_name_from_state,
          state: state_name_from_state,
          limit: PAGE_SIZE,
          page: pageRef.current,
          search: searchRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        });
      } else if (redirectFrom === "operator") {
        res = await PositionDashboard.provider_operator_dashboard_2({
          game_provider: user_company,
          limit: PAGE_SIZE,
          page: pageRef.current,
          search: searchRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        });
      } else if (redirectFrom === "game") {
        res = await PositionDashboard.provider_operator_dashboard_3({
          game_provider: user_company,
          game_id: game_id_from_state,
          country_name: country_name_from_state,
          state: state_name_from_state,
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
      field: "operator_name",
      header: headerWithTooltip(
        "Operator",
        "Name of Operator",
        "operator_name",
      ),
      body: textTemplate("operator_name"),
      sortable: true,
    },

    ...(redirectFrom === "operator"
      ? [
          {
            field: "country_count",
            header: headerWithTooltip(
              "Country Count",
              "Overall count of countries for this operator",
              "country_count",
            ),
            body: textTemplate("country_count"),
            sortable: true,
          },
        ]
      : []),

    ...(redirectFrom === "operator" || redirectFrom === "country"
      ? [
          {
            field: "game_count",
            header: headerWithTooltip(
              "Game Count",
              "Overall count of games in this country",
              "game_count",
            ),
            body: textTemplate("game_count"),
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
    if (redirectFrom === "country") {
      const downloadData = {
        game_provider: user_company,
        search: searchTerm,
        country_name: country_name_from_state,
        state: state_name_from_state,
      };
      const downloadRes =
        await PositionDashboard.provider_operator_dashboard_1_download(
          downloadData,
        );
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
    }
    if (redirectFrom === "operator") {
      const downloadData = {
        game_provider: user_company,
        search: searchTerm,
      };
      const downloadRes =
        await PositionDashboard.provider_operator_dashboard_2_download(
          downloadData,
        );
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
    }
    if (redirectFrom === "game") {
      const downloadData = {
        game_provider: user_company,
        search: searchTerm,
        game_id: game_id_from_state,
        country_name: country_name_from_state,
        state: state_name_from_state,
      };
      const downloadRes =
        await PositionDashboard.provider_operator_dashboard_3_download(
          downloadData,
        );
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
    }
  };

  return (
    <>
      <PageHeader
        title="Operator Dashboard"
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
          {/* <div className="border border-secondary p-3 rounded-3 mt-3"> */}
          <div className="mb-3">
            <div className="flex gap-2 mt-2">
              <InfoCard
                header="Operator Count"
                tooltip="Shows total count of unique operators hosting your games"
                tooltipTarget="casino_count"
                value={summaryCasinoCount}
              />

              {redirectFrom === "country" && (
                <InfoCard
                  header="Operator Coverage"
                  tooltip="Shows coverage of your games compared to total operators scanned in selected country"
                  tooltipTarget="casino_coverage"
                  value={summaryCasinoCoverage + "%"}
                />
              )}

              {redirectFrom === "operator" && (
                <InfoCard
                  header="Country Count"
                  tooltip="Shows total count of unique countries hosting your games"
                  tooltipTarget="country_count"
                  value={summaryCountryCount}
                />
              )}

              {redirectFrom === "country" && (
                <InfoCard
                  header="Game Count"
                  tooltip="Shows total count of unique games across all casinos"
                  tooltipTarget="game_count"
                  value={summaryGameCount}
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
              if (redirectFrom === "country") {
                navigate("/game-dashboard", {
                  state: {
                    redirect_from: "country",
                    country_name_from_state: country_name_from_state,
                    state_name_from_state: state_name_from_state,
                    operator_id_from_state: rowData.operator_id,
                    operator_name_from_state: rowData.operator_name,
                  },
                });
              }
              if (redirectFrom === "operator") {
                navigate("/country-dashboard", {
                  state: {
                    redirect_from: "operator",
                    operator_id_from_state: rowData.operator_id,
                    operator_name_from_state: rowData.operator_name,
                  },
                });
              }

              if (redirectFrom === "game") {
                navigate("/page-position-details", {
                  state: {
                    redirect_from: redirectFrom,
                    game_id: game_id_from_state,
                    game_name: game_name_from_state,
                    operator_id: rowData.operator_id,
                    operator_name: rowData.operator_name,
                    country_name: country_name_from_state,
                    state_name: state_name_from_state,
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

export default OperatorDashboard1;
