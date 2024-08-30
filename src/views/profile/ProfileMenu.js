import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { Drawer } from "antd";
import "react-dropdown/style.css";
import profileService from "../../services/Profile";
import { GoPencil } from "react-icons/go";
import toast from "react-hot-toast";
import { ProfileSystem } from "../../context/ProfileContext";
import { FormFeedback, Input, Label } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoCheckmarkSharp } from "react-icons/io5";

const ProfileMenu = () => {
  const user_id = localStorage.getItem("user_id");
  const { dispatch: profilename, state: namestate } = useContext(ProfileSystem);
  const { dispatch: profileemail, state: emailstate } =
    useContext(ProfileSystem);

  const [profileData, setProfileData] = useState([]);
  const [editProfileData, setEditProfileData] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const getProfile = () => {
    profileService
      .Profile({ user_id: parseInt(user_id) })
      .then((res) => {
        if (res && res?.data) {
          setProfileData(res?.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user_id) {
      getProfile();
    }
  }, [user_id]);

  const profileMenuDrawer = (data) => {
    setEditProfileData(data);
    setProfileOpen(true);
  };

  const onClose = () => {
    setProfileOpen(false);
    getProfile();
  };

  const companyMenuDrawer = (data) => {
    setProfileData(data);
    setCompanyOpen(true);
  };

  const onCompanyClose = () => {
    setCompanyOpen(false);
    getProfile();
  };

  const contactMenuDrawer = (data) => {
    setProfileData(data);
    setContactOpen(true);
  };

  const onContactClose = () => {
    setContactOpen(false);
    getProfile();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: (editProfileData && editProfileData.id) || profileData?.id,
      first_name:
        (editProfileData && editProfileData.first_name) ||
        profileData?.first_name,
      last_name:
        (editProfileData && editProfileData.last_name) ||
        profileData?.last_name,
      gender:
        (editProfileData && editProfileData.gender) || profileData?.gender,
      dob:
        (editProfileData && editProfileData.dob?.split("T")[0]) ||
        profileData?.dob?.split("T")[0],
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please enter first name"),
      last_name: Yup.string().required("Please enter last name"),
      gender: Yup.string().required("Please select gender"),
      dob: Yup.string().required("Please select date"),
    }),
    onSubmit: (values) => {
      profileService
        .UpdateProfile(values)
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
            toast.success(res.message);
            getProfile();
            setProfileOpen(false);
          }
        })
        .catch((err) => console.log(err));
    },
  });

  const companyFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: (editProfileData && editProfileData.id) || profileData?.id,
      company:
        (editProfileData && editProfileData.company) || profileData?.company,
      company_site:
        (editProfileData && editProfileData.company_site) ||
        profileData?.company_site,
      company_size:
        (editProfileData && editProfileData.company_size) ||
        profileData?.company_size,
      category:
        (editProfileData && editProfileData.category) || profileData?.category,
    },
    validationSchema: Yup.object({
      company: Yup.string().required("Please enter company name"),
      company_site: Yup.string().required("Please enter company website"),
      company_size: Yup.string().required("Please enter company size"),
      category: Yup.string().required("Please select category"),
    }),
    onSubmit: (values) => {
      profileService
        .UpdateProfile(values)
        .then((res) => {
          if (res.success === true) {
            toast.success(res.message);
            getProfile();
            setCompanyOpen(false);
          }
        })
        .catch((err) => console.log(err));
    },
  });

  const contactFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user_id: (editProfileData && editProfileData.id) || profileData?.id,
      phone_number:
        (editProfileData && editProfileData.phone_number) ||
        profileData?.phone_number,
      email: (editProfileData && editProfileData.email) || profileData?.email,
    },
    validationSchema: Yup.object({
      phone_number: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Please enter mobile number"),
      email: Yup.string()
        .email("Must be a valid Email")
        .max(255)
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      profileService
        .UpdateProfile(values)
        .then((res) => {
          if (res.success === true) {
            toast.success(res.message);
            getProfile();
            setContactOpen(false);
          }
        })
        .catch((err) => console.log(err));
    },
  });

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
                    <span onClick={() => profileMenuDrawer(profileData)}>
                      <GoPencil />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>First Name</Label>
                        <Input
                          type="text"
                          value={profileData?.first_name}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Last Name</Label>
                        <Input
                          type="text"
                          value={profileData?.last_name}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Gender</Label>
                        <Input
                          type="text"
                          value={profileData?.gender}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group date-pick">
                        <Label>Date of birth</Label>
                        <Input
                          name="dob"
                          type="text"
                          value={
                            profileData?.dob
                              ? profileData?.dob?.split("T")[0]
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Organization Details</h3>
                    <span onClick={() => companyMenuDrawer(profileData)}>
                      <GoPencil />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Company Name</Label>
                        <Input
                          type="text"
                          value={profileData?.company}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Company Website</Label>
                        <Input
                          type="text"
                          value={profileData?.company_site}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Company Size</Label>
                        <Input
                          type="text"
                          value={profileData?.company_size}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Company Category</Label>
                        <Input
                          type="text"
                          value={profileData?.category}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile_box">
                  <div className="profile_box_title">
                    <h3>Contact Details</h3>
                    <span onClick={() => contactMenuDrawer(profileData)}>
                      <GoPencil />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Phone Number</Label>
                        <Input
                          type="text"
                          value={profileData?.phone_number}
                          readOnly
                        />
                        <span className="phone_verify_btn">
                          <IoCheckmarkSharp />
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label>Email Address</Label>
                        <Input
                          type="text"
                          value={profileData?.email}
                          readOnly
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
              onClick={formik.handleSubmit}
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
                <Label className="form-label">First Name</Label>
                <Input
                  type="text"
                  name="first_name"
                  className="form-control"
                  placeholder="Enter first name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name || ""}
                  invalid={
                    formik.touched.first_name && formik.errors.first_name
                      ? true
                      : false
                  }
                />
                {formik.touched.first_name && formik.errors.first_name ? (
                  <FormFeedback type="invalid">
                    {formik.errors.first_name}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <div className="form-group">
                  <Label className="form-label">Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    className="form-control"
                    placeholder="Enter last name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name || ""}
                    invalid={
                      formik.touched.last_name && formik.errors.last_name
                        ? true
                        : false
                    }
                  />
                  {formik.touched.last_name && formik.errors.last_name ? (
                    <FormFeedback type="invalid">
                      {formik.errors.last_name}
                    </FormFeedback>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <Label className="form-label">Gender</Label>
                <Input
                  type="select"
                  name="gender"
                  className="form-control"
                  placeholder="Select gender"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender || ""}
                  invalid={
                    formik.touched.gender && formik.errors.gender ? true : false
                  }
                >
                  <option value="" label="Select gender" />
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </Input>
                {formik.touched.gender && formik.errors.gender ? (
                  <FormFeedback type="invalid">
                    {formik.errors.gender}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group date-pick">
                <Label className="form-label">Date of birth</Label>
                <Input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={formik?.values?.dob?.split("T")[0]}
                  format="YYYY-MM-DD"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.dob && formik.errors.dob ? true : false
                  }
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <FormFeedback type="invalid">
                    {formik.errors.dob}
                  </FormFeedback>
                ) : null}
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
              onClick={companyFormik.handleSubmit}
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
                <Label className="form-label">Company Name</Label>
                <Input
                  name="company"
                  type="text"
                  className="form-control"
                  placeholder="Enter company name"
                  onChange={companyFormik.handleChange}
                  onBlur={companyFormik.handleBlur}
                  value={companyFormik.values.company || ""}
                  invalid={
                    companyFormik.touched.company &&
                    companyFormik.errors.company
                      ? true
                      : false
                  }
                />
                {companyFormik.touched.company &&
                companyFormik.errors.company ? (
                  <FormFeedback type="invalid">
                    {companyFormik.errors.company}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <Label className="form-label">Company Website</Label>
                <Input
                  name="company_site"
                  type="text"
                  className="form-control"
                  placeholder="Enter company website"
                  onChange={companyFormik.handleChange}
                  onBlur={companyFormik.handleBlur}
                  value={companyFormik.values.company_site || ""}
                  invalid={
                    companyFormik.touched.company_site &&
                    companyFormik.errors.company_site
                      ? true
                      : false
                  }
                />
                {companyFormik.touched.company_site &&
                companyFormik.errors.company_site ? (
                  <FormFeedback type="invalid">
                    {companyFormik.errors.company_site}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <Label className="form-label">Company Size</Label>
                <Input
                  name="company_size"
                  type="text"
                  className="form-control"
                  placeholder="Enter company size"
                  onChange={companyFormik.handleChange}
                  onBlur={companyFormik.handleBlur}
                  value={companyFormik.values.company_size || ""}
                  invalid={
                    companyFormik.touched.company_size &&
                    companyFormik.errors.company_size
                      ? true
                      : false
                  }
                />
                {companyFormik.touched.company_size &&
                companyFormik.errors.company_size ? (
                  <FormFeedback type="invalid">
                    {companyFormik.errors.company_size}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group">
                <Label className="form-label">Company Category</Label>
                <Input
                  name="category"
                  type="select"
                  className="form-control"
                  placeholder="Select company category"
                  onChange={companyFormik.handleChange}
                  onBlur={companyFormik.handleBlur}
                  value={companyFormik.values.category || ""}
                  invalid={
                    companyFormik.touched.category &&
                    companyFormik.errors.category
                      ? true
                      : false
                  }
                >
                  <option value="" label="Select company category" />
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Real Estate">Real Estate</option>
                </Input>
                {companyFormik.touched.category &&
                companyFormik.errors.category ? (
                  <FormFeedback type="invalid">
                    {companyFormik.errors.category}
                  </FormFeedback>
                ) : null}
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
              onClick={contactFormik.handleSubmit}
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
                <Label className="form-label">Phone Number</Label>
                <Input
                  name="phone_number"
                  type="number"
                  className="form-control"
                  placeholder="Enter phone number"
                  onChange={contactFormik.handleChange}
                  onBlur={contactFormik.handleBlur}
                  value={contactFormik.values.phone_number || ""}
                  invalid={
                    contactFormik.touched.phone_number &&
                    contactFormik.errors.phone_number
                      ? true
                      : false
                  }
                />
                {contactFormik.touched.phone_number &&
                contactFormik.errors.phone_number ? (
                  <FormFeedback type="invalid">
                    {contactFormik.errors.phone_number}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            <div className="col-md-7 mb-2">
              <div className="form-group">
                <Label className="form-label">Company Email</Label>
                <Input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter email address"
                  onChange={contactFormik.handleChange}
                  onBlur={contactFormik.handleBlur}
                  value={contactFormik.values.email || ""}
                  invalid={
                    contactFormik.touched.email && contactFormik.errors.email
                      ? true
                      : false
                  }
                />
                {contactFormik.touched.email && contactFormik.errors.email ? (
                  <FormFeedback type="invalid">
                    {contactFormik.errors.email}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ProfileMenu;
