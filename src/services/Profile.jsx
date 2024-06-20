import Call from "./Call";

const Profile = async (data) => {
    let d = await Call({
        path: "get_profile",
        method: "POST",
        data
    });
    return d;
};

const UpdateProfile = async (data) => {
    let d = await Call({
        path: "update_profile",
        method: "PUT",
        data
    });
    return d;
};

const exportObject = {
    Profile,
    UpdateProfile
};

export default exportObject;