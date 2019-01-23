import axios from "axios";
import { GET_ROLE, DEL_ROLE, ADD_ROLE, PUT_ROLE } from "./types"; //, CREATE_ROLE, DELETE_ROLE
import HostConfig from "../config/Host_Config";
let token = localStorage.token;

export const getAllRoles = (mode = "role") => dispatch => {
  if (mode === "role") {
    let options = {
      url: `${HostConfig}/role`,
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
  } else {
    let options = {
      url: `${HostConfig}/theAccess`,
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
  }
};
export const getnoAccess = () => dispatch => {
  let options = {
    url: `${HostConfig}/noAccess`,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: "GET_NO_ACCESS",
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "GET_NO_ACCESS",
        payload: error
      });
    });
};
export const deleteRole = (param, modalStatus) => dispatch => {
  let options = {
    url: `${HostConfig}/role/${param}`,
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
      modalStatus(
        1,
        `Data deleted!, Data role with code ${param} has been deleted!`
      );
    })
    .catch(error => {
      dispatch({
        type: DEL_ROLE,
        payload: null
      });
      modalStatus(
        2,
        `Invalid!, Data role with code  ${param} is used in other account!`
      );
    });
};

export const createRole = (body, modalCallback) => dispatch => {
  let option = {
    url: `${HostConfig}/role`,
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
      modalCallback(
        1,
        `Data Saved! New role with code RO-${response.data.message +
          1} has been added!`
      );
    })
    .catch(error => {
      dispatch({
        type: ADD_ROLE,
        payload: null,
        status: error.message
      });
      modalCallback(2, `Something Wrong, data not saved!. message: ${error}`);
    });
};

export const putRole = (body, modalStatus) => dispatch => {
  let option = {
    url: `${HostConfig}/role/${body.code}`,
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
      modalStatus(
        1,
        `Data Updated!, data with code ${body.code} has been updated!`
      );
    })
    .catch(error => {
      dispatch({
        type: PUT_ROLE,
        payload: null
      });
      modalStatus(2, `Something error, data not saved!. message: ${error}`);
    });
};
