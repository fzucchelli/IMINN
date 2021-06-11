const actions = {
  SET_USER_DATA: "auth/SET_USER_DATA",

  setUserData: (token, uData) => (dispatch) => {
    console.log("REDUX UPDATED userData ==>", token, uData);
    return dispatch({
      type: actions.SET_USER_DATA,
      accsessToken: token,
      userData: uData,
    });
  },
};

export default actions;
