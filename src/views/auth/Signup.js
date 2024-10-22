import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./config";
import UserLogin from "../../services/Login";
import CompassData from "../../services/CompassApi";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";


const cookies = new Cookies();

const Signup = () => {
  const navigate = useNavigate();
  const [passShow, setPassShow] = useState(false);
  const [providerData, setProviderData] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('---');

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    getProviderData();
  }, []);

  const [errors, setErrors] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [confirmpasswordType, setConfirmPasswordType] = useState("password");

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

  const getProviderData = () => {
    CompassData.get_provider()
      .then((res) => {
        if (res?.success) {
          setProviderData(res.data);
          console.log("res.data", res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(true);
    setErrorMessage("");
  };

  const handlePasswordChange = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
    setErrors({});
  };

  const validateEmail = (email) => {
    return email.includes("@") && email.includes(".");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      setIsValidEmail(false);
      setErrorMessage("Please enter your email");
      return;
    }
    const isValid = validateEmail(email);
    setIsValidEmail(isValid);
    if (isValid) {
      if (selectedProvider === '---') {
        toast.error("Please select a provider");
        return;
      }
      console.log("Valid email:", email);
      setPassShow(true);
    } else {
      setErrorMessage("Please enter a valid email address");
      console.log("Invalid email:", email);
    }
  };

  const handleVerifyPassWord = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // navigate("/login");
      UserLogin.SignUp({ user_email: email, provider: selectedProvider, password: input?.password })
        .then((res) => {
          console.log(res.success, res.status, res.message, res);
          if (res?.success === true) {
            toast.success(res?.message, {
              duration: 10000,
            });
            navigate("/login");
          } else {
            setErrorMessage(res?.message);
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          toast.error(err, {
            duration: 10000,
          });
        });
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

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        const email = data?.user?.email;
        if (email) {
          UserLogin.SignUp({ user_email: email, password: "user@123" })
            .then((res) => {
              if (res?.success === true) {
                localStorage.setItem("user_id", res?.data?.user_id);
                localStorage.setItem("access_token", res?.data?.access);
                localStorage.setItem("refresh_token", res?.data?.refresh);
                toast.success("Login Successfully");
                navigate("/");
              } else {
                toast.error("Login failed");
              }
            })
            .catch((err) => {
              toast.error("Error during login");
              if (err.response && err.response.status === 401) {
                toast.error("Unauthorized. Please check your credentials.");
              }
            });
        } else {
          toast.error("No email found from Google sign-in");
        }
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
        navigate("/login");
      });
  };

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
                      <p className="pb-3">Your partner in gaming insights!</p>
                      <span>Lets get you started...</span>
                    </div>
                    <div className="login_detail_inr signup_details_inr signup_page_input p-0">
                      {passShow === false && (
                        <>
                          <form onSubmit={handleSubmit}>
                            <div className="form-group position-relative">
                              <label>Email</label>
                              <input
                                type="email"
                                className={`form-control ${
                                  !isValidEmail && "is-invalid"
                                }`}
                                placeholder="Email ID"
                                value={email}
                                onChange={handleEmailChange}
                              />
                              {!isValidEmail && (
                                <div className="invalid-feedback m-0">
                                  {errorMessage}
                                </div>
                              )}
                            </div>
                            <div className="form-group position-relative">
                              <label>Select Game Provider</label>
                              <select 
                                className="form-control"
                                options={providerData} 
                                value={selectedProvider} 
                                onChange={(e) => setSelectedProvider(e.target.value)}
                              >
                                <option key={"---"} value={provider.game_provider_name} disabled>
                                      ---
                                    </option>
                                {
                                  providerData.map((provider, index) => (
                                    <option key={provider.game_provider_name + "" + index} value={provider.game_provider_name}>
                                      {provider.game_provider_name}
                                    </option>
                                  ))
                                }
                              </select>
                            </div>
                            <div className="auth_login_btn mb-4">
                                <button className="login_btn">
                                  Next
                                  <IoIosArrowForward className="ms-2" />
                                </button>
                              </div>
                            
                          </form>
                        </>
                      )}
                      {passShow === true && (
                        <>
                          <form onSubmit={handleVerifyPassWord}>
                            <div className="form-group position-relative">
                              <label>password</label>
                              <div className="position-relative">
                                <input
                                  type={passwordType}
                                  name="password"
                                  className={`form-control ${
                                    errors.password ? "is-invalid" : ""
                                  }`}
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
                                  className="text-danger mb-2"
                                  style={{ fontSize: "14px" }}
                                >
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            <div className="form-group position-relative">
                              <label>Confirm Password</label>
                              <div className="position-relative">
                                <input
                                  type={confirmpasswordType}
                                  name="confirmPassword"
                                  className={`form-control ${
                                    errors.confirmPassword ? "is-invalid" : ""
                                  }`}
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
                                  className="text-danger mb-2"
                                  style={{ fontSize: "14px" }}
                                >
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </div>
                            <div className="auth_login_btn mb-4">
                              <button className="login_btn">
                                Next
                                <IoIosArrowForward className="ms-2" />
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                      {/* <h4 className="pb-2">
                        <span>Or Sign in with</span>
                      </h4>
                      <button
                        className="btn google_login"
                        onClick={handleGoogleLogin}
                      >
                        <FcGoogle className="me-2 google_icon" />
                        Sign in with Google
                      </button> */}

                      <div className="auth_signup_link mt-5">
                        <p className="m-0">Already have account?</p>
                        <Link to="/login" className="ms-2">
                          Login here
                        </Link>
                      </div>
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
