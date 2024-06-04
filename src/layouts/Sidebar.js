import "./layout.css";
import "../assets/scss/layout/_sidebar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Nav, NavItem } from "reactstrap";
import { FaChevronLeft, FaLocationArrow } from "react-icons/fa6";
import { IoMdCompass, IoMdHome } from "react-icons/io";

// For Gaming Navigation
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

// For Profile Navigation
const ProfileMenu = [
  {
    title: "My Profile",
    href: "/my-account",
  },
  {
    title: "Billing",
    href: "/game-tracking",
  },
  {
    title: "Help & Support",
    href: "/calibrate-compass",
  },
  {
    title: "Refer & Earn",
    href: "/calibrate-compass",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <>
      {location.pathname === "/my-account" ? (
        <>
          <div className="profile-sidebar">
            <div className="d-flex">
              <Button
                color="white"
                className="ms-auto text-white d-lg-none"
                onClick={() => showMobilemenu()}
              >
                <i className="bi bi-x"></i>
              </Button>
            </div>

            <div className="">
              <Nav vertical className="sidebarNav">
                <button
                  className="profile_back_btn"
                  onClick={() => navigate("/")}
                >
                  <FaChevronLeft className="me-2" />
                  Back to Home
                </button>

                {ProfileMenu.map((navi, index) => (
                  <NavItem key={index} className="sidenav-bg">
                    <Link
                      to={navi.href}
                      className={
                        location.pathname === navi.href
                          ? "active nav-link py-2"
                          : "nav-link py-2"
                      }
                    >
                      <span className="ms-3 d-inline-block">{navi.title}</span>
                    </Link>
                  </NavItem>
                ))}
              </Nav>
            </div>
          </div>
        </>
      ) : (
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

            <div className="p-3">
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
                      <navi.icon style={{ fontSize: "23px" }} />
                      <span className="ms-3 d-inline-block">{navi.title}</span>
                    </Link>
                  </NavItem>
                ))}
              </Nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
