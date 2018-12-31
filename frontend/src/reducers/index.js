import { combineReducers } from "redux";
import authReducer from "./authReducer";
import designReducer from "./designReducer";
import souvenirReducer from "./souvenirReducer";
import unitReducer from "./unitReducer";
import productReducer from "./productReducers";
import menuReducers from "./menuReducer";
import employeeReducers from "./employee_reducers";
import companyReducers from "./companyReducer";
import eventReducers from "./event_reducers";
import tsouvenirReducer from "./tsouvenirReducer";
import tsouveniritemReducer from "./tsouveniritemReducer";

export default combineReducers({
  auth: authReducer,
  companyIndexReducer: companyReducers,
  menu: menuReducers,
  design: designReducer,
  souvenir: souvenirReducer,
  units: unitReducer,
  product: productReducer,
  employee: employeeReducers,
  event: eventReducers,
  tsouvenirIndexReducer: tsouvenirReducer,
  tsouveniritemIndexReducer: tsouveniritemReducer
});
