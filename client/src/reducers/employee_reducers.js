import {
  GET_EMPLOYEE,
  UPDATE_EMPLOYEE,
  CREATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  GET_ID_EMPLOYEE,
  SEARCH_EMPLOYEE,
  GET_COMPANIES
} from "../actions/types";

const initialState = {
  myEmployee: [],
  myCompany: [],
  myEmployeeId: null,
  status: null,
  employee_number: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EMPLOYEE:
      return {
        ...state,
        myEmployee: action.payload
      };
    case UPDATE_EMPLOYEE:
      return {
        ...state,
        myEmployee: action.payload,
        status: action.status
      };
    case CREATE_EMPLOYEE:
      return {
        ...state,
        myEmployee: action.payload,
        status: action.status,
        employee_number: action.created.employee_number
      };
    case SEARCH_EMPLOYEE:
      return {
        ...state,
        myEmployee: action.payload
      };
    case DELETE_EMPLOYEE:
      return {
        ...state,
        myEmployee: state.myEmployee.filter(row => row._id !== action.payload),
        status: action.status
      };
    case GET_ID_EMPLOYEE:
      return {
        ...state,
        myEmployeeId: action.payload
      };
    case GET_COMPANIES:
      return {
        ...state,
        myCompany: action.payload
      };
    default:
      return state;
  }
}
