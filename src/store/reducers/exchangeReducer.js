import {
  SELECT_EXCHANGE,
  SELECT_EXCHANGE_ERROR,
  RECEIVE_CANDLE_DATA,
  RECEIVE_ORDERBOOK_DATA,
  RECEIVE_TRADES_DATA
} from "../actionTypes";

const initialState = {
  selectedExchange: "",
  candleData: {
    isFetching: false,
    volumeChanges: {},
    priceChanges: {}
  },
  orderbookData: {
    isFetching: false,
    aggOrders: {},
    bidAsk: {}
  },
  tradesData: {
    isFetching: false,
    aggAsks: null,
    aggBids: null
  }
};

const exchangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_EXCHANGE:
      return {
        ...state,
        selectedExchange: action.exchange,
        candleData: { ...state.candleData, isFetching: true },
        orderbookData: { ...state.orderbookData, isFetching: true }
      };

    case RECEIVE_CANDLE_DATA:
      return {
        ...state,
        candleData: {
          isFetching: false,
          volumeChanges: action.volumeChanges,
          priceChanges: action.priceChanges
        }
      };

    case RECEIVE_ORDERBOOK_DATA:
      return {
        ...state,
        orderbookData: {
          isFetching: false,
          aggOrders: action.aggOrders,
          bidAsk: action.bidAsk
        }
      };

    case RECEIVE_TRADES_DATA:
      return {
        ...state,
        tradesData: {
          isFetching: false,
          aggAsks: action.aggAsks,
          aggBids: action.aggBids
        }
      };

    case SELECT_EXCHANGE_ERROR:
      console.log("Error selecting exchange, ", action);
      return state;

    default:
      return state;
  }
};

export default exchangeReducer;
