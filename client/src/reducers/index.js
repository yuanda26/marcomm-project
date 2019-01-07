import { combineReducers } from "redux";
import authReducer from "./authReducer";
import designReducer from "./designReducer";
import souvenirReducer from "./souvenirReducer";
import unitReducer from "./unitReducer";
import productReducer from "./productReducers";
import employeeReducers from "./employee_reducers";
import eventReducers from "./event_reducers";
import menuReducer from "./menuReducer";
import companyReducer from "./companyReducer";
import roleReducer from "./roleReducers";
import tSouvenirReducer from "./tsouvenirReducer";
import tSouvenirItemReducer from "./tsouveniritemReducer";
import promotionReducer from "./promotionReducers";
import accessReducer from "./accessMenuReducers";
import userReducer from "./userReducers";

export default combineReducers({
  auth: authReducer,
  design: designReducer,
  souvenir: souvenirReducer,
  units: unitReducer,
  product: productReducer,
  employee: employeeReducers,
  event: eventReducers,
  roleData: roleReducer,
  menu: menuReducer,
  companyIndexReducer: companyReducer,
  tsouvenirIndexReducer: tSouvenirReducer,
  tsouveniritemIndexReducer: tSouvenirItemReducer,
  accessMenuData: accessReducer,
  promot: promotionReducer,
  userData: userReducer
});
