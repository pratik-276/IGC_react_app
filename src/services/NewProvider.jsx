import Call from "./Call";

const new_provider_l1 = async (data = {}) => {
    let d = await Call({
        path: "new_provider_l1",
        method: "post",
        data,
    });
    return d;
};
const new_provider_l2 = async (data = {}) => {
    let d = await Call({
        path: "new_provider_l2",
        method: "post",
        data,
    });
    return d;
};
const new_provider_l3 = async (data = {}) => {
    let d = await Call({
        path: "new_provider_l3",
        method: "post",
        data,
    });
    return d;
};


const exportObject = {
    new_provider_l1,
    new_provider_l2,
    new_provider_l3
};

export default exportObject;