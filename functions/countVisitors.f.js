const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = functions.config().firebase;
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

exports = module.exports = functions.https.onCall((data, context) => {
  const db = admin.firestore();
  const numVisitorsRef = db.collection("views").doc("count");
  return db
    .runTransaction(transaction => {
      return transaction.get(numVisitorsRef).then(doc => {
        if (!doc.exists) {
          throw "Count does not exist";
        }

        let newCount = doc.data().count + 1;
        transaction.update(numVisitorsRef, { count: newCount });
      });
    })
    .then(() => {})
    .catch(err => {
      console.log("Count failed: ", err);
    });
});
