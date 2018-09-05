// Declare express library.
const express = require('express');

// Declare validator library.
var validator = require('validator');

// Body parsing middleware library.
const bodyParser = require('body-parser');
// firebase middleware library.
var firebaseMiddleware = require('express-firebase-middleware');

//Logger library.
const logger = require('winston');

var firebaseAdmin = require("firebase-admin");

// Firebase library.
var firebase = require("firebase");

// Puch Notifications.
var FCM = require('fcm-node');
var serverKey = 'AAAAPNnBFFg:APA91bF7gxunrDxdSKH1BvCAtrq1Xkc8avuA3HL_UhGE1mHaFamTYUqKOQGBEKt8hp7yS7YxIW-i4Eu8hGfEZKrmt9v7cnPzefU_2E6i_ThvyNdIUar__xeuAEl4C64o-T13oUdn3YeW'; //put your server key here
var fcm = new FCM(serverKey)

//var messaging = require('firebase-messaging');

// Const https response.
const https = require(__dirname + '/https.js');

var oauth = require(__dirname + '/authorize.js');

// Add user controller.
const userControllers = require(__dirname + '/controllers/user.js');

// Notifications controller.
const todoNotificationsControllers = require(__dirname + '/controllers/notifications.js');

// personal todo controller.
const ptodoControllers = require(__dirname + '/controllers/ptodo.js');
// collaborative todo controller
const ctodoControllers = require(__dirname + '/controllers/ctodo.js');

var serviceAccount = require( __dirname  + "/serviceAccountKey.json");

var configJSON = {
    apiKey: "AIzaSyCkPSqpV4H8_Rr1lwjbfx9tlnI3Zg6zEMo",
    authDomain: "sample-project-2-1595e.firebaseapp.com",
    databaseURL: "https://sample-project-2-1595e.firebaseio.com",
    projectId: "sample-project-2-1595e",
    storageBucket: "sample-project-2-1595e.appspot.com",
    messagingSenderId: "261351347288"
};

firebase.initializeApp(configJSON);

//var messagingObject = firebase.messaging();
//messagingObject.usePublicVapidKey("BBIAjZH9Xe12o422wbf-Vv8y4-ILejmJYc0qF_rmyk3xQ3QM70GQcJ3RXVJoMLAGn9BMhSp5PMCv2iErkUv6dTc");

// Get a database reference to our blog
var db = firebase.database();
var ref = db.ref("server/saving-data/fireblog");

const app = express();

// Parse Application/ x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true }));

// Returns middleware that only parses json 
app.use(bodyParser.json());


app.get('/', (req, res) =>  res.send({status: 'Ok'}));

// user Controller.
var userControllersObject = new userControllers(app, https, validator, firebase, ref );
userControllersObject.UserCreated(app, https, validator, firebase, ref);

// ptoddo Controller.
var ptoddoControllerObject = new ptodoControllers(app, https, firebase, ref, firebaseMiddleware);
ptoddoControllerObject.ptodoCreated(app, https, firebase, ref, firebaseMiddleware) ;

// ctodo Controller.
var ctoddoControllerObject = new ctodoControllers(app, https, firebase, ref, firebaseMiddleware);
ctoddoControllerObject.ctodoCreated(app, https, firebase, ref, firebaseMiddleware) ;

var todonotificationsObject = new todoNotificationsControllers( app, https, firebase, ref, firebaseMiddleware, fcm);
todonotificationsObject.notificationsCreated(app, https, firebase, ref, firebaseMiddleware, fcm);

module.exports = app;
// Port Listen.



