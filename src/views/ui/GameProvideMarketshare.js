import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { FloatLabel } from "primereact/floatlabel";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";

import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { FaGem, FaLock } from "react-icons/fa6";

import call from "../../services/Call";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";
import GameRankAPI from "../../services/GameRank";
import ReusableLazyTable from "../../component/ReusableLazyTable";
import headerWithTooltip from "../../component/tableHeaders";

import "./DashboardMod.css";
import "./AccessBlur.css";
import {
  changeTemplate,
  marketshareTemplate,
} from "../../component/tableTemplates";
import AppBreadcrumb from "../../component/AppBreadcrumb";

const GameProvideMarketshare = () => {
  const navigate = useNavigate();

  const PAGE_SIZE = 20;

  // const tableWrapperRef = useRef(null);

  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const searchRef = useRef("");
  const searchDebounceRef = useRef(null);

  const sortFieldRef = useRef("market_share");
  const sortOrderRef = useRef("desc");

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("North America");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [totalCasinos, setTotalCasinos] = useState(null);
  const [updatedOn, setUpdatedOn] = useState(null);

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  const { showContactSalesConfirmation } = useContactSales();

  useEffect(() => {
    const savedMarket = localStorage.getItem("marketshareMarket");

    setSelectedRegion("All");
    getMarkets();

    const market = savedMarket || "North America";
    setSelectedMarket(market);
    getRegions(market);

    pageRef.current = 1;
    hasMoreRef.current = true;
    setTableData([]);

    fetchMarketshareData({ reset: true });
  }, []);

  useEffect(() => {
    import("../../utils/DatatableBottomFix").then(
      ({ datatableBottomItemFix }) => {
        console.log(datatableBottomItemFix());
      },
    );
  }, [tableData]);

  // useEffect(() => {
  //   const wrapper = tableWrapperRef.current?.querySelector(
  //     ".p-datatable-wrapper",
  //   );

  //   if (!wrapper) return;

  //   const handleScroll = (e) => {
  //     if (loadingRef.current) return;

  //     const { scrollTop, scrollHeight, clientHeight } = e.target;

  //     if (scrollTop + clientHeight >= scrollHeight - 50) {
  //       fetchMarketshareData();
  //     }
  //   };

  //   wrapper.addEventListener("scroll", handleScroll);
  //   return () => wrapper.removeEventListener("scroll", handleScroll);
  // }, []);

  async function getMarkets() {
    GameRankAPI.get_markets().then((res) => {
      console.log(res);
      if (res?.data && Array.isArray(res.data)) {
        const cleaned = res.data
          .filter((region) => region !== null && typeof region === "string")
          .map((region) => ({ label: region, value: region }));

        setMarkets(cleaned);
      } else {
        setMarkets([]);
      }
    });
  }

  async function getRegions(updated_market) {
    setLoading(true);
    const res = await call({
      path: "get_regions_by_market",
      method: "POST",
      data: {
        region: updated_market,
      },
    });

    if (res?.data && Array.isArray(res.data)) {
      const cleaned = res.data
        .filter((region) => region !== null && typeof region === "string")
        .map((region) => ({ label: region, value: region }));

      setRegions(cleaned);
      // setSelectedRegion("All");
      // getMarketshareData(updated_market, "All");
      setSelectedRegion("All");

      pageRef.current = 1;
      hasMoreRef.current = true;
      setTableData([]);

      fetchMarketshareData({ reset: true });
    } else {
      setRegions([]);
      setLoading(false);
    }
  }

  const fetchMarketshareData = async ({ reset = false } = {}) => {
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
      const res = await call({
        path: "get_provider_marketshare_mod",
        method: "POST",
        data: {
          region: selectedRegion,
          market: selectedMarket,
          search_term: searchRef.current,
          month: "",
          limit: PAGE_SIZE,
          page: pageRef.current,
          sort_by: sortFieldRef.current,
          order: sortOrderRef.current,
        },
      });

      if (res?.data?.data) {
        setTableData((prev) => {
          const clean = prev.filter((r) => !r.__skeleton);
          return reset ? res.data.data : [...clean, ...res.data.data];
        });

        console.log("res.data : ", res);

        const pagination = res.pagination;
        console.log("pagination : ", pagination);

        hasMoreRef.current = pagination.current_page < pagination.total_pages;

        pageRef.current = pagination.current_page + 1;

        setTotalCasinos(res.data.total_casinos);
        setUpdatedOn(res.data.month_year);
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

    const res = await call({
      path: "get_provider_marketshare_mod",
      method: "POST",
      data: {
        region: selectedRegion,
        market: selectedMarket,
        search_term: searchRef.current,
        month: "",
        limit: PAGE_SIZE,
        page: pageRef.current,
        sort_by: sortFieldRef.current,
        order: sortOrderRef.current,
      },
    });

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
      field: "provider_rank",
      header: headerWithTooltip(
        "Rank",
        "Rank of the game provider in the market",
        "rank",
      ),
      sortable: true,
    },
    {
      field: "game_provider",
      header: headerWithTooltip(
        "Game Provider",
        "Name of the game provider",
        "game_provider",
      ),
      sortable: true,
    },
    {
      field: "unique_games",
      header: headerWithTooltip(
        "Unique Games",
        "Number of unique games provided by the provider",
        "unique_games",
      ),
      sortable: true,
    },
    {
      field: "unique_casinos",
      header: headerWithTooltip(
        "Unique Casinos",
        "Number of unique casinos using the provider",
        "unique_casinos",
      ),
      sortable: true,
    },
    {
      field: "market_share",
      header: headerWithTooltip(
        "Market Share",
        "Market share of the provider in the selected region",
        "market_share",
      ),
      sortable: true,
      body: marketshareTemplate,
    },
    {
      field: "change",
      header: headerWithTooltip(
        "Change (MoM)",
        "Change in market share",
        "change",
      ),
      sortable: true,
      body: changeTemplate,
    },
  ];

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

      <div className={`content ${isPlanExpired ? "show" : ""}`}>
        <FaLock
          style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#392f6c" }}
        />
        <p className="fw-bold">Your plan has expired</p>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#392f6c",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onClick={showContactSalesConfirmation}
        >
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
                    Provider Marketshare
                  </h4>
                  {/* <span className="text-black" style={{ fontSize: "1rem" }}>
                    Understand provider dominance across global casinos
                  </span> */}
                  <AppBreadcrumb />
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <FloatLabel>
                    <Dropdown
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Region"
                      loading={loading}
                      value={selectedMarket}
                      onChange={(e) => {
                        const region = e.value;
                        setSelectedMarket(region);
                        localStorage.setItem("marketshareMarket", region);
                        getRegions(region);
                      }}
                      options={markets}
                      style={{ width: "150px" }}
                    />
                  </FloatLabel>
                  <FloatLabel>
                    <Dropdown
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Country"
                      loading={loading}
                      value={selectedRegion}
                      onChange={(e) => {
                        const region = e.value;
                        setSelectedRegion(region);
                        localStorage.setItem("marketshareRegion", region);

                        pageRef.current = 1;
                        hasMoreRef.current = true;
                        setTableData([]);

                        fetchMarketshareData({ reset: true });
                      }}
                      options={regions}
                      style={{ width: "150px" }}
                    />
                  </FloatLabel>

                  <IconField iconPosition="left" style={{ flex: 2 }}>
                    <InputIcon className="pi pi-search" />
                    <InputText
                      disabled={loading}
                      placeholder="Search"
                      onChange={(e) => {
                        if (searchDebounceRef.current) {
                          clearTimeout(searchDebounceRef.current);
                        }

                        const value = e.target.value.trim();

                        searchDebounceRef.current = setTimeout(() => {
                          searchRef.current = value;
                          pageRef.current = 1;
                          hasMoreRef.current = true;
                          loadingRef.current = false;
                          setTableData([]);

                          fetchMarketshareData({ reset: true });
                        }, 500);
                      }}
                      style={{ width: "150px" }}
                    />
                  </IconField>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            {/* <h5 className="font-semibold pl-2">Latest Details</h5>
            <div className="d-flex justify-content-between pl-2 mb-2">
              <div>
                <strong>Total Casinos : </strong>
                {totalCasinos}
              </div>
              <div>
                <strong>Period : </strong>
                {updatedOn}
              </div>
            </div> */}
            {/* <div ref={tableWrapperRef}>
              <DataTable
                value={tableData}
                scrollable
                scrollHeight="600px"
                onSort={(e) => {
                  sortFieldRef.current = e.sortField;
                  sortOrderRef.current = e.sortOrder === 1 ? "asc" : "desc";
                  pageRef.current = 1;
                  hasMoreRef.current = true;
                  setTableData([]);

                  fetchMarketshareData({ reset: true });
                }}
                sortField={sortFieldRef.current}
                sortOrder={sortOrderRef.current === "asc" ? 1 : -1}
                className="table-bordered p-datatable custom-table small"
                onRowClick={(e) => {
                  const rowData = e.data;
                  navigate("/game-provider-marketshare-details", {
                    state: {
                      regionName: selectedRegion,
                      providerId: rowData.provider_id,
                      passed_market: selectedMarket,
                      provider_details: rowData,
                    },
                  });
                }}
              >
                <Column
                  field="provider_rank"
                  sortable
                  header={headerWithTooltip(
                    "Rank",
                    "Rank of the game provider in the market",
                    "rank",
                  )}
                  body={(row) =>
                    row.__skeleton ? (
                      <Skeleton width="80%" height="1rem" />
                    ) : (
                      row.provider_rank
                    )
                  }
                ></Column>

                <Column
                  field="game_provider"
                  sortable
                  header={headerWithTooltip(
                    "Game Provider",
                    "Name of the game provider",
                    "game_provider",
                  )}
                  body={(row) =>
                    row.__skeleton ? (
                      <Skeleton width="80%" height="1rem" />
                    ) : (
                      row.game_provider
                    )
                  }
                ></Column>

                <Column
                  field="unique_games"
                  sortable
                  header={headerWithTooltip(
                    "Unique Games",
                    "Number of unique games provided by the provider",
                    "unique_games",
                  )}
                  body={(row) =>
                    row.__skeleton ? (
                      <Skeleton width="80%" height="1rem" />
                    ) : (
                      row.unique_games
                    )
                  }
                ></Column>

                <Column
                  field="unique_casinos"
                  sortable
                  header={headerWithTooltip(
                    "Unique Casinos",
                    "Number of unique casinos using the provider",
                    "unique_casinos",
                  )}
                  body={(row) =>
                    row.__skeleton ? (
                      <Skeleton width="80%" height="1rem" />
                    ) : (
                      row.unique_casinos
                    )
                  }
                ></Column>

                <Column
                  field="total_lobby_position"
                  sortable
                  header={headerWithTooltip(
                    "Lobby Casinos",
                    "Count of casinos where games in lobby",
                    "total_lobby_position",
                  )}
                  body={(row) =>
                    row.__skeleton ? (
                      <Skeleton width="80%" height="1rem" />
                    ) : (
                      row.total_lobby_position
                    )
                  }
                ></Column>

                <Column
                  field="market_share"
                  sortable
                  align="center"
                  header={headerWithTooltip(
                    "Market Share",
                    "Market share of the provider in the selected region",
                    "market_share",
                  )}
                  body={marketshareTemplate}
                ></Column>

                <Column
                  field="change"
                  sortable
                  header={headerWithTooltip(
                    "Change (MoM)",
                    "Change in market share",
                    "change",
                  )}
                  body={changeTemplate}
                ></Column>
              </DataTable>
            </div> */}

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
                navigate("/game-provider-marketshare-details", {
                  state: { provider_details: e.data },
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameProvideMarketshare;
