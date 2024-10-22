import Call from "./Call";

const create_alert = async (data) => {
  let d = await Call({
    path: "alert_create",
    method: "post",
    data,
  });
  return d;
};

const tracker_summary = async (data) => {
  let d = await Call({
    path: "overview_dashboard_summary",
    method: "post",
    data,
  });
  return d;
};

const tracker_detail = async (data) => {
  let d = await Call({
    path: "tracker_dashboard_details",
    method: "post",
    data,
  });
  return d;
};

const tracker_dashboard_filter = async (data) => {
  let d = await Call({
    path: "tracker_dashboard_filter",
    method: "post",
    data,
  });
  return d;
};

const exportObject = {
  create_alert,
  tracker_summary,
  tracker_dashboard_filter,
  tracker_detail,
};

export default exportObject;
