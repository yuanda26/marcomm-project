import {
  GET_COMPANIES,
  CREATE_COMPANY,
  EDIT_COMPANY,
  DELETE_COMPANY
} from "../actions/types";

const initialState = {
  companies: [],
  statusGET: "",
  statusDEL: "",
  statusADD: "",
  statusPUT: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COMPANIES:
      return {
        ...state,
        companies: action.payload,
        statusGET: action.status
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(
          companies => companies.code !== action.payload
        ),
        statusDEL: action.status
      };
    case CREATE_COMPANY:
      return {
        ...state,
        companies: [...state.companies, action.payload],
        statusADD: action.status
      };
    case EDIT_COMPANY:
      const updatedCompany = state.companies.map(company => {
        if (company.code === action.payload.code) {
          return { ...company, ...action.payload };
        }
        return company;
      });
      return {
        ...state,
        companies: updatedCompany,
        statusPUT: action.status
      };
    default:
      return state;
  }
}
