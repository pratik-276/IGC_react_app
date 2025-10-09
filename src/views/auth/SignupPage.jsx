import { useState, useEffect, useRef } from "react";
import AuthLayout from "./AuthLayout";
import CompassData from "../../services/CompassApi";
import UserLogin from "../../services/Login";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const SignupPage = () => {
    const [providerData, setProviderData] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [loading, setLoading] = useState(false);
    const [providerLoading, setProviderLoading] = useState(true);

    const navigate = useNavigate();
    const formRef = useRef(null);

    useEffect(() => {
        CompassData.get_provider()
            .then((res) => {
                if (res?.success && Array.isArray(res.data)) {
                    setProviderData(
                        res.data.map((p) => ({
                            label: p.game_provider_name,
                            value: p.game_provider_name,
                        }))
                    );
                }
            })
            .catch(console.error)
            .finally(() => setProviderLoading(false));
    }, []);

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        setLoading(true);

        UserLogin.SignUpNew(formData)
            .then((res) => {
                if (res?.success) {
                    toast.success(res.message);
                    navigate(`/verify-otp?email=${formData.user_email}&flow=signup`);
                } else if (res?.message === "Only professional email allowed") {
                    toast.error("Only professional email allowed", { duration: 3000 });
                }
            })
            .catch((err) => {
                toast.error(err, { duration: 10000 });
            })
            .finally(() => setLoading(false));
    };

    return (
        <AuthLayout>
            <h4 className="fw-bold pt-5" style={{ color: "#392f6c" }}>Sign Up</h4>
            <div className="login_detail_inr">
                <form onSubmit={handleSignupSubmit} ref={formRef}>
                    <div className="form-group">
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-envelope" />
                            <InputText
                                name="user_email"
                                type="email"
                                required
                                placeholder="Use a professional email"
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
                            onChange={(e) => setSelectedProvider(e.value)}
                            options={providerData}
                            className="w-100"
                        />
                        <p style={{ fontSize: "10px" }}>
                            *required for configuration. Learn more <a href="https://igamingcompass.com/faqs/why-is-selecting-a-provider-required-when-signing-into-the-app/" target="_blank" rel="noreferrer">here</a>
                        </p>
                    </div>

                    <div className="auth_login_btn">
                        <Button className="login_btn" loading={loading} disabled={!selectedProvider}>
                            Send OTP <i className="pi pi-send ms-2" />
                        </Button>
                    </div>
                </form>

                <div className="auth_signup_link">
                    <p>Already have an account ?</p>
                    <a href="/login" className="ms-2 signup-text">Sign in</a>
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;
