import axios from "axios";
import { GET_COMPANIES } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const getCompanies = () => dispatch => {
  let options = {
    url: `${apiconfig.host}/company`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_COMPANIES,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: GET_COMPANIES,
        payload: null
      });
    });
};

