import Call from "./Call"

const compass_read
    = async (data) => {
        let d = await Call({
            path: "fetch",
            method: "post",
            data,
        });
        return d;
    };

;

const exportObject = {
    compass_read
    ,
};

export default exportObject;