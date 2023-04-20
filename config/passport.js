const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const newStudentModel = require("../Models/studentModel");


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "UserID" }, (UserID, password, done) => {
            // Match user
            console.log("heelllo");
            newStudentModel.findOne({
                ID: UserID
            }).then((student) => {
                console.log(student);
                if (!student) {
                    return done(null, false);
                }

                console.log("function reaching here");
                // Match password
                bcrypt.compare(password, student.passwd, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, student);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );

    passport.serializeUser(function(student, done) {
        done(null, student.id);
    });

    passport.deserializeUser(function(id, done) {
        newStudentModel.findById(id).then(function(student) {
            done(null, student);
        }).catch(function(err) {
            done(err, null);
        });
    });
};
