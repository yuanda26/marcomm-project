import axios from "axios";
import {
  GET_EVENT,
  GET_ID_EVENT,
  CREATE_EVENT,
  UPDATE_EVENT,
  SEARCH_EVENT,
  ERASE_STATUS,
  APPROVE_EVENT,
  REJECT_EVENT,
  CLOSE_EVENT,
  ERRORS
} from "./types";
import HostConfig from "../config/Host_Config";
import ApiConfig from "../config/Api_Config";

// Get All EVENT
export const getAllEvent = (empId, roleId) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.event}/${empId}/${roleId}`,
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
export const getEventId = param => dispatch => {
  let options = {
    url: `${HostConfig}/${ApiConfig.event}/${param}`,
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
export const createEvent = (body, empId, roleId) => dispatch => {
  let options = {
    url: `${HostConfig}/${ApiConfig.event}/${empId}/${roleId}`,
    method: "post",
    headers: {
      Authorization: localStorage.token
    },
    data: body
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
        status: 403
      });
    });
};

// Update EVENT
export const updateEvent = (param, body, empId, roleId) => dispatch => {
  let options = {
    url: `${HostConfig}/${ApiConfig.event}/${param}/${empId}/${roleId}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data: body
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
export const searchEvent = (
  param1,
  param2,
  param3,
  param4,
  param5,
  param6,
  empId,
  roleId
) => dispatch => {
  let options = {
    url: `${HostConfig}/${
      ApiConfig.event
    }/${param1}/${param2}/${param3}/${param4}/${param5}/${param6}/${empId}/${roleId}`,
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

export const eraseStatus = () => dispatch => {
  dispatch({
    type: ERASE_STATUS,
    payload: null
  });
};

// Approve Transaction Event API
export const approveEvent = (eventId, approveData) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.approve_event}/${eventId}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data: approveData
  })
    .then(res => {
      let newPayload = res.data.message.map(row=>{
        if (row.status === "1") {
          row.status = "Submitted";
        } else if (row.status === "2") {
          row.status = "In Progress";
        } else if (row.status === "3") {
          row.status = "Done";
        } else if (row.status === "0") {
          row.status = "Rejected";
        }
        return row
      })
      dispatch({
        type: APPROVE_EVENT,
        payload: newPayload,
        statusCode: res.data.code,
        eventId
      });
    })
    .catch(err => {
      dispatch({
        type: ERRORS,
        payload: err
      });
    });
};

// Reject Transaction Event API
export const rejectEvent = (eventId, rejectData) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.reject_event}/${eventId}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data: rejectData
  })
    .then(res => {
      let newPayload = res.data.message.map(row=>{
        if (row.status === "1") {
          row.status = "Submitted";
        } else if (row.status === "2") {
          row.status = "In Progress";
        } else if (row.status === "3") {
          row.status = "Done";
        } else if (row.status === "0") {
          row.status = "Rejected";
        }
        return row
      })
      dispatch({
        type: REJECT_EVENT,
        payload: newPayload,
        statusCode: res.data.code,
        eventId
      });
    })
    .catch(err => {
      dispatch({
        type: ERRORS,
        payload: err
      });
    });
};

// Close Transaction Event API
export const closeEvent = (eventId, closeData) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.close_event}/${eventId}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data: closeData
  })
    .then(res => {
      let newPayload = res.data.message.map(row=>{
        if (row.status === "1") {
          row.status = "Submitted";
        } else if (row.status === "2") {
          row.status = "In Progress";
        } else if (row.status === "3") {
          row.status = "Done";
        } else if (row.status === "0") {
          row.status = "Rejected";
        }
        return row
      })
      dispatch({
        type: CLOSE_EVENT,
        payload: newPayload,
        statusCode: res.data.code,
        eventId
      });
    })
    .catch(err => {
      dispatch({
        type: ERRORS,
        payload: err
      });
    });
};
