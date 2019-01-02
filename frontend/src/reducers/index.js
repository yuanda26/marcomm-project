import { combineReducers } from "redux";
import authReducer from "./authReducer";
import designReducer from "./designReducer";
import souvenirReducer from "./souvenirReducer";
import unitReducer from "./unitReducer";
import productReducer from "./productReducers";
import employeeReducers from "./employee_reducers";
import companyReducers from "./company_reducers";
import eventReducers from "./event_reducers";
import roleReducers from "./roleReducers";
import promotionReducers from "./promotionReducers";
import accessMenuReducers from "./accessMenuReducers";
export default combineReducers({
  auth: authReducer,
  roleData: roleReducers,
  accessMenuData: accessMenuReducers,
  promot: promotionReducers,
  design: designReducer,
  souvenir: souvenirReducer,
  units: unitReducer,
  product: productReducer,
  employee: employeeReducers,
  company: companyReducers,
  event: eventReducers
});
