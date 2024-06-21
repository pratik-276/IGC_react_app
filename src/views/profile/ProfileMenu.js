import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { Drawer, DatePicker } from "antd";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import profileService from "../../services/Profile";
import { GoPencil } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import moment from "moment/moment";
import toast from "react-hot-toast";
import { ProfileSystem } from "../../context/ProfileContext";

const selectGender = ["Male", "Female", "Transgender"];
const selectCompanyCategories = [
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Real Estate",
];

const ProfileMenu = () => {
  const user_id = localStorage.getItem("user_id");
  const { dispatch: profilename, state: namestate } = useContext(ProfileSystem);
  const { dispatch: profileemail, state: emailstate } =
    useContext(ProfileSystem);

  const [profileData, setProfileData] = useState([]);

  const [editProfileData, setEditProfileData] = useState([]);

  const [birthDate, setBirthDate] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const getProfile = () => {
    profileService
      .Profile({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res && res.data) {
          setEditProfileData({
            ...res.data,
          });
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

  const profileMenuDrawer = (data) => {
    setProfileData(data);
    setProfileOpen(true);
  };

  const onClose = () => {
    setProfileOpen(false);
    resetProfileData();
  };

  const companyMenuDrawer = (data) => {
    setProfileData(data);
    setCompanyOpen(true);
  };

  const onCompanyClose = () => {
    setCompanyOpen(false);
  };

  const contactMenuDrawer = (data) => {
    setProfileData(data);
    setContactOpen(true);
  };

  const onContactClose = () => {
    setContactOpen(false);
  };

  const onChange = (date) => {
    // console.log("Selected date (moment object):", date?.format("DD-MM-YYYY"));
    setBirthDate(date?.format("DD-MM-YYYY"));
  };

  const submitProfileData = () => {
    const data = {
      user_id: parseInt(user_id),
      username: profileData?.username
        ? profileData?.username
        : editProfileData?.username,
      gender: profileData?.gender
        ? profileData?.gender
        : editProfileData?.gender,
      dob: birthDate ? birthDate : editProfileData?.dob,
      company: profileData?.company
        ? profileData?.company
        : editProfileData?.company,
      company_site: profileData?.company_site
        ? profileData?.company_site
        : editProfileData?.company_site,
      phone_number: profileData?.phone_number
        ? profileData?.phone_number
        : editProfileData?.phone_number,
      email: profileData?.email ? profileData?.email : editProfileData?.email,
    };

    profileService
      .UpdateProfile(data)
      .then((res) => {
        if (res.success === true) {
          profilename({
            type: "SET_NAME",
            payload: { profilename: !namestate?.profilename },
          });

          profileemail({
            type: "SET_EMAIl",
            payload: { profileemail: !emailstate?.profileemail },
          });
          setProfileData(res.data);
          toast.success(res.message);
          getProfile();
          resetProfileData();
          setProfileOpen(false);
          setContactOpen(false);
          setCompanyOpen(false);
        }
      })
      .catch((err) => console.log(err));
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
                    <span onClick={() => profileMenuDrawer(editProfileData)}>
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
                          value={editProfileData?.username}
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
                          value={editProfileData.lastName}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Gender</label>
                        <Dropdown
                          options={selectGender}
                          placeholder="Select gender"
                          value={editProfileData?.gender}
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
                          // value={editProfileData?.dob}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Organization Details</h3>
                    <span onClick={() => companyMenuDrawer(editProfileData)}>
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
                          value={editProfileData?.company || ""}
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
                          value={editProfileData?.company_site || ""}
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
                          value={editProfileData?.category || ""}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Company Category</label>
                        <Dropdown
                          options={selectCompanyCategories}
                          placeholder="Select company category"
                          value={editProfileData.category || ""}
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
                    <span onClick={() => contactMenuDrawer(editProfileData)}>
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
                          value={editProfileData?.phone_number}
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
                          value={editProfileData?.email}
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
                <label htmlFor="">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter company name"
                  value={profileData.company}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      company: e.target.value,
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
                  value={profileData.company_site}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      company_site: e.target.value,
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
                  value={profileData.companySize}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
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
                  value={profileData?.category}
                  onChange={(option) =>
                    setProfileData({
                      ...profileData,
                      category: option.value,
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
      <Drawer
        title="Contact Details"
        width={700}
        onClose={onContactClose}
        open={contactOpen}
        maskClosable={false}
        className="profile_menu_drawer"
        footer={
          <div style={{ textAlign: "right" }}>
            <button
              onClick={onContactClose}
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
                <label htmlFor="">Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={profileData.phone_number}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <label htmlFor="">Company Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter company email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      email: e.target.value,
                    })
                  }
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
