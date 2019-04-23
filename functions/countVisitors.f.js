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
  // const db = admin.firestore();
  // const numVisitorsRef = db.collection("views").doc("count");
  numVisitorsRef.transaction(currentValue => {
    return (currentValue || 0) + 1;
  });
  // .runTransaction(transaction => {
  //   return transaction.get(numVisitorsRef).then(doc => {
  //     if (!doc.exists) {
  //       throw "Count does not exist";
  //     }

  //     let newCount = doc.data().count + 1;
  //     transaction.update(numVisitorsRef, { count: newCount });
  //   });
  // })
  // .then(() => {})
  // .catch(err => {
  //   request.post(constants.SLACK_WEBHOOK_URL, {
  //     json: { text: `Counting visitor failed: ${err}` }
  //   });
  //   console.log("Count failed: ", err);
  // });
});
