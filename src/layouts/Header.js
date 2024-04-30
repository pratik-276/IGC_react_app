import React, { useLayoutEffect } from "react";
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

const Header = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

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
    localStorage.removeItem("email");
    localStorage.removeItem("password");
  };

  useLayoutEffect(() => {}, [email]);

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
          {email ? (
            <>
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle color="transparent">
                  <div className="profile_icon">
                    <div className="profile_name text-end">
                      <h3>Shantanu Khoraskar</h3>
                      <p>{email ? email : ""}</p>
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
                  {/* <DropdownItem header>Info</DropdownItem>
              <DropdownItem>My Account</DropdownItem>
              <DropdownItem>Edit Profile</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>My Balance</DropdownItem>
              <DropdownItem>Inbox</DropdownItem> */}
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
