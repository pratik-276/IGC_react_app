import Call from "./Call";

const Profile = async (data) => {
    let d = await Call({
        path: "get_profile",
        method: "POST",
        data
    });
    return d;
};

const exportObject = {
    Profile
};

export default exportObject;