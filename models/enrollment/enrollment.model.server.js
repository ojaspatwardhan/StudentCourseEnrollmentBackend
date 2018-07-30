var mongoose = require("mongoose");
var enrollmentSchema = require("./enrollment.schema.server");

var enrollmentModel = mongoose.model("EnrollmentModel", enrollmentSchema);

function enrollStudentInSection(enrollment) {
  return enrollmentModel.create(enrollment);
}

function deleteEnrollment(enrollmentId) {
  console.log("inside enrollment model");
    enrollmentModel.findByIdAndRemove(enrollmentId,function (err,deleteEnrollment) {
        if(err)
        {

        }
        else
        {

        }
    });
}

function findSectionsForStudent(studentId) {
  return enrollmentModel
    .find({student: studentId})
    .populate('section')
    .exec();
}


function findEnrollmentForSection(sectionId) {
    console.log("inside ********** enrollment for a section********** in service")
    return enrollmentModel
        .find({section: sectionId})
        .populate('student')
        .exec();
}

var api = {
  enrollStudentInSection: enrollStudentInSection,
  findSectionsForStudent: findSectionsForStudent,
  deleteEnrollment: deleteEnrollment,
  findEnrollmentForSection: findEnrollmentForSection
};

module.exports = api;
