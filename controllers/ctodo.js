/**
 * collaborative todo Constructor.
 * @param {app} Express Object. 
 * @param {http} Standard Api Status Code.
 * @param {firebase} Firebase Object.
 * @param {ref} Database Object.
 * @return None
 */

function ctodo(app, https, firebase, ref, firebaseMiddleware) {
    this.app = app;
    this.https = https;
    this.firebase = firebase;
    this.ref = ref;
    this.firebaseMiddleware = firebaseMiddleware;
}

/**
 * collaborative todo Created Function.
 * @param {app} Express Object. 
 * @param {message} Standard Message Object.
 * @param {firebase} Firebase Object.
 * @param {ref} Database Object.
 * @return None
 */
ctodo.prototype.ctodoCreated = (app, https, firebase, ref, firebaseMiddleware) => {


    /**
	 * @api {post} /addctodo add personal todo.
	 * @apiName addctodo
	 * @apiGroup collaborative todo
	 *
	 * @apiParam {String} text collaborative todo text.
	 * @apiSuccess {Object} Sucess message with status code.
	 */
    app.post('/addctodo', firebaseMiddleware.auth, (req, res) => {
        var user = firebase.auth().currentUser;
        if (user != null && req.body.text != null && req.body.text != '') {
            // add collaborative values
            var collaborativetodoRef = ref.child("collaborativetodo");
            collaborativetodoRef.push(
                {
                    text: req.body.text,
                    date: new Date().toString(),
                    createdby: user.uid
                }
            );
            // response
            var response = {};
            response.message = "Collaborative Todo Add Sucessfully.";
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
	 * @api {post} /deletectodo delete collaborative todo.
	 * @apiName deletectodo
	 * @apiGroup collaborative todo
	 *
	 * @apiParam {String} text deleteid todo text.
     * @apiParam {String} text deletetext todo deletetext.
	 * @apiSuccess {Object} Sucess message with status code.
	 */
    app.post('/deletectodo', firebaseMiddleware.auth, (req, res) => {

        var user = firebase.auth().currentUser;
        if (user != null && req.body.deleteid != null && req.body.deletetext != null && req.body.deleteid != '' && req.body.deletetext != '') {
            
            // get collaboratives
            ref.child("collaborativetodo/" + req.body.deleteid).remove();
            // get all collaboratives values.
            var getAddTodo = ref.child("collaborativetodo");
            getAddTodo.on("value", function (snapshot) {
                todoData = snapshot.val();

                if (todoData != null) {
                    // response
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

        } else {
            var response = {};
            response.message = "Parameters are missing.!!!";
            response.status = https.BADREQUEST
            res.status(https.BADREQUEST).json(response);
        }
    });

    /**
	 * @api {post} /getctodo/:userid get collaborative todo.
	 * @apiName getctodo
	 * @apiGroup collaborative todo
	 *
	 * @apiParam {String} text userid.
	 * @apiSuccess {Object} Sucess message with status code.
	 */
    app.get('/getctodo/:userid', firebaseMiddleware.auth, (req, res) => {

        var user = firebase.auth().currentUser;
        if (user != null && req.params.user != null && req.params.userid != '' && req.params.userid == user.uid) {
            // get collaboratives todo values
            var todoRef = ref.child("collaborativetodo");
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


module.exports = ctodo;