import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { MdInfoOutline } from "react-icons/md";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import AveragePositionChart from "../../charts/AveragePositionChart";
import GameSectionChangesChart from "../../charts/GameSectionChangesChart";
import GamePositionChangesChart from "../../charts/GamePositionChangesChart";
import TrackerDetailsTable from "../../tables/TrackerDetailsTable";
import PositionChangeChart from "../../charts/PositionChangeChart";
import MiniCasinoTrackChart from "../../charts/MiniCasinoTrackChart";

import GameData from "../../services/GameTracker";

const TrackingTime = ["7days", "1 month", "3 months", "custom"];
const TrackingStatus = ["All", "Live"];

const GameTracking = () => {
  const user_id = localStorage.getItem("user_id");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const [gameTracking, setGameTracking] = useState([]);

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
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

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
                          {gameTracking?.average_position?.percentage_change}{" "}
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
                  <PositionChangeChart
                    gameTracking={gameTracking}
                    loading={loading}
                  />
                </div>
              </div>
            </div>

            {/* Tracker Details Table */}
            <div className="tracker-details mt-3">
              <div className="tracker-details-body">
                <TrackerDetailsTable
                  setShow={setShow}
                  gameTracking={gameTracking?.tracker_details}
                />
              </div>
            </div>
          </>
        )}
        {show === true && (
          <>
            <div className="mt-1">
              <div className="tracker-details">
                <div className="tracker-details-head">
                  <h5 className="m-0">Tracker Details</h5>
                </div>
                <div className="row pt-3">
                  <div className="col-md-4 ">
                    <div className="position-view-box">
                      <div className="d-flex justify-content-between align-items-center position-view-box-head">
                        <h5>Latest Position</h5>
                        <div className="d-flex align-items-center">
                          <h4>56</h4> <span>(12 July 2023)</span>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>New</h4>
                            <span>Section Name</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>3</h4>
                            <span>Section Name</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>6</h4>
                            <span>Game Position</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 p-0">
                    <div className="position-view-box best_position_box">
                      <div className="d-flex justify-content-between align-items-center position-view-box-head">
                        <h5>Best Position</h5>
                        <div className="d-flex align-items-center">
                          <h4>56</h4> <span>(12 July 2023)</span>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>New</h4>
                            <span>Section Name</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>3</h4>
                            <span>Section Name</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>6</h4>
                            <span>Game Position</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="position-view-box worst_position_box">
                      <div className="d-flex justify-content-between align-items-center position-view-box-head">
                        <h5>Worst Position</h5>
                        <div className="d-flex align-items-center">
                          <h4>56</h4> <span>(12 July 2023)</span>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>New</h4>
                            <span>Section Name</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>3</h4>
                            <span>Section Name</span>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="position-view-box-bottom">
                            <h4>6</h4>
                            <span>Game Position</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tracker-details" style={{ marginTop: "16px" }}>
                <AveragePositionChart />
              </div>
              <div className="tracker-details" style={{ marginTop: "16px" }}>
                <GameSectionChangesChart />
              </div>
              <div className="tracker-details" style={{ marginTop: "16px" }}>
                <GamePositionChangesChart />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GameTracking;
