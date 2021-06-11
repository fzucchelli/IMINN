const actions = {
  SET_THEME: "auth/SET_THEME",

  setTheme: (theme) => (dispatch) => {
    console.log("REDUX UPDATED THEME ==>", theme);
    return dispatch({
      type: actions.SET_THEME,
      theme: theme,
    });
  },
};

export default actions;
