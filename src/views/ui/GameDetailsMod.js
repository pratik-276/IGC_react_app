import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

import { Spin } from "antd";

import { MdArrowBackIos } from "react-icons/md";
import { FaGem, FaLock } from "react-icons/fa6";

import call from "../../services/Call";
import AveragePositionChart from "../../charts/AveragePositionChart";
import DailySectionalAnalyticshart from "../../charts/DailySectionalAnalyticshart";
import InfoCard from "../../charts/InfoCard";

import { useContext } from "react";
import { ProfileSystem } from "../../context/ProfileContext";
import { useContactSales } from "../../context/confirmationContext";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./DashboardMod.css";
import "./AccessBlur.css";

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
  const {
    casino_id,
    casino_name,
    game_id,
    game_name,
    country_name,
    state_name
  } = location.state || {};

  const { state } = useContext(ProfileSystem);
  const isPlanExpired = state?.plan === "trial_expired";
  //const isPlanExpired = state?.plan === "trial";
  const { showContactSalesConfirmation } = useContactSales();

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
    if (casino_id && game_id) {
      setLoader(true);
      getDashboardData({
        casino_id: casino_id,
        game_id: game_id
      });
    }
  }, [user_id, casino_id, game_id]);

  const getDashboardData = ({ casino_id, game_id }) => {
    const user_company_2 = localStorage.getItem("user_company");
    call({
      path: "tracker_dashboard_details_3",
      method: "POST",
      data: {
        casino_id: casino_id,
        game_id: game_id,
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
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex gap-2 align-items-center">
              <MdArrowBackIos
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                }}
                // onClick={() => navigate("/dashboard")}
                onClick={() => navigate(-1)}
              />
              <div>
                <h4
                  className="m-md-0 font-semibold"
                  style={{ color: "#392f6c" }}
                >
                  Positions Dashboard
                </h4>
                <span className="text-black" style={{ fontSize: "1rem" }}>
                  View details related to game
                </span>
              </div>
            </div>

            {/* <div className="d-flex gap-2">
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
            </div> */}
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
        ) : trackingDetails ? (
          <>
            <div className="mt-3">
              <h5 className="font-semibold pl-2">Indicators</h5>
              <div className="flex gap-2 mt-2">
                <InfoCard
                  header="Selected Game"
                  tooltip="Shows selected game name"
                  tooltipTarget="game_name"
                  value={game_name}
                  widthMod={true}
                />

                <InfoCard
                  header="Selected Casino"
                  tooltip="Shows selected casino name"
                  tooltipTarget="casino_name"
                  value={casino_name}
                  widthMod={true}
                />

                <InfoCard
                  header="Country"
                  tooltip="Shows country name"
                  tooltipTarget="country_name"
                  value={country_name}
                  widthMod={true}
                />

                <InfoCard
                  header="State"
                  tooltip="Shows state name"
                  tooltipTarget="state_name"
                  value={state_name}
                  widthMod={true}
                />
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
