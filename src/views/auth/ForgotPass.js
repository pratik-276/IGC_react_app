import React, { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import OTPInput from "otp-input-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaEyeSlash } from "react-icons/fa";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [resetShow, setResetShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShow(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setResetShow(true);
  };

  const handleVerifyPassWord = (e) => {
    e.preventDefault();
    navigate("/signup");
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
                          <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                              <input
                                type="email"
                                className="form-control"
                                placeholder="Email ID"
                              />
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
                                <button className="forgetpass_btn_otp">
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
                                    className="otp-container"
                                    autoFocus
                                    OTPLength={5}
                                    otpType="number"
                                    disabled={false}
                                    placeholder="000000"
                                  />
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
                                    <button className="forgetpass_btn_otp">
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
                            <div className="form-group mb-4 position-relative ">
                              <input
                                type="email"
                                className="form-control"
                                placeholder="Enter Password"
                              />
                              <div className="show_pass_first_eye">
                                <FaEyeSlash />
                              </div>
                            </div>
                            <div className="form-group mb-4 position-relative">
                              <input
                                type="email"
                                className="form-control"
                                placeholder="Confirm Password"
                              />
                              <div className="show_pass_first_eye">
                                <FaEyeSlash />
                              </div>
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
