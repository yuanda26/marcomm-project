import { CURRENT_USER, FORGOT_PASSWORD, ERRORS } from "../actions/types";
import isEmpty from "../validation/isEmpty";

const initialState = {
  isAuthenticated: false,
  user: {},
  errors: null
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
        status: action.status
      };
    case ERRORS:
      return {
        ...state,
        errors: action.payload
      };

    default:
      return state;
  }
}
