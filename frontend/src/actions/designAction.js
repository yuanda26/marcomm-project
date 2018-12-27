import axios from "axios";
import {
  GET_DESIGNS,
  GET_DESIGN,
  GET_CODE,
  GET_EVENT,
  GET_PRODUCT,
  GET_REQUESTER,
  GET_ASSIGN,
  ADD_DESIGN,
  ADD_DESIGN_ITEM,
  GET_DESIGN_ITEM,
  UPDATE_DESIGN,
  UPDATE_DESIGN_ITEM,
  ERRORS
} from "./types";
import ApiConfig from "../config/Host_Config";

// Get All Designs
export const getAllDesign = () => dispatch => {
  axios({
    url: `${ApiConfig.host}/design`,
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
    url: `${ApiConfig.host}/design/${code}`,
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
    url: `${ApiConfig.host}/design/item/${code}`,
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
    url: `${ApiConfig.host}/design/code`,
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
    url: `${ApiConfig.host}/tevent`,
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
    url: `${ApiConfig.host}/product`,
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
    url: `${ApiConfig.host}/design/requester`,
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
    url: `${ApiConfig.host}/employee`,
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
    url: `${ApiConfig.host}/design`,
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
    url: `${ApiConfig.host}/design/item`,
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
    url: `${ApiConfig.host}/design/${code}`,
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
    url: `${ApiConfig.host}/design/item`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
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
