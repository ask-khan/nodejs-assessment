/**
 * User Constructor.
 * @param {app} Express Object. 
 * @param {message} Standard Message Object.
 * @param {http} Standard Api Status Code.
 * @param {logger} Logger Object.
 * @param {db} Database Object.
 * @param {User} User Model Object.
 * @return None
 */

function User(app, https, validator, firebase, ref) {
    this.app = app;
    this.https = https;
    this.validator = validator;
    this.firebase = firebase;
    this.ref = ref
}


/**
 * User Created Function.
 * @param {app} Express Object. 
 * @param {message} Standard Message Object.
 * @param {http} Standard Api Status Code.
 * @param {logger} Logger Object.
 * @param {db} Database Object.
 * @param {User} User Model Object.
 * @return None
 */
User.prototype.UserCreated = (app, https, validator, firebase, ref) => {

	/**
	 * @api {post} /signup Sign Up information.
	 * @apiName signup
	 * @apiGroup User
	 *
	 * @apiParam {String} User Name: User Name.
	 * @apiParam {String} Email: Email Addres.
	 * @apiParam {String} Password: Password.
	 * @apiSuccess {Object} Sucess message with status code.
	 */

    app.post('/signup', (req, res) => {

        // Create User Object.
        var newUser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        };
        if (newUser.username && newUser.password && newUser.email && validator.isEmpty(newUser.username) == false && validator.isEmpty(newUser.password) == false && validator.isEmpty(newUser.email) == false && validator.isEmail(newUser.email) == true) {
            firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password).then(function (response) {
                if (response.user.uid != '') {
                    var usersRef = ref.child("users");
                    usersRef.child(response.user.uid).set({
                        userid: response.user.uid,
                        username: req.body.username,
                        password: req.body.password,
                        email: req.body.email
                    });

                    var response = {};
                    response.message = "User Sign Up Sucessfully.";
                    response.status = https.OK
                    res.status(https.OK).json(response);
                }
            }).catch(function (error) {
                var response = {};
                response.message = error.message;
                response.status = https.BADREQUEST
                res.status(https.BADREQUEST).json(response);
            });
        } else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }


    });

    /**
	 * @api {post} /signin Sign in information.
	 * @apiName signin
	 * @apiGroup User
	 * @apiParam {String} Email: Email Addres.
	 * @apiParam {String} Password: Password.
	 * @apiSuccess {Object} Sucess message with status code.
	 */

    app.post('/signin', (req, res) => {

        if (req.body.email && req.body.password && validator.isEmpty(req.body.email) == false && validator.isEmail(req.body.email) == true && validator.isEmpty(req.body.password) == false) {
            firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function (response) {

                var userData, token = '';
                token = response.user._lat;

                var usersRef = ref.child("users").child(response.user.uid);
                usersRef.on("value", function (snapshot) {
                    userData = snapshot.val();

                    if (userData != null) {
                        var response = {};
                        userData.token = token;
                        response.data = userData;
                        response.message = "User sign in sucessfully.";
                        response.status = https.OK
                        res.status(https.OK).json(response);
                    }

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            }).catch(function (error) {
                // Handle Errors here.
                var response = {};
                response.message = error.message;
                response.status = https.BADREQUEST
                res.status(https.BADREQUEST).json(response);
            });
        } else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }

    });

    /**
	 * @api {post} /resetpassword Reset Password information.
	 * @apiName resetpassword
	 * @apiGroup User
	 *
	 * @apiParam {String} Email: Email Addres.
	 * @apiSuccess {Object} Sucess message with status code.
	 */
    app.post('/resetpassword', (req, res) => {

        if (req.body.email && validator.isEmail(req.body.email) == true) {
            firebase.auth().sendPasswordResetEmail(req.body.email).then(function (response) {
                var response = {};
                response.message = "Email Sent Sucessfully";
                response.status = https.OK
                res.status(https.OK).json(response);
            }).catch(function (error) {
                var response = {};
                response.message = error.message;
                response.status = https.BADREQUEST
                res.status(https.BADREQUEST).json(response);
            });
        } else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }

    });


    /**
	 * @api {post} /signout Sign out information.
	 * @apiName signout
	 * @apiGroup User
	 * @apiParam {String} userid: user uniquw id.
	 * @apiSuccess {Object} Sucess message with status code.
	 */
    app.post('/signout', (req, res) => {

        if (req.body.userid != null && req.body.userid != undefined) {

            firebase.auth().signOut()

            var response = {};
            response.message = "Sign out is sucessfully.";
            response.status = https.OK
            res.status(https.OK).json(response);

        } else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
    });
};

module.exports = User;