import axios from "axios";
import {
  GET_TSOUVENIR,
  CREATE_TSOUVENIR,
  PUT_TSOUVENIR,
  GET_EMPLOYEE,
  GET_TSOUVENIR_ITEM
} from "./types";
import HostConfig from "../config/Host_Config";

export const getAllTsouvenir = () => dispatch => {
  let options = {
    url: `${HostConfig}/tsouvenir`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_TSOUVENIR,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_TSOUVENIR,
        payload: null
      });
    });
};

export const createTsouvenir = body => dispatch => {
  let option = {
    url: `${HostConfig}/tsouvenir`,
    method: "post",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: body
  };
  axios(option)
    .then(res => {
      dispatch({
        type: CREATE_TSOUVENIR,
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_TSOUVENIR,
        payload: null
      });
    });
};

export const updateTsouvenir = newTsouvenir => dispatch => {
  let option = {
    url: `${HostConfig}/tsouvenir/${newTsouvenir.souv.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: newTsouvenir
  };
  axios(option)
    .then(res => {
      dispatch({
        type: PUT_TSOUVENIR,
        payload: newTsouvenir,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: PUT_TSOUVENIR,
        payload: null
      });
    });
};

export const getAllEmployee = () => dispatch => {
  let options = {
    url: `${HostConfig}/employee`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_EMPLOYEE,
        payload: null
      });
    });
};

export const getListTsouvenirItem = () => dispatch => {
  let options = {
    url: `${HostConfig}/tsouveniritemdetil`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_TSOUVENIR_ITEM,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_TSOUVENIR_ITEM,
        payload: null
      });
    });
};
