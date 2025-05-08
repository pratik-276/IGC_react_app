import Call from "./Call";

const get_geography_lists = async () => {
    let d = await Call({
        path: "get_geography_lists",
        method: "get",
    });
    return d;
};

const post_provider_by_geography_lists = async (data) => {
    let d = await Call({
        path: "post_provider_by_geography_lists",
        method: "post",
        data,
    });
    return d;
};

const post_provider_marketshare_details = async (data) => {
    let d = await Call({
        path: "post_provider_marketshare_details",
        method: "post",
        data,
    });
    return d;
};

const post_provider_top_games = async (data) => {
    let d = await Call({
        path: "post_provider_top_games",
        method: "post",
        data,
    });
    return d;
};

const post_provider_latest_relese = async (data) => {
    let d = await Call({
        path: "post_provider_latest_relese",
        method: "post",
        data,
    });
    return d;
};

const post_provider_top_casinos = async (data) => {
    let d = await Call({
        path: "post_provider_top_casinos",
        method: "post",
        data,
    });
    return d;
};


const exportObject = {
    post_provider_by_geography_lists,
    get_geography_lists,
    post_provider_marketshare_details,
    post_provider_top_games,
    post_provider_latest_relese,
    post_provider_top_casinos,
};

export default exportObject;