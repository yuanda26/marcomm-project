import axios from "axios";
import { GET_MENU, DEL_MENU, ADD_MENU, PUT_MENU } from "./types";
import HostConfig from "../config/Host_Config";

export const getAllMenu = () => dispatch => {
  let options = {
    url: `${HostConfig}/menu`,
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

export const createMenu = (newMenu, modalStatus) => dispatch => {
  let option = {
    url: `${HostConfig}/menu`,
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
      modalStatus(
        1,
        `Menu with name ${res.data.message.name} has been created!`
      );
    })
    .catch(error => {
      dispatch({
        type: ADD_MENU,
        payload: null
      });
      modalStatus(2, `${error.message}`);
    });
};

export const putMenu = (updatedMenu, modalStatus) => dispatch => {
  let option = {
    url: `${HostConfig}/menu/${updatedMenu.code}`,
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
      modalStatus(1, `Menu with name ${updatedMenu.name} has been updated!`);
    })
    .catch(error => {
      dispatch({
        type: PUT_MENU,
        payload: null
      });
      modalStatus(2, `${error.message}`);
    });
};

export const delMenu = (deletedMenu, modalStatus) => dispatch => {
  let options = {
    url: `${HostConfig}/menu/${deletedMenu.code}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DEL_MENU,
        payload: deletedMenu.code,
        status: res.data.code
      });
      modalStatus(1, `Menu with name ${deletedMenu.name} has been deleted!`);
    })
    .catch(error => {
      dispatch({
        type: DEL_MENU,
        payload: null
      });
      modalStatus(
        2,
        `Failed to delete menu with name ${
          deletedMenu.name
        }! The menu was used on other data.`
      );
    });
};
