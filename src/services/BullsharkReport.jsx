import Call from "./Call";

const get_all_markets = async () => {
    let d = await Call({
        path: "get_all_markets",
        method: "get",
    });
    return d;
};

const post_country_by_region = async (data) => {
    let d = await Call({
        path: "post_country_by_region",
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

const get_provider = async () => {
    let d = await Call({
        path: "get_provider",
        method: "get",
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
    get_all_markets,
    post_country_by_region,
    post_operator_by_geography_lists,
    get_provider,
    get_competitor_data,
};

export default exportObject;