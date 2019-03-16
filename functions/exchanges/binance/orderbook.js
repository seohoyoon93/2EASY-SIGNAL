var request = require("request");
var exports = (module.exports = {});

exports.getAggOrderbook = function(symbol) {
  var options = {
    method: "GET",
    url: `https://api.binance.com/api/v1/depth?symbol=${symbol}&limit=1000`
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    var resp = JSON.parse(body);

    var bids = resp.bids;
    var asks = resp.asks;

    var totalBidQty = 0;
    for (i in bids) {
      totalBidQty += parseFloat(bids[i][1]);
    }

    var totalAskQty = 0;
    for (i in asks) {
      totalAskQty += parseFloat(asks[i][1]);
    }

    var result = {
      totalBidQty: totalBidQty,
      totalAskQty: totalAskQty,
      highestBidPrice: bids[0][0],
      lowestAskPrice: asks[0][0]
    };

    console.log(result);
  });
};
