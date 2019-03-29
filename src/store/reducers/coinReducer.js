import { SELECT_COIN, SELECT_COIN_ERROR } from "../actionTypes";

const initialState = {
  isFetching: true,
  selectedCoin: "",
  selectedCoinNameKo: "",
  exchanges: []
};

const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_COIN:
      return {
        ...state,
        isFetching: false,
        selectedCoin: action.coinAndExchanges.coin.symbol,
        selectedCoinNameKo: action.coinAndExchanges.coin.nameKo,
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
