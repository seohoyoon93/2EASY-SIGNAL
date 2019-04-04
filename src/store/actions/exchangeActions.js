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
      if (exchange === "Upbit" || exchange === "Bithumb") {
        let candlePromise, orderbookPromise, tradesPromise;
        candlePromise =
          exchange === "Upbit"
            ? await upbit.getCandleSticks(selectedCoin)
            : await bithumb.getCandleSticks(selectedCoin);
        orderbookPromise =
          exchange === "Upbit"
            ? await upbit.getOrderbook(selectedCoin)
            : await bithumb.getOrderbook(selectedCoin);
        tradesPromise =
          exchange === "Upbit"
            ? await upbit.getTrades(selectedCoin)
            : await bithumb.getTrades(selectedCoin);
        await Promise.all([
          candlePromise,
          orderbookPromise,
          tradesPromise
        ]).then(values => {
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
        });
      } else if (exchange === "Bitsonic") {
        bitsonic.getBitsonicData(selectedCoin).then(value => {
          let currentCoin = getState().coin.selectedCoin;
          let currentEx = getState().exchange.selectedExchange;
          if (currentCoin === selectedCoin && currentEx === exchange) {
            dispatch({
              type: RECEIVE_CANDLE_DATA,
              volumeChanges: value.volumeChanges,
              priceChanges: value.priceChanges
            });
            dispatch({
              type: RECEIVE_ORDERBOOK_DATA,
              aggOrders: value.aggOrders,
              bidAsk: value.bidAsk
            });
            dispatch({
              type: RECEIVE_TRADES_DATA,
              aggAsks: value.aggAsks,
              aggBids: value.aggBids
            });
          }
        });
      } else if (exchange === "Coinbit") {
        let candlePromise, orderbookPromise, tradesPromise;
        candlePromise = await coinbit.getCandleSticks(selectedCoin);
        orderbookPromise = await coinbit.getOrderbook(selectedCoin);
        tradesPromise = await coinbit.getTrades(selectedCoin);

        await Promise.all([
          candlePromise,
          orderbookPromise,
          tradesPromise
        ]).then(values => {
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
        });
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };
};
