const functions = require("firebase-functions");
const config = functions.config().firebase;
const admin = require("firebase-admin");
const request = require("request");
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

exports = module.exports = functions.https.onRequest((req, res) => {
  request(
    {
      method: "GET",
      url: "https://api.bithumb.com/public/ticker/ALL"
    },
    (err, response, result) => {
      if (err) {
        console.log(err);
        return;
      }
      const obj = JSON.parse(result);
      const bases = Object.keys(obj.data).filter(base => base !== "date");
      admin
        .firestore()
        .doc("exchanges/bithumb")
        .set({
          name: "Bithumb",
          link: "https://www.bithumb.com/",
          bases: bases
        })
        .then(() => {
          console.log("Successfully updated bithumb!");
          res.send("Done!");
        })
        .catch(err => {
          console.error("Error updating bithumb");
          res.status(500).send(err);
        });
    }
  );
});
