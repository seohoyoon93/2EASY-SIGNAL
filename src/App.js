import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import Coins from "./components/Coins";
import Exchanges from "./components/Exchanges";
import Volume from "./components/Volume";
import Price from "./components/Price";
import Orderbook from "./components/Orderbook";
import BidAsk from "./components/BidAsk";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="header">
          <div className="header-text">
            <h1>FOMO WATCHER</h1>
            <h3>어디에 투자하시겠습니까?</h3>
          </div>
          <div className="header-icons">
            <a
              className="community-link"
              href="https://coinpan.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/icon_document.svg" alt="community" />
            </a>
            <img src="/images/icon_refresh.svg" alt="refresh" />
          </div>
        </div>
        <Coins />
        <Exchanges />
        <Volume />
        <Price />
        <Orderbook />
        <BidAsk />
        <Button content="거래하기" className="go-trade" />
      </div>
    );
  }
}

export default App;
