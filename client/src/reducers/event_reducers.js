import { 
  GET_EVENT,
  UPDATE_EVENT,
  CREATE_EVENT,
  DELETE_EVENT,
  SEARCH_EVENT
} from "../actions/types";

const initialState = {
  myEvent: [],
  status: null,
  _id : null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EVENT:
      return {
        ...state,
        myEvent: action.payload
      };
    case UPDATE_EVENT:
      return {
        ...state,
        myEvent: action.payload,
        status: action.status
      };
    case CREATE_EVENT:
      return {
        ...state,
        myEvent: action.payload,
        _id: action.payload[action.payload.length-1].code
      };
    case DELETE_EVENT:
      return {
        ...state,
        statusDeleted: action.status,
      };
    case SEARCH_EVENT:
      return {
        ...state,
        myEvent: action.payload,
      };
    default:
      return state;
  }
}