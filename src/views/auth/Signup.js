import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  return (
    <>
      <div className="auth_main">
        <div className="auth_inr">
          <div className="auth_left"></div>
          <div className="auth_right">
            <div className="login_main">
              <div className="row justify-content-center align-items-center h-100">
                <div className="col-md-6">
                  <div className="signup_detail">
                    <div className="signup_title">
                      <h3>Sign Up</h3>
                      <p className="pb-4">Your partner in gaming insights!</p>
                      <span>Lets get you started...</span>
                    </div>
                    <div className="login_detail_inr signup_details_inr p-0">
                      <form>
                        <div className="form-group position-relative">
                            <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                          />
                        </div>
                        <div className="auth_login_btn mb-4">
                          <button className="login_btn">
                            Next
                            <IoIosArrowForward className="ms-2" />
                          </button>
                        </div>
                        <h4 className="pb-2">
                          <span>Or Sign in with</span>
                        </h4>
                        <button className="btn google_login">
                          <FcGoogle className="me-2 google_icon" />
                          Sign in with Google
                        </button>

                        <div className="auth_signup_link mt-5">
                          <p className="m-0">Already have account?</p>
                          <Link to="/login" className="ms-2">
                            Login here
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

export default Signup;
