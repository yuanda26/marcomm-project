import axios from "axios";
import { GET_EMPLOYEE } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const getEmployee = () => dispatch => {
  let options = {
    url: `${apiconfig.host}/employee`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      // dikirim ke store dan akan diolah oleh reducer
      // dispatch property kedua (payload), dia yang menampung data
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: GET_EMPLOYEE,
        payload: null
      });
    });
};

