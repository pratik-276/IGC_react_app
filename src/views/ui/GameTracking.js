import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdArrowForwardIos, MdInfoOutline } from "react-icons/md";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import PositionChangeChart from "../../charts/PositionChangeChart";
import MiniCasinoTrackChart from "../../charts/MiniCasinoTrackChart";

import GameData from "../../services/GameTracker";
import { Spin } from "antd";
import TrackerDetails from "../../GameTrackDetails/TrackerDetails";

const TrackingTime = ["7days", "1 month", "3 months", "custom"];
const TrackingStatus = ["Live", "Old"];

const GameTracking = () => {
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(true);

  const [gameTracking, setGameTracking] = useState([]);
  const [trackingDetails, setTrackingDetails] = useState([]);
  const [loader2, setLoader2] = useState(true);

  useEffect(() => {
    const data = {
      user_id: 1,
      status: "live",
      start_datetime: "2024-06-01",
      end_datetime: "2024-07-01",
    };

    GameData.tracker_summary(data)
      .then((res) => {
        if (res?.success === true) {
          setGameTracking(res?.data);
          setLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dt = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedRows, setSelectedRows] = useState(null);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <div className="tracker-details-head">
        <h5 className="m-0">
          Tracker Details <MdInfoOutline className="ms-1" />
        </h5>
      </div>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Select Game"
        />
      </IconField>
    </div>
  );

  const StatusBodyTemplate = (row) => {
    return <span>{row ? row?.status : "-"}</span>;
  };

  const AverageBodyTemplate = (row) => {
    return <span style={{ color: "#8A92A6" }}>{row?.avg_position}</span>;
  };

  const MinBodyTemplate = (row) => {
    return <span style={{ color: "#8A92A6" }}>{row?.worst_position}</span>;
  };

  const MaxBodyTemplate = (row) => {
    return <span style={{ color: "#8A92A6" }}>{row?.best_position}</span>;
  };

  const TrendBodyTemplate = (row) => {
    return <span className="trend-details-badge">{row?.last_week_trend}</span>;
  };

  const HandleShowDetails = (id) => {
    window.scrollTo(0, 0);
    setShow(true);

    GameData.tracker_detail({ tracker_id: id })
      .then((res) => {
        if (res?.success === true) {
          setTrackingDetails(res?.data);
          setLoader2(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <MdArrowForwardIos
        style={{ fontSize: "24px" }}
        onClick={() => {
          HandleShowDetails(rowData.tracker_id);
        }}
      />
    );
  };

  return (
    <>
      <div className="compass">
        <div className="compass-data">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="m-0">Overview Dashboard</h4>
              <span>
                View, Filter and analyse data as per your requirements with
                adaptive dashboard
              </span>
            </div>

            <div className="col-md-6">
              <div className="row justify-content-end">
                <div className="col-md-3">
                  <Dropdown
                    options={TrackingStatus}
                    placeholder="Status"
                    className="w-100"
                  />
                </div>
                <div className="col-md-3">
                  <Dropdown
                    options={TrackingTime}
                    placeholder="All time "
                    className="w-100"
                  />
                </div>
              </div>
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
            {show === false && (
              <>
                <div className="tracker-details mt-2">
                  <div className="tracker-details-head">
                    <h5 className="m-0">
                      Tracker Details <MdInfoOutline className="ms-1" />
                    </h5>
                  </div>
                  <div className="row pt-3">
                    <div className="col-md-4">
                      <div className="position-view-box game-track-box">
                        <div className="d-flex justify-content-between align-items-center position-view-box-head game-track-box-chart">
                          <div>
                            <h6>Games/Casino Tracked</h6>
                            <p>View Details</p>
                          </div>
                          <div>
                            <h4 className="m-0 text-end">
                              {gameTracking?.tracker_count?.count}
                            </h4>
                            <p className="text-danger">
                              -4.66% <FaArrowDownLong />
                            </p>
                          </div>
                        </div>
                        <div className="chart-section-box">
                          <MiniCasinoTrackChart />
                        </div>
                      </div>
                      <div className="position-view-box game-track-box mt-3">
                        <div className="d-flex justify-content-between align-items-center position-view-box-head game-track-box-chart">
                          <div>
                            <h6>Average Position</h6>
                            <p>View Details</p>
                          </div>
                          <div>
                            <h4 className="m-0 text-end">
                              {gameTracking?.average_position?.position}
                            </h4>
                            <p className="text-success">
                              {
                                gameTracking?.average_position
                                  ?.percentage_change
                              }{" "}
                              <FaArrowUpLong />
                            </p>
                          </div>
                        </div>
                        <div className="chart-section-box">
                          <MiniCasinoTrackChart />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 ps-0">
                      <div className="position-view-box game-track-box">
                        <div className="d-flex justify-content-between align-items-center position-view-box-head game-track-box-chart">
                          <div>
                            <h6>Games Gaining Positions</h6>
                            <p>View Details</p>
                          </div>
                          <div>
                            <h4 className="m-0 text-end">
                              {gameTracking?.trackers_gaining_position?.count}
                            </h4>
                            <p className="text-success">
                              -4.66% <FaArrowUpLong />
                            </p>
                          </div>
                        </div>
                        <div className="chart-section-box">
                          <MiniCasinoTrackChart />
                        </div>
                      </div>
                      <div className="position-view-box game-track-box mt-3">
                        <div className="d-flex justify-content-between align-items-center position-view-box-head game-track-box-chart">
                          <div>
                            <h6>Games Losing Positions</h6>
                            <p>View Details</p>
                          </div>
                          <div>
                            <h4 className="m-0 text-end">
                              {gameTracking?.trackers_losing_position?.count}
                            </h4>
                            <p className="text-danger">
                              -4.66% <FaArrowDownLong />
                            </p>
                          </div>
                        </div>
                        <div className="chart-section-box">
                          <MiniCasinoTrackChart />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <PositionChangeChart gameTracking={gameTracking} />
                    </div>
                  </div>
                </div>

                {/* Tracker Details Table */}
                <div className="tracker-details mt-3">
                  <div className="tracker-details-body">
                    <DataTable
                      ref={dt}
                      value={gameTracking?.tracker_details}
                      selection={selectedRows}
                      onSelectionChange={(e) => setSelectedRows(e.value)}
                      dataKey="tracker_id"
                      removableSort
                      paginator
                      className="tracker-details-table"
                      rows={10}
                      rowsPerPageOptions={[5, 10, 25]}
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                      globalFilter={globalFilter}
                      header={header}
                      scrollable
                      scrollHeight="400px"
                    >
                      <Column
                        selectionMode="multiple"
                        exportable={false}
                      ></Column>
                      <Column
                        field="operator_name"
                        header="Casino "
                        sortable
                        style={{ minWidth: "10rem" }}
                      ></Column>
                      <Column
                        field="game_name"
                        header="Game"
                        sortable
                        style={{ minWidth: "10rem" }}
                      ></Column>
                      <Column
                        field="status"
                        header="Status"
                        body={StatusBodyTemplate}
                        sortable
                        style={{ minWidth: "10rem" }}
                      ></Column>
                      <Column
                        field="avg_position"
                        header="Avg.Position"
                        sortable
                        style={{ minWidth: "10rem" }}
                        body={AverageBodyTemplate}
                        className="text-center "
                      ></Column>
                      <Column
                        field="worst_position"
                        header="Min Position"
                        sortable
                        style={{ minWidth: "10rem" }}
                        body={MinBodyTemplate}
                        className="text-center"
                      ></Column>
                      <Column
                        field="best_position"
                        header="Max Position"
                        sortable
                        style={{ minWidth: "10rem" }}
                        body={MaxBodyTemplate}
                        className="text-center"
                      ></Column>
                      <Column
                        field="last_week_trend"
                        header="Trend"
                        sortable
                        style={{ minWidth: "10rem" }}
                        body={TrendBodyTemplate}
                      ></Column>
                      <Column
                        field=""
                        header=""
                        className="text-center"
                        body={actionBodyTemplate}
                      ></Column>
                    </DataTable>
                  </div>
                </div>
              </>
            )}
            {show === true && (
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
            )}
          </>
        )}
      </div>
    </>
  );
};

export default GameTracking;
