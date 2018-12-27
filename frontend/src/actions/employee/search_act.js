import axios from "axios";
import { SEARCH_EMPLOYEE } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const searchEmployee = ( param1, param2, param3, param4, param5 ) => dispatch => {
  let options = {
    url: `${apiconfig.host}/employee/${param1}/${param2}/${param3}/${param4}/${param5}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: SEARCH_EMPLOYEE,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: SEARCH_EMPLOYEE,
        payload: null
      });
    });
};

