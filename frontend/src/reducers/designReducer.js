import {
  GET_DESIGNS,
  GET_DESIGN,
  GET_CODE,
  GET_EVENT,
  GET_PRODUCT,
  GET_REQUESTER,
  GET_ASSIGN,
  GET_DESIGN_ITEM,
  ADD_DESIGN,
  ADD_DESIGN_ITEM,
  UPDATE_DESIGN,
  UPDATE_DESIGN_ITEM,
  ERRORS
} from "../actions/types";

const initialState = {
  designs: [],
  design: {},
  code: "",
  event: [],
  product: [],
  requester: [],
  assign: [],
  items: [],
  item: {},
  errors: {},
  status: 0,
  message: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_DESIGNS:
      return {
        ...state,
        designs: action.payload
      };
    case GET_DESIGN:
      return {
        ...state,
        design: action.payload
      };
    case GET_CODE:
      return {
        ...state,
        code: action.payload
      };
    case GET_EVENT:
      return {
        ...state,
        event: action.payload
      };
    case GET_PRODUCT:
      return {
        ...state,
        product: action.payload
      };
    case GET_REQUESTER:
      return {
        ...state,
        requester: action.payload
      };
    case GET_ASSIGN:
      return {
        ...state,
        assign: action.payload
      };
    case ADD_DESIGN:
      return {
        ...state,
        designs: [...state.designs, action.payload],
        status: 1,
        message: `Data Saved! Transaction Souvenir Request Has Been Added with Code ${
          action.payload.code
        }!`
      };
    case ADD_DESIGN_ITEM:
      return {
        ...state
      };
    case GET_DESIGN_ITEM:
      return {
        ...state,
        items: action.payload
      };
    case UPDATE_DESIGN:
      return {
        ...state,
        status: 2,
        message: `Data Updated! Transaction Souvenir Request with Code ${
          action.code
        } Has Been Updated!`
      };
    case UPDATE_DESIGN_ITEM:
      return {
        ...state
      };
    case ERRORS:
      return {
        ...state,
        errors: action.payload
      };

    default:
      return state;
  }
}
