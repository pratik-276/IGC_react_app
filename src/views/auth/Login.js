import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./config";

const Login = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [errors, setErrors] = useState({});

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const togglePassword = (e) => {
    e.preventDefault();
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setValue(data?.user?.email);
        localStorage.setItem("email", data?.user?.email);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
        navigate("/login");
      });
  };

  const validation = () => {
    let errors = {};
    let isValid = true;

    if (!input["email"]) {
      isValid = false;
      errors["email"] = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(input?.email)) {
      errors["email"] = "Email field is invalid";
      isValid = false;
    }

    if (!input["password"]) {
      isValid = false;
      errors["password"] = "Please enter your password.";
    }

    if (input["password"] && input["password"].length < 6) {
      isValid = false;
      errors["password"] = "Please add at least 6 characters.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validation()) {
      console.log(input);
      localStorage.setItem("email", input.email);
      localStorage.setItem("password", input.password);
      navigate("/");
      setInput({
        email: "",
        password: "",
      });
    }
  };

  useEffect(() => {
    setValue(localStorage.getItem("email"));
  }, []);

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
                      <button
                        className="btn google_login"
                        onClick={handleGoogleLogin}
                      >
                        <FcGoogle className="me-2 google_icon" />
                        Sign in with Google
                      </button>
                      <h4>
                        <span>Or Sign in with</span>
                      </h4>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${
                              errors.email && "is-invalid"
                            }`}
                            placeholder="Email ID"
                            autoComplete="off"
                            onChange={(e) => handleChange(e)}
                            // required
                          />
                          {errors.email && (
                            <div
                              className="text-danger m-0 pb-1"
                              style={{ fontSize: "14px" }}
                            >
                              {errors.email}
                            </div>
                          )}
                        </div>
                        <div className="form-group m-0 position-relative">
                          <input
                            type={passwordType}
                            name="password"
                            className={`form-control ${
                              errors.password && "is-invalid"
                            }`}
                            placeholder="Password"
                            autoComplete="off"
                            onChange={(e) => handleChange(e)}
                            // required
                          />
                          <div
                            className="eye-icon"
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
                        <p className="text-end m-0 pt-2 mb-4">
                          <Link to="/forget-password">Forgot Password?</Link>
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
