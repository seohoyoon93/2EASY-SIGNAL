import { SELECT_COIN, SELECT_COIN_ERROR, SEARCH_COIN } from "../actionTypes";
import firebase from "../../config/fbConfig";

export const searchCoin = () => {
  return dispatch => {
    dispatch({ type: SEARCH_COIN });
  };
};

export const selectCoin = coin => {
  return async dispatch => {
    const db = firebase.database();
    const exchanges = [];
    await db
      .ref("exchanges/upbit")
      .once("value")
      .then(snapshot => {
        if (snapshot.val().bases.includes(coin.symbol)) {
          exchanges.push({
            id: snapshot.key,
            name: snapshot.val().name,
            link: snapshot.val().link
          });
        }
      });
    await db
      .ref("exchanges/bithumb")
      .once("value")
      .then(snapshot => {
        if (snapshot.val().bases.includes(coin.symbol)) {
          exchanges.push({
            id: snapshot.key,
            name: snapshot.val().name,
            link: snapshot.val().link
          });
        }
      });
    await db
      .ref("exchanges/bitsonic")
      .once("value")
      .then(snapshot => {
        if (snapshot.val().bases.includes(coin.symbol)) {
          exchanges.push({
            id: snapshot.key,
            name: snapshot.val().name,
            link: snapshot.val().link
          });
        }
      });
    await db
      .ref("exchanges/coinbit")
      .once("value")
      .then(snapshot => {
        if (snapshot.val().bases.includes(coin.symbol)) {
          exchanges.push({
            id: snapshot.key,
            name: snapshot.val().name,
            link: snapshot.val().link
          });
        }
      });

    // db.ref("exchanges")
    //   .orderByChild("bases")
    //   .equalTo(coin.symbol)
    // db.collection("exchanges")
    //   .where("bases", "array-contains", coin.symbol)
    //   .get()
    // .once("value")
    // .then(snapshot => {
    //   snapshot.forEach(childSnapshot => {
    //     console.log(childSnapshot);
    //     console.log(childSnapshot.val());
    // const exchange = {
    //   id: childSnapshot.key,
    //   name: childSnapshot.val().name,
    //   link: childSnapshot.val().link
    // };
    // exchanges.push(exchange);
    // });
    await exchanges.sort((a, b) => {
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
    const coinAndExchanges = await { coin: coin, exchanges: exchanges };
    await dispatch({ type: SELECT_COIN, coinAndExchanges });
    // })
    // .catch(err => {
    //   dispatch({ type: SELECT_COIN_ERROR, err });
    // });
  };
};
