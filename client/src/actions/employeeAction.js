import axios from "axios";
import {
  GET_EMPLOYEE,
  GET_ID_EMPLOYEE,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  SEARCH_EMPLOYEE,
  GET_COMPANIES
} from "./types";
import ApiConfig from "../config/Host_Config";

// Get All EMPLOYEE
export const getAllEmployee = () => dispatch => {
  axios({
    url: `${ApiConfig.host}/employee`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  })
    .then(res => {
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data.message
      });
    })
    .catch(err =>
      dispatch({
        type: GET_EMPLOYEE,
        payload: err.response.data
      })
    );
};

// Get Single Emloye
export const getEmployeeId = param => dispatch => {
  let options = {
    url: `${ApiConfig.host}/employee/${param}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_ID_EMPLOYEE,
        payload: res.data.message[0]
      });
    })
    .catch(error => {
      dispatch({
        type: GET_ID_EMPLOYEE,
        payload: null
      });
    });
};

// Add New Employee
export const createEmployee = body => dispatch => {
  let options = {
    url: `${ApiConfig.host}/employee`,
    method: "post",
    headers: {
      Authorization: localStorage.token
    },
    data: body
  };
  axios(options)
    .then(res => {
      dispatch({
        type: CREATE_EMPLOYEE,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_EMPLOYEE,
        status: 403
      });
    });
};

// Update Employee
export const updateEmployee = (param, body) => dispatch => {
  let options = {
    url: `${ApiConfig.host}/employee/${param}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data: body
  };
  axios(options)
    .then(res => {
      dispatch({
        type: UPDATE_EMPLOYEE,
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: UPDATE_EMPLOYEE,
        payload: error,
        status: 403
      });
    });
};

// delete employee
export const deleteEmployee = param => dispatch => {
  let options = {
    url: `${ApiConfig.host}/employee/${param}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DELETE_EMPLOYEE,
        payload: param,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: DELETE_EMPLOYEE,
        status: 403
      });
    });
};

// Search Employee
export const searchEmployee = (
  param1,
  param2,
  param3,
  param4,
  param5
) => dispatch => {
  let options = {
    url: `${
      ApiConfig.host
    }/employee/${param1}/${param2}/${param3}/${param4}/${param5}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: SEARCH_EMPLOYEE,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: SEARCH_EMPLOYEE,
        payload: null
      });
    });
};

// Get All EMPLOYEE
export const getAllCompany = () => dispatch => {
  axios({
    url: `${ApiConfig.host}/company`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  })
    .then(res => {
      dispatch({
        type: GET_COMPANIES,
        payload: res.data.message
      });
    })
    .catch(err =>
      dispatch({
        type: GET_COMPANIES,
        payload: err.response.data
      })
    );
};
