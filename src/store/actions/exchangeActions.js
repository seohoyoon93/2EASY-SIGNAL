import { SELECT_EXCHANGE, SELECT_EXCHANGE_ERROR } from "../actionTypes";

export const selectExchange = exchange => {
  //make async requests to exchange api or db
  return (dispatch, getState, { getFirestore }) => {
    const selectedCoin = getState().coin.selectedCoin;
    console.log("exchange: ", exchange);
    console.log("selected coin: ", selectedCoin);
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
                const data = { exchange, exchangeData };
                console.log("data: ", data);
                dispatch({ type: SELECT_EXCHANGE, data });
              });
          });
      });
  };
};
