import { SELECT_COIN, SELECT_COIN_ERROR } from "../actionTypes";

const initialState = {
  selectedCoin: "",
  exchanges: []
};

const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_COIN:
      return {
        ...state,
        selectedCoin: action.coinAndExchanges.coin,
        exchanges: action.coinAndExchanges.exchanges
      };

    case SELECT_COIN_ERROR:
      console.log("Error selecting coin, ", action);
      return state;

    default:
      return state;
  }
};

export default coinReducer;
