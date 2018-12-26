import { combineReducers } from "redux";
import authReducer from "./authReducer";
import designReducer from "./designReducer";
import souvenirReducer from "./souvenirReducer";

export default combineReducers({
  auth: authReducer,
  design: designReducer,
  souvenir: souvenirReducer
});
