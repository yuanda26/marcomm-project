import {
  GET_TSOUVENIR,
  CREATE_TSOUVENIR,
  PUT_TSOUVENIR,
  GET_TSOUVENIR_ITEM,
  CREATE_TSOUVENIR_ITEM
} from "../actions/types"; //CREATE_MENU, DELETE_MENU

const initialState = {
  ts: [],
  it: [],
  statusGET: "",
  statusDEL: "",
  statusADD: "",
  statusPUT: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TSOUVENIR:
      return {
        ...state,
        ts: action.payload,
        statusGET: action.status
      };

    case CREATE_TSOUVENIR:
      return {
        ...state,
        statusADD: action.status
      };

    case PUT_TSOUVENIR:
      return {
        ...state,
        statusPUT: action.status
      };
    case GET_TSOUVENIR_ITEM:
      return {
        ...state,
        it: action.payload,
        statusGET: action.status
      };
    case CREATE_TSOUVENIR_ITEM:
      return {
        ...state,
        // menuan: action.payload,
        statusADD: action.status
      };

    default:
      return state;
  }
}
