import React, { useContext, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
import user1 from "../assets/images/users/user4.jpg";
import logo from "../assets/images/logos/AEG-Logo.png";
import "./layout.css";
import profileService from "../services/Profile";
import { ProfileSystem } from "../context/ProfileContext";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { state: namestate } = useContext(ProfileSystem);
  const { state: emailstate } = useContext(ProfileSystem);

  const user_id = localStorage.getItem("user_id");

  const [isHomeSidebarVisible, setHomeSidebarVisible] = useState(false);
  const [isProfileSidebarVisible, setProfileSidebarVisible] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const showMobileMenu = () => {
    setHomeSidebarVisible((prevState) => !prevState);
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const showProfileMobileMenu = () => {
    setProfileSidebarVisible((prevState) => !prevState);
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const profileResponse = await profileService.Profile({
        user_id: parseInt(user_id),
      });

      if (profileResponse?.success) {
        setProfile(profileResponse?.data);
      } else if (profileResponse?.error?.status === 401) {
        localStorage.clear();
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (user_id) {
      getProfile();
    }
  }, [
    user_id,
    namestate?.profilename,
    emailstate?.email,
    isProfileSidebarVisible,
    isHomeSidebarVisible,
  ]);

  const isExcludedPath = [
    "/my-account",
    "/billing-section",
    "/help-support",
    "/refer-earn",
  ].includes(location.pathname);

  return (
    <Navbar
      color="white"
      light
      expand="md"
      className="fix-header fixed-top header"
    >
      <div className="d-flex align-items-center">
        {!isExcludedPath ? (
          <div className="d-lg-none me-2" onClick={showMobileMenu}>
            {isHomeSidebarVisible ? (
              <FaTimes style={{ fontSize: "25px" }} />
            ) : (
              <FaBars style={{ fontSize: "25px" }} />
            )}
          </div>
        ) : (
          <>
            <div className="d-lg-none me-2" onClick={showProfileMobileMenu}>
              {isProfileSidebarVisible ? (
                <FaTimes style={{ fontSize: "25px" }} />
              ) : (
                <FaBars style={{ fontSize: "25px" }} />
              )}
            </div>
          </>
        )}
        <div className="d-lg-block d-none">
          <Link to="/">
            <img src={logo} alt="Logo" height="60" />
          </Link>
        </div>
        <Link to="/" className="d-lg-none me-4">
          <img src={logo} alt="Logo" height="50" />
        </Link>
      </div>

      {user_id ? (
        <Dropdown
          isOpen={dropdownOpen}
          toggle={toggle}
          className="profile_dropdown"
        >
          <DropdownToggle color="transparent">
            <div className="profile_icon">
              <div className="profile_name text-end">
                {loading ? (
                  "Hello user"
                ) : (
                  <>
                    <h3>
                      {profile?.first_name || profile?.last_name
                        ? `${profile?.first_name} ${profile?.last_name}`
                        : "Hello User"}
                    </h3>
                    <p>{profile?.email}</p>
                  </>
                )}
              </div>
              <img
                src={user1}
                alt="Profile"
                className="rounded-circle ms-2"
                width="40"
              />
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => navigate("/my-account")}>
              My Account
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/billing-section")}>
              Billing
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/help-support")}>
              Help & Support
            </DropdownItem>
            <DropdownItem onClick={() => navigate("/refer-earn")}>
              Refer and Earn
            </DropdownItem>
            <DropdownItem onClick={logOut}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <button className="compass-sidebar-next" onClick={handleLogin}>
          Login
        </button>
      )}
    </Navbar>
  );
};

export default Header;
