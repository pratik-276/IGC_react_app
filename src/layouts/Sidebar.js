import "./layout.css";
import "../assets/scss/layout/_sidebar.scss";
import { Nav, NavItem } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaDatabase, FaHouse, FaLocationArrow, FaUserPlus } from "react-icons/fa6";
import { IoMdCompass, IoMdHome } from "react-icons/io";
import { MdViewKanban } from "react-icons/md";
import Accordion from 'react-bootstrap/Accordion';

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
  {
    title: "Beta Dashboards",
    href: "/dashboard",
    icon: MdViewKanban,
  },
  {
    title: "Raw Data",
    href: "/all-data-dashboard",
    icon: MdViewKanban,
  },
];

const iGameTrackerNavigation = [
  {
    title: "Tracker Details",
    href: "/game-tracking",
  },
  {
    title: "Calibrate Compass",
    href: "/calibrate-compass",
  },
  {
    title: "Beta Dashboard",
    href: "/dashboard",
  },
  // {
  //   title: "View Request",
  //   href: "/casino-requests",
  // }
]

const marketIntelligenceNavigation = [
  {
    title: "Game Provider Marketshare",
    href: "/game-provider-marketshare",
  },
  {
    title: "Game Rank",
    href: "/game-rank-report",
  },
  // {
  //   title: "Game Position",
  //   href: "/game-position",
  // }
]

// For Profile Navigation
const ProfileMenu = [
  {
    title: "Calibrate Compass",
    href: "/calibrate-compass",
  },
  {
    title: "Tracker Details",
    href: "/game-tracking",
  },
  {
    title: "View Request",
    href: "/casino-requests",
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  let location = useLocation();

  const isAdmin = localStorage.getItem('is_admin')
  console.log('isAdmin', isAdmin)

  return (
    <>
      {location.pathname === "/my-account" ||
        location.pathname === "/billing-section" ||
        location.pathname === "/help-support" ||
        location.pathname === "/refer-earn" ? (
        <>
          <div className="profile-sidebar" id="sidebarArea">
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
        </>
      ) : (
        <>
          <div className="sidebar" id="sidebarArea">
            <div className="sidenav-bg mt-2 mx-2">
              <Link
                to="/"
                className={
                  location.pathname === "/"
                    ? "active nav-link mb-2 py-2 px-2"
                    : "nav-link mb-2 py-2 px-2"
                }
              >
                <FaHouse style={{ fontSize: "23px" }} /> 
                <span className="ms-3 d-inline-block" style={{ fontWeight: 'bold' }}>Home</span>
              </Link>
            </div>

            <Accordion className="pb-2 mx-2 mt-2">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <FaLocationArrow style={{ fontSize: "23px" }} /> 
                    &nbsp;&nbsp;
                    <div style={{ fontWeight: 'bold' }}>iGame Tracker</div>
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                  {iGameTrackerNavigation.map((navi, index) => (
                    <div key={index} className="sidenav-bg mb-2">
                      <Link
                        to={navi.href}
                        className={
                          location.pathname === navi.href
                            ? "active nav-link mb-2 py-2 px-2"
                            : "nav-link mb-2 py-2 px-2"
                        }
                      >
                        <span className="ms-3 d-inline-block">{navi.title}</span>
                      </Link>
                    </div>
                  ))}
                  {isAdmin != 1 && (
                    <div key={2} className="sidenav-bg mb-2">
                      <Link
                        to="/casino-requests"
                        className={
                          location.pathname === "/casino-requests"
                            ? "active nav-link mb-2 py-2 px-2"
                            : "nav-link mb-2 py-2 px-2"
                        }
                      >
                        <span className="ms-3 d-inline-block">Casino Requests</span>
                      </Link>
                    </div>
                  )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion className="pb-2 mx-2">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <FaDatabase style={{ fontSize: "23px" }} /> 
                    &nbsp;&nbsp;
                    <div style={{ fontWeight: 'bold' }}>Market Intelligenece</div>
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                  {marketIntelligenceNavigation.map((navi, index) => (
                    <div key={index} className="sidenav-bg mb-2">
                      <Link
                        to={navi.href}
                        className={
                          location.pathname === navi.href
                            ? "active nav-link mb-2 py-2 px-2"
                            : "nav-link mb-2 py-2 px-2"
                        }
                      >
                        <span className="ms-3 d-inline-block">{navi.title}</span>
                      </Link>
                    </div>
                  ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {
              isAdmin == 1 &&
              <Accordion className="pb-2 mx-2">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                      <FaDatabase style={{ fontSize: "23px" }} /> 
                      &nbsp;&nbsp;
                      <div style={{ fontWeight: 'bold' }}>Admin Dashboards</div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div>
                    <div className="sidenav-bg mb-2">
                        <Link
                          to="/casino-requests"
                          className={
                            location.pathname === "/casino-requests"
                              ? "active nav-link mb-2 py-2 px-2"
                              : "nav-link mb-2 py-2 px-2"
                          }
                        >
                          <span className="ms-3 d-inline-block">Casino Requests</span>
                        </Link>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            }

          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
