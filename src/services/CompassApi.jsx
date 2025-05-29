import Call from "./Call";

const compass_read = async (data) => {
  let d = await Call({
    path: "compass_read",
    method: "post",
    data,
  });
  return d;
};

const compass_create = async (data) => {
  let d = await Call({
    path: "casino_games_combination",
    method: "post",
    data,
  });
  return d;
};

const compass_delete = async (data) => {
  let d = await Call({
    path: "delete_compass",
    method: "post",
    data,
  });
  return d;
};

const get_operator = async () => {
  let d = await Call({
    path: "get_operator",
    method: "GET",
  });
  return d;
};

const get_operator_by_provider = async (data) => {
  let d = await Call({
    path: "get_operator_by_provider",
    method: "POST",
    data
  });
  return d;
};


const get_provider = async () => {
  let d = await Call({
    path: "get_provider",
    method: "GET",
  });
  return d;
};

const get_game = async (currPage, data) => {
  let d = await Call({
    path: `get_game?page=${currPage}`,
    method: "POST",
    data,
  });
  return d;
};

const get_game_by_provider = async (currPage, data) => {
  let d = await Call({
    path: `get_game_by_provider?page=${currPage}`,
    method: "POST",
    data,
  });
  return d;
};

const request_new_casino = async (data) => {
  let d = await Call({
    path: "request_new_casino",
    method: "POST",
    data,
  });
  return d;
};

const exportObject = {
  compass_read,
  compass_create,
  compass_delete,
  get_provider,
  get_operator,
  get_operator_by_provider,
  get_game,
  get_game_by_provider,
  request_new_casino,
};

export default exportObject;
