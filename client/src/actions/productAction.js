import axios from "axios";
import {
  GET_PRODUCT, 
  DEL_PRODUCT,
  CREATE_PRODUCT, 
  UPDATE_PRODUCT, 
  SEARCH_PRODUCT,
  ERASE_STATUS 
  } from "./types"; //, CREATE_MENU, DELETE_MENU
import HostConfig from "../config/Host_Config";
import ApiConfig from "../config/Api_Config";

export const getAllProduct = () => dispatch => {
  let options = {
    url: `${HostConfig}/${ApiConfig.product}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_PRODUCT,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_PRODUCT,
        payload: null
      });
    });
};

export const delProduct = param => dispatch => {
  let options = {
    url: `${HostConfig}/${ApiConfig.product}/${param}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DEL_PRODUCT,
        payload: param,
        status: res.data.code
      });
    })
    .catch(error =>
      dispatch({
        type: DEL_PRODUCT,
        payload: null,
        status: 403
        // payload: err.response.data
      })
    );
};

export const createProduct = body => dispatch => {
  let option = {
    url: `${HostConfig}/${ApiConfig.product}`,
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
        type: CREATE_PRODUCT,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_PRODUCT,
        payload: null,
        status: 403
      });
    });
};

export const updateProduct = (theData)=>dispatch=>{
  let option = {
    url: `${HostConfig}/${ApiConfig.product}/${theData.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: theData
  };
  axios(option)
    .then(res => {
          dispatch({
            type : UPDATE_PRODUCT,
            payload :  theData,
            status: res.data.code
          })
    })
    .catch(error => {
        dispatch({
          type : UPDATE_PRODUCT,
          payload : null,
          status: 403
        })
    });
};

export const searchProduct = ( param1, param2, param3, param4, param5 ) => dispatch => {
  let options = {
    url: `${HostConfig}/${ApiConfig.product}/${param1}/${param2}/${param3}/${param4}/${param5}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: SEARCH_PRODUCT,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: SEARCH_PRODUCT,
        payload: null
      });
    });
};

export const eraseStatus = () => dispatch => {
  dispatch({
    type: ERASE_STATUS,
    payload: null
  });
};