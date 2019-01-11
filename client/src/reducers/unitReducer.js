import {
  GET_UNITS,
  GET_UNIT,
  CREATE_UNIT,
  UPDATE_UNIT,
  DELETE_UNIT
} from "../actions/types";

const initialState = {
  unitData: [],
  unit: {},
  status: null,
  code: "",
  message1: "",
  message2: "",
  message3: ""
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
        message1: `Data Saved ! `,
        message2: `New Unit Has Been Added with Code `,
        message3: ` `,
        code: action.id,
        status: action.status
      };

    case UPDATE_UNIT:
      let updatedUnit = state.unitData.map(unit => {
        if (unit._id === action.unitId) {
          return { ...unit, ...action.payload };
        }
        return unit;
      });

      return {
        ...state,
        unitData: updatedUnit,
        message1: `Data Updated ! `,
        message2: `Data Unit Has Been Updated !`,
        message3: ` `,
        code: "",
        status: action.status
      };

    case DELETE_UNIT:
      return {
        ...state,
        unitData: state.unitData.filter(data => data._id !== action.payload),
        message1: `Data Deleted ! `,
        message2: `Data Unit With Code `,
        message3: ` Has Been Deleted !`,
        code: action.payload,
        status: action.status
      };
    default:
      return state;
  }
}
