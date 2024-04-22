import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="pageWrapper d-lg-flex">
        <Sidebar />
        <div className="main">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
