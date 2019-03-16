const coinReducer = (state = {}, action) => {
  switch (action.type) {
    case "SELECT_COIN":
      console.log("select coin", action.coin);

    default:
      return state;
  }
};

export default coinReducer;
