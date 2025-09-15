import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { InputOtp } from "primereact/inputotp";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import UserLogin from "../../services/Login";
import "./Auth.css";

const OtpVerification = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const flow = searchParams.get("flow"); // login or signup
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        UserLogin.OtpVerification({ user_email: email, otp })
            .then((res) => {
                if (res?.success) {
                    toast.success(res.message);
                    localStorage.setItem("user_id", res?.data?.user_id);
                    localStorage.setItem("user_company", res?.data?.user_company);
                    localStorage.setItem("access_token", res?.data?.access);
                    localStorage.setItem("refresh_token", res?.data?.refresh);
                    navigate("/");
                }
            })
            .catch((err) => {
                toast.error(err, { duration: 10000 });
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthLayout>
            <h4 className="fw-bold pt-5" style={{ color: "#392f6c" }}>Enter OTP</h4>
            <div className="login_detail_inr">
                <p>OTP is sent to <strong>{email}</strong></p>
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
                        <Button className="login_btn" loading={loading} disabled={!otp || otp.length < 6}>
                            Verify OTP <i className="pi pi-check ms-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default OtpVerification;
