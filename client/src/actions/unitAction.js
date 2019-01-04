import axios from "axios";
import {
  GET_UNITS,
  CREATE_UNIT,
  UPDATE_UNIT,
  DELETE_UNIT,
  ERRORS
} from "./types";
import HostConfig from "../config/Host_Config";

// Get All Units
export const getUnits = () => dispatch => {
  axios({
    url: `${HostConfig.host}/unit`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_UNITS,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: null
      })
    );
};

// Create Unit
export const createUnit = param => dispatch => {
  axios({
    url: `${HostConfig.host}/unit`,
    method: "post",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: param
  })
    .then(res => {
      dispatch({
        type: CREATE_UNIT,
        payload: res.data.message,
        id: res.data.message.code,
        status: 1
      });
    })
    .catch(error =>
      dispatch({
        type: ERRORS,
        payload: error.response.data
      })
    );
};

// Update Unit
export const updateUnit = (unitId, data) => dispatch => {
  axios({
    url: `${HostConfig.host}/unit/${unitId}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: data
  })
    .then(res => {
      dispatch({
        type: UPDATE_UNIT,
        payload: res.data.message,
        unitId: unitId,
        status: 1
      });
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err
      })
    );
};

// Delete Unit
export const deleteUnit = unitId => dispatch => {
  axios({
    url: `${HostConfig.host}/unit/${unitId}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    }
  })
    .then(res => {
      dispatch({
        type: DELETE_UNIT,
        payload: unitId,
        status: 1
      });
    })
    .catch(error =>
      dispatch({
        type: ERRORS,
        payload: error.response.data
      })
    );
};
