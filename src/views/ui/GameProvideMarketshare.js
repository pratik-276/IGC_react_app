import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";

import { Spin } from "antd";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode } from "primereact/api";

import "./DashboardMod.css";
import call from "../../services/Call";
import toast from "react-hot-toast";

const GameProvideMarketshare = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("United States");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    getPageData();
  }, [selectedRegion]);

  useEffect(() => {
    import("../../utils/DatatableBottomFix").then(
      ({ datatableBottomItemFix }) => {
        console.log(datatableBottomItemFix());
      }
    );
  }, [tableData]);

  async function getRegions() {
    const res = await call({
      path: "get_regions",
      method: "GET",
    });

    if (res?.data && Array.isArray(res.data)) {
      const cleaned = res.data
        .filter((region) => region !== null && typeof region === "string")
        .map((region) => ({ label: region, value: region }));

      setRegions(cleaned);
    } else {
      setRegions([]);
    }
  }

  async function getMarketshareData() {
    const data = await call({
      path: `get_provider_marketshare`,
      method: "POST",
      data: {
        region: selectedRegion,
        month: "",
        search_term: "",
      },
    });

    console.log(Math.max(...data.data.map((d) => parseFloat(d.market_share))));
    setTableData(data.data.sort((a, b) => b.market_share - a.market_share));
  }

  async function getPageData() {
    setLoading(true);
    try {
      await getRegions();
      await getMarketshareData();
    } catch (e) {
      toast.error(e);
      setTableData([]);
    }

    setLoading(false);
  }

  const changeTemplate = (row) => {
    let change = ";";
    if (row != null) {
      change = row?.change.replaceAll("%", "");
      change = parseFloat(change).toFixed(2);
    }
    return (
      <h6 className="font-normal text-secondary">
        {change < 0 ? (
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
            {change}% <FaCaretDown />
          </span>
        ) : (
          ""
        )}
        {change == 0 ? (
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
            {change}%
          </span>
        ) : (
          ""
        )}
        {change > 0 ? (
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
            {change}% <FaCaretUp />
          </span>
        ) : (
          ""
        )}
      </h6>
    );
  };

  const marketshareTemplate = (row) => {
    const share = mapToRange(row.market_share, 0, 100);
    let bg = "bg-info";

    if (parseFloat(row.market_share) < 3.0) {
      bg = "bg-danger";
    } else if (
      parseFloat(row.market_share) > 3.0 &&
      parseFloat(row.market_share) < 6.0
    ) {
      bg = "bg-warning";
    } else if (parseFloat(row.market_share) > 6.0) {
      bg = "bg-success";
    } else {
      bg = "bg-info";
    }

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
        <div style={{ fontSize: "12px", flex: 0.3 }}>
          {parseFloat(row.market_share).toFixed(2)}%
        </div>
        <div style={{ flex: 1 }} className="progress">
          <div
            className={`progress-bar ${bg}`}
            role="progressbar"
            style={{ width: `${share}%` }}
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
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

  const actionBodyTemplate = (rowData) => {
    return (
      <MdArrowForwardIos
        style={{ fontSize: "16px" }}
        onClick={() => {
          console.log(rowData);
          navigate("/game-provider-marketshare-details", {
            state: {
              regionName: selectedRegion,
              providerId: rowData.provider_id,
            },
          });
        }}
      />
    );
  };

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="d-flex flex-column gap-3 justify-content-between">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4
                  className="m-md-0 font-semibold"
                  style={{ color: "#392f6c" }}
                >
                  Game Provider Marketshare
                </h4>
                <span className="text-black" style={{ fontSize: "1rem" }}>
                  Understand provider dominance across global casinos
                </span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <Dropdown
                  optionLabel="label"
                  optionValue="value"
                  filter
                  placeholder="Select Region"
                  loading={loading}
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.value)}
                  options={regions}
                />

                <IconField iconPosition="left" style={{ flex: 2 }}>
                  <InputIcon className="pi pi-search" />
                  <InputText
                    disabled={loading}
                    placeholder="Search"
                    value={filters.global.value}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        global: { ...f.global, value: e.target.value },
                      }))
                    }
                  />
                </IconField>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <>
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
          </>
        ) : (
          <>
            <div className="border border-secondary p-3 rounded-3 mt-3">
              <h5 className="font-semibold pl-2">Latest Details</h5>
              <DataTable
                value={tableData}
                filters={filters}
                removableSort
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                size="small"
                className="table-bordered p-component p-datatable custom-table small"
                scrollable
                sortIcon={sortIconTemplate}
                sortField="market_share"
                sortOrder={0}
                globalFilterFields={["game_provider"]}
              >
                <Column
                  field="provider_rank"
                  sortable
                  header={headerWithTooltip(
                    "Rank",
                    "Rank of the game provider in the market",
                    "rank"
                  )}
                ></Column>

                <Column
                  field="game_provider"
                  sortable
                  header={headerWithTooltip(
                    "Game Provider",
                    "Name of the game provider",
                    "game_provider"
                  )}
                ></Column>

                <Column
                  field="unique_games"
                  sortable
                  header={headerWithTooltip(
                    "Unique Games",
                    "Number of unique games provided by the provider",
                    "unique_games"
                  )}
                ></Column>

                <Column
                  field="unique_casinos"
                  sortable
                  header={headerWithTooltip(
                    "Unique Casinos",
                    "Number of unique casinos using the provider",
                    "unique_casinos"
                  )}
                ></Column>

                <Column
                  field="market_share"
                  sortable
                  align="center"
                  header={headerWithTooltip(
                    "Market Share",
                    "Market share of the provider in the selected region",
                    "market_share"
                  )}
                  body={marketshareTemplate}
                ></Column>

                <Column
                  field="major_market"
                  sortable
                  header={headerWithTooltip(
                    "Market",
                    "Market of the provider in the selected region",
                    "major_market"
                  )}
                ></Column>

                <Column
                  field="change"
                  sortable
                  header={headerWithTooltip(
                    "Change (MoM)",
                    "Change in market share",
                    "change"
                  )}
                  body={changeTemplate}
                ></Column>

                <Column
                  field="details"
                  header={headerWithTooltip(
                    "Details",
                    "Check details",
                    "details"
                  )}
                  className="text-center"
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
            </div>
          </>
        )}
      </div>
    </>
  );
};

function mapToRange(value, oldMin, oldMax) {
  if (value < oldMin || value > oldMax) {
    throw new Error("Value out of range");
  }

  const mappedValue = ((value - oldMin) / (oldMax - oldMin)) * 100;
  return mappedValue.toFixed(0);
}

export default GameProvideMarketshare;
