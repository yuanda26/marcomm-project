import { combineReducers } from 'redux';
import authReducer from './authReducer';
import designReducer from './designReducer';
import souvenirReducer from './souvenirReducer';
import unitReducer from './unitReducer';
import productReducer from './productReducers';
import menuReducers from './menuReducer';
import employeeReducers from './employee_reducers';
import companyReducers from './companyReducer';
import roleReducers from './roleReducers';
import eventReducers from './event_reducers';
import tsouvenirReducer from './tsouvenirReducer';
import tsouveniritemReducer from './tsouveniritemReducer';
import promotionReducers from './promotionReducers';
import accessMenuReducers from './accessMenuReducers';
import userReducers from './userReducers';
import promotionItemReducers from './promotionItemReducers';
import promotionItemFileReducers from './promotionFileReducers';
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
	companyIndexReducer: companyReducers,
	tsouvenirIndexReducer: tsouvenirReducer,
	tsouveniritemIndexReducer: tsouveniritemReducer,
	accessMenuData: accessMenuReducers,
	promot: promotionReducers,
	promotItem: promotionItemReducers,
	promotFile: promotionItemFileReducers,
	userData: userReducers
});
