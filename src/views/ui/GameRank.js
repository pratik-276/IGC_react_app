import React, { useEffect, useState } from "react";
import { MdInfoOutline } from "react-icons/md";

import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Spin } from "antd";
import { FilterMatchMode } from "primereact/api";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import "./DashboardMod.css";

import call from "../../services/Call";
const GameRank = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("United States");

  useEffect(() => {
    setLoading(true);
    getRegions();
    call({
      path: "get_game_rank",
      method: "POST",
      data: {
        region: selectedRegion,
        search_term: "",
      },
    })
      .then((v) => {
        setTableData(v.data);
        console.log(v.data[0]);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const stabilityTemplate = (row) => {
    let stability = "low";
    if (row.stability < 5) stability = "high";
    else if (row.stability > 5 && row.stability <= 10) stability = "medium";
    else stability = "low";

    return (
      <h6 className="font-normal text-secondary">
        {stability === "low" ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#f8d7da",
              color: "#dc3545",
            }}
            className="text-capitalize"
          >
            low
          </span>
        ) : (
          ""
        )}
        {stability === "medium" ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#faf3e8",
              color: "#dc9b00",
            }}
            className="text-capitalize"
          >
            medium
          </span>
        ) : (
          ""
        )}
        {stability === "high" ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#e6f9e6",
              color: "#28a745",
            }}
            className="text-capitalize"
          >
            high
          </span>
        ) : (
          ""
        )}
      </h6>
    );
  };

  const changeTemplate = (row) => {
    let change = ";";
    if (row != null) {
      change = row?.change;
    }
    return (
      <h6 className="font-normal text-secondary">
        {change < 0 ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc3545",
            }}
          >
            {change} <FaCaretDown />
          </span>
        ) : (
          ""
        )}
        {change == 0 ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              color: "#dc9b00",
            }}
          >
            {change}{" "}
          </span>
        ) : (
          ""
        )}
        {change > 0 ? (
          <span
            style={{
              display: "inline-block",
              padding: "0.5em 0.75em",
              fontSize: "0.875em",
              borderRadius: "0.25em",
              fontWeight: "bold",
              textAlign: "center",
              color: "#28a745",
            }}
          >
            {change} <FaCaretUp />
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
                  Game Rank
                </h4>
                <span className="text-black" style={{ fontSize: "1rem" }}>
                  Track top games in every market
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
                sortField="country_rank"
                sortOrder={1}
              >
                <Column
                  field="game_name"
                  sortable
                  header={headerWithTooltip(
                    "Game Name",
                    "The name of the game",
                    "game_name"
                  )}
                ></Column>

                <Column
                  field="game_provider"
                  sortable
                  header={headerWithTooltip(
                    "Game Provider",
                    "The name of the game provider",
                    "game_provider"
                  )}
                ></Column>

                <Column
                  field="country_rank"
                  sortable
                  header={headerWithTooltip(
                    "Country Rank",
                    "The rank of the game in the selected country",
                    "country_rank"
                  )}
                ></Column>

                <Column
                  field="avg_position"
                  sortable
                  header={headerWithTooltip(
                    "Average Position",
                    "The average position of the game in the selected country",
                    "avg_position"
                  )}
                ></Column>

                <Column
                  field="casino_present"
                  sortable
                  header={headerWithTooltip(
                    "Casino Present",
                    "The number of casinos where the game is present",
                    "casino_present"
                  )}
                ></Column>

                <Column
                  field="stability"
                  sortable
                  header={headerWithTooltip(
                    "Stability",
                    "The stability of the game",
                    "stability"
                  )}
                  body={stabilityTemplate}
                ></Column>

                <Column
                  field="change"
                  sortable
                  header={headerWithTooltip(
                    "Change",
                    "The change in rank of the game",
                    "change"
                  )}
                  body={changeTemplate}
                ></Column>
              </DataTable>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GameRank;
