import types from "./actions";

const initialState = {
  theme: "light",
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
    case types.SET_THEME:
      return {
        ...state,
        theme: actions.theme,
      };
    default:
      return state;
  }
}
