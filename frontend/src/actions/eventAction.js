import axios from "axios";
import {
  GET_EVENT,
  GET_ID_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  SEARCH_EVENT
} from "./types";
import ApiConfig from "../config/Host_Config";

// Get All EVENT
export const getAllEvent = () => dispatch => {
  axios({
    url: `${ApiConfig.host}/event`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  })
    .then(res =>
      dispatch({
        type: GET_EVENT,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EVENT,
        payload: err
      })
    );
};

// Get Single Emloye
export const getEventId = (param) => dispatch => {
  let options = {
    url: `${ApiConfig.host}/event/${param}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_ID_EVENT,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: GET_ID_EVENT,
        payload: null
      });
    });
};

// Add New EVENT
export const createEvent = (body, companyName) => dispatch => {
  let options = {
    url: `${ApiConfig.host}/event`,
    method: "post",
    headers: {
      Authorization: localStorage.token
    },
    data : body,
  };
  axios(options)
    .then(res => {
      dispatch({
        type: CREATE_EVENT,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_EVENT,
        status: "Over Capasity, Try Again Next Day Ok!"
      });
    });
};


// Update EVENT
export const updateEvent = (param, body) => dispatch => {
  let options = {
    url: `${ApiConfig.host}/event/${param}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data : body,
  };
  axios(options)
    .then(res => {
      dispatch({
        type: UPDATE_EVENT,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: UPDATE_EVENT,
        payload: error,
        status: 403
      });
    });
};

// Search EVENT
export const searchEvent = ( param1, param2, param3, param4, param5, param6 ) => dispatch => {
  let options = {
    url: `${ApiConfig.host}/event/${param1}/${param2}/${param3}/${param4}/${param5}/${param6}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: SEARCH_EVENT,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: SEARCH_EVENT,
        payload: null
      });
    });
};