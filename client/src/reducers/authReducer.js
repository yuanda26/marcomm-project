import { CURRENT_USER, FORGOT_PASSWORD, ERRORS } from "../actions/types";
import isEmpty from "../validation/isEmpty";

const initialState = {
  isAuthenticated: false,
  user: {},
  errors: null,
  status: "",
  message: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case FORGOT_PASSWORD:
      return {
        ...state,
        status: action.status,
        message: "Reset Password Success! Now you can login with new password."
      };
    case ERRORS:
      return {
        ...state,
        status: action.payload.code,
        message: action.payload.message
      };

    default:
      return state;
  }
}
