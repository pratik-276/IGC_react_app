import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

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

  const arrayFromValues = Object.values(providerLatestDetails);

  const latest_details_fetch = () => {
    const data = {
      game_provider: user_company,
    };

    GameData.provider_latest_details(data)
      .then((res) => {
        if (res?.success === true) {
          console.log(res?.data);
          setProviderLatestDetails(res?.data || []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        }
      })
      .catch((err) => {
        console.log(err);
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
          navigate("/game-tracking-details", {
            state: {
              operator_site_id: rowData.operator_site_id,
              game_name: rowData.game_name,
              casino_name: rowData.casino_name,
            },
          });
          console.log(rowData.game_name, rowData.operator_site_id);
          //window.location.href = `/game-track-details?game_name=${rowData.game_name}&operator_site_id=${rowData.operator_site_id}`;
        }}
      />
    );
  };

  const changeTemplate = (row) => {
    let growth = ";";
    if (row != null) {
      growth = row?.growth;
      growth = parseFloat(growth).toFixed(2);
    }
    return (
      <h6 className="font-normal text-secondary">
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

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly }, "test.csv");
  };

  return (
    <>
      <div>
        <div>
          <div>
            <div>
              <h4 className="font-semibold" style={{ color: "#392f6c" }}>
                {trackingDetails?.operator_name != undefined
                  ? `${trackingDetails?.operator_name} Dashboard`
                  : `Dashboard`}
              </h4>
              <span>View details related to all the compass configured</span>
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
                    <div className="mt-3 border border-secondary rounded-3 p-3">
                      <div>
                        <h5 className="pl-2 font-semibold">Summary</h5>
                        <div className="flex gap-3 mt-2">
                          <div className="flex-1">
                            <div className="d-flex border border-secondary border-left-3 justify-content-between align-items-center w-100 p-2">
                              <h5>Game Count</h5>
                              <h5 className="font-semibold">
                                {providerSummary.game_count}
                              </h5>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="d-flex border border-secondary border-left-3 justify-content-between align-items-center w-100 p-2">
                              <h5>Casino Count</h5>
                              <h5 className="font-semibold">
                                {providerSummary.casino_count}
                              </h5>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="d-flex border border-secondary border-left-3 justify-content-between align-items-center w-100 p-2">
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
                        <h5 className="pl-2 font-semibold">Latest Details</h5>
                        <div>
                          <DataTable
                            ref={dt}
                            value={providerLatestDetails}
                            selection={selectedRows}
                            onSelectionChange={(e) => setSelectedRows(e.value)}
                            dataKey="comb_id"
                            removableSort
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                            globalFilter={globalFilter}
                            //header={header}
                            size="small"
                            className="p-datatable p-component small table-bordered table-hover"
                            scrollable
                          >
                            <Column
                              field="game_name"
                              header="Game"
                              sortable
                            ></Column>
                            <Column
                              field="casino_name"
                              header="Casino"
                              sortable
                            ></Column>
                            <Column
                              field="country_name"
                              header="Country"
                              sortable
                            ></Column>
                            <Column
                              field="section_name"
                              header="Section Name"
                              sortable
                            ></Column>
                            <Column
                              field="section_position"
                              header="Section Position"
                              sortable
                            ></Column>
                            <Column
                              field="sectional_game_position"
                              header="Sectional Game Position"
                              sortable
                            ></Column>
                            <Column
                              field="overall_position"
                              header="Overall Position"
                              sortable
                            ></Column>
                            <Column
                              field="growth"
                              header="Growth"
                              sortable
                              body={changeTemplate}
                            ></Column>
                            {/* <Column
                              field=""
                              header=""
                              className="text-center"
                              //body={actionBodyTemplate}
                            ></Column> */}
                          </DataTable>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* {show === true && (
                  <>
                    {loader2 ? (
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
                        <TrackerDetails trackingDetails={trackingDetails} />
                      </>
                    )}
                  </>
                )} */}
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
