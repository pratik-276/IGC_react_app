import { Button, Nav, NavItem } from "reactstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa6";
import { IoMdCompass, IoMdHome } from "react-icons/io";
import "./layout.css";
import "../assets/scss/layout/_sidebar.scss";

const navigation = [
  {
    title: "Home",
    href: "/",
    icon: IoMdHome,
  },
  {
    title: "iGame Tracker",
    href: "/game-tracking",
    icon: FaLocationArrow,
  },
  {
    title: "Calibrate Compass",
    href: "/calibrate-compass",
    icon: IoMdCompass,
  },
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <>
      <div className="sidebar">
        <div className="d-flex">
          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        <div className="p-3 mt-2">
          <Nav vertical className="sidebarNav">
            {navigation.map((navi, index) => (
              <NavItem key={index} className="sidenav-bg mb-2">
                <Link
                  to={navi.href}
                  className={
                    location.pathname === navi.href
                      ? "active nav-link py-2"
                      : "nav-link py-2"
                  }
                >
                  {typeof navi.icon === "string" ? (
                    <i className={navi.icon} style={{ fontSize: "23px" }}></i>
                  ) : (
                    <navi.icon style={{ fontSize: "23px" }} />
                  )}
                  <span className="ms-3 d-inline-block">{navi.title}</span>
                </Link>
              </NavItem>
            ))}
          </Nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
