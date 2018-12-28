import axios from "axios";
import { CREATE_EVENT } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const createEvent = (body) => dispatch => {
  let options = {
    url: `${apiconfig.host}/tevent`,
    method: "post",
    headers: {
      Authorization: localStorage.token
    },
    data : body,
  };
  axios(options)
    .then(res => {
      dispatch({
        type: CREATE_EVENT,
        idCreated:res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_EVENT,
        status: error
      });
    });
};