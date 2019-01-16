import {
  GET_UNITS,
  GET_UNIT,
  CREATE_UNIT,
  UPDATE_UNIT,
  DELETE_UNIT,
  CLEAR_UNIT_ALERT
} from "../actions/types";

const initialState = {
  unitData: [],
  unit: {},
  status: 0,
  message: "",
  data: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_UNITS:
      return {
        ...state,
        unitData: action.payload
      };

    case GET_UNIT:
      return {
        ...state,
        unit: action.payload
      };

    case CREATE_UNIT:
      return {
        ...state,
        unitData: [action.payload, ...state.unitData],
        status: 1,
        message: "New Unit Has Been Added with Code ",
        data: action.data
      };

    case UPDATE_UNIT:
      let updatedUnit = state.unitData.map(unit => {
        if (unit.code === action.unitCode) {
          return { ...unit, ...action.payload };
        }
        return unit;
      });

      return {
        ...state,
        unitData: updatedUnit,
        status: 2,
        message: "Data Unit Has Been Updated !",
        data: action.unitCode
      };

    case DELETE_UNIT:
      return {
        ...state,
        unitData: state.unitData.filter(data => data.code !== action.payload),
        status: 3,
        message: `Data Unit Has Been Deleted with Code `,
        data: action.payload
      };

    case CLEAR_UNIT_ALERT:
      return {
        ...state,
        status: 0,
        message: "",
        data: ""
      };

    default:
      return state;
  }
}
