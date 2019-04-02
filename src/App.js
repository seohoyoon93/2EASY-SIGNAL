import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";

import Popup from "./components/Popup";
import Coins from "./components/Coins";
import Exchanges from "./components/Exchanges";
import Volume from "./components/Volume";
import Price from "./components/Price";
import Orderbook from "./components/Orderbook";
import BidAsk from "./components/BidAsk";
import firebase from "./config/fbConfig";

class App extends Component {
  constructor(props) {
    super(props);
    window.Kakao.init("3e5e4aeea8c7475b5efd977b69e4180c");
    this.state = {
      visitors: "-",
      isPopupHidden: true
    };
    this.togglePopup = this.togglePopup.bind(this);
  }
  componentDidMount() {
    window.Kakao.Link.createDefaultButton({
      container: "#kakao-link-btn",
      objectType: "feed",
      content: {
        title: "EGG SIGNAL(beta)",
        description: "암호화폐 선동비율 트래커",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/twoeasy-signal.appspot.com/o/kakao-share%403x.png?alt=media&token=b636974a-7f03-418b-8707-70a1c0f613a9",
        link: {
          mobileWebUrl: "https://eggsignal.com",
          webUrl: "https://eggsignal.com"
        }
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: {
            mobileWebUrl: "https://eggsignal.com",
            webUrl: "https://eggsignal.com"
          }
        }
      ]
    });

    firebase
      .firestore()
      .doc("views/count")
      .get()
      .then(doc => {
        this.setState({ visitors: doc.data().count });
      })
      .catch(err => {
        console.log("error retrieving count data");
      });
  }
  togglePopup(e, data) {
    console.log("toggle popup");
    this.setState(state => ({ isPopupHidden: !state.isPopupHidden }));
  }
  render() {
    const goTradeLink = (function(exchange, coin) {
      switch (exchange) {
        case "Upbit":
          return `https://upbit.com/exchange?code=CRIX.UPBIT.KRW-${coin}`;
        case "Bitsonic":
          return `https://bitsonic.co.kr/front/exchange/${coin}-krw`;
        case "Coinbit":
          return `https://www.coinbit.co.kr/trade/order/krw-${coin}`;
        case "Bithumb":
          return `https://www.bithumb.com/trade/order/${coin}`;
        default:
          return null;
      }
    })(this.props.selectedExchange, this.props.selectedCoin);
    return (
      <div className="App">
        <Popup
          isHidden={this.state.isPopupHidden}
          togglePopup={this.togglePopup}
        />
        <div className="header">
          <div className="header-top">
            <h1>
              SIGNAL <span>by Eastern Golden Egg(beta)</span>
            </h1>
            <div className="visitors">
              <p>누적 방문자수</p>
              <p>{this.state.visitors}</p>
            </div>
          </div>
          <div className="header-bottom">
            <div className="header-btns">
              <div className="info">
                <button className="info-btn" onClick={this.togglePopup}>
                  EGG SIGNAL 소개
                </button>
              </div>
              <div className="info">
                <a
                  className="kakao-link"
                  id="kakao-link-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  KaKaoTalk 공유
                </a>
              </div>
              <div className="info">
                <a
                  className="telegram-link"
                  href="https://telegram.me/share/url?url=https://eggsignal.com&text=EGG%20SIGNAL%20-%20암호화폐%20선동비율%20트래커"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram 공유
                </a>
              </div>
            </div>
          </div>
        </div>
        <Coins />
        <Exchanges />
        <Orderbook />
        <Volume />
        <Price />
        <BidAsk />
        <a href={goTradeLink} target="_blank" rel="noopener noreferrer">
          <Button content="거래하기" className="go-trade" />
        </a>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedExchange: state.exchange.selectedExchange,
    selectedCoin: state.coin.selectedCoin
  };
};

export default connect(mapStateToProps)(App);
