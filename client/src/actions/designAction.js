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
  CLOSE_DESIGN,
  ERRORS
} from "./types";
import HostConfig from "../config/Host_Config";

// Get All Designs
export const getAllDesign = () => dispatch => {
  axios({
    url: `${HostConfig.host}/design`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
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
    url: `${HostConfig.host}/design/${code}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
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
    url: `${HostConfig.host}/design/item/${code}`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
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
    url: `${HostConfig.host}/design/code`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
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
    url: `${HostConfig.host}/event`,
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
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get Product List
export const getProduct = () => dispatch => {
  axios({
    url: `${HostConfig.host}/product`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
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
    url: `${HostConfig.host}/design/requester`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
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
    url: `${HostConfig.host}/employee`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
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

// Add New Design Request
export const createDesign = (designData, history) => dispatch => {
  axios({
    url: `${HostConfig.host}/design`,
    method: "post",
    headers: {
      Authorization: localStorage.token
    },
    data: designData
  })
    .then(res => {
      dispatch({
        type: ADD_DESIGN,
        payload: res.data.message
      });
      history.push("/design");
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Add New Design Item Request
export const createDesignItem = (designItemData, history) => dispatch => {
  axios({
    url: `${HostConfig.host}/design/item`,
    method: "post",
    headers: {
      Authorization: localStorage.token
    },
    data: { designItemData }
  })
    .then(res => {
      dispatch({
        type: ADD_DESIGN_ITEM
      });
      history.push("/design");
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Update Design Request
export const updateDesign = (code, designUpdate, history) => dispatch => {
  axios({
    url: `${HostConfig.host}/design/${code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data: designUpdate
  })
    .then(res => {
      dispatch({
        type: UPDATE_DESIGN,
        payload: res.data.message,
        code: code
      });
      history.push("/design");
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Update Design Request
export const updateDesignItem = (designItemUpdate, history) => dispatch => {
  axios({
    url: `${HostConfig.host}/design/item`,
    method: "put",
    headers: { Authorization: localStorage.token },
    data: { designItemUpdate }
  })
    .then(res => {
      dispatch({
        type: UPDATE_DESIGN_ITEM,
        payload: res.data.message
      });
      history.push("/design");
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};

// Get User has Staff Role
export const getStaff = () => dispatch => {
  axios({
    url: `${HostConfig.host}/design/staff`,
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

// Get All Employee
export const getEmployee = () => dispatch => {
  axios({
    url: `${HostConfig.host}/employee`,
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

// Close Design Request
export const uploadFiles = formdata => dispatch => {
  axios({
    method: "post",
    url: `${HostConfig.host}/design/upload_files`,
    data: formdata
  })
    .then(res => console.log(res))
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err.response.data
      })
    );
};
