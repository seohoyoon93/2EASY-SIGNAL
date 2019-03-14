const initState = {
  coins: [
    { id: "1", sym: "BTC", name: "Bitcoin(BTC)" },
    { id: "2", sym: "ETH", name: "Ethereum(ETH)" },
    { id: "3", sym: "XRP", name: "Ripple(XRP)" },
    { id: "4", sym: "BCHABC", name: "Bitcoin Cash(BCHABC)" },
    { id: "5", sym: "EOS", name: "EOS.IO(EOS)" }
  ]
};

const coinReducer = (state = initState, action) => {
  switch (action.type) {
    case "SELECT_COIN":
      console.log("select coin", action.coin);

    default:
      return state;
  }
};

export default coinReducer;
