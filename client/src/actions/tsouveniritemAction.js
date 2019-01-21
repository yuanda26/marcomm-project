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

export const getAllTSouvenirItem = (m_role_id, m_employee_id) => dispatch => {
  let options = {
    url: `${HostConfig}/tsouveniritem/${m_role_id}/${m_employee_id}`,
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

export const createTSouvenirItem = (body, modalStatus) => dispatch => {
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
      modalStatus(
        1,
        `Souvenir Request with Code ${
          res.data.message[0].code
        } has been Created!`
      );
    })
    .catch(error => {
      dispatch({
        type: CREATE_TSOUVENIR_ITEM,
        payload: null
      });
    });
};

export const updateTSouvenirItem = (
  newTSouvenirItem,
  modalStatus
) => dispatch => {
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
      modalStatus(
        1,
        `Souvenir Request with Code ${
          newTSouvenirItem.souv.code
        } has been Updated!`
      );
    })
    .catch(error => {
      dispatch({
        type: PUT_TSOUVENIR_ITEM,
        payload: null
      });
    });
};

export const adminRequestApprove = (tsouveniritem, modalStatus) => dispatch => {
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
      modalStatus(
        1,
        `Souvenir Request with Code ${tsouveniritem.code} has been Approved!`
      );
    })
    .catch(error => {
      dispatch({
        type: REQUEST_APPROVE,
        payload: null
      });
    });
};

export const adminRequestReject = (tsouveniritem, modalStatus) => dispatch => {
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
      modalStatus(
        2,
        `Souvenir Request with Code ${tsouveniritem.code} has been Rejected!`
      );
    })
    .catch(error => {
      dispatch({
        type: REQUEST_REJECT,
        payload: null,
        status: 400
      });
    });
};

export const putReceivedSouvenir = (tsouveniritem, modalStatus) => dispatch => {
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
      modalStatus(
        1,
        `Souvenir Request with Code ${tsouveniritem.code} has been Received!`
      );
    })
    .catch(error => {
      dispatch({
        type: TSOUVENIR_RECEIVED,
        payload: null
      });
    });
};

export const adminApproveSettlement = (
  tsouveniritem,
  modalStatus
) => dispatch => {
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
      modalStatus(
        1,
        `Souvenir Settlement with Code ${tsouveniritem.code} has been Approved!`
      );
    })
    .catch(error => {
      dispatch({
        type: SETTLEMENT_APPROVE,
        payload: null
      });
    });
};

export const putCloseOrder = (tsouveniritem, modalStatus) => dispatch => {
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
      modalStatus(
        1,
        `Souvenir Request with Code ${tsouveniritem.code} has been Closed!`
      );
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
