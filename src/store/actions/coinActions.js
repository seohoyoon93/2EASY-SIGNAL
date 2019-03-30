import { SELECT_COIN, SELECT_COIN_ERROR, SEARCH_COIN } from "../actionTypes";

export const searchCoin = () => {
  return dispatch => {
    dispatch({ type: SEARCH_COIN });
  };
};

export const selectCoin = coin => {
  return (dispatch, getState, { getFirestore }) => {
    const db = getFirestore();
    const exchanges = [];
    db.collection("exchanges")
      .where("bases", "array-contains", coin.symbol)
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
        exchanges.sort((a, b) => {
          switch (a.name) {
            case "Upbit":
              return -1;
            case "Bithumb":
              if (b.name === "Upbit") {
                return 1;
              }
              return -1;
            case "Coinbit":
              if (b.name === "Upbit" || b.name === "Bithumb") {
                return 1;
              }
              return -1;
            default:
              return 1;
          }
        });
        const coinAndExchanges = { coin: coin, exchanges: exchanges };
        dispatch({ type: SELECT_COIN, coinAndExchanges });
      })
      .catch(err => {
        dispatch({ type: SELECT_COIN_ERROR, err });
      });
  };
};
