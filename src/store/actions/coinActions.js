export const selectCoin = coin => {
  return (dispatch, getState) => {
    // make async call to database
    dispatch({ type: "SELECT_COIN", coin });
  };
};
