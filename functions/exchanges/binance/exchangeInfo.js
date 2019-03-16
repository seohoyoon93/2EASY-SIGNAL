//Symbols(Trading pair)를 가져올 수 있음
var rp = require("request-promise");
var exports = (module.exports = {});

exports.postExchangeInfo = function() {
  var options = {
    method: "GET",
    url: "https://api.binance.com/api/v1/exchangeInfo"
  };

  return rp(options).then(body => {
    var symbols = JSON.parse(body).symbols;

    var pairs = symbols
      .filter(function(elem) {
        if (
          elem.symbol.substring(elem.symbol.length - 3, elem.symbol.length) ==
            "BTC" ||
          elem.symbol.substring(elem.symbol.length - 4, elem.symbol.length) ==
            "USDT"
        ) {
          return true;
        }
        return false;
      })
      .map(function(elem) {
        var priceTick = elem.filters[0].tickSize;

        var sizeTick = elem.filters[2].stepSize;

        return {
          symbol: elem.symbol,
          priceTick: priceTick,
          sizeTick: sizeTick
        };
      });

    return pairs;
  });
};
