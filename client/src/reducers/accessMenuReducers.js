const initialState = {
  dataAccess: [],
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

    default:
      return state;
  }
}
