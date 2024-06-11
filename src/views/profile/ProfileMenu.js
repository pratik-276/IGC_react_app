import React, { useEffect, useState } from "react";
import "./index.css";
import { Drawer, DatePicker } from "antd";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import profileService from "../../services/Profile";
import { GoPencil } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import moment from "moment/moment";

const selectGender = ["Male", "Female", "Transgender"];
const selectCompanyCategories = [
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Real Estate",
];

const ProfileMenu = () => {
  const user_id = localStorage.getItem("user_id");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  const [birthDate, setBirthDate] = useState("");

  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyWebsite: "",
    companySize: "",
    companyCategory: "",
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const getProfile = () => {
    profileService
      .Profile({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res && res.data) {
          setProfileData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user_id) {
      getProfile();
    }
  }, [user_id]);

  const resetProfileData = () => {
    setProfileData({
      firstName: "",
      lastName: "",
      gender: "",
    });
    setBirthDate("");
  };

  const resetCompanyData = () => {
    setCompanyData({
      companyName: "",
      companyWebsite: "",
      companySize: "",
      companyCategory: "",
    });
  };

  const profileMenuDrawer = () => {
    setProfileOpen(true);
  };

  const onClose = () => {
    setProfileOpen(false);
    resetProfileData();
  };

  const companyMenuDrawer = () => {
    setCompanyOpen(true);
  };

  const onCompanyClose = () => {
    setCompanyOpen(false);
    resetCompanyData();
  };

  const onChange = (date) => {
    // console.log("Selected date (moment object):", date?.format("DD-MM-YYYY"));
    setBirthDate(date?.format("DD-MM-YYYY"));
  };

  const submitProfileData = () => {
    const data = {
      firstName: profileData?.firstName ? profileData?.firstName : null,
      lastName: profileData?.lastName ? profileData?.lastName : null,
      gender: profileData?.gender ? profileData?.gender : null,
      birthDate: birthDate ? birthDate : null,
    };
    console.log("hello all data", data);
  };

  return (
    <>
      <div className="container">
        <div className="profile_main">
          <div className="row">
            <div className="col-md-8">
              <div className="profile_inr">
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Basic Details</h3>
                    <span onClick={profileMenuDrawer}>
                      <GoPencil />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Gender</label>
                        <Dropdown
                          options={selectGender}
                          placeholder="Select gender"
                          value={profileData.gender}
                          onChange={(option) =>
                            setProfileData({
                              ...profileData,
                              gender: option.value,
                            })
                          }
                          className="form-control w-100"
                        />
                        <IoIosArrowDown
                          className="profile_calender_icon"
                          style={{ fontSize: "22px" }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group date-pick">
                        <label htmlFor="">Date of birth</label>
                        <DatePicker
                          format="DD-MM-YYYY"
                          allowClear
                          className="form-control w-100"
                          placeholder="Select date"
                          value={
                            birthDate ? moment(birthDate, "DD-MM-YYYY") : null
                          }
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Organization Details</h3>
                    <span onClick={companyMenuDrawer}>
                      <GoPencil />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter company name"
                          value={companyData.companyName}
                          onChange={(e) =>
                            setCompanyData({
                              ...companyData,
                              companyName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Website</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter company size"
                          value={companyData.companyWebsite}
                          onChange={(e) =>
                            setCompanyData({
                              ...companyData,
                              companyWebsite: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Size</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter company size"
                          value={companyData.companySize}
                          onChange={(e) =>
                            setCompanyData({
                              ...companyData,
                              companySize: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Category</label>
                        <Dropdown
                          options={selectCompanyCategories}
                          placeholder="Select company category"
                          value={companyData.companyCategory}
                          onChange={(option) =>
                            setCompanyData({
                              ...companyData,
                              companyCategory: option.value,
                            })
                          }
                          className="form-control w-100"
                        />
                        <IoIosArrowDown
                          className="profile_calender_icon"
                          style={{ fontSize: "22px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Contact Details</h3>
                    <span onClick={profileMenuDrawer}>
                      <GoPencil />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Enter phone number"
                        />
                        <span className="phone_verify_btn">
                          <IoCheckmarkSharp />
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter email address"
                        />
                        <span className="email_verify_btn">Verify</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOR FILL BASIC DETAILS DRAWER */}
      <Drawer
        title="Basic Details"
        width={700}
        onClose={onClose}
        open={profileOpen}
        maskClosable={false}
        className="profile_menu_drawer"
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={onClose}
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Back
            </button>
            <button
              className="compass-sidebar-next"
              onClick={() => submitProfileData()}
            >
              Save
            </button>
          </div>
        }
      >
        <div className="profile_box">
          <div className="row">
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">Gender</label>
                <Dropdown
                  options={selectGender}
                  placeholder="Select gender"
                  value={profileData.gender}
                  onChange={(option) =>
                    setProfileData({
                      ...profileData,
                      gender: option.value,
                    })
                  }
                  className="form-control w-100"
                />
                <IoIosArrowDown
                  className="profile_calender_icon"
                  style={{ fontSize: "22px" }}
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group date-pick">
                <label htmlFor="">Date of birth</label>
                <DatePicker
                  format="DD-MM-YYYY"
                  allowClear
                  className="form-control w-100"
                  placeholder="Select date"
                  onChange={onChange}
                  value={birthDate ? moment(birthDate, "DD-MM-YYYY") : null}
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* FOR FILL ORGANIZATION DETAILS DRAWER */}
      <Drawer
        title="Organization Details"
        width={700}
        onClose={onCompanyClose}
        open={companyOpen}
        maskClosable={false}
        className="profile_menu_drawer"
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={onCompanyClose}
              style={{ marginRight: 8 }}
              className="compass-sidebar-back"
            >
              Back
            </button>
            <button className="compass-sidebar-next">Save</button>
          </div>
        }
      >
        <div className="profile_box">
          <div className="row">
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter company name"
                  value={companyData.companyName}
                  onChange={(e) =>
                    setCompanyData({
                      ...companyData,
                      companyName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">Company Website</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter company website"
                  value={companyData.companyWebsite}
                  onChange={(e) =>
                    setCompanyData({
                      ...companyData,
                      companyWebsite: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">Company Size</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter company size"
                  value={companyData.companySize}
                  onChange={(e) =>
                    setCompanyData({
                      ...companyData,
                      companySize: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group">
                <label htmlFor="">Company Category</label>
                <Dropdown
                  options={selectCompanyCategories}
                  placeholder="Select company category"
                  value={companyData.companyCategory}
                  onChange={(option) =>
                    setCompanyData({
                      ...companyData,
                      companyCategory: option.value,
                    })
                  }
                  className="form-control w-100"
                />
                <IoIosArrowDown
                  className="profile_calender_icon"
                  style={{ fontSize: "22px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* FOR FILL CONTACT DETAILS DRAWER */}
    </>
  );
};

export default ProfileMenu;
