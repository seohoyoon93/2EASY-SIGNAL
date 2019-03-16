//Volume을 가져올 수 있음
var request = require("request");
var exports = (module.exports = {});

function getKlines(symbol) {
  var options = {
    method: "GET",
    url: `https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=1m&limit=1`
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    var resp = JSON.parse(body);

    var result = {
      start_time: resp[0][0],
      open: resp[0][1],
      high: resp[0][2],
      low: resp[0][3],
      close: resp[0][4],
      volume: resp[0][5],
      end_time: resp[0][6],
      quote_asset_vol: resp[0][7]
    };

    console.log(result);
  });
}

exports.postKlines = function(symbols) {
  for (i in symbols) {
    getKlines(symbols[i].symbol);

    setInterval(function() {
      getKlines(symbols[i].symbol);
    }, 60000);
  }
};
