import { GET_COMPANIES } from "../actions/types";

const initialState = {
  myCompany: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COMPANIES:
      return {
        ...state,
        myCompany: action.payload 
      };

    default:
      return state;
  }
}