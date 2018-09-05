/**
 * ptodo Constructor.
 * @param {app} Express Object. 
 * @param {http} Standard Api Status Code.
 * @param {firebase} Firebase Object.
 * @param {ref} Database Object.
 * @param {firebaseMiddleware} firebaseMiddleware Object.
 * @return None
 */

function ptodo(app, https, firebase, ref, firebaseMiddleware) {
    this.app = app;
    this.https = https;
    this.firebase = firebase;
    this.ref = ref;
    this.firebaseMiddleware = firebaseMiddleware;
}

/**
 * todo Created Function.
 * @param {app} Express Object. 
 * @param {message} Standard Message Object.
 * @param {firebase} Firebase Object.
 * @param {ref} Database Object.
 * @param {firebaseMiddleware} firebaseMiddleware Object.
 * @return None
 */
ptodo.prototype.ptodoCreated = (app, https, firebase, ref, firebaseMiddleware) => {



	/**
	 * @api {post} /addptodo add personal todo.
	 * @apiName addptodo
	 * @apiGroup personal todo
	 *
	 * @apiParam {String} text todo text.
	 * @apiSuccess {Object} Sucess message with status code.
	 */

    app.post('/addptodo', firebaseMiddleware.auth, (req, res) => {
        var user = firebase.auth().currentUser;
        if (user != null && user != null && req.body.text != null && req.body.text != '') {
            // add personal todo values.
            var todoRef = ref.child("todo");
            todoRef.child(user.uid).push(
                {
                    text: req.body.text,
                    date: new Date().toString()
                }
            );
            // response
            var response = {};
            response.message = "Todo Add Sucessfully.";
            response.status = https.OK
            res.status(https.OK).json(response);

        } else if (user == null) {
            var response = {};
            response.message = "User not sign in.";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
        else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
    });

    /**
	 * @api {post} /deleteptodo delete personal todo.
	 * @apiName deleteptodo
	 * @apiGroup personal todo
	 *
	 * @apiParam {String} deleteid deleteid text.
     * @apiParam {String} deletetext deletetext text.
	 * @apiSuccess {Object} Sucess message with status code.
	 */
    app.post('/deleteptodo', firebaseMiddleware.auth, (req, res) => {

        var user = firebase.auth().currentUser;
        if (user != null && user != '' && req.body.deleteid != null && req.body.deleteid != '' && req.body.deletetext != null && req.body.deletetext != '') {

            // update todo. .
            ref.child("todo/" + user.uid + "/" + req.body.deleteid).remove();

            // get all todo.
            var getAddTodo = ref.child("todo").child(user.uid);
            getAddTodo.on("value", function (snapshot) {
                todoData = snapshot.val();
                // response
                if (todoData != null) {
                    var response = {};
                    response.userid = req.params.userid;
                    response.data = todoData;
                    response.status = https.OK
                    res.status(https.OK).json(response);
                }
            });

        } else if (user == null) {
            var response = {};
            response.message = "User not sign in.";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
        else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
    });

    /**
	 * @api {get} /getptodo update personal todo.
	 * @apiName getptodo
	 * @apiGroup personal todo
	 *
	 * @apiParam {String} userid user id text.
	 * @apiSuccess {Object} Sucess message with status code.
	 */
    app.get('/getptodo/:userid', firebaseMiddleware.auth, (req, res) => {

        var user = firebase.auth().currentUser;
        if (user != null && user != '' && req.params.userid != null && req.params.userid != '' && req.params.userid == user.uid) {
            // get all todo.
            var todoRef = ref.child("todo").child(user.uid);
            todoRef.on("value", function (snapshot) {
                todoData = snapshot.val();

                if (todoData != null) {
                    var response = {};
                    response.userid = req.params.userid;
                    response.data = todoData;
                    response.status = https.OK
                    res.status(https.OK).json(response);
                }

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

        } else if (user == null) {
            var response = {};
            response.message = "User not sign in.";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
        else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
    });

};


module.exports = ptodo;