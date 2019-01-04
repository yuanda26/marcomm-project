const initialState = {
  userPayload: [],
  useremployee: [],
  staff: [],
  statusGET: "",
  statusDEL: "",
  statusADD: "",
  statusPUT: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        userPayload: action.payload,
        statusGET: action.status
      };

    case "DEL_USER":
      return {
        ...state,
        userPayload: state.userPayload.filter(
          userPayload => userPayload._id !== action.payload
        ),
        statusDEL: action.status
      };

    case "ADD_USER":
      return {
        ...state,
        userPayload: state.userPayload.concat(action.payload),
        statusADD: action.status
      };

    case "PUT_USER":
      return {
        ...state,
        userPayload: state.userPayload.filter(
          userPayload => userPayload._id !== action.payload.id
        ),
        statusPUT: action.status
      };

    case "GET_USEREMPLOYEE":
      return {
        ...state,
        useremployee: action.payload,
        statusGET: action.status
      };

    case "GET_USERSTAFF":
      return {
        ...state,
        staff: action.payload
      };

    default:
      return state;
  }
}
