import axios from "axios";
import { GET_EVENT } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const getEvent = () => dispatch => {
  let options = {
    url: `${apiconfig.host}/tevent`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_EVENT,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: GET_EVENT,
        payload: null
      });
    });
};

