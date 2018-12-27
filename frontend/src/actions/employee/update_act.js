import axios from "axios";
import { UPDATE_EMPLOYEE } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const updateEmployee = (param, body, companyName) => dispatch => {
  let options = {
    url: `${apiconfig.host}/employee/${param}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data : body,
  };
  axios(options)
    .then(res => {
      dispatch({
        type: UPDATE_EMPLOYEE,
        companyName: companyName,
        payload: body,
      });
    })
    .catch(error => {
      dispatch({
        type: UPDATE_EMPLOYEE,
        companyName: null,
        status: error
      });
    });
};