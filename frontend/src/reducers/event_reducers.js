import { 
  GET_EVENT,
  UPDATE_EVENT,
  CREATE_EVENT,
  DELETE_EVENT
} from "../actions/types";

const initialState = {
  myEvent: [],
  idCreated : [],
  idUpdated : [],
  messageDeleted : [],
  statusDeleted : null,
  statusCreated : null,
  statusUpdated : null
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
        statusUpdated: action.status,
        idUpdated: action.idUpdated,
      };
    case CREATE_EVENT:
      return {
        ...state,
        idCreated: action.idCreated,
        statusCreated: action.status 
      };
    case DELETE_EVENT:
      return {
        ...state,
        statusDeleted: action.status,
      };
    default:
      return state;
  }
}