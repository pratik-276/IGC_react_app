import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <div className="pageWrapper d-lg-flex">
        <Sidebar />
        <div
          className={`main ${
            location.pathname === "/" ? "game-tracking-path" : ""
          } ${
            location.pathname === "/game-tracking" ? "game-tracking-path" : ""
          } ${
            location.pathname === "/my-account" ? "profile-sidebar-page" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
