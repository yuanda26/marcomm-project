import axios from "axios";
import { CREATE_EMPLOYEE } from "../types";
import apiconfig from "../../config/Host_Dev.json";

export const createEmployee = (body, companyName) => dispatch => {
  let options = {
    url: `${apiconfig.host}/employee`,
    method: "post",
    headers: {
      Authorization: localStorage.token
    },
    data : body,
  };
  axios(options)
    .then(res => {
      dispatch({
        type: CREATE_EMPLOYEE,
        payload: res.data.message,
        companyName : companyName,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_EMPLOYEE,
        status: "Over Capasity, Try Again Next Day Ok!"
      });
    });
};