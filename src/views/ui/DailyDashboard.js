import React, { useEffect, useState } from "react";
import "./index.css";
import { Link } from "@mui/material";
import GameData from "../../services/GameTracker";
import { ProgressSpinner } from "primereact/progressspinner";

const DailyDashboard = () => {
  const [user_company_name, setUserCompanyName] = useState("");
  const [dashboardLink, setDashboardLink] = useState("");

  const getDetails = () => {
    const user_company = localStorage.getItem("user_company");

    const data = {
      game_provider: user_company,
      priority: 1
    };

    GameData.provider_dashboard_mapper(data)
      .then((res) => {
        console.log(res);
        if (res?.success === true) {
          setDashboardLink(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      {dashboardLink === "" ? (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="d-flex flex-column justify-content-center align-items-center">
                      <ProgressSpinner />
            <p>Please connect with administrator</p>
          </div>
        </div>
      ) : (
        <div style={{ height: "90vh" }}>
          <iframe title="Tracker Dashboard"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            src={dashboardLink}
            frameborder="0" allowFullScreen="true">
          </iframe>
        </div>
      )}

    </>
  );
};

export default DailyDashboard;
