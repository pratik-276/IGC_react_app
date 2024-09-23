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

const exportObject = {
    login,
    SignUp,
    verify
};

export default exportObject;