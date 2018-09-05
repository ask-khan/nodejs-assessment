/**
 * User Notifications.
 * @param {app} Express Object. 
 * @param {http} Standard Api Status Code.
 * @param {firebase} firebase Object.
 * @param {ref} ref Object.
 * @param {fcm} User Model Object.
 * @return None
 */

function Notifications(app, https, firebase, ref, firebaseMiddleware, fcm, messaging) {
    this.app = app;
    this.https = https;
    this.fcm = fcm;
    this.firebase = firebase;
    this.ref = ref
    this.firebaseMiddleware = firebaseMiddleware;
    this.messaging = messaging;
}

/**
 * User NotificationsCreated.
 * @param {app} Express Object. 
 * @param {http} Standard Api Status Code.
 * @param {firebase} firebase Object.
 * @param {ref} ref Object.
 * @param {fcm} User Model Object.
 * @return None
 */
Notifications.prototype.notificationsCreated = (app, https, firebase, ref, firebaseMiddleware, fcm, messaging) => {

    app.post('/sendpushnotifications', firebaseMiddleware.auth, (req, res) => {
        var user = firebase.auth().currentUser;
        if (user != null && user != '' && req.body.deviceID != null && req.body.deviceID != '') {
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: req.body.deviceID,
                collapse_key: 'green',

                notification: {
                    title: 'Title of your push notification',
                    body: 'Body of your push notification'
                },

                data: {  //you can send only notification or only data(or include both)
                    my_key: 'my value',
                    my_another_key: 'my another value'
                }
            };

            fcm.send(message, function (err, response) {
                if (err) {

                    var response = {};
                    response.message = "Something has gone wrong.";
                    response.status = https.BADREQUEST
                    res.status(https.BADREQUEST).json(response);
                } else {
                    var response = {};
                    response.message = "Successfully sent with response.";
                    response.status = https.OK
                    res.status(https.OK).json(response);
                }
            });
        } else if (user != null && user != '' && req.body.deviceID  ) { 
            // firebase message in web not working.
            // var notification = {
            //     'title': 'Sample Web Notifications',
            //     'body': '5 to 1',
            //     'icon': 'firebase-logo.png',
            //     'click_action': 'http://localhost:8081'
            //   };
              
            //   fetch('https://fcm.googleapis.com/fcm/send', {
            //     'method': 'POST',
            //     'headers': {
            //       'Authorization': 'key=' + key,
            //       'Content-Type': 'application/json'
            //     },
            //     'body': JSON.stringify({
            //       'notification': notification,
            //       'to': to
            //     })
            //   }).then(function(response) {
            //     console.log(response);
            //   }).catch(function(error) {
            //     console.error(error);
            //   })
        } 
        else if (user == null) {
            var response = {};
            response.message = "User not sign in.";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        } else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }

    });

};

module.exports = Notifications;