import React, { useEffect, useState } from "react";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./DashboardMod.css";
import call from "../../services/Call";
import { useLocation } from "react-router-dom";
import AveragePositionChart from "../../charts/AveragePositionChart";
import GamePositionChangesChart from "../../charts/GamePositionChangesChart";
import DailySectionalAnalyticshart from "../../charts/DailySectionalAnalyticshart";

import { Spin } from "antd";

const GameDetailsMod = () => {
  const user_id = localStorage.getItem("user_id");
  const [loader, setLoader] = useState(true);
  const [trackingDetails, setTrackingDetails] = useState([]);

  const location = useLocation();
  console.log("location.state", location.state);
  const { operator_site_id, game_name, casino_name, country_name, state_name } =
    location.state || {};

  useEffect(() => {
    getDashboardData({ site_id: operator_site_id, game_name: game_name });
  }, [user_id]);

  const getDashboardData = ({ site_id, game_name }) => {
    const user_company_2 = localStorage.getItem("user_company");
    call({
      path: "tracker_dashboard_details_2",
      method: "POST",
      data: {
        operator_site_id: site_id,
        game_name: game_name,
        game_provider: user_company_2,
      },
    }).then((res) => {
      console.log("res : ", res);
      console.log("res data : ", res.data);
      setTrackingDetails(res.data);
      setLoader(false);
    });
  };

  return (
    <>
      <div>
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="font-semibold" style={{ color: "#392f6c" }}>
                Tracker Dashboard
              </h4>
              <span>View details related to game</span>
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
            {trackingDetails &&
            Object.keys(trackingDetails).length > 0 &&
            trackingDetails.latest_position ? (
              <>
                <div className="mt-3">
                  <h5 className="font-semibold pl-2">Indicators</h5>
                  <div className="flex gap-3 mt-2">
                    <div className="flex-1">
                      <div
                        className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                        style={{
                          borderTop: "1px solid #392f6c",
                          borderRight: "1px solid #392f6c",
                          borderBottom: "1px solid #392f6c",
                          borderLeft: "6px solid #392f6c",
                        }}
                      >
                        <h5>Selected Game</h5>
                        <h5 className="font-semibold">{game_name}</h5>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div
                        className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                        style={{
                          borderTop: "1px solid #392f6c",
                          borderRight: "1px solid #392f6c",
                          borderBottom: "1px solid #392f6c",
                          borderLeft: "6px solid #392f6c",
                        }}
                      >
                        {" "}
                        <h5>Selected Casino</h5>
                        <h5 className="font-semibold">{casino_name}</h5>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div
                        className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                        style={{
                          borderTop: "1px solid #392f6c",
                          borderRight: "1px solid #392f6c",
                          borderBottom: "1px solid #392f6c",
                          borderLeft: "6px solid #392f6c",
                        }}
                      >
                        {" "}
                        <h5>Country</h5>
                        <h5 className="font-semibold">{country_name}</h5>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div
                        className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                        style={{
                          borderTop: "1px solid #392f6c",
                          borderRight: "1px solid #392f6c",
                          borderBottom: "1px solid #392f6c",
                          borderLeft: "6px solid #392f6c",
                        }}
                      >
                        {" "}
                        <h5>State</h5>
                        <h5 className="font-semibold">
                          {state_name ? state_name : "-"}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-secondary p-3 rounded-3 mt-3">
                  {/* Tracker Details Table */}
                  <div>
                    <h5 className="font-semibold pl-2">Latest Details</h5>

                    <div className="flex gap-3 mt-2">
                      <div className="flex-1">
                        <div
                          className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                          style={{
                            borderTop: "1px solid #392f6c",
                            borderRight: "1px solid #392f6c",
                            borderBottom: "1px solid #392f6c",
                            borderLeft: "6px solid #392f6c",
                          }}
                        >
                          <h5>Overall Position</h5>
                          <h5 className="font-semibold">
                            {" "}
                            {
                              trackingDetails.latest_position
                                .overall_game_nonvisible_position
                            }
                          </h5>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div
                          className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                          style={{
                            borderTop: "1px solid #392f6c",
                            borderRight: "1px solid #392f6c",
                            borderBottom: "1px solid #392f6c",
                            borderLeft: "6px solid #392f6c",
                          }}
                        >
                          {" "}
                          <h5>Section Name</h5>
                          <h5 className="font-semibold">
                            {" "}
                            {trackingDetails.latest_position.section_name}
                          </h5>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div
                          className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                          style={{
                            borderTop: "1px solid #392f6c",
                            borderRight: "1px solid #392f6c",
                            borderBottom: "1px solid #392f6c",
                            borderLeft: "6px solid #392f6c",
                          }}
                        >
                          {" "}
                          <h5>Sectional Position</h5>
                          <h5 className="font-semibold">
                            {" "}
                            {trackingDetails.latest_position.section_position}
                          </h5>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div
                          className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                          style={{
                            borderTop: "1px solid #392f6c",
                            borderRight: "1px solid #392f6c",
                            borderBottom: "1px solid #392f6c",
                            borderLeft: "6px solid #392f6c",
                          }}
                        >
                          {" "}
                          <h5>Sectional Game Position</h5>
                          <h5 className="font-semibold">
                            {" "}
                            {trackingDetails.latest_position.game_position}
                          </h5>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div
                          className="d-flex flex-column h-100 justify-content-center w-100 pl-3 pt-2"
                          style={{
                            borderTop: "1px solid #392f6c",
                            borderRight: "1px solid #392f6c",
                            borderBottom: "1px solid #392f6c",
                            borderLeft: "6px solid #392f6c",
                          }}
                        >
                          {" "}
                          <h5>Latest Date</h5>
                          <h5 className="font-semibold">
                            {trackingDetails.latest_position.created_date}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <AveragePositionChart trackingDetails={trackingDetails} />
                    </div>
                  </div>
                </div>

                <div className="border border-secondary p-3 rounded-3 mt-3">
                  <div>
                    <DailySectionalAnalyticshart
                      trackingDetails={trackingDetails}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "15%" }}
                >
                  <h4>
                    {trackingDetails
                      ? "Tracking data is unavailable"
                      : "No trackers configured"}
                  </h4>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default GameDetailsMod;
