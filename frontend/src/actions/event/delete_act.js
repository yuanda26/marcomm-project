import axios from "axios";
import { DELETE_EVENT } from "../types";
import apiconfig from "../../config/Host_Dev.json";

let token = localStorage.getItem(apiconfig.LS.TOKEN);

export const deleteEvent = (param) => dispatch => {
  let options = {
    url: `${apiconfig.host}/tevent/${param}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    },
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DELETE_EVENT,
        status: res.data.code,
      });
    })
    .catch(error => {
      dispatch({
        type: DELETE_EVENT,
        status: 403
      });
    });
};