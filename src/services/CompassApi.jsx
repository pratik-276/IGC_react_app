import Call from "./Call";

const compass_read = async (data) => {
    let d = await Call({
        path: "compass_read",
        method: "post",
        data,
    });
    return d;
};

const compass_create = async (data) => {
    let d = await Call({
        path: "casino_games_combination",
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

const get_operator = async () => {
    let d = await Call({
        path: "get_operator",
        method: "GET",
    });
    return d;
};

const get_game = async () => {
    let d = await Call({
        path: "get_game",
        method: "GET",
    });
    return d;
};

const exportObject = {
    compass_read,
    compass_create,
    compass_delete,
    get_operator,
    get_game
};

export default exportObject;
