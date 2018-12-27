import axios from "axios";
import { GET_PRODUCT, DEL_PRODUCT,CREATE_PRODUCT, UPDATE_PRODUCT, SEARCH_PRODUCT } from "./types"; //, CREATE_MENU, DELETE_MENU
import ApiConfig from "../configs/api.config.json";

let token = localStorage.getItem(ApiConfig.LS.TOKEN);

export const getAllProduct = () => dispatch => {
  let options = {
    url: ApiConfig.BASE_URL + ApiConfig.ENDPOINTS.PRODUCT,
    method: "get",
    headers: {
      Authorization: token
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
    url: ApiConfig.BASE_URL + ApiConfig.ENDPOINTS.PRODUCT + "/" + param,
    method: "delete",
    headers: {
      Authorization: token
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
        payload: null
        // type: GET_ERRORS,
        // payload: err.response.data
      })
    );
};

export const createProduct = body => dispatch => {
  let token = localStorage.getItem(ApiConfig.LS.TOKEN);
  let option = {
    url: ApiConfig.BASE_URL + ApiConfig.ENDPOINTS.PRODUCT,
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
        type: CREATE_PRODUCT,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_PRODUCT,
        payload: null
      });
    });
};

export const updateProduct = (theData)=>dispatch=>{
  let token = localStorage.getItem(ApiConfig.LS.TOKEN);
  let option = {
    url: ApiConfig.BASE_URL + ApiConfig.ENDPOINTS.PRODUCT + "/" + theData.code,
    method: "put",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    data: theData
  };
  axios(option)
    .then(res => {
          dispatch({
              type : UPDATE_PRODUCT,
              payload :  theData,
              //status: res.data.code
          })
    })
    .catch(error => {
        dispatch({
            type : UPDATE_PRODUCT,
            payload : null
        })
    });
};

export const searchProduct = ( param1, param2, param3, param4, param5 ) => dispatch => {
  let token = localStorage.getItem(ApiConfig.LS.TOKEN)
  let options = {
    url: ApiConfig.BASE_URL + ApiConfig.ENDPOINTS.PRODUCT + "/" + param1 + "/" + param2 + "/" + param3 + "/" + param4 + "/" + param5,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      console.log(res)
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
