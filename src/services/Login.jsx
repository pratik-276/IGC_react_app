import Call from "./Call"

const login = async (data) => {
    let d = await Call({
        path: "login",
        method: "post",
        data,
    });
    return d;
};

const SignUp = async (data) => {
    let d = await Call({
        path: "signup",
        method: "post",
        data,
    });
    return d;
};

const verify = async (data) => {
    let d = await Call({
        path: "verify_email",
        method: "post",
        data,
    });
    return d;
};

const SignUpNew = async (data) => {
    let d = await Call({
        path: "signup_new",
        method: "post",
        data,
    });
    return d;
};

const LoginNew = async (data) => {
    let d = await Call({
        path: "login_new",
        method: "post",
        data,
    });
    return d;
};

const OtpVerification = async (data) => {
    let d = await Call({
        path: "otp_verification",
        method: "post",
        data,
    });
    return d;
};

const exportObject = {
    login,
    SignUp,
    verify,
    SignUpNew,
    LoginNew,
    OtpVerification
};

export default exportObject;