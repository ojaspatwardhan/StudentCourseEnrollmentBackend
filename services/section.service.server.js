module.exports = function(app) {
  var sectionModel = require("../models/section/section.model.server");
  var userModel = require('../models/user/user.model.server');
  var enrollmentModel = require('../models/enrollment/enrollment.model.server');

  console.log("Inside section.service.server");

  app.post("/api/course/:id/section", createSection);
  app.get("/api/course/:id/section", findSectionsForCourse);
  app.delete("/api/section/:sectionId", deleteSection);
  app.put("/api/section/:sectionId", updateSection);
  app.get("/api/section/:sectionId", findSectionById);
  app.post("/api/student/:sectionId/section", enrollStudentInSection);
  app.get("/api/student/section", findSectionsForStudent);
  app.delete("/api/student/:sectionId/section", unenrollStudentInSection);

  function createSection(req, res) {
    var section = req.body;
    sectionModel.createSection(section)
    .then(function(section) {
      res.send(section);
    });
  }

  function findSectionsForCourse(req, res) {
    var courseId = req.params["id"];
    sectionModel.findSectionsForCourse(courseId)
    .then(function (sections) {
      res.json(sections);
    });
  }

  function deleteSection(req, res) {
    var sectionId = req.params["sectionId"];
    sectionModel.deleteSection(sectionId);
    res.send(sectionId);
  }

  function updateSection(req, res) {
    var section = req.body;
    console.log(section);
    sectionModel.updateSection(section);
    res.send(section);
  }

  function findSectionById(req, res) {
    var sectionId = req.params["sectionId"];
    sectionModel.findSectionById(sectionId).then(function(section) {
      res.json(section);
    });
  }

  function findSectionsForStudent(req, res) {
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    enrollmentModel.findSectionsForStudent(studentId)
    .then(function(enrollments) {
      res.json(enrollments);
    });
    console.log("inside findSectionsForStudent" + " " + currentUser + " " + studentId);
  }

  function enrollStudentInSection(req, res) {
    var sectionId = req.params.sectionId;
    var currentUser = req.session['currentUser'];
    var studentId = currentUser._id;
    var enrollment = {
      student: studentId,
      section: sectionId,
        grade: "A"
    };
    console.log("section id" + " " + sectionId + " " + "student id" + " " + studentId + " " + "enrollment" + " " + enrollment);
    sectionModel.decrementSectionSeats(sectionId)
    .then(function() {
      return userModel.addSectionForStudent(sectionId, studentId)
      .then(function() {
        return sectionModel.addStudentInSection(sectionId, studentId)
      }).then(function() {
        return enrollmentModel.enrollStudentInSection(enrollment)
        .then(function(enrollment) {
          res.json(enrollment);
        })
      })
    });
  }

  function unenrollStudentInSection(req, res) {
    var sectionId = req.params.sectionId;
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    // console.log("section id" + " " + sectionId + " " + "student id" + " " + studentId);
    sectionModel.incrementSectionSeats(sectionId)
    .then(function() {
      return userModel.deleteSectionForStudent(sectionId, studentId)
      .then(function() {
        return sectionModel.deleteStudentInSection(sectionId, studentId)
      }).then(function() {
        enrollmentModel.findSectionsForStudent(studentId)
        .then(function(enrollments) {
          enrollments.map((enrollment) => {
            if(enrollment.section != null) {
              console.log("Enrollment section" + " " + enrollment.section);
              if(enrollment.section._id == sectionId) {
                console.log("Enrollment id" + " " + enrollment._id);
                enrollmentModel.deleteEnrollment(enrollment._id);
              }
            }
          })
        })
      }).then(() => res.send("unenrolled"))
    });
  }
}
