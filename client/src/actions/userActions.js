import axios from "axios";
import apiConfig from "../config/Host_Config";

let token = localStorage.token;

export const getAllUser = () => dispatch => {
  let options = {
    url: `${apiConfig.host}/user`,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: "GET_USER",
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "GET_USER",
        payload: null,
        status: error
      });
    });
};

export const delUser = param => dispatch => {
  let options = {
    url: `${apiConfig.host}/user/${param}`,
    method: "delete",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: "DEL_USER",
        payload: param,
        status: res.data.code
      });
    })
    .catch(error =>
      dispatch({
        type: "DEL_USER",
        payload: null,
        status: error
      })
    );
};

export const createUser = body => dispatch => {
  let option = {
    url: `${apiConfig.host}/user`,
    method: "post",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    data: body
  };
  axios(option)
    .then(res => {
      dispatch({
        type: "ADD_USER",
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "ADD_USER",
        payload: null,
        status: error
      });
    });
};

export const putUser = body => dispatch => {
  let option = {
    url: `${apiConfig.host}/user/${body._id}`,
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
        type: "PUT_USER",
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "PUT_USER",
        payload: null,
        status: error
      });
    });
};
export const getUserEmployee = () => dispatch => {
  let options = {
    url: `${apiConfig.host}/useremployee`,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: "GET_USEREMPLOYEE",
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "GET_USEREMPLOYEE",
        payload: null,
        status: error
      });
    });
};

export const getStaff = () => dispatch => {
  let options = {
    url: `${apiConfig.host}/userstaff`,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: "GET_USERSTAFF",
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "GET_USERSTAFF",
        payload: null,
        status: error
      });
    });
};
