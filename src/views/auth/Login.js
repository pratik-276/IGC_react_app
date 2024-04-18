import React from "react";
import "./Auth.css";
import { FaEye } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="auth_main">
        <div className="auth_inr">
          <div className="auth_left"></div>
          <div className="auth_right">
            <div className="login_main">
              <div className="row justify-content-center align-items-center h-100">
                <div className="col-md-6">
                  <div className="login_detail">
                    <div className="login_title">
                      <h3>Sign in</h3>
                      <p>Your partner in gaming insights!</p>
                    </div>
                    <div className="login_detail_inr">
                      <button className="btn google_login">
                        <FcGoogle className="me-2 google_icon" />
                        Sign in with Google
                      </button>
                      <h4>
                        <span>Or Sign in with</span>
                      </h4>
                      <form>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email ID"
                          />
                        </div>
                        <div className="form-group m-0 position-relative">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                          />
                          <div className="eye-icon">
                            <FaEye />
                          </div>
                        </div>
                        <p className="text-end m-0 pt-2 mb-4">
                          <Link to="/forgot-password">Forgot Password?</Link>
                        </p>
                        <div className="auth_login_btn">
                          <button className="login_btn">
                            Login
                            <IoIosArrowForward className="ms-2" />
                          </button>
                        </div>
                        <div className="auth_signup_link">
                          <p>Don't have an account?</p>
                          <Link to="/signup" className="ms-2">
                            Sign up
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
