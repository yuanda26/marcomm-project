import axios from "axios";
import jwt_decode from "jwt-decode";
import { CURRENT_USER, ERRORS } from "./types";
import HostConfig from "../config/Host_Config";

// Login User Action
export const loginUser = userData => dispatch => {
  axios
    .post(`${HostConfig.host}/user/login`, userData)
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
//Forgot Password
export const ForgotPassword = body => dispatch => {
  let option = {
    url: `${HostConfig.host}/user/forgot/${body.username}`,
    method: "put",
    headers: {
      "Content-Type": "application/json"
    },
    data: body
  };
  axios(option)
    .then(res => {
      dispatch({
        type: "FORGOT_USER",
        status: res.data.code
      });
      alert(
        "Perubahan password berhasil disimpan, silahkan login kembali dengan password baru!"
      );
      window.location.href = "/";
    })
    .catch(err => {
      dispatch({
        type: "FORGOT_USER",
        status: 404,
        payload: null
      });
    });
};
