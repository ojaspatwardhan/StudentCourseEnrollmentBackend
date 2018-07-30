var mongoose = require("mongoose");
var userSchema = require("./user.schema.server");

var userModel = mongoose.model("UserModel", userSchema);

function createUser(user) {
  return userModel.create(user);
}

function findAllUsers() {
  return userModel.find();
}

function findUserById(userId) {
  return userModel.findById(userId);
}

function updateUser(user) {
  userModel.findByIdAndUpdate(user._id, {
    $set: {firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, address: user.address}
  }, {
    new: true
  }, function(err) {
    if(err) {
      throw err;
    }
    else {
      console.log("update working");
    }
  });
}

function findUserByCredentials(credentials) {
  return userModel.findOne(credentials, {username: 1});
}

function addSectionForStudent(sectionId, studentId) {
  return userModel.update({
    _id: studentId
  }, {
    $push: {sections: sectionId}
  });
}

function deleteSectionForStudent(sectionId, studentId) {
  return userModel.findByIdAndUpdate(studentId, {
    $pull: {sections: sectionId}
  },{
    safe: true,
    upsert: true
  }, function(err) {
    if(err) {
      throw err;
    }
    else {
      console.log("deleteSectionForStudent successful");
    }
  })
}

var api = {
  createUser: createUser,
  findAllUsers: findAllUsers,
  findUserById,
  updateUser: updateUser,
  findUserByCredentials: findUserByCredentials,
  addSectionForStudent: addSectionForStudent,
  deleteSectionForStudent: deleteSectionForStudent
};

module.exports = api;
