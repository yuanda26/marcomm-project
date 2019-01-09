//CREATE_MENU, DELETE_MENU
import { 
  GET_PRODUCT, 
  DEL_PRODUCT,
  CREATE_PRODUCT, 
  UPDATE_PRODUCT, 
  SEARCH_PRODUCT,
  ERASE_STATUS
} from "../actions/types";

const initialState = {
  production: [], //nilai awal masih kosong (array kosong) bebas variabel
  statusGET: "",
  statusDeleted: "",
  statusCreated: "",
  statusUpdated: "",
  code: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCT:
      return {
        ...state,
        production: action.payload,
        statusGET: action.status
      };

    case SEARCH_PRODUCT:
      return {
        ...state,
        production: action.payload,
      };

    case DEL_PRODUCT:
      return {
        ...state,
        production: state.production.filter(production => production.code !== action.payload),
        statusDeleted: action.status
      };

    case CREATE_PRODUCT:
      return {
        ...state,
        production: [...state.production, action.payload],
        statusCreated: action.status,
        code: action.payload.code
      };

      case UPDATE_PRODUCT:
      return {
        ...state,
        production : state.production.map(row=>{
                if(row._id === action.payload._id){
                  action.payload.name = action.payload.name.toUpperCase()
                  row = action.payload
                }
                return row
              }),
        statusUpdated: action.status
      };

    case ERASE_STATUS:
      return {
        ...state,
        statusCreated: action.status,
        statusUpdated: action.status,
        statusDeleted: action.status
      };

    default:
      return state;
  }
}
