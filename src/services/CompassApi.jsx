import Call from "./Call";

const compass_read = async (data) => {
    let d = await Call({
        path: "fetch",
        method: "post",
        data,
    });
    return d;
};

const compass_create = async (data) => {
    let d = await Call({
        path: "games_combination",
        method: "post",
        data,
    });
    return d;
};

const compass_delete = async (data) => {
    let d = await Call({
        path: "delete_compass",
        method: "post",
        data,
    });
    return d;
};

const exportObject = {
    compass_read,
    compass_create,
    compass_delete,
};

export default exportObject;
