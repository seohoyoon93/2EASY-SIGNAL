const initState = {
  exchanges: [
    { id: "1", name: "업비트", link: "https://www.upbit.com" },
    { id: "2", name: "바이낸스", link: "https://www.binance.com" },
    { id: "3", name: "비트소닉", link: "https://www.bitsonic.com" }
  ]
};

const exchangeReducer = (state = initState, action) => {
  return state;
};

export default exchangeReducer;
