import { combineReducers } from "redux";
import authReducer from "./authReducer";
import designReducer from "./designReducer";
import souvenirReducer from "./souvenirReducer";
import unitReducer from "./unitReducer";

export default combineReducers({
  auth: authReducer,
  design: designReducer,
  souvenir: souvenirReducer,
  units: unitReducer
});
