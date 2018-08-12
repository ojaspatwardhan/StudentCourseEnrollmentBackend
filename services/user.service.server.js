module.exports = function(app) {
  var userModel = require("../models/user/user.model.server");

  app.get("/api/user", findAllUsers);
  app.post("/api/user", createUser);
  app.post("/api/user/admin", createUserByAdmin);
  app.get("/api/profile", profile);
  app.get("/api/user/:userId", findUserById);
  app.get("/api/forgotPassword/:emailId", findUserByEmail);
  app.put("/api/profile", updateUser);
  app.post("/api/logout", logout);
  app.post("/api/login", login);
  app.delete("/api/delete/:id", deleteUser);

  function createUser(req, res) {
    var user = req.body;
    userModel.createUser(user)
    .then(function(user) {
      req.session['currentUser'] = user;
      res.send(user);
    });
  }

  function createUserByAdmin(req, res) {
    var user = req.body;
    console.log(user);
    userModel.createUser(user)
    .then(function(user) {
      console.log("User created by admin");
      res.json(user);
    });
  }

  function deleteUser(req, res) {
    var id = req.params["id"];
    userModel.deleteUser(id).then(function(user) {
      res.json(user);
    });
  }

  function profile(req, res) {
    var user = req.session['currentUser'];
    if(user != undefined) {
      userModel.findUserById(user._id)
      .then(function (user) {
        // res.send(user);
        // console.log(user);
        res.json(user);
      });
    }
  }

  function findAllUsers(req, res) {
    userModel.findAllUsers().then(function(users) {
      res.send(users);
    })
  }

  function findUserById(req, res) {
    var id = req.params['userId'];
    userModel.findUserById(id)
    .then(function(user) {
      res.json(user);
    });
  }

  function findUserByEmail(req, res) {
    var emailId = req.params["emailId"];
    userModel.findUserByEmail(emailId).then(function(user) {
      res.json(user);
    });
  }

  function updateUser(req, res) {
      var user = req.body;
      console.log(user);
      userModel.updateUser(user);
      res.send(user);
  }

  function logout(req, res) {
    req.session.destroy();
    res.sendStatus(200);
  }

  function login(req, res) {
    var credentials = req.body;
    userModel.findUserByCredentials(credentials).then(function(user) {
      req.session['currentUser'] = user;
      console.log(user);
      res.json(user);
      // res.send(user);
    });
  }
}
