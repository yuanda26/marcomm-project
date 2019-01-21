import axios from "axios";
import {
  GET_DESIGNS,
  GET_DESIGN,
  GET_CODE,
  GET_EVENT,
  GET_PRODUCT,
  GET_REQUESTER,
  GET_ASSIGN,
  GET_EMPLOYEE,
  GET_STAFF,
  GET_DESIGN_ITEM,
  ADD_DESIGN_ITEM,
  ADD_DESIGN,
  UPDATE_DESIGN,
  UPDATE_DESIGN_ITEM,
  APPROVE_DESIGN,
  REJECT_DESIGN,
  CLOSE_DESIGN,
  UPLOAD_DESIGN,
  CLEAR_DESIGN_ALERT,
  ERRORS
} from "./types";
import HostConfig from "../config/Host_Config";
import ApiConfig from "../config/Api_Config";

// Get All Designs
export const getAllDesign = (roleId, employeeId) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design}/${roleId}/${employeeId}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_DESIGNS,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get Single Design
export const getDesign = code => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design}/${code}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_DESIGN,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get Design Items
export const getItems = code => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design_item}/${code}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_DESIGN_ITEM,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get Generated Design Code
export const getCode = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design_code}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_CODE,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get Event List
export const getEvent = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.event}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_EVENT,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get Product List
export const getProduct = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.product}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_PRODUCT,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get PIC User that Has Role as "Requester"
export const getRequester = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design_requester}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_REQUESTER,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get Assign To Name
export const getAssignToName = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.employee}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_ASSIGN,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get All Employee
export const getEmployee = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.employee}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: {}
      })
    );
};

// Get User has Staff Role
export const getStaff = () => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design_staff}`,
    method: "get",
    headers: { Authorization: localStorage.token }
  })
    .then(res =>
      dispatch({
        type: GET_STAFF,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: {}
      })
    );
};

// Add New Design Request
export const createDesign = designData => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design}`,
    method: "post",
    headers: { Authorization: localStorage.token },
    data: designData
  })
    .then(res => {
      dispatch({
        type: ADD_DESIGN,
        payload: res.data.message
      });
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Add New Design Item Request
export const createDesignItem = designItemData => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design_item}`,
    method: "post",
    headers: { Authorization: localStorage.token },
    data: { designItemData }
  })
    .then(res => {
      dispatch({
        type: ADD_DESIGN_ITEM,
        payload: res.data.message
      });
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Update Design Request
export const updateDesign = (code, designUpdate) => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design}/${code}`,
    method: "put",
    headers: { Authorization: localStorage.token },
    data: designUpdate
  })
    .then(res =>
      dispatch({
        type: UPDATE_DESIGN,
        payload: res.data.message,
        code: code
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Update Design Request
export const updateDesignItem = designItemUpdate => dispatch => {
  axios({
    url: `${HostConfig}/${ApiConfig.design_item}`,
    method: "put",
    headers: { Authorization: localStorage.token },
    data: { designItemUpdate }
  })
    .then(res => {
      dispatch({
        type: UPDATE_DESIGN_ITEM,
        payload: res.data.message
      });
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Approve Design Request
export const approveDesign = (code, formdata) => dispatch => {
  axios({
    method: "put",
    url: `${HostConfig}/${ApiConfig.design_approve}/${code}`,
    headers: { Authorization: localStorage.token },
    data: formdata
  })
    .then(res => {
      dispatch({
        type: APPROVE_DESIGN,
        payload: res.data.message,
        code: code
      });
    })
    .catch(err => {
      dispatch({
        type: ERRORS,
        payload: err.response.data
      });
    });
};

// Reject Design Request
export const rejectDesign = (code, formdata) => dispatch => {
  axios({
    method: "put",
    url: `${HostConfig}/${ApiConfig.design_reject}/${code}`,
    data: formdata,
    headers: { Authorization: localStorage.token }
  })
    .then(res => {
      dispatch({
        type: REJECT_DESIGN,
        payload: res.data.message,
        code: code
      });
    })
    .catch(err => {
      dispatch({
        type: ERRORS,
        payload: err.response.data
      });
    });
};

// Close Design Request
export const closeDesign = closeData => dispatch => {
  axios({
    method: "post",
    url: `${HostConfig}/${ApiConfig.design_close}`,
    headers: { Authorization: localStorage.token },
    data: closeData
  })
    .then(res =>
      dispatch({
        type: CLOSE_DESIGN,
        payload: res.data.message
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Close Design Request
export const uploadDesign = formdata => dispatch => {
  axios({
    method: "post",
    url: `${HostConfig}/${ApiConfig.design_uploads}`,
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "multipart/form-data"
    },
    data: formdata
  })
    .then(res =>
      dispatch({
        type: UPLOAD_DESIGN
      })
    )
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err
      })
    );
};

// Clear Design Status & Messages
export const clearAlert = () => dispatch => {
  dispatch({
    type: CLEAR_DESIGN_ALERT
  });
};
