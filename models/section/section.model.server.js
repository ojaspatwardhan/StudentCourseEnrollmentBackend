var mongoose = require("mongoose");
var sectionSchema = require("./section.schema.server");

var sectionModel = mongoose.model("SectionModel", sectionSchema);

function createSection(section) {
  return sectionModel.create(section);
}

function findAllSections() {
  return sectionModel.find();
}

function findSectionsForCourse(courseId) {
  return sectionModel.find({courseId: courseId});
}

function deleteSection(sectionId) {
  sectionModel.remove({"_id": sectionId}, function(err) {
    if(err) {
      throw err
    }
    else {
    }
  });
}

function updateSection(section) {
  sectionModel.findByIdAndUpdate(section._id, {
    $set: {name: section.name, seats: section.seats}
  }, {
    new: true
  }, function(err) {
    if(err) {
      throw err;
    }
    else {
      console.log("updated");
    }
  });
}

function findSectionById(sectionId) {
  return sectionModel.findById(sectionId, function(err) {
    if(err) {
      throw err;
    }
    else {
      console.log("find section by id successful");
    }
  });
}

function decrementSectionSeats(sectionId) {
  console.log(sectionId);
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: -1}
  });
}

function incrementSectionSeats(sectionId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: +1}
  });
}

function addStudentInSection(sectionId, studentId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $push: {students: studentId}
  });
}

function deleteStudentInSection(sectionId, studentId) {
  sectionModel.findByIdAndUpdate(sectionId, {
    $pull: {students: studentId}
  }, {
    safe: true,
    upsert: true
  }, function(err) {
    if(err) {
      throw err;
    }
    else {
      console.log("deleteStudentInSection successful");
    }
  })
}

var api = {
  createSection: createSection,
  findAllSections: findAllSections,
  findSectionsForCourse: findSectionsForCourse,
  deleteSection: deleteSection,
  updateSection: updateSection,
  findSectionById: findSectionById,
  decrementSectionSeats: decrementSectionSeats,
  incrementSectionSeats: incrementSectionSeats,
  addStudentInSection: addStudentInSection,
  deleteStudentInSection: deleteStudentInSection
};

module.exports = api;
