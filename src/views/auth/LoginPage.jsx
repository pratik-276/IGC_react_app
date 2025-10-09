import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import UserLogin from "../../services/Login";
import "./Auth.css";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        setLoading(true);

        UserLogin.LoginNew(formData)
            .then((res) => {
                if (res?.success) {
                    toast.success(res.message);
                    navigate(`/verify-otp?email=${formData.user_email}&flow=login`);
                }
            })
            .catch((err) => {
                toast.error(err, { duration: 10000 });
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthLayout>
            <h4 className="fw-bold pt-5" style={{ color: "#392f6c" }}>Sign In</h4>
            <div className="login_detail_inr">
                <form onSubmit={handleEmailSubmit}>
                    <div className="form-group">
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-envelope" />
                            <InputText name="user_email" type="email" required placeholder="Email" className="w-100" />
                        </IconField>
                    </div>

                    <div className="auth_login_btn">
                        <Button className="login_btn" loading={loading}>Send OTP<i className="pi pi-send ms-2" /></Button>
                    </div>
                </form>

                <div className="auth_signup_link">
                    <p>Don't have an account?</p>
                    <a href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ01Qc5mw4Gi3RaAfIAlxSmva4AYs35e3TPliUz2FbQx-gADjngNTYM5GPmAWD6_6FRQUwp-V7He" _target='blank' className="ms-2 signup-text">Book a Demo</a>
                </div>
            </div>

        </AuthLayout>
    );
};

export default LoginPage;
