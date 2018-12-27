import axios from "axios";
import { GET_ID_EMPLOYEE } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const getEmployeeId = (param) => dispatch => {
  let options = {
    url: `${apiconfig.host}/employee/${param}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_ID_EMPLOYEE,
        payload: res.data.message[0]
      });
    })
    .catch(error => {
      dispatch({
        type: GET_ID_EMPLOYEE,
        payload: null
      });
    });
};

