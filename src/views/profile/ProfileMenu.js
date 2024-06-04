import React, { useEffect, useState } from "react";
import "./index.css";
import { GoPencil } from "react-icons/go";
import profileService from "../../services/Profile";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Space } from "antd";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfileMenu = () => {
  const user_id = localStorage.getItem("user_id");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });

  const [profileOpen, setProfileOpen] = useState(false);

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

  const profileMenuDrawer = () => {
    setProfileOpen(true);
  };

  const onClose = () => {
    setProfileOpen(false);
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
                          value={profileData.username}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              username: e.target.value,
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
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Select gender"
                          value={profileData.gender}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              gender: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Date of birth</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Select date of birth"
                          value={profileData.dob}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              dob: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Organization Details</h3>
                    <a href="#">
                      <GoPencil />
                    </a>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Website</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter company website"
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
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Category</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter company category"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Contact Details</h3>
                    <a href="#">
                      <GoPencil />
                    </a>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Phone Number</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter phone number"
                        />
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        title="Basic Details"
        width={700}
        onClose={onClose}
        open={profileOpen}
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={onClose}
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
                <label htmlFor="">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
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
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">Gender</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Select gender"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group date-pick">
                <label htmlFor="">Date of birth</label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  toggleCalendarOnIconClick
                  dropdownMode="select"
                  placeholderText="Select date"
                  showIcon
                  className="form-control w-100"
                  closeOnScroll={false}
                  selectsEnd
                  icon={<FaCalendarAlt style={{ color: "#ADB5BD" }} />}
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ProfileMenu;
