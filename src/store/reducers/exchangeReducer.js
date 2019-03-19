import { SELECT_EXCHANGE, SELECT_EXCHANGE_ERROR } from "../actionTypes";

const initialState = {
  selectedExchange: "",
  exchangeData: []
};

const exchangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_EXCHANGE:
      return {
        ...state,
        selectedExchange: action.data.exchange,
        exchangeData: action.data.exchangeData
      };

    case SELECT_EXCHANGE_ERROR:
      console.log("Error selecting exchange, ", action);
      return state;

    default:
      return state;
  }
};

export default exchangeReducer;
