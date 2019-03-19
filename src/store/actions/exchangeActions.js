import { SELECT_EXCHANGE, SELECT_EXCHANGE_ERROR } from "../actionTypes";

export const selectExchange = exchange => {
  //make async requests to exchange api or db
  return (dispatch, getState, { getFirestore }) => {
    const selectedCoin = getState().coin.selectedCoin;
    //get exchange api data
    let aggBids = 0,
      aggAsks = 0,
      highestBidPrice,
      highestBidQuantity,
      lowestAskPrice,
      lowestAskQuantity,
      orderbookData,
      bidAskData;
    if (exchange === "Upbit") {
      var request = require("request");

      var options = {
        method: "GET",
        url: "https://api.upbit.com/v1/orderbook",
        qs: { markets: `KRW-${selectedCoin}` }
      };

      request(options, function(error, response, body) {
        if (error) throw new Error(error);
        let obj = JSON.parse(body);

        aggAsks = obj[0].total_ask_size;
        aggBids = obj[0].total_bid_size;

        highestBidPrice = obj[0].orderbook_units[0].bid_price;
        highestBidQuantity = obj[0].orderbook_units[0].bid_size;
        lowestAskPrice = obj[0].orderbook_units[0].ask_price;
        lowestAskQuantity = obj[0].orderbook_units[0].ask_size;

        orderbookData = { aggAsks, aggBids };
        bidAskData = {
          highestBidPrice,
          highestBidQuantity,
          lowestAskPrice,
          lowestAskQuantity
        };
      });
    } else if (exchange === "Bithumb") {
      const request = require("request");

      request(
        {
          method: "GET",
          uri: `https://api.bithumb.com/public/orderbook/${selectedCoin}`,
          qs: { count: 50 }
        },
        (err, res, result) => {
          if (err) throw new Error(err);

          let obj = JSON.parse(result);
          obj.data.bids.forEach(bid => {
            aggBids += parseFloat(bid.quantity);
          });
          obj.data.asks.forEach(ask => {
            aggAsks += parseFloat(ask.quantity);
          });
          highestBidPrice = obj.data.bids.sort((a, b) => {
            return a > b ? -1 : 1;
          })[0].price;
          highestBidQuantity = obj.data.bids.sort((a, b) => {
            return a > b ? -1 : 1;
          })[0].quantity;
          lowestAskPrice = obj.data.asks.sort()[0].price;
          lowestAskQuantity = obj.data.asks.sort()[0].quantity;

          orderbookData = { aggAsks, aggBids };
          bidAskData = {
            highestBidPrice,
            highestBidQuantity,
            lowestAskPrice,
            lowestAskQuantity
          };
        }
      );
    }

    //get firestore data
    const db = getFirestore();
    let exchangeDocId, marketDocId;
    let exchangeData = [];
    db.collection("Exchanges")
      .where("name", "==", exchange)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          exchangeDocId = doc.id;
        });
      })
      .then(() => {
        db.collection("Exchanges")
          .doc(exchangeDocId)
          .collection("markets")
          .where("base", "==", selectedCoin)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              marketDocId = doc.id;
            });
          })
          .then(() => {
            db.collection("Exchanges")
              .doc(exchangeDocId)
              .collection("markets")
              .doc(marketDocId)
              .collection("data")
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  exchangeData.push(doc.data());
                });
              })
              .then(() => {
                const data = {
                  exchange,
                  exchangeData,
                  orderbookData,
                  bidAskData
                };
                dispatch({ type: SELECT_EXCHANGE, data });
              })
              .catch(err => {
                dispatch({ type: SELECT_EXCHANGE_ERROR, err });
              });
          });
      });
  };
};
