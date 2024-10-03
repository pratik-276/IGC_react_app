import React, { useEffect, useState } from "react";
import "./index.css";

const RawDataDashboard = () => {
  
  return (
    <>
    <iframe title="Raw Data Dashboard" 
      style={{
        width: "100%",
        height: "110%",
        border: "none",
      }} 
      src="https://app.powerbi.com/view?r=eyJrIjoiNTJjYzc3YmEtZmRkNS00ZjAzLTliNTQtNmU5YjM3YjNkZGRkIiwidCI6IjA4Njc0NDdmLTkwYjItNGFjYS05OTczLTk3NmJiZmJjNTNiYiJ9" 
      frameborder="0" allowFullScreen="true">
      </iframe>
    </>
  );
};

export default RawDataDashboard;
