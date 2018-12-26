import axios from "axios";
import jwt_decode from "jwt-decode";
import { CURRENT_USER, ERRORS } from "./types";
import ApiConfig from "../config/API_Config";

// Login User Action
export const loginUser = userData => dispatch => {
  axios
    .post(`${ApiConfig.host}/user/login`, userData)
    .then(res => {
      // Set Token to localStorage
      const { token } = res.data.message;
      localStorage.setItem("token", token);
      // Decode Token to Get User Data
      const decoded = jwt_decode(token);
      // Remove Password Property
      delete decoded.password;
      // Set Current User
      dispatch({
        type: CURRENT_USER,
        payload: decoded
      });
    })
    .catch(err =>
      dispatch({
        type: ERRORS,
        payload: err
      })
    );
};

// Logout User Action
export const logoutUser = () => dispatch => {
  // Remove UserData & Token from localStorage
  localStorage.clear();
  // Set Current User to {}
  // Which will Set isAuthenticated to False
  dispatch({
    type: CURRENT_USER,
    payload: {}
  });
  window.location.href = "/";
};
