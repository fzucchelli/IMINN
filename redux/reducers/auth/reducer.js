import types from "./actions";

const initialState = {
  token: "",
  userData: {},
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case "persist/REHYDRATE":
      if (
        actions.payload &&
        actions.payload.auth &&
        actions.payload.auth.dataChanged
      ) {
        return {
          ...state,
          ...actions.payload.auth,
          dataChanged: false,
        };
      }
      return state;
    case types.SET_USER_DATA:
      return {
        ...state,
        token: actions.accsessToken,
        userData: actions.userData,
      };
    default:
      return state;
  }
}
