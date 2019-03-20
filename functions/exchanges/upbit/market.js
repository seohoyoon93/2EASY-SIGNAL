const request = require("request");

request(
  {
    method: "GET",
    url: "https://api.upbit.com/v1/market/all"
  },
  (err, response, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  }
);
