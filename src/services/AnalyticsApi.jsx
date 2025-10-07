import Call from "./Call";


const post_region_filters = async (data) => {
  let response = await Call({
    path: "post_region_filters",
    method: "POST",
    data
  });
  return response;
};


const post_country_by_region = async (data) => {
  let response = await Call({
    path: "post_country_by_region",
    method: "POST",
    data
  });
  return response;
};


const post_game_by_country = async (data) => {
  let response = await Call({
    path: "post_game_by_country",
    method: "POST",
    data
  });
  return response;
};


const post_global_coverage_trend = async (data) => {
  let response = await Call({
    path: "post_global_coverage_trend",
    method: "POST",
    data
  });
  return response;
};


const post_provider_casino_covergae_trend = async (data) => {
  let response = await Call({
    path: "post_provider_casino_covergae_trend",
    method: "POST",
    data
  });
  return response;
};


const post_average_position_trend = async (data) => {
  let response = await Call({
    path: "post_average_position_trend",
    method: "POST",
    data
  });
  return response;
};


const post_game_stability_trend = async (data) => {
  let response = await Call({
    path: "post_game_stability_trend",
    method: "POST",
    data
  });
  return response;
};


const post_section_mapping_distribution_trend = async (data) => {
  let response = await Call({
    path: "post_section_mapping_distribution_trend",
    method: "POST",
    data
  });
  return response;
};


const post_casino_table = async (data) => {
  let response = await Call({
    path: "post_casino_table",
    method: "POST",
    data
  });
  return response;
};


const post_kpi_one = async (data) => {
  let response = await Call({
    path: "post_kpi_one",
    method: "POST",
    data
  });
  return response;
};


const post_casino_section_details = async (data) => {
  let response = await Call({
    path: "post_casino_section_details",
    method: "POST",
    data
  });
  return response;
};

const exportObject = {
  post_region_filters,
  post_country_by_region,
  post_game_by_country,
  post_global_coverage_trend,
  post_provider_casino_covergae_trend,
  post_average_position_trend,
  post_game_stability_trend,
  post_section_mapping_distribution_trend,
  post_casino_table,
  post_kpi_one,
  post_casino_section_details,
};

export default exportObject;
