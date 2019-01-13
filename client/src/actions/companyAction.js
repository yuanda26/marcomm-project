import axios from "axios";
import {
  GET_COMPANIES,
  CREATE_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY
} from "./types";
import HostConfig from "../config/Host_Config";

export const getCompanies = () => dispatch => {
  let options = {
    url: `${HostConfig}/company`,
    method: "get",
    headers: {
      Authorization: localStorage.token
    }
  };
  axios(options)
    .then(res => {
      dispatch({
        type: GET_COMPANIES,
        payload: res.data.message
      });
    })
    .catch(error => {
      dispatch({
        type: GET_COMPANIES,
        payload: null
      });
    });
};

export const createCompany = (newCompany, modalStatus) => dispatch => {
  let option = {
    url: `${HostConfig}/company`,
    method: "post",
    headers: {
      Authorization: localStorage.token,
      "Content-Type": "application/json"
    },
    data: newCompany
  };
  axios(option)
    .then(res => {
      dispatch({
        type: CREATE_COMPANY,
        payload: res.data.message,
        status: res.data.code
      });
      modalStatus(
        1,
        `Company with name ${res.data.message.name} has been created!`
      );
    })
    .catch(error => {
      dispatch({
        type: CREATE_COMPANY,
        payload: null
      });
      modalStatus(2, `${error.message}`);
    });
};

export const deleteCompany = (deletedCompany, modalStatus) => dispatch => {
  let options = {
    url: `${HostConfig}/company/${deletedCompany.code}`,
    method: "delete",
    headers: {
      Authorization: localStorage.token
    },
    data: deletedCompany
  };
  axios(options)
    .then(res => {
      dispatch({
        type: DELETE_COMPANY,
        payload: deletedCompany.code,
        status: res.data.code
      });
      modalStatus(
        1,
        `Company with name ${deletedCompany.name} has been deleted!`
      );
    })
    .catch(error => {
      dispatch({
        type: DELETE_COMPANY,
        payload: null,
        status: 400
      });
      modalStatus(
        2,
        `Failed to delete company with name ${
          deletedCompany.name
        }! The company was used on other data.`
      );
    });
};

export const editCompany = (updatedCompany, modalStatus) => dispatch => {
  let options = {
    url: `${HostConfig}/company/${updatedCompany.code}`,
    method: "put",
    headers: {
      Authorization: localStorage.token
    },
    data: updatedCompany
  };
  axios(options)
    .then(res => {
      dispatch({
        type: EDIT_COMPANY,
        payload: updatedCompany,
        status: res.data.code,
        company_id: updatedCompany.code
      });
      modalStatus(
        1,
        `Company with name ${updatedCompany.name} has been updated!`
      );
    })
    .catch(error => {
      dispatch({
        type: EDIT_COMPANY,
        payload: null
      });
      modalStatus(2, `${error.message}`);
    });
};
