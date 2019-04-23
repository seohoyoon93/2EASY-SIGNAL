import React from "react";
import ReactDOM from "react-dom";
import "./css/index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
// import { reduxFirestore, getFirestore } from "redux-firestore";
// import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
// import { reactReduxFirebase } from "react-redux-firebase";
import rootReducer from "./store/reducers/rootReducer";
import firebase from "./config/fbConfig";

const store = createStore(
  rootReducer,
  compose(
    // applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    applyMiddleware(thunk)
    // reduxFirestore(firebase),
    // reactReduxFirebase(firebase)
  )
);
const hitCounter = firebase.functions().httpsCallable("countVisitors");
hitCounter();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
