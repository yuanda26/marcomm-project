import axios from "axios";
import {
  GET_PROMOTION,
  DEL_PROMOTION,
  ADD_PROMOTION,
  PUT_PROMOTION,
  GET_EVENT,
  GET_DESIGN,
  ADD_DATA_P
} from "./types"; //, CREATE_PROMOTION, DELETE_PROMOTION

import ApiConfig from "../config/Host_Config"; //localhost:4000/api

const token = localStorage.token;
const ENDPOINTS = {
  PROMOTION: {
    PROMOTION: "/promotion",
    ITEM: "/promotionitem",
    FILE: "/prmotionfile",
    EVENT: "/tevent",
    DESIGN: "/design",
    T_DESIGN_ITEM: "/t_design_item"
  }
};
//<<--------------------------Get API from t_promotion--------------------------->>
export const getAllPromotion = () => dispatch => {
  let options = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_PROMOTION,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_PROMOTION,
        payload: null
      });
    });
};

export const delPromotion = param => dispatch => {
  let options = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION + "/" + param,
    method: "delete",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DEL_PROMOTION,
        payload: param,
        status: res.data.code
      });
    })
    .catch(error =>
      dispatch({
        type: DEL_PROMOTION,
        status: error.response.data.code,
        message: error.response.data.message
      })
    );
};

export const createPromotion = body => dispatch => {
  let option = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION,
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
        type: ADD_PROMOTION,
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: ADD_PROMOTION,
        payload: null
      });
    });
};

export const putPromotion = body => dispatch => {
  let option = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION + "/" + body._id,
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
        type: PUT_PROMOTION,
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: PUT_PROMOTION,
        payload: null
      });
    });
};
//<<-----------------------------End of Get API from t_promotion--------------------->>

//<<-----------------------------Get API from t_event-------------------------------->>
export const getEvent = () => dispatch => {
  let options = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.EVENT,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_EVENT,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_EVENT,
        payload: null
      });
    });
};
//<<------------------------------End of Get API from t_event---------------------->>
//<<-----------------------------Get API from t_design------------------------------->>
export const getDesign = () => dispatch => {
  let options = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.DESIGN,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_DESIGN,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_DESIGN,
        payload: null
      });
    });
};
export const getDesignByCode = data => dispatch => {
  let option = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.DESIGN + "/" + data,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(option)
    .then(res => {
      dispatch({
        type: "GET_ONE_DESIGN",
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(err => {
      dispatch({
        type: "GET_ONE_DESIGN",
        payload: null,
        status: err.code
      });
    });
};
//<<----------------------------End of Get API from t_design------------------------->>
export const addDataP = body => dispatch => {
  dispatch({
    type: ADD_DATA_P,
    payload: body
  });
};
export const getPromotion = id => dispatch => {
  let options = {
    url: ApiConfig.host + ENDPOINTS.PROMOTION.PROMOTION + "/" + id,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: "GET_ONE",
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "GET_ONE",
        payload: null
      });
    });
};
export const getDesignOne = code => dispatch => {
  let options = {
    url: ApiConfig.host + ENDPOINTS.DESIGN + "/" + code,
    method: "get",
    headers: {
      Authorization: token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: "GET_D_ONE",
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: "GET_D_ONE",
        payload: null
      });
    });
};
