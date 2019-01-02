import axios from "axios";
import { GET_ROLE, DEL_ROLE, ADD_ROLE, PUT_ROLE } from "./types"; //, CREATE_ROLE, DELETE_ROLE
import apiConfig from "../config/Host_Config";
let token = localStorage.token;

export const getAllRoles = () => dispatch => {
  let options = {
    url: `${apiConfig.host}/role`,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_ROLE,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_ROLE,
        payload: error
      });
    });
};

export const delRole = param => dispatch => {
  let options = {
    url: `${apiConfig.host}/role/${param}`,
    method: "delete",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DEL_ROLE,
        payload: param,
        status: res.data.code
      });
    })
    .catch(error =>
      dispatch({
        type: DEL_ROLE,
        payload: null
        // type: GET_ERRORS,
        // payload: err.response.data
      })
    );
};

export const createRole = body => dispatch => {
  let token = localStorage.token;
  let option = {
    url: `${apiConfig.host}/role`,
    method: "post",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    data: body
  };
  axios(option)
    .then(response => {
      dispatch({
        type: ADD_ROLE,
        payload: body,
        status: response.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: ADD_ROLE,
        payload: null,
        status: error.message
      });
    });
  // let token = localStorage.getItem(apiConfig.LS.TOKEN);
  // let option = {
  //   url: apiConfig.BASE_URL + apiConfig.ENDPOINTS.ROLE,
  //   method: "post",
  //   headers: {
  //     Authorization: token,
  //     "Content-Type": "application/json"
  //   },
  //   data: body
  // };
  // axios(option)
  //   .then(res => {
  //     dispatch({
  //       type: ADD_ROLE,
  //       payload: body,
  //       status: res.data.code
  //     });
  //   })
  //   .catch(error => {
  //     dispatch({
  //       type: ADD_ROLE,
  //       payload: null
  //     });
  //   });
};

export const putRole = body => dispatch => {
  let token = localStorage.token;
  let option = {
    url: `${apiConfig.host}/role/${body.code}`,
    method: "put",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    data: body
  };
  axios(option)
    .then(res => {
      dispatch({
        type: PUT_ROLE,
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: PUT_ROLE,
        payload: null
      });
    });
};
