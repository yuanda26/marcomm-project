import axios from "axios";
import { GET_MENU, DEL_MENU, ADD_MENU, PUT_MENU } from "./types";
import ApiConfig from "../config/Host_Config";

export const getAllMenu = () => dispatch => {
  let options = {
    url: `${ApiConfig.host}/menu`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_MENU,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: GET_MENU,
        payload: null
      });
    });
};

export const createMenu = newMenu => dispatch => {
  let option = {
    url: `${ApiConfig.host}/menu`,
    method: "post",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: newMenu
  };
  axios(option)
    .then(res => {
      dispatch({
        type: ADD_MENU,
        payload: res.data.message,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: ADD_MENU,
        payload: null
      });
    });
};

export const putMenu = updatedMenu => dispatch => {
  let option = {
    url: `${ApiConfig.host}/menu/${updatedMenu.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: updatedMenu
  };
  axios(option)
    .then(res => {
      dispatch({
        type: PUT_MENU,
        payload: updatedMenu,
        status: res.data.code
      });
    })
    .catch(error => {
      dispatch({
        type: PUT_MENU,
        payload: null
      });
    });
};

export const delMenu = menuId => dispatch => {
  let options = {
    url: `${ApiConfig.host}/menu/${menuId}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DEL_MENU,
        payload: menuId,
        status: res.data.code
      });
    })
    .catch(error =>
      dispatch({
        type: DEL_MENU,
        payload: null
      })
    );
};
