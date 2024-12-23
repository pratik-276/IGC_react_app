import React, { useEffect, useState } from "react";
import "./index.css";
import { Link } from "@mui/material";

const Dashboard = () => {
  const [user_company_name, setUserCompanyName] = useState("");
  let company_to_dashboard = {
    "Pixiu Gaming": "https://app.powerbi.com/view?r=eyJrIjoiZGY4ZTNiODEtM2I1My00MzRjLWE1MTAtMzM0OTM3Mjk2ZGE1IiwidCI6IjA4Njc0NDdmLTkwYjItNGFjYS05OTczLTk3NmJiZmJjNTNiYiJ9",
    "Fazi": "https://app.powerbi.com/view?r=eyJrIjoiMzU5ZDFkNzQtZDk4My00MzJkLWI0ZDUtMDVhZWMxMTIzOTlmIiwidCI6IjA4Njc0NDdmLTkwYjItNGFjYS05OTczLTk3NmJiZmJjNTNiYiJ9",
    "Split The Pot": "https://app.powerbi.com/view?r=eyJrIjoiMWQ4YzI1MjAtZTA3Yy00OTQxLTg4OWItOGIxM2QxZDI5ZGU2IiwidCI6IjA4Njc0NDdmLTkwYjItNGFjYS05OTczLTk3NmJiZmJjNTNiYiJ9"
  }

  const [dashboardLink, setDashboardLink] = useState("");

  useEffect(() => {
    const user_company = localStorage.getItem("user_company");
    setUserCompanyName(user_company);
    console.log('User Company: ' + user_company);

    if (user_company in company_to_dashboard) {
      setDashboardLink(company_to_dashboard[user_company]);
    }

  });

  return (
    <>
      {dashboardLink === "" ? (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="d-flex flex-column justify-content-center align-items-center">
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

export default Dashboard;
