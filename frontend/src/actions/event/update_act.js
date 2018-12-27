import axios from "axios";
import { UPDATE_EVENT } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const updateEvent = (param, body) => dispatch => {
  let options = {
    url: `${apiconfig.host}/tevent/${param}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data : body,
  };
  axios(options)
    .then(res => {
      dispatch({
        type: UPDATE_EVENT,
        status: res.data.code,
        idUpdated:res.data.message,
      });
    })
    .catch(error => {
      dispatch({
        type: UPDATE_EVENT,
        status: error
      });
    });
};