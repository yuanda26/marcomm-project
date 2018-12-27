import { combineReducers } from "redux";
import authReducer from "./authReducer";
import designReducer from "./designReducer";
import souvenirReducer from "./souvenirReducer";
import unitReducer from "./unitReducer";
import productReducer from "./productReducers";
import employeeReducers from "./employee_reducers";
import companyReducers from "./company_reducers";
import eventReducers from "./event_reducers";

export default combineReducers({
  auth: authReducer,
  design: designReducer,
  souvenir: souvenirReducer,
  units: unitReducer,
  product: productReducer,
  employee: employeeReducers,
  company: companyReducers,
  event: eventReducers
});
