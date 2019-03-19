import { SELECT_COIN, SELECT_COIN_ERROR } from "../actionTypes";

export const selectCoin = coin => {
  return (dispatch, getState, { getFirestore }) => {
    const db = getFirestore();
    const exchanges = [];
    db.collection("Exchanges")
      .where("bases", "array-contains", coin)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const exchange = {
            id: doc.id,
            name: doc.data().name,
            link: doc.data().link
          };
          exchanges.push(exchange);
        });
      })
      .then(() => {
        const coinAndExchanges = { coin: coin, exchanges: exchanges };
        dispatch({ type: SELECT_COIN, coinAndExchanges });
      })
      .catch(err => {
        dispatch({ type: SELECT_COIN_ERROR, err });
      });
  };
};
