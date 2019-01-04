import { 
  GET_EVENT,
  UPDATE_EVENT,
  CREATE_EVENT,
  DELETE_EVENT,
  SEARCH_EVENT,
  ERASE_STATUS
} from "../actions/types";

const initialState = {
  myEvent: [],
  statusUpdate: null,
  statusCreate: null,
  code : null
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
        statusUpdate: action.status
      };
    case CREATE_EVENT:
      return {
        ...state,
        myEvent: action.payload,
        code: action.payload[action.payload.length-1].code,
        statusCreate: action.status
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
    case ERASE_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
}