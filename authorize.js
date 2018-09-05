
var firebaseAdmin = require("firebase-admin");
var serviceAccount = require( __dirname  + "/serviceAccountKey.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://sample-project-2-1595e.firebaseio.com"
});

var verification = function (req, res) {
    if ( req && req.body.token != null )  {
        firebaseAdmin.auth().verifyIdToken(req.body.token)
        .then(function (decodedToken) {
            console.log(decodedToken.user_id);
            if (decodedToken.user_id) {

                //callback(true);
            } else {
                //callback(null);
            }
        }).catch(function (error) {
            // Handle error
            //callback(null);
        });      
    }
    
}

module.exports = verification;