import React, { useEffect, useState } from "react";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./DashboardMod.css";
import { Calendar } from "primereact/calendar";
import call from "../../services/Call";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import AveragePositionChart from "../../charts/AveragePositionChart";
import DailySectionalAnalyticshart from "../../charts/DailySectionalAnalyticshart";
import InfoCard from "../../charts/InfoCard";

import { Spin } from "antd";

const GameDetailsMod = () => {
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [loader, setLoader] = useState(true);
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [minDate, setMinDate] = useState(null);

  const location = useLocation();
  console.log("location.state", location.state);
  const { operator_site_id, game_name, casino_name, country_name, state_name } =
    location.state || {};

  useEffect(() => {
    const currentDate = new Date();
    const previousMonth = new Date(currentDate);

    previousMonth.setMonth(currentDate.getMonth() - 1);
    previousMonth.setDate(1);

    setMinDate(previousMonth);
    setStartDate(previousMonth);
    setEndDate(currentDate);
  }, []);

  useEffect(() => {
    if (startDate && endDate && operator_site_id && game_name) {
      setLoader(true);
      getDashboardData({
        site_id: operator_site_id,
        game_name: game_name,
        start_date: startDate,
        end_date: endDate,
      });
    }
  }, [user_id, startDate, endDate]);

  const getDashboardData = ({ site_id, game_name, start_date, end_date }) => {
    const user_company_2 = localStorage.getItem("user_company");
    call({
      path: "tracker_dashboard_details_2",
      method: "POST",
      data: {
        operator_site_id: site_id,
        game_name: game_name,
        game_provider: user_company_2,
        start_date: start_date,
        end_date: end_date,
      },
    })
      .then((res) => {
        setTrackingDetails(res.data);
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
        setTrackingDetails(null);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <div>
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center">
              <MdArrowBackIos
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/dashboard-mod")}
              />
              <div>
                <h4
                  className="m-md-0 font-semibold"
                  style={{ color: "#392f6c" }}
                >
                  Tracker Dashboard
                </h4>
                <span className="text-black" style={{ fontSize: "1rem" }}>
                  View details related to game
                </span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <div>
                <Calendar
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select Start Date"
                  minDate={minDate}
                  maxDate={new Date()}
                />
              </div>

              <div>
                <Calendar
                  value={endDate}
                  onChange={(e) => setEndDate(e.value)}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select End Date"
                  minDate={minDate}
                  maxDate={new Date()}
                />
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
        ) : trackingDetails && trackingDetails.latest_position ? (
          <>
            <div className="mt-3">
              <h5 className="font-semibold pl-2">Indicators</h5>
              <div className="flex gap-2 mt-2">
                <InfoCard
                  header="Selected Game"
                  tooltip="Shows selected game name"
                  tooltipTarget="game_name"
                  value={game_name}
                />

                <InfoCard
                  header="Selected Casino"
                  tooltip="Shows selected casino name"
                  tooltipTarget="casino_name"
                  value={casino_name}
                />

                <InfoCard
                  header="Country"
                  tooltip="Shows country name"
                  tooltipTarget="country_name"
                  value={country_name}
                />

                <InfoCard
                  header="State"
                  tooltip="Shows state name"
                  tooltipTarget="state_name"
                  value={state_name ? state_name : "-"}
                />
              </div>
            </div>

            <div className="border border-secondary p-3 rounded-3 mt-3">
              {/* Tracker Details Table */}
              <div>
                <h5 className="font-semibold pl-2">Latest Details</h5>

                <div className="flex gap-2 mt-2">
                  <InfoCard
                    header="Overall Position"
                    tooltip="Overall Position of game on casino"
                    tooltipTarget="overall_game_nonvisible_position"
                    value={
                      trackingDetails.latest_position
                        .overall_game_nonvisible_position
                    }
                  />
                  <InfoCard
                    header="Section Name"
                    tooltip="Section in which the game resides"
                    tooltipTarget="section_name"
                    value={trackingDetails.latest_position.section_name}
                  />
                  <InfoCard
                    header="Sectional Position"
                    tooltip="Shows position of section within casino"
                    tooltipTarget="section_position"
                    value={trackingDetails.latest_position.section_position}
                  />
                  <InfoCard
                    header="Sectional Game Position"
                    tooltip="Shows position of game within section"
                    tooltipTarget="game_position"
                    value={trackingDetails.latest_position.game_position}
                  />
                  <InfoCard
                    header="Latest Date"
                    tooltip="Last date when the game was observed on the casino"
                    tooltipTarget="created_date"
                    value={trackingDetails.latest_position.created_date}
                  />
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
              <h4>Tracking data is unavailable</h4>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GameDetailsMod;
