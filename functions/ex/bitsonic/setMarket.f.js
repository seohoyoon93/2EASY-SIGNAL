const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = functions.config().firebase;
const request = require("request");
const constants = require("../../constants");
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

exports = module.exports = functions.https.onRequest((req, res) => {
  const bases = [
    "TUSD",
    "STORM",
    "BTC",
    "XRP",
    "ZIL",
    "DASH",
    "BTG",
    "KREX",
    "XLM",
    "ETH",
    "ARTS",
    "FNB",
    "BOLT",
    "XTX",
    "OMG",
    "EOS",
    "EVZ",
    "ALP",
    "DEAL",
    "GXC",
    "LTC",
    "DRC",
    "BNB",
    "CLB",
    "RVN",
    "TRX",
    "RET",
    "DXR",
    "BSC",
    "MANA",
    "REP",
    "MVL",
    "ISR",
    "BAT",
    "ZPR",
    "ADA",
    "DOCK",
    "ONT",
    "CNN",
    "DXG",
    "QKC",
    "LINK",
    "BCH",
    "POLY",
    "QLC",
    "YEED",
    "TNB",
    "VIB",
    "QTUM",
    "FUEL",
    "MTL",
    "ROM",
    "MDA",
    "SNT",
    "NPXS",
    "ARN",
    "CDT",
    "GVT",
    "PHX",
    "RCN",
    "GO",
    "LEND",
    "NANO",
    "KNC",
    "XVG",
    "MFT",
    "PAX",
    "VIA",
    "WTC",
    "IOTA",
    "ICX",
    "NEO",
    "IOTX",
    "KEY",
    "VET",
    "WAN",
    "APPC",
    "DNT",
    "AION",
    "FUN",
    "STRAT",
    "CND",
    "NEBL",
    "ELF",
    "APOT",
    "OST",
    "YOYO",
    "XMR",
    "ZEN",
    "CVC",
    "SKY",
    "SC",
    "ETC",
    "ZEC",
    "IOST",
    "GTO",
    "NCASH",
    "HC",
    "BCHSV",
    "MCO",
    "MOD",
    "BCD",
    "AMB",
    "NXS",
    "XEM",
    "LSK",
    "BCPT",
    "HOT",
    "POE",
    "POA",
    "CMT",
    "DCR",
    "FEMI",
    "SUNC",
    "O2O",
    "FRNT",
    "TUDA",
    "IUC"
  ];
  admin
    .database()
    .ref("exchanges/bitsonic")
    .set({
      name: "Bitsonic",
      link: "https://bitsonic.co.kr",
      bases: bases
    })
    .then(() => {
      console.log("Successfully updated bitsonic!");
      res.send("Done");
    })
    .catch(err => {
      request.post(constants.SLACK_WEBHOOK_URL, {
        json: { text: `Bitsonic set markets db writing error: ${err}` }
      });
      console.error("Error updating bitsonic");
      res.status(500).send(err);
    });
});
