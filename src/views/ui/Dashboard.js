import React, { useEffect, useState } from "react";
import "./index.css";

const Dashboard = () => {
  const [user_company_name, setUserCompanyName] = useState("");
  let company_to_dashboard = {
    "Pixiu Gaming": "https://app.powerbi.com/view?r=eyJrIjoiYWVhMTcwYTMtYzk3My00YTZlLWE5ZjUtMzYxYzRlZDNlNjNlIiwidCI6IjA4Njc0NDdmLTkwYjItNGFjYS05OTczLTk3NmJiZmJjNTNiYiJ9",
  }

  const [dashboardLink, setDashboardLink] = useState("");

  useEffect(() => {
    const user_company = localStorage.getItem("user_company");
    setUserCompanyName(user_company);

    if(user_company in company_to_dashboard){
      setDashboardLink(company_to_dashboard[user_company]);
    }
    
  });
  
  return (
    <>
    {dashboardLink === "" ? (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{height: "100vh"}}>
        <div className="d-flex flex-column justify-content-center align-items-center">
        <p>Please connect with administrator</p>
        </div>
      </div>
    ): (
      <iframe title="Tracker Dashboard" 
      style={{
        width: "100%",
        height: "110%",
        border: "none",
      }} 
      src="https://app.powerbi.com/view?r=eyJrIjoiYWVhMTcwYTMtYzk3My00YTZlLWE5ZjUtMzYxYzRlZDNlNjNlIiwidCI6IjA4Njc0NDdmLTkwYjItNGFjYS05OTczLTk3NmJiZmJjNTNiYiJ9" 
      frameborder="0" allowFullScreen="true">
      </iframe>
    )}
      
    </>
  );
};

export default Dashboard;
