import Call from "./Call";

const get_operator_sites_list = async (data) => {
    let d = await Call({
        path: "get_operator_sites_list",
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

const get_competitor_data = async (data) => {
    let d = await Call({
        path: "get_competitor_data",
        method: "post",
        data,
    });
    return d;
};

const exportObject = {
    get_operator_sites_list,
    get_games_by_site,
    get_providers_by_site,
    get_competitor_data,
};

export default exportObject;
