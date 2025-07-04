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
    path: "tracker_dashboard_details_2",
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

const provider_summary = async (data) => {
  let d = await Call({
    path: "provider_dashboard_summary",
    method: "post",
    data,
  });
  return d;
};

const mail_sales_team = async (data) => {
  let d = await Call({
    path: "mail_sales_team",
    method: "post",
    data,
  });
  return d; 
}

const provider_latest_details = async (data) => {
  let d = await Call({
    path: "provider_dashboard_details",
    method: "post",
    data,
  });
  return d;
};

const provider_dashboard_mapper = async (data) => {
  let d = await Call({
    path: "get_dashboard_links",
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
  provider_summary,
  provider_latest_details,
  provider_dashboard_mapper,
  mail_sales_team
};

export default exportObject;
