import axios from "axios";
import { DELETE_EMPLOYEE } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const deleteEmployee = (param) => dispatch => {
  let options = {
    url: `${apiconfig.host}/employee/${param}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    },
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DELETE_EMPLOYEE,
        payload: param,
        status: res.data.code,
      });
    })
    .catch(error => {
      dispatch({
        type: DELETE_EMPLOYEE,
        status: 403
      });
    });
};