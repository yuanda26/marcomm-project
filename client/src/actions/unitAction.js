import axios from "axios";
import {
  GET_UNITS,
  CREATE_UNIT,
  UPDATE_UNIT,
  DELETE_UNIT,
  CLEAR_UNIT_ALERT,
  ERRORS
} from "./types";
// Config Files
import HostConfig from "../config/Host_Config";
import ApiConfig from "../config/Api_Config";

// Get All Units
export const getUnits = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.unit}`,
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
    url: `${HostConfig}/${ApiConfig.unit}`,
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
        data: res.data.message.code
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
export const updateUnit = (unitCode, data) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.unit}/${unitCode}`,
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
        unitCode
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
export const deleteUnit = unitCode => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.unit}/${unitCode}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    }
  })
    .then(res => {
      dispatch({
        type: DELETE_UNIT,
        payload: unitCode
      });
    })
    .catch(error =>
      dispatch({
        type: ERRORS,
        payload: error.response.data
      })
    );
};

// Clear Unit Status & Messages
export const clearAlert = () => dispatch => {
  dispatch({
    type: CLEAR_UNIT_ALERT
  });
};
