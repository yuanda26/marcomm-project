import axios from "axios";
import HostConfig from "../config/Host_Config";
const token = localStorage.token;

export const createAccessMenu = body => dispatch => {
  let option = {
    url: `${HostConfig}/access/${body.m_role_id}`,
    method: "put",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    data: body.m_menu_id
  };
  axios(option)
    .then(response => {
      dispatch({
        type: "PUT_ACCESS",
        status: response.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "PUT_ACCESS",
        status: error
      });
    });
};
export const getListAccess = role => dispatch => {
  let option = {
    url: `${HostConfig}/access/${role}`,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(option)
    .then(response => {
      dispatch({
        type: "GET_ACCESS",
        payload: response.data.message.map(content => {
          return content.controller;
        }),
        status: response.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "GET_ACCESS",
        payload: null,
        status: error
      });
    });
};
