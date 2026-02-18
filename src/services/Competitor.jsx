import Call from "./Call";

const get_operator_sites_list = async (data) => {
    let d = await Call({
        path: "get_operator_sites_list",
        method: "post",
        data,
    });
    return d;
};

const post_operator_by_geography_lists = async (data) => {
    let d = await Call({
        path: "post_operator_by_geography_lists",
        method: "post",
        data,
    });
    return d;
};

const get_games_by_site = async (data) => {
    let d = await Call({
        path: "get_games_by_site",
        method: "post",
        data,
    });
    return d;
};

const get_providers_by_site = async (data) => {
    let d = await Call({
        path: "get_providers_by_site",
        method: "post",
        data,
    });
    return d;
};

const get_casino_data = async (data) => {
    let d = await Call({
        path: "get_casino_data",
        method: "post",
        data,
    });
    return d;
};

const get_casino_data_2 = async (data) => {
    let d = await Call({
        path: "get_casino_data_2",
        method: "post",
        data,
    });
    return d;
};

const get_casino_dates = async (data) => {
    let d = await Call({
        path: "get_casino_dates",
        method: "post",
        data,
    });
    return d;
};

const exportObject = {
    get_operator_sites_list,
    post_operator_by_geography_lists,
    get_games_by_site,
    get_providers_by_site,
    get_casino_data,
    get_casino_data_2,
    get_casino_dates,
};

export default exportObject;
