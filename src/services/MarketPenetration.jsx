import Call from "./Call";

const market_penetration_provider_countries = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_provider_countries",
        method: "post",
        data,
    });
    return d;
};

const market_penetration_provider_casinos = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_provider_operators",
        method: "post",
        data,
    });
    return d;
};

const market_penetration_provider_licenses = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_provider_licenses",
        method: "post",
        data,
    });
    return d;
};

const market_penetration_provider_summary = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_provider_summary",
        method: "post",
        data,
    });
    return d;
};

const market_penetration_provider_data = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_provider_data",
        method: "post",
        data,
    });
    return d;
};

const market_penetration_provider_operator_details = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_provider_operator_details",
        method: "post",
        data,
    });
    return d;
};

const market_penetration_operator_data = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_operator_data",
        method: "post",
        data,
    });
    return d;
};

const market_penetration_operator_provider_details = async (data = {}) => {
    let d = await Call({
        path: "market_penetration_operator_provider_details",
        method: "post",
        data,
    });
    return d;
};



const exportObject = {
    market_penetration_provider_countries,
    market_penetration_provider_casinos,
    market_penetration_provider_licenses,
    market_penetration_provider_summary,
    market_penetration_provider_data,
    market_penetration_provider_operator_details,
    market_penetration_operator_data,
    market_penetration_operator_provider_details
};

export default exportObject;