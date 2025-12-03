import Call from "./Call";

const get_all_markets = async () => {
    let d = await Call({
        path: "get_all_markets",
        method: "get",
    });
    return d;
};

const get_country_for_multiple_market = async (data) => {
    let d = await Call({
        path: "get_country_for_multiple_market",
        method: "post",
        data,
    });
    return d;
};

const get_operator_for_multiple_country = async (data) => {
    let d = await Call({
        path: "get_operator_for_multiple_country",
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
    get_country_for_multiple_market,
    get_operator_for_multiple_country,
    get_provider,
    get_competitor_data,
};

export default exportObject;