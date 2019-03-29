import {
  SELECT_EXCHANGE,
  RECEIVE_CANDLE_DATA,
  RECEIVE_ORDERBOOK_DATA,
  RECEIVE_TRADES_DATA
} from "../actionTypes";
import upbit from "./exchanges/upbit";
import bithumb from "./exchanges/bithumb";
import bitsonic from "./exchanges/bitsonic";
import coinbit from "./exchanges/coinbit";

export const selectExchange = exchange => {
  //make async requests to exchange api or db
  return async (dispatch, getState) => {
    try {
      const selectedCoin = getState().coin.selectedCoin;
      dispatch({ type: SELECT_EXCHANGE, exchange });
      let candlePromise, orderbookPromise, tradesPromise;
      if (exchange === "Upbit") {
        candlePromise = await upbit.getCandleSticks(selectedCoin);
        orderbookPromise = await upbit.getOrderbook(selectedCoin);
        tradesPromise = await upbit.getTrades(selectedCoin);
      } else if (exchange === "Bithumb") {
        candlePromise = await bithumb.getCandleSticks(selectedCoin);
        orderbookPromise = await bithumb.getOrderbook(selectedCoin);
        tradesPromise = await bithumb.getTrades(selectedCoin);
      } else if (exchange === "Bitsonic") {
        candlePromise = await bitsonic.getCandleSticks(selectedCoin);
        orderbookPromise = await bitsonic.getOrderbook(selectedCoin);
        tradesPromise = await bitsonic.getTrades(selectedCoin);
      } else if (exchange === "Coinbit") {
        candlePromise = await coinbit.getCandleSticks(selectedCoin);
        orderbookPromise = await coinbit.getOrderbook(selectedCoin);
        tradesPromise = await coinbit.getTrades(selectedCoin);
      }
      await Promise.all([candlePromise, orderbookPromise, tradesPromise]).then(
        values => {
          let currentCoin = getState().coin.selectedCoin;
          let currentEx = getState().exchange.selectedExchange;
          if (currentCoin === selectedCoin && currentEx === exchange) {
            dispatch({
              type: RECEIVE_CANDLE_DATA,
              volumeChanges: values[0].volumeChanges,
              priceChanges: values[0].priceChanges
            });
            dispatch({
              type: RECEIVE_ORDERBOOK_DATA,
              aggOrders: values[1].aggOrders,
              bidAsk: values[1].bidAsk
            });
            dispatch({
              type: RECEIVE_TRADES_DATA,
              aggAsks: values[2].aggAsks,
              aggBids: values[2].aggBids
            });
          }
        }
      );
    } catch (err) {
      console.log("err: ", err);
    }
  };
};
