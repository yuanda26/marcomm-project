import axios from "axios";
import {
  GET_TSOUVENIR_ITEM,
  GET_TSOUVENIR_ITEM_DETIL,
  CREATE_TSOUVENIR_ITEM,
  PUT_TSOUVENIR_ITEM,
  REQUEST_APPROVE,
  REQUEST_REJECT,
  TSOUVENIR_RECEIVED,
  SETTLEMENT_APPROVE,
  CLOSE_ORDER,
  GET_EVENT
} from "./types";
import HostConfig from "../config/Host_Config";

export const getAllTSouvenirItem = () => dispatch => {
  let options = {
    url: `${HostConfig}/tsouveniritem`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_TSOUVENIR_ITEM,
        payload: res.data.message
        //status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_TSOUVENIR_ITEM,
        payload: null
      });
    });
};

export const getAllTSouvenirItemDetil = () => dispatch => {
  let options = {
    url: `${HostConfig}/tsouveniritemdetil`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_TSOUVENIR_ITEM_DETIL,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: GET_TSOUVENIR_ITEM_DETIL,
        payload: null
      });
    });
};

export const createTSouvenirItem = body => dispatch => {
  let option = {
    url: `${HostConfig}/tsouveniritem`,
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
        type: CREATE_TSOUVENIR_ITEM,
        payload: body,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_TSOUVENIR_ITEM,
        payload: null
      });
    });
};

export const updateTSouvenirItem = newTSouvenirItem => dispatch => {
  let option = {
    url: `${HostConfig}/tsouveniritem/${newTSouvenirItem.souv.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: newTSouvenirItem
  };
  axios(option)
    .then(res => {
      dispatch({
        type: PUT_TSOUVENIR_ITEM,
        payload: newTSouvenirItem,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: PUT_TSOUVENIR_ITEM,
        payload: null
      });
    });
};

export const adminRequestApprove = tsouveniritem => dispatch => {
  let option = {
    url: `${HostConfig}/tsouveniritem/adminrequestapprove/${
      tsouveniritem.code
    }`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: tsouveniritem
  };
  axios(option)
    .then(res => {
      dispatch({
        type: REQUEST_APPROVE,
        payload: tsouveniritem,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: REQUEST_APPROVE,
        payload: null
      });
    });
};

export const adminRequestReject = tsouveniritem => dispatch => {
  let option = {
    url: `${HostConfig}/tsouveniritem/adminrequestreject/${tsouveniritem.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: tsouveniritem
  };
  axios(option)
    .then(res => {
      dispatch({
        type: REQUEST_REJECT,
        payload: tsouveniritem,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: REQUEST_REJECT,
        payload: null,
        status: 400
      });
    });
};

export const putReceivedSouvenir = tsouveniritem => dispatch => {
  let option = {
    url: `${HostConfig}/tsouveniritem/receivedsouvenir/${tsouveniritem.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: tsouveniritem
  };
  axios(option)
    .then(res => {
      dispatch({
        type: TSOUVENIR_RECEIVED,
        payload: tsouveniritem,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: TSOUVENIR_RECEIVED,
        payload: null
      });
    });
};

export const adminApproveSettlement = tsouveniritem => dispatch => {
  let option = {
    url: `${HostConfig}/tsouveniritem/adminapprovesettlement/${
      tsouveniritem.code
    }`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: tsouveniritem
  };
  axios(option)
    .then(res => {
      dispatch({
        type: SETTLEMENT_APPROVE,
        payload: tsouveniritem,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: SETTLEMENT_APPROVE,
        payload: null
      });
    });
};

export const putCloseOrder = tsouveniritem => dispatch => {
  let option = {
    url: `${HostConfig}/tsouveniritem/colseorder/${tsouveniritem.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: tsouveniritem
  };
  axios(option)
    .then(res => {
      dispatch({
        type: CLOSE_ORDER,
        payload: tsouveniritem,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: CLOSE_ORDER,
        payload: null
      });
    });
};

export const getEvent = () => dispatch => {
  let options = {
    url: `${HostConfig}/event`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_EVENT,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: GET_EVENT,
        payload: null
      });
    });
};
