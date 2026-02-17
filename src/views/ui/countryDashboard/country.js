import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Papa from "papaparse";

import PositionDashboard from "../../../services/PositionDashboard";

import { useContext } from "react";
import { ProfileSystem } from "../../../context/ProfileContext";

import InfoCard from "../../../charts/InfoCard";
import PageHeader from "../../../component/PageHeader";
import headerWithTooltip from "../../../component/tableHeaders";
import ReusableLazyTable from "../../../component/ReusableLazyTable";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../DashboardMod.css";
import "../AccessBlur.css";
import "./posnDashboard.css";
import { gameTrendTemplate } from "../../../component/tableTemplates";

const CountryDashboard1 = () => {
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

  const [summaryCountryCount, setSummaryCountryCount] = useState(null);
  const [summaryCasinoCount, setSummaryCasinoCount] = useState(null);
  const [summaryGameCount, setSummaryGameCount] = useState(null);
  const [summaryTotalPositions, setSummaryTotalPositions] = useState(null);

  const {
    redirect_from,
    operator_id_from_state,
    operator_name_from_state,
    game_id_from_state,
    game_name_from_state,
  } = location.state || {};
  var redirectFrom = "country";

  if (redirect_from) {
    redirectFrom = redirect_from;
  }
  console.log("CountryDashboard1 Redirect FROM: " + redirectFrom);

  let items = [{ label: "Countries" }];

  if (redirectFrom === "operator") {
    items = [
      { label: "Operators", command: () => navigate("/operator-dashboard") },
      { label: operator_name_from_state },
      { label: "Countries" },
    ];
  }

  if (redirectFrom === "game") {
    items = [
      { label: "Games", command: () => navigate("/game-dashboard") },
      { label: game_name_from_state },
      { label: "Countries" },
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
          await PositionDashboard.provider_country_dashboard_1_summary({
            game_provider: user_company,
          });

        if (response?.success === true) {
          console.log(response);
          setSummaryCountryCount(response?.data?.country_count || null);
          setSummaryCasinoCount(response?.data?.casino_count || null);
          setSummaryTotalPositions(
            response?.data?.game_positions_count || null,
          );
        } else {
          console.log("Failed to fetch summary data");
        }
      }
      if (redirectFrom === "operator") {
        const response =
          await PositionDashboard.provider_country_dashboard_2_summary({
            game_provider: user_company,
            operator_id: operator_id_from_state,
          });

        if (response?.success === true) {
          console.log(response);
          setSummaryCountryCount(response?.data?.country_count || null);
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
          await PositionDashboard.provider_country_dashboard_3_summary({
            game_provider: user_company,
            game_id: game_id_from_state,
          });

        if (response?.success === true) {
          console.log(response);
          setSummaryCountryCount(response?.data?.country_count || null);
          setSummaryCasinoCount(response?.data?.casino_count || null);
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
        res = await PositionDashboard.provider_country_dashboard_1({
          game_provider: user_company,
          limit: PAGE_SIZE,
          page: pageRef.current,
          search: searchRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        });
      } else if (redirectFrom === "operator") {
        res = await PositionDashboard.provider_country_dashboard_2({
          game_provider: user_company,
          operator_id: operator_id_from_state,
          limit: PAGE_SIZE,
          page: pageRef.current,
          search: searchRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        });
      } else if (redirectFrom === "game") {
        res = await PositionDashboard.provider_country_dashboard_3({
          game_provider: user_company,
          game_id: game_id_from_state,
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

  const fetchNextPage = async (reset = false) => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    // skeletons
    setTableData((prev) => [
      ...prev,
      ...Array.from({ length: PAGE_SIZE }, (_, i) => ({
        __skeleton: true,
        __id: `sk-${pageRef.current}-${i}`,
      })),
    ]);

    let res;
    if (redirectFrom === "country") {
      res = await PositionDashboard.provider_country_dashboard_1({
        game_provider: user_company,
        limit: PAGE_SIZE,
        page: pageRef.current,
        search: searchRef.current,
        sort_by: sortFieldRef.current,
        order: sortOrderRef.current,
      });
    } else if (redirectFrom === "operator") {
      res = await PositionDashboard.provider_country_dashboard_2({
        game_provider: user_company,
        operator_id: operator_id_from_state,
        limit: PAGE_SIZE,
        page: pageRef.current,
        search: searchRef.current,
        sort_by: sortFieldRef.current,
        order: sortOrderRef.current,
      });
    } else if (redirectFrom === "game") {
      res = await PositionDashboard.provider_country_dashboard_3({
        game_provider: user_company,
        game_id: game_id_from_state,
        limit: PAGE_SIZE,
        page: pageRef.current,
        search: searchRef.current,
        sort_by: sortFieldRef.current,
        order: sortOrderRef.current,
      });
    }

    const rows = res?.data?.data || [];
    const pagination = res?.pagination;

    setTableData((prev) => {
      const clean = prev.filter((r) => !r.__skeleton);
      return reset ? rows : [...clean, ...rows];
    });

    if (pagination) {
      hasMoreRef.current = pagination.current_page < pagination.total_pages;
      pageRef.current = pagination.current_page + 1;
    }

    loadingRef.current = false;
    setLoading(false);
  };

  const resetTable = () => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    loadingRef.current = false;
    setTableData([]);
    fetchNextPage(true);
  };

  const handleSort = (field, order) => {
    sortFieldRef.current = field;
    sortOrderRef.current = order;
    resetTable();
  };

  const columns = [
    {
      field: "country_name",
      header: headerWithTooltip("Country", "Name of country", "country_name"),
      sortable: true,
    },

    ...(redirectFrom === "country" || redirectFrom === "game"
      ? [
          {
            field: "casino_count",
            header: headerWithTooltip(
              "Operator Count",
              "Overall count of casinos in this country",
              "casino_count",
            ),
            sortable: true,
          },
        ]
      : []),

    ...(redirectFrom === "country" || redirectFrom === "operator"
      ? [
          {
            field: "game_count",
            header: headerWithTooltip(
              "Game Count",
              "Overall count of games in this country",
              "game_count",
            ),
            sortable: true,
          },
          {
            field: "game_count_trend",
            header: headerWithTooltip(
              "Game Count Trend",
              "Trend of game count in this country over last few months",
              "game_count_trend",
            ),
            body: gameTrendTemplate,
            sortable: false,
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
      sortable: true,
    },
  ];

  const exportCSV = async () => {
    let downloadRes;
    if (redirectFrom === "country") {
      const downloadData = {
        game_provider: user_company,
        search: searchTerm,
      };

      downloadRes =
        await PositionDashboard.provider_country_dashboard_1_download(
          downloadData,
        );
    } else if (redirectFrom === "operator") {
      const downloadData = {
        game_provider: user_company,
        operator_id: operator_id_from_state,
        search: searchTerm,
      };

      downloadRes =
        await PositionDashboard.provider_country_dashboard_2_download(
          downloadData,
        );
    } else if (redirectFrom === "game") {
      const downloadData = {
        game_provider: user_company,
        game_id: game_id_from_state,
        search: searchTerm,
      };

      downloadRes =
        await PositionDashboard.provider_country_dashboard_3_download(
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
        title="Country Dashboard"
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

      {tableData.length > 0 ? (
        <>
          {/* <div className="border border-secondary p-3 rounded-3 mt-3"> */}
          <div className="mb-3">
            <div>
              {/* <h5 className="font-semibold pl-2">Summary</h5> */}
              <div className="flex gap-2 mt-2">
                <InfoCard
                  header="Country Count"
                  tooltip="Shows total count of countries where your games are found"
                  tooltipTarget="country_count"
                  value={summaryCountryCount}
                />

                {(redirectFrom === "country" || redirectFrom === "game") && (
                  <InfoCard
                    header="Operator Count"
                    tooltip="Shows total count of unique operators hosting your games"
                    tooltipTarget="casino_count"
                    value={summaryCasinoCount}
                  />
                )}

                {redirectFrom === "operator" && (
                  <InfoCard
                    header="Game Count"
                    tooltip="Shows total count of unique games hosted by your operator"
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
          </div>

          <ReusableLazyTable
            data={tableData}
            loading={loading}
            hasMore={hasMoreRef.current}
            columns={columns}
            scrollHeight="600px"
            onLazyLoad={() => fetchNextPage()}
            onSort={handleSort}
            sortField={sortFieldRef.current}
            sortOrder={sortOrderRef.current}
            onRowClick={(e) => {
              const rowData = e.data;
              if (redirectFrom === "country") {
                navigate("/operator-dashboard", {
                  state: {
                    redirect_from: redirectFrom,
                    country_name_from_state: rowData.country_name,
                    state_name_from_state: rowData.state,
                  },
                });
              }
              if (redirectFrom === "operator") {
                navigate("/game-dashboard", {
                  state: {
                    redirect_from: redirectFrom,
                    country_name_from_state: rowData.country_name,
                    state_name_from_state: rowData.state,
                    operator_id_from_state: operator_id_from_state,
                    operator_name_from_state: operator_name_from_state,
                  },
                });
              }
              if (redirectFrom === "game") {
                navigate("/operator-dashboard", {
                  state: {
                    redirect_from: redirectFrom,
                    country_name_from_state: rowData.country_name,
                    state_name_from_state: rowData.state,
                    game_id_from_state: game_id_from_state,
                    game_name_from_state: game_name_from_state,
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

export default CountryDashboard1;
