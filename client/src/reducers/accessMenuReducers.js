const initialState = {
  dataAccess: [],
  dataAccessMenu: [],
  statusGET: "",
  statusDEL: "",
  statusADD: "",
  statusPUT: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "GET_ACCESS":
      return {
        ...state,
        dataAccess: action.payload,
        statusGET: action.status
      };

    case "PUT_ACCESS":
      return {
        ...state,
        statusPUT: action.status
      };
    case "GET_ACCESS_MENU":
      return {
        ...state,
        dataAccessMenu: action.payload
      };
    default:
      return state;
  }
}
