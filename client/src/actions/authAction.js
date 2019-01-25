import axios from "axios";
import jwt_decode from "jwt-decode";
import { CURRENT_USER, FORGOT_PASSWORD, ERRORS } from "./types";
import HostConfig from "../config/Host_Config";
import ApiConfig from "../config/Api_Config";

// Login User Action
export const loginUser = userData => dispatch => {
  axios
    .post(`${HostConfig}/${ApiConfig.user_login}`, userData)
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
        payload: err.response.data
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
    url: `${HostConfig}/${ApiConfig.user_forgot}/${body.username}`,
    method: "put",
    headers: {
      "Content-Type": "application/json"
    },
    data: body
  };
  axios(option)
    .then(res => {
      dispatch({
        type: FORGOT_PASSWORD,
        status: res.data.code
      });
      alert(
        "Perubahan password berhasil disimpan, silahkan login kembali dengan password baru!"
      );
      window.location.href = "/";
    })
    .catch(err => {
      dispatch({
        type: ERRORS,
        status: 404,
        payload: null
      });
    });
};
