import { SELECT_COIN, SELECT_COIN_ERROR, SEARCH_COIN } from "../actionTypes";

const initialState = {
  isFetching: true,
  selectedCoin: "",
  selectedCoinNameKo: "",
  exchanges: [],
  isSearching: false
};

const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_COIN:
      return {
        ...state,
        isFetching: false,
        selectedCoin: action.coinAndExchanges.coin.symbol,
        selectedCoinNameKo: action.coinAndExchanges.coin.nameKo,
        exchanges: action.coinAndExchanges.exchanges,
        isSearching: false
      };

    case SELECT_COIN_ERROR:
      console.log("Error selecting coin, ", action);
      return state;

    case SEARCH_COIN:
      return {
        ...state,
        isSearching: true
      };

    default:
      return state;
  }
};

export default coinReducer;
