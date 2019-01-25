import {
  GET_EVENT,
  UPDATE_EVENT,
  CREATE_EVENT,
  SEARCH_EVENT,
  ERASE_STATUS,
  APPROVE_EVENT,
  REJECT_EVENT,
  CLOSE_EVENT
} from "../actions/types";

const initialState = {
  myEvent: [],
  statusUpdate: null,
  statusCreate: null,
  statusApprove: null,
  statusReject: null,
  statusClose: null,
  code: null
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
        code: action.payload[0].code,
        statusCreate: action.status
      };
    case SEARCH_EVENT:
      return {
        ...state,
        myEvent: action.payload
      };
    case ERASE_STATUS:
      return {
        ...state,
        statusCreate: action.payload,
        statusUpdate: action.payload
      };

    case APPROVE_EVENT:
      const approvedEvent = state.myEvent.map(event => {
        if (event._id === action.eventId) {
          return { ...event, ...action.payload };
        }
        return event;
      });

      return {
        ...state,
        myEvent: approvedEvent,
        statusApprove: action.statusCode
      };

    case REJECT_EVENT:
      const rejectedEvent = state.myEvent.map(event => {
        if (event._id === action.eventId) {
          return { ...event, ...action.payload };
        }
        return event;
      });

      return {
        ...state,
        myEvent: rejectedEvent,
        statusReject: action.statusCode
      };

    case CLOSE_EVENT:
      const closedEvent = state.myEvent.map(event => {
        if (event._id === action.eventId) {
          return { ...event, ...action.payload };
        }
        return event;
      });

      return {
        ...state,
        myEvent: closedEvent,
        statusClose: action.statusCode
      };

    default:
      return state;
  }
}
