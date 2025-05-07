import Call from "./Call";

const get_regions = async () => {
    let d = await Call({
        path: "get_regions",
        method: "get",
    });
    return d;
};

const get_games = async (data) => {
    let d = await Call({
        path: "post_game_by_geography_lists",
        method: "post",
        data,
    });
    return d;
};

const get_game_rank_details = async (data) => {
    let d = await Call({
        path: "get_game_rank_details_2",
        method: "post",
        data,
    });
    return d;
};

const get_game_rank_trend = async (data) => {
    let d = await Call({
        path: "get_game_rank_trend",
        method: "post",
        data,
    });
    return d;
};

const get_game_rank_casinos = async (data) => {
    let d = await Call({
        path: "get_game_rank_casinos",
        method: "post",
        data,
    });
    return d;
};


const exportObject = {
    get_regions,
    get_games,
    get_game_rank_details,
    get_game_rank_trend,
    get_game_rank_casinos,
};

export default exportObject;