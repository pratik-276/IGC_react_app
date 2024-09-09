import React, { useContext, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import { ReactComponent as LogoWhite } from "../assets/images/logos/adminprowhite.svg";
import user1 from "../assets/images/users/user4.jpg";
import logo from "../assets/images/logos/AEG-Logo.png";
import "./layout.css";
import Cookies from "universal-cookie";
import profileService from "../services/Profile";
import { ProfileSystem } from "../context/ProfileContext";
import toast from "react-hot-toast";

const cookies = new Cookies();

const Header = () => {
  const navigate = useNavigate();
  const { state: namestate } = useContext(ProfileSystem);
  const { state: emailstate } = useContext(ProfileSystem);
  const user_id = localStorage.getItem("user_id");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState([]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const logOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const profileResponse = await profileService.Profile({
        user_id: parseInt(user_id),
      });

      if (profileResponse?.success === true) {
        setProfile(profileResponse?.data);
      } else {
        if (profileResponse?.error?.status === 401) {
          // cookies.remove("access_token", { path: "/" });
          // cookies.remove("refresh_token", { path: "/" });
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_id");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (user_id) {
      getProfile();
    }
  }, [user_id, namestate?.profilename, emailstate?.email]);

  return (
    <>
      <Navbar
        color="white"
        light
        expand="md"
        className="fix-header fixed-top header"
      >
        <div className="d-flex align-items-center">
          <div className="d-lg-block d-none me-5 pe-3">
            <Link to="/">
              <img src={logo} alt="" height="60" />
            </Link>
          </div>
          <NavbarBrand href="/">
            <LogoWhite className="d-lg-none" />
          </NavbarBrand>
          <Button
            color="primary"
            className=" d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-list"></i>
          </Button>
        </div>
        <div className="hstack gap-2">
          <Button
            color="primary"
            size="sm"
            className="d-sm-block d-md-none"
            onClick={Handletoggle}
          >
            {isOpen ? (
              <i className="bi bi-x"></i>
            ) : (
              <i className="bi bi-three-dots-vertical"></i>
            )}
          </Button>
        </div>

        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar></Nav>
          {user_id ? (
            <>
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
                            {profile?.first_name?.length > 0 ||
                            profile?.last_name?.length > 0
                              ? profile?.first_name + " " + profile?.last_name
                              : "Hello User"}
                          </h3>
                        </>
                      )}

                      <p>{profile?.email}</p>
                    </div>
                    <img
                      src={user1}
                      alt="profile"
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
            </>
          ) : (
            <>
              <div>
                <button className="compass-sidebar-next" onClick={handleLogin}>
                  Login
                </button>
              </div>
            </>
          )}
        </Collapse>
      </Navbar>
    </>
  );
};

export default Header;
