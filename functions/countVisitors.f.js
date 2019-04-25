const functions = require("firebase-functions");
const admin = require("firebase-admin");
const request = require("request");
const constants = require("constants");
const config = functions.config().firebase;
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

exports = module.exports = functions.https.onCall((data, context) => {
  const db = admin.database();
  const numVisitorsRef = db.ref("views/count");
  numVisitorsRef.transaction(currentValue => {
    return (currentValue || 0) + 1;
  });
});
