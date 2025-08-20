import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Auth.css";
import UserLogin from "../../services/Login";
import CompassData from "../../services/CompassApi";

import toast from "react-hot-toast";
import WebsiteLogo from "../../assets/images/logos/logo.ico";

import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputOtp } from "primereact/inputotp";
import { Button } from "primereact/button";

const Login = () => {
  const navigate = useNavigate();

  const [providerLoading, setProviderLoading] = useState(true);
  const [providerData, setProviderData] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");

  const [pageType, setPageType] = useState("SignIn");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpFormRef = useRef(null);

  useEffect(() => {
    localStorage.clear();
    getProviderData();
  }, []);

  const getProviderData = () => {
    setProviderLoading(true);
    CompassData.get_provider()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          const cleaned = res.data
            .filter(
              (record) =>
                record?.game_provider_name &&
                typeof record.game_provider_name === "string"
            )
            .map((record) => ({
              label: record.game_provider_name,
              value: record.game_provider_name,
            }));

          setProviderData(cleaned);
        }
      })
      .catch((err) => {
        console.log(err);
        setProviderLoading(false);
      })
      .finally(() => {
        setProviderLoading(false);
      });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    UserLogin.LoginNew(formData)
      .then((res) => {
        if (res?.success === true) {
          toast.success(res.message);
          setEmail(formData.user_email);
          setOtpSent(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err, {
          duration: 10000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted OTP:", otp);
    setLoading(true);

    UserLogin.OtpVerification({ user_email: email, otp: otp })
      .then((res) => {
        if (res?.success === true) {
          toast.success(res.message);
          localStorage.setItem("user_id", res?.data?.user_id);
          localStorage.setItem("user_company", res?.data?.user_company);
          localStorage.setItem("access_token", res?.data?.access);
          localStorage.setItem("refresh_token", res?.data?.refresh);
          navigate("/");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err, {
          duration: 10000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    setLoading(true);

    UserLogin.SignUpNew(formData)
      .then((res) => {
        if (res?.success === true) {
          toast.success(res.message);
          setEmail(formData.user_email);
          setOtpSent(true);
        }else{
          console.log(res);
          if(res?.message === 'Only professional email allowed'){
            toast.error('Only professional email allowed', {
              duration: 2000
            });
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err, {
          duration: 10000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="auth_main">
        <div className="auth_inr">
          <div className="auth_left row justify-content-center align-items-center h-100" style={{width: "100.9%"}}>
            <div className="auth_right">
              <div className="login_main">
                <div className="row justify-content-center align-items-center h-100">
                  <div className="col-10 col-sm-10 col-md-10">
                    <div className="login_detail">
                      {/* {pageType === "SignIn" ? (
                        !otpSent ? (
                          <>
                            <div className="login_title">
                              <img
                                src={WebsiteLogo}
                                alt="IGC"
                                style={{
                                  height: "80px",
                                }}
                              />
                              <h3
                                className="fw-bold"
                                style={{ color: "#392f6c" }}
                              >
                                Sign in
                              </h3>
                              <p>Your partner in gaming insights !</p>
                            </div>

                            <div className="login_detail_inr">
                              <form onSubmit={handleEmailSubmit}>
                                <div className="form-group">
                                  <IconField iconPosition="left">
                                    <InputIcon className="pi pi-envelope"></InputIcon>
                                    <InputText
                                      name="user_email"
                                      type="email"
                                      keyfilter="email"
                                      required
                                      placeholder="Email"
                                      className="w-100"
                                    />
                                  </IconField>
                                </div>

                                <div className="auth_login_btn">
                                  <Button className="login_btn" loading={loading}>
                                    Send OTP
                                    <i className="pi pi-send ms-2" />
                                  </Button>
                                </div>
                              </form>

                              <div className="auth_signup_link">
                                <p>Don't have an account ?</p>
                                <span
                                  className="ms-2 signup-text"
                                  onClick={() => setPageType("SignUp")}
                                >
                                  Sign up
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="login_title">
                              <img
                                src={WebsiteLogo}
                                alt="IGC"
                                style={{
                                  height: "80px",
                                }}
                              />
                              <h3
                                className="fw-bold"
                                style={{ color: "#392f6c" }}
                              >
                                Enter OTP
                              </h3>
                              <p>OTP is sent to {email}</p>
                            </div>

                            <div className="login_detail_inr">
                              <form onSubmit={handleOtpSubmit}>
                                <div className="form-group">
                                  <InputOtp
                                    name="otp"
                                    integerOnly
                                    length={6}
                                    className="w-100"
                                    value={otp}
                                    onChange={(e) => setOtp(e.value)}
                                  />
                                </div>

                                <div className="auth_login_btn">
                                  <Button
                                    className="login_btn"
                                    loading={loading}
                                    disabled={!otp || otp.length < 6}
                                  >
                                    Verify OTP
                                    <i className="pi pi-check ms-2" />
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </>
                        )
                      ) : (
                        <>
                          <div className="login_title">
                            <img
                              src={WebsiteLogo}
                              alt="IGC"
                              style={{
                                height: "80px",
                              }}
                            />
                            <h3 className="fw-bold" style={{ color: "#392f6c" }}>
                              Sign Up
                            </h3>
                            <p>Your partner in gaming insights !</p>
                          </div>

                          <div className="login_detail_inr">
                            <form
                              ref={signUpFormRef}
                              onSubmit={handleSignUpSubmit}
                            >
                              <div className="form-group">
                                <IconField iconPosition="left">
                                  <InputIcon className="pi pi-envelope"></InputIcon>
                                  <InputText
                                    name="user_email"
                                    type="email"
                                    keyfilter="email"
                                    required
                                    placeholder="Email"
                                    className="w-100"
                                  />
                                </IconField>
                              </div>

                              <div className="form-group">
                                <Dropdown
                                  name="provider"
                                  optionLabel="label"
                                  optionValue="value"
                                  filter
                                  placeholder="Select Provider"
                                  loading={providerLoading}
                                  value={selectedProvider}
                                  onChange={(e) => {
                                    setSelectedProvider(e.value);
                                  }}
                                  options={providerData}
                                  className="w-100"
                                />
                              </div>

                              <div className="auth_login_btn">
                                <Button
                                  className="login_btn"
                                  loading={loading}
                                  disabled={!selectedProvider}
                                >
                                  Send OTP
                                  <i className="pi pi-send ms-2" />
                                </Button>
                              </div>
                            </form>

                            <div className="auth_signup_link">
                              <p>Already have an account ?</p>
                              <span
                                className="ms-2 signup-text"
                                onClick={() => {
                                  signUpFormRef.current?.reset();
                                  setSelectedProvider(null);
                                  setPageType("SignIn");
                                  setOtpSent(false);
                                }}
                              >
                                Sign in
                              </span>
                            </div>
                          </div>
                        </>
                      )} */}

                      {otpSent ? (
                        <>
                          <div className="login_title">
                            <img
                              src={WebsiteLogo}
                              alt="IGC"
                              style={{
                                height: "80px",
                              }}
                            />
                            <h3 className="fw-bold" style={{ color: "#392f6c" }}>
                              Enter OTP
                            </h3>
                            <p>OTP is sent to {email}</p>
                          </div>

                          <div className="login_detail_inr">
                            <form onSubmit={handleOtpSubmit}>
                              <div className="form-group">
                                <InputOtp
                                  name="otp"
                                  integerOnly
                                  length={6}
                                  className="w-100"
                                  value={otp}
                                  onChange={(e) => setOtp(e.value)}
                                />
                              </div>

                              <div className="auth_login_btn">
                                <Button
                                  className="login_btn"
                                  loading={loading}
                                  disabled={!otp || otp.length < 6}
                                >
                                  Verify OTP
                                  <i className="pi pi-check ms-2" />
                                </Button>
                              </div>
                            </form>
                          </div>
                        </>
                      ) : pageType === "SignIn" ? (
                        <>
                          <div className="login_title">
                            <img
                              src={WebsiteLogo}
                              alt="IGC"
                              style={{
                                height: "80px",
                              }}
                            />
                            <h3 className="fw-bold" style={{ color: "#392f6c" }}>
                              IGamingCompass
                            </h3>
                            <p>Your partner in gaming insights !</p>
                            <br /><br /><br />
                            <h4 className="fw-bold" style={{ color: "#392f6c" }}>
                              Sign in
                            </h4>
                          </div>

                          <div className="login_detail_inr">
                            <form onSubmit={handleEmailSubmit}>
                              <div className="form-group">
                                <IconField iconPosition="left">
                                  <InputIcon className="pi pi-envelope"></InputIcon>
                                  <InputText
                                    name="user_email"
                                    type="email"
                                    keyfilter="email"
                                    required
                                    placeholder="Email"
                                    className="w-100"
                                  />
                                </IconField>
                              </div>

                              <div className="auth_login_btn">
                                <Button className="login_btn" loading={loading}>
                                  Send OTP
                                  <i className="pi pi-send ms-2" />
                                </Button>
                              </div>
                            </form>

                            <div className="auth_signup_link">
                              <p>Don't have an account ?</p>
                              <span
                                className="ms-2 signup-text"
                                onClick={() => setPageType("SignUp")}
                              >
                                Sign up
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="login_title">
                            <img
                              src={WebsiteLogo}
                              alt="IGC"
                              style={{
                                height: "80px",
                              }}
                            />
                            <h3 className="fw-bold" style={{ color: "#392f6c" }}>
                              IGamingCompass
                            </h3>
                            <p>Your partner in gaming insights !</p>
                            <br /><br /><br />
                            <h4 className="fw-bold mb-0" style={{ color: "#392f6c" }}>
                              Sign Up
                            </h4>
                            <p style={{fontSize: "14px"}}>*Use your professional email</p>
                          </div>

                          <div className="login_detail_inr">
                            <form
                              ref={signUpFormRef}
                              onSubmit={handleSignUpSubmit}
                            >
                              <div className="form-group">
                                <IconField iconPosition="left">
                                  <InputIcon className="pi pi-envelope"></InputIcon>
                                  <InputText
                                    name="user_email"
                                    type="email"
                                    keyfilter="email"
                                    required
                                    placeholder="Email"
                                    className="w-100"
                                  />
                                </IconField>
                              </div>

                              <div className="form-group">
                                <Dropdown
                                  name="provider"
                                  optionLabel="label"
                                  optionValue="value"
                                  filter
                                  placeholder="Select Provider"
                                  loading={providerLoading}
                                  value={selectedProvider}
                                  onChange={(e) => {
                                    setSelectedProvider(e.value);
                                  }}
                                  options={providerData}
                                  className="w-100"
                                />
                              </div>

                              <div className="auth_login_btn">
                                <Button
                                  className="login_btn"
                                  loading={loading}
                                  disabled={!selectedProvider}
                                >
                                  Send OTP
                                  <i className="pi pi-send ms-2" />
                                </Button>
                              </div>
                            </form>

                            <div className="auth_signup_link">
                              <p>Already have an account ?</p>
                              <span
                                className="ms-2 signup-text"
                                onClick={() => {
                                  signUpFormRef.current?.reset();
                                  setSelectedProvider(null);
                                  setPageType("SignIn");
                                  setOtpSent(false);
                                }}
                              >
                                Sign in
                              </span>
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
        </div>
      </div>
    </>
  );
};

export default Login;
