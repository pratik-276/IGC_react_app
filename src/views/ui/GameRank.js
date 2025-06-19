import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FloatLabel } from "primereact/floatlabel";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";

import { Spin } from "antd";

import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { FaGem, FaLock } from "react-icons/fa6";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";

import call from "../../services/Call";
import "./DashboardMod.css";
import "./AccessBlur.css";

const GameRank = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalCasinos, setTotalCasinos] = useState("");
  const [updatedOn, setUpdatedOn] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("United States");

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  // const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

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
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setTableData(res.data.data);

          const month = res.data?.month;
          const year = res.data?.year;

          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          const formattedDate =
            month && year ? `${monthNames[month - 1]}, ${year}` : null;

          console.log(formattedDate);

          setUpdatedOn(formattedDate);
          setTotalCasinos(res.data.total_casinos);
        } else {
          console.error("Expected array but got:", res.data.data);
          setTableData([]);
        }
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

  useEffect(() => {
    const savedRegion = localStorage.getItem("gameRegion");
    if (savedRegion) {
      setSelectedRegion(savedRegion);
    }
  }, []);

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

  const actionBodyTemplate = (rowData) => {
    return (
      <MdArrowForwardIos
        style={{ fontSize: "24px" }}
        onClick={() => {
          console.log(rowData);
          navigate("/game-rank-details", {
            state: {
              selected_region: selectedRegion,
              game_id: rowData.game_id,
            },
          });
        }}
      />
    );
  };

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
                    Game Rank
                  </h4>
                  <span className="text-black" style={{ fontSize: "1rem" }}>
                    Track top games in every market
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <FloatLabel>
                    <Dropdown
                      optionLabel="label"
                      optionValue="value"
                      filter
                      placeholder="Select Region"
                      loading={loading}
                      value={selectedRegion}
                      // onChange={(e) => setSelectedRegion(e.value)}
                      onChange={(e) => {
                        const region = e.value;
                        setSelectedRegion(region);
                        localStorage.setItem("gameRegion", region);
                      }}
                      options={regions}
                    />
                    <label className="fs-6" htmlFor="region">
                      Select Country
                    </label>
                  </FloatLabel>

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
                {/* <div className="d-flex justify-content-between mb-2"> */}
                <h5 className="font-semibold pl-2">Latest Details</h5>
                {/* <div>
                    <strong>Total Casinos : </strong>
                    {totalCasinos}
                  </div> */}
                <div className="d-flex justify-content-between pl-2 mb-2">
                  <div>
                    <strong>Total Casinos : </strong>
                    {totalCasinos}
                  </div>
                  <div>
                    <strong>Updated On : </strong>
                    {updatedOn}
                  </div>
                </div>
                {/* </div> */}

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
                    field="country_rank"
                    sortable
                    header={headerWithTooltip(
                      "Rank",
                      "The rank of the game in the selected country",
                      "country_rank"
                    )}
                  ></Column>
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

                  {/* <Column
                  field="avg_position"
                  sortable
                  header={headerWithTooltip(
                    "Average Position",
                    "The average position of the game in the selected country",
                    "avg_position"
                  )}
                ></Column> */}

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
                    field="visibility_perc"
                    sortable
                    header={headerWithTooltip(
                      "Visibility %",
                      "The visibility % of the game",
                      "visibility_perc"
                    )}
                  ></Column>

                  <Column
                    field="lobby_perc"
                    sortable
                    header={headerWithTooltip(
                      "Lobby %",
                      "The lobby % of the game",
                      "lobby_perc"
                    )}
                  ></Column>

                  <Column
                    field="change"
                    sortable
                    header={headerWithTooltip(
                      "Rank Change",
                      "The change in rank of the game",
                      "change"
                    )}
                    body={changeTemplate}
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
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GameRank;
