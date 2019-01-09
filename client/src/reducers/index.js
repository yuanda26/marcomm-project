import { combineReducers } from "redux";
import authReducer from "./authReducer";
import designReducer from "./designReducer";
import souvenirReducer from "./souvenirReducer";
import unitReducer from "./unitReducer";
import productReducer from "./productReducers";
import menuReducers from "./menuReducer";
import employeeReducers from "./employee_reducers";
import companyReducers from "./companyReducer";
import roleReducers from "./roleReducers";
import eventReducers from "./event_reducers";
<<<<<<< HEAD
import tsouvenirReducer from "./tsouvenirReducer";
import tsouveniritemReducer from "./tsouveniritemReducer";
import promotionReducers from "./promotionReducers";
import accessMenuReducers from "./accessMenuReducers";
import userReducers from "./userReducers";
=======
import menuReducer from "./menuReducer";
import companyReducer from "./companyReducer";
import roleReducer from "./roleReducers";
import tSouvenirReducer from "./tsouvenirReducer";
import tSouvenirItemReducer from "./tsouveniritemReducer";
import promotionReducer from "./promotionReducers";
import accessReducer from "./accessMenuReducers";
import userReducer from "./userReducers";

>>>>>>> 4ca7e2fdd3f99d41644588ba8589cbb6b56d751f
export default combineReducers({
  auth: authReducer,
  roleData: roleReducers,
  menu: menuReducers,
  design: designReducer,
  souvenir: souvenirReducer,
  units: unitReducer,
  product: productReducer,
  employee: employeeReducers,
  event: eventReducers,
<<<<<<< HEAD
  companyIndexReducer: companyReducers,
  tsouvenirIndexReducer: tsouvenirReducer,
  tsouveniritemIndexReducer: tsouveniritemReducer,
  accessMenuData: accessMenuReducers,
  promot: promotionReducers,
  userData: userReducers
=======
  roleData: roleReducer,
  menu: menuReducer,
  companyIndexReducer: companyReducer,
  tsouvenirIndexReducer: tSouvenirReducer,
  tsouveniritemIndexReducer: tSouvenirItemReducer,
  accessMenuData: accessReducer,
  promot: promotionReducer,
  userData: userReducer
>>>>>>> 4ca7e2fdd3f99d41644588ba8589cbb6b56d751f
});
