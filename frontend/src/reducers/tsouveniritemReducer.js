import {
  GET_TSOUVENIR_ITEM,
  GET_TSOUVENIR_ITEM_DETIL,
  CREATE_TSOUVENIR_ITEM,
  PUT_TSOUVENIR_ITEM,
  REQUEST_APPROVE,
  REQUEST_REJECT,
  TSOUVENIR_RECEIVED,
  TSOUVENIR_SETTLEMENT,
  SETTLEMENT_APPROVE,
  CLOSE_ORDER
} from "../actions/types";

const initialState = {
  ts: [],
  tsv: [],
  statusGET: "",
  statusDEL: "",
  statusADD: "",
  statusPUT: "",
  statusRA: "",
  statusTR: "",
  statusTS: "",
  statusSA: "",
  statusCO: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TSOUVENIR_ITEM:
      return {
        ...state,
        ts: action.payload
        //statusGET: action.status
      };

    case GET_TSOUVENIR_ITEM_DETIL:
      return {
        ...state,
        tsv: action.payload
        //statusGET: action.status
      };

    case CREATE_TSOUVENIR_ITEM:
      return {
        ...state,
        // menuan: action.payload,
        statusADD: action.status
      };

    case PUT_TSOUVENIR_ITEM:
      return {
        ...state,
        //ts: state.ts.filter(ts => ts._id !== action.payload.id),
        statusPUT: action.status
      };

    case REQUEST_APPROVE:
      return {
        ...state,
        //ts: state.ts.filter(ts => ts._id !== action.payload.id),
        statusRA: action.status
      };

    case REQUEST_REJECT:
      return {
        ...state,
        //ts: state.ts.filter(ts => ts._id !== action.payload.id),
        statusRA: action.status
      };

    case TSOUVENIR_RECEIVED:
      return {
        ...state,
        //ts: state.ts.filter(ts => ts._id !== action.payload.id),
        statusTR: action.status
      };

    case TSOUVENIR_SETTLEMENT:
      return {
        ...state,
        //ts: state.ts.filter(ts => ts._id !== action.payload.id),
        statusTS: action.status
      };

    case SETTLEMENT_APPROVE:
      return {
        ...state,
        //ts: state.ts.filter(ts => ts._id !== action.payload.id),
        statusSA: action.status
      };

    case CLOSE_ORDER:
      return {
        ...state,
        //ts: state.ts.filter(ts => ts._id !== action.payload.id),
        statusCO: action.status
      };

    default:
      return state;
  }
}
