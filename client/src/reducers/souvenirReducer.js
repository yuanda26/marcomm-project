import {
  GET_SOUVENIRS,
  GET_SOUVENIR,
  GET_UNITS,
  ADD_SOUVENIR,
  UPDATE_SOUVENIR,
  DELETE_SOUVENIR,
  CLEAR_SOUVENIR_ALERT
} from "../actions/types";

const initialState = {
  souvenirs: [],
  souvenir: {},
  units: [],
  status: 0,
  message: "",
  data: ""
};

export default function(state = initialState, action) {
  let status;
  let message;

  switch (action.type) {
    case GET_UNITS:
      return {
        ...state,
        units: action.payload
      };

    case GET_SOUVENIRS:
      return {
        ...state,
        souvenirs: action.payload
      };

    case GET_SOUVENIR:
      return {
        ...state,
        souvenir: action.payload
      };

    case ADD_SOUVENIR:
      let addSouvenir;
      // Return All Souvenir Data
      if (action.code === 201) {
        addSouvenir = [...state.souvenirs];
        status = 3;
        message = action.payload;
      }
      // Return Souvenir Data That Have Been Filtered
      if (action.code === 200) {
        addSouvenir = [action.payload, ...state.souvenirs];
        status = 1;
        message = "New Souvenir Has Been Added with Code ";
      }

      return {
        ...state,
        souvenirs: addSouvenir,
        status,
        message,
        data: action.payload.code
      };

    case UPDATE_SOUVENIR:
      let updatedSouvenir;
      // Return All Souvenir Data Without Changing Any Data
      if (action.code === 201) {
        updatedSouvenir = [...state.souvenirs];
        status = 3;
        message = action.payload;
      }

      if (action.code === 200) {
        updatedSouvenir = state.souvenirs.map(souvenir => {
          if (souvenir.code === action.souvenirCode) {
            return { ...souvenir, ...action.payload };
          }
          return souvenir;
        });
        status = 2;
        message = "Data Souvenir Has Been Updated with Code";
      }

      return {
        ...state,
        souvenirs: updatedSouvenir,
        status,
        message,
        data: action.souvenirCode
      };

    case DELETE_SOUVENIR:
      let deletedSouvenir;

      // Return All Souvenir Data
      if (action.code === 201) {
        deletedSouvenir = [...state.souvenirs];
        status = 3;
        message = action.message;
      }
      // Return Souvenir Data That Have Been Filtered
      if (action.code === 200) {
        const filtered = state.souvenirs.filter(
          souvenir => souvenir.code !== action.payload
        );
        deletedSouvenir = filtered;
        status = 1;
        message = "Data Souvenir Successfully Deleted with Code ";
      }

      return {
        ...state,
        souvenirs: deletedSouvenir,
        status,
        message,
        data: action.payload
      };

    case CLEAR_SOUVENIR_ALERT:
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
