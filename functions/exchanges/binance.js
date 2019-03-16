var exchangeInfo = require("./binance/exchangeInfo");
var klines = require("./binance/klines");
var orderbook = require("./binance/orderbook");
var exports = (module.exports = {});

exports.binance = function() {
  exchangeInfo
    .postExchangeInfo()
    .then(pairs => {
      console.log(pairs);
      klines.postKlines(pairs);

      orderbook.getAggOrderbook(pairs[1].symbol);
    })
    .catch(err => {
      console.log("Got an error from postExchangeInfo(): ", err);
    });
};
