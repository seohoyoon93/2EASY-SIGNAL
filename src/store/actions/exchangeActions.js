import {
  SELECT_EXCHANGE,
  RECEIVE_CANDLE_DATA,
  RECEIVE_ORDERBOOK_DATA
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
      let candlePromise, orderbookPromise;
      if (exchange === "Upbit") {
        candlePromise = await upbit.getCandleSticks(selectedCoin);
        orderbookPromise = await upbit.getOrderbook(selectedCoin);
      } else if (exchange === "Bithumb") {
        candlePromise = await bithumb.getCandleSticks(selectedCoin);
        orderbookPromise = await bithumb.getOrderbook(selectedCoin);
      } else if (exchange === "Bitsonic") {
        candlePromise = await bitsonic.getCandleSticks(selectedCoin);
        orderbookPromise = await bitsonic.getOrderbook(selectedCoin);
      } else if (exchange === "Coinbit") {
        candlePromise = await coinbit.getCandleSticks(selectedCoin);
        orderbookPromise = await coinbit.getOrderbook(selectedCoin);
      }
      await Promise.all([candlePromise, orderbookPromise]).then(values => {
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
      });
    } catch {
      console.log("err");
    }
  };
};
