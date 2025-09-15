import WebsiteLogo from "../../assets/images/logos/logo.ico";
import "./Auth.css";

const AuthLayout = ({ children }) => {
    return (
        <div className="auth_wrapper">
            <div className="auth_main">
                <div className="auth_inr">
                    <div className="auth_left row justify-content-center align-items-center h-100" style={{ width: "100.9%" }}>
                        <div className="auth_right">
                            <div className="login_main">
                                <div className="row justify-content-center align-items-center h-100">
                                    <div className="col-10 col-sm-10 col-md-10">
                                        <div className="login_detail">
                                            <div className="login_title">
                                                <a href="https://www.igamingcompass.com" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                                                    <img src={WebsiteLogo} alt="IGC" style={{ height: "80px" }} />
                                                    <h3 className="fw-bold" style={{ color: "#392f6c" }}>IGamingCompass</h3>
                                                    <p>Your partner in gaming insights!</p>
                                                </a>
                                            </div>
                                            {children}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="auth_footer text-center">
                <p>
                    By continuing, you agree to our{" "}
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>.
                </p>
            </footer>
        </div>
    );
};

export default AuthLayout;
