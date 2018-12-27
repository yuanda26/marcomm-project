import {  
  GET_EMPLOYEE, 
  UPDATE_EMPLOYEE, 
  CREATE_EMPLOYEE,
  DELETE_EMPLOYEE, 
  GET_ID_EMPLOYEE, 
  SEARCH_EMPLOYEE
} from "../actions/types";

const initialState = {
  myEmployee: [],
  myEmployeeId: null,
  idCreated : [],
  idUpdated : [],
  messageDeleted : [],
  statusDeleted : null,
  statusCreated : null,
  statusUpdated : null
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
        myEmployee: state.myEmployee.map(row=>{
          if(row._id === action.payload._id){
            let newObjArray = row
            newObjArray.m_company_name = action.companyName
          }
          return newObjArray
        }),
        idUpdated: action.idUpdated,
      };
    case CREATE_EMPLOYEE:
    let newObjArray = action.payload
    newObjArray.m_company_name = action.companyName
      return {
        ...state,
        myEmployee: [...state.myEmployee, newObjArray],
        statusCreated: action.status 
      };
    case SEARCH_EMPLOYEE:
      return {
        ...state,
        myEmployee: action.payload,
      };
    case DELETE_EMPLOYEE:
      return {
        ...state,
        myEmployee: state.myEmployee.filter(row => row._id !== action.payload),
      };
    case GET_ID_EMPLOYEE:
      return {
        ...state,
        myEmployeeId: action.payload,
      };
    default:
      return state;
  }
}