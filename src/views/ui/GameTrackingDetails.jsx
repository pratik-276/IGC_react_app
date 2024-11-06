import React, { useEffect, useRef, useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import PositionChangeChart from "../../charts/PositionChangeChart";
import GameData from "../../services/GameTracker";
import { Spin } from "antd";
import TrackerDetails from "../../GameTrackDetails/TrackerDetails";
import call from "../../services/Call";
import { useLocation } from "react-router-dom";


const GameTrackingDetails = (props) => {
  const user_id = localStorage.getItem("user_id");
  const [loader, setLoader] = useState(true);
  const [trackingDetails, setTrackingDetails] = useState([]);

  const location = useLocation();
  console.log(location.state)
  const { operator_site_id, game_name } = location.state || {};  // Safe access in case state is undefined

  useEffect(() => {
    getDashboardData({ site_id: operator_site_id, game_name: game_name })
  }, [user_id]);

  const getDashboardData = ({ site_id, game_name }) => {
    const user_company_2 = localStorage.getItem("user_company");
    call({
        path: 'tracker_dashboard_details_2',
        method: 'POST',
        data:  {
            "operator_site_id": site_id,
            "game_name": game_name,
            "game_provider": user_company_2
        }
    }).then((res) => {
        setTrackingDetails(res.data)
        setLoader(false)
    })
  };

  return (
    <div className="container">
      <div className="compass">
        <div className="compass-data">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-6 pb-3">
              <h3 className="m-md-0">
                {
                  trackingDetails?.operator_name != undefined ? 
                    `${trackingDetails?.operator_name} Dashboard` : 
                    `Tracker Dashboard`
                }
              </h3>
              <span>
                View, Filter and analyse data as per your requirements with adaptive dashboard
              </span>
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
            {trackingDetails ?? 0 ? (
              <>
                <TrackerDetails trackingDetails={trackingDetails} />
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
    </div>
  );
};

export default GameTrackingDetails;
