import axios from "axios";
import {
  GET_SOUVENIRS,
  GET_UNITS,
  ADD_SOUVENIR,
  UPDATE_SOUVENIR,
  DELETE_SOUVENIR,
  CLEAR_SOUVENIR_ALERT,
  ERRORS
} from "./types";
// Import Config
import HostConfig from "../config/Host_Config";
import ApiConfig from "../config/Api_Config";

// Get All Units
export const getUnits = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.unit}`,
    method: "get",
    headers: {
      authorization: localStorage.token
    }
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
        payload: err
      })
    );
};

// Get All Souvenirs
export const getAllSouvenir = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.souvenir}`,
    method: "get",
    headers: {
      authorization: localStorage.token
    }
  })
    .then(res =>
      dispatch({
        type: GET_SOUVENIRS,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err
      })
    );
};

// Add New Master Souvenir
export const createSouvenir = souvenirData => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.souvenir}`,
    method: "post",
    headers: {
      authorization: localStorage.token
    },
    data: souvenirData
  })
    .then(res =>
      dispatch({
        type: ADD_SOUVENIR,
        payload: res.data.message,
        code: res.data.code
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Update Master Souvenir
export const updateSouvenir = (souvenirCode, souvenirUpdate) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.souvenir}/${souvenirCode}`,
    method: "put",
    headers: {
      authorization: localStorage.token
    },
    data: souvenirUpdate
  })
    .then(res =>
      dispatch({
        type: UPDATE_SOUVENIR,
        payload: res.data.message,
        code: res.data.code,
        souvenirCode
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err
      })
    );
};

// Delete Master Souvenir
export const deleteSouvenir = (code, deleteData) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.souvenir}/${code}`,
    method: "delete",
    headers: {
      authorization: localStorage.token
    },
    data: { deleteData }
  })
    .then(res => {
      dispatch({
        type: DELETE_SOUVENIR,
        payload: code,
        code: res.data.code,
        message: res.data.message
      });
    })
    .catch(err => {
      dispatch({
        type: ERRORS,
        payload: err
      });
    });
};

// Clear Souvenir Status & Messages
export const clearAlert = () => dispatch => {
  dispatch({
    type: CLEAR_SOUVENIR_ALERT
  });
};
