import React, { useEffect, useState } from "react";
import "./index.css";

const Dashboard = () => {
  
  return (
    <>
      <iframe title="Main Dashboard" 
      style={{
        width: "100%",
        height: "120%",
        border: "none",
      }} 
      src="https://app.powerbi.com/view?r=eyJrIjoiOWQ1ZmUxN2UtZTY4My00MTZhLTk3OWEtM2NlYjhhOTMxZGIyIiwidCI6IjM3MTZkZWI2LTZjNDMtNDgwNi04Mzc4LWRmODlmMGNlMzNmYSJ9" frameborder="0" allowFullScreen="true"></iframe>
    </>
  );
};

export default Dashboard;
