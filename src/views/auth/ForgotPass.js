import React, { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import OTPInput from "otp-input-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [resetShow, setResetShow] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [confirmpasswordType, setConfirmPasswordType] = useState("password");

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email field is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email field is invalid");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    let errors = {};
    let isValid = true;

    if (!input["password"]) {
      isValid = false;
      errors["password"] = "Please enter your password.";
    }

    if (!input["confirmPassword"]) {
      isValid = false;
      errors["confirmPassword"] = "Please enter your confirm password.";
    }

    if (input["password"] && input["password"].length < 6) {
      isValid = false;
      errors["password"] = "Please add at least 6 characters.";
    } else {
      if (
        input["password"] &&
        input["confirmPassword"] &&
        input["password"] !== input["confirmPassword"]
      ) {
        isValid = false;
        errors["confirmPassword"] =
          "Password and Confirm password doesn't match.";
      }
    }

    setErrors(errors);
    return isValid;
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
    setErrors({});
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    if (validateEmail()) {
      console.log("Email is valid:", email);
      setShow(true);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const isValidOTP = otp.length === 5;
    if (isValidOTP) {
      setResetShow(true);
    } else if (!isValidOTP) {
      setOtpError("Please Enter Valid OTP");
    }
  };

  const handleVerifyPassWord = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      navigate("/signup");
    }
  };

  const togglePassword = (e) => {
    e.preventDefault();
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const toggleConfirmPassword = (e) => {
    e.preventDefault();
    if (confirmpasswordType === "password") {
      setConfirmPasswordType("text");
      return;
    }
    setConfirmPasswordType("password");
  };

  return (
    <>
      <div className="auth_main">
        <div className="auth_inr">
          <div className="auth_left"></div>
          <div className="auth_right">
            <div className="login_main">
              <div className="row justify-content-center align-items-center h-100">
                <div className="col-md-7">
                  {show === false && (
                    <>
                      <div className="login_detail">
                        <div className="login_title forget_pass_email mb-4">
                          <h5>Reset your password</h5>
                          <p>
                            Enter your registered email address. You will
                            receive OTP on the same email address.
                          </p>
                        </div>
                        <div className="login_detail_inr p-0">
                          <form onSubmit={handleSubmitOtp}>
                            <div className="form-group mb-4 position-relative">
                              <input
                                type="email"
                                className={`form-control ${
                                  emailError ? "is-invalid" : ""
                                }`}
                                placeholder="Email ID"
                                value={email}
                                onChange={handleChangeEmail}
                              />
                              {emailError && (
                                <div
                                  className="invalid-feedback  mb-1"
                                  style={{ fontSize: "14px" }}
                                >
                                  {emailError}
                                </div>
                              )}
                            </div>

                            <div className="forget_pass_btn">
                              <div className="auth_login_btn">
                                <button
                                  className="forgetpass_btn"
                                  onClick={() => navigate("/signup")}
                                >
                                  Back to sign in
                                </button>
                              </div>
                              <div className="auth_login_btn ">
                                <button className="forgetpass_btn_otp forget_pass_send_otp_btn">
                                  Send OTP
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </>
                  )}
                  {show === true && (
                    <>
                      {resetShow === false && (
                        <>
                          <div className="login_detail">
                            <div className="login_title forget_pass_title">
                              <h5>OTP Sent</h5>
                              <p>
                                We have sent OTP to your Registered email
                                address.
                              </p>
                            </div>
                            <div className="login_detail_inr p-0">
                              <form onSubmit={handleVerifyOtp}>
                                <div className="otp_input_box mb-3">
                                  <OTPInput
                                    className={`otp-container ${
                                      otpError ? "is-invalid" : ""
                                    }`}
                                    autoFocus
                                    OTPLength={5}
                                    otpType="number"
                                    disabled={false}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(otp) => {
                                      setOtp(otp);
                                      setOtpError("");
                                    }}
                                  />
                                  {otpError && (
                                    <div
                                      className="invalid-feedback "
                                      style={{ fontSize: "14px" }}
                                    >
                                      {otpError}
                                    </div>
                                  )}
                                </div>

                                <div className="mb-4">
                                  <span>
                                    Didn’t receive OTP yet ?
                                    <Link to="/" className="ms-2">
                                      Resend OTP
                                    </Link>
                                  </span>
                                </div>
                                <div className="forget_pass_btn">
                                  <div className="auth_login_btn">
                                    <button
                                      className="forgetpass_btn"
                                      onClick={() => navigate("/signup")}
                                    >
                                      Back to sign in
                                    </button>
                                  </div>
                                  <div className="auth_login_btn">
                                    <button className="forgetpass_btn_otp forget_pass_send_otp_btn">
                                      Reset Password
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {resetShow === true && (
                    <>
                      <div className="login_detail">
                        <div className="login_title forget_pass_title create_password_title">
                          <h5>
                            <IoIosArrowBack style={{ fontSize: "21px" }} />{" "}
                            Create your password
                          </h5>
                        </div>
                        <div className="login_detail_inr p-0 reset_pass_details">
                          <form onSubmit={handleVerifyPassWord}>
                            <div className="form-group mb-3 position-relative">
                              <div className="position-relative">
                                <input
                                  type={passwordType}
                                  className="form-control"
                                  name="password"
                                  placeholder="Enter Password"
                                  value={input.password}
                                  onChange={handlePasswordChange}
                                />

                                <div
                                  className="show_pass_first_eye"
                                  onClick={(e) => togglePassword(e)}
                                >
                                  {passwordType === "password" ? (
                                    <FaEye />
                                  ) : (
                                    <FaEyeSlash />
                                  )}
                                </div>
                              </div>
                              {errors.password && (
                                <div
                                  className="text-danger m-0 pb-1"
                                  style={{ fontSize: "14px" }}
                                >
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            <div className="form-group mb-3 position-relative">
                              <div className="position-relative">
                                <input
                                  type={confirmpasswordType}
                                  name="confirmPassword"
                                  className="form-control"
                                  placeholder="Confirm Password"
                                  value={input.confirmPassword}
                                  onChange={handlePasswordChange}
                                />
                                <div
                                  className="show_pass_first_eye"
                                  onClick={(e) => toggleConfirmPassword(e)}
                                >
                                  {confirmpasswordType === "password" ? (
                                    <FaEye />
                                  ) : (
                                    <FaEyeSlash />
                                  )}
                                </div>
                              </div>
                              {errors.confirmPassword && (
                                <div
                                  className="text-danger m-0 pb-2"
                                  style={{ fontSize: "14px" }}
                                >
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </div>

                            <div className="create_pass_btns">
                              <button className="forgetpass_btn_otp">
                                Reset Password
                                <IoIosArrowForward
                                  className="ms-2"
                                  style={{ fontSize: "17px" }}
                                />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPass;
