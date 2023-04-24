const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const newStudentModel = require("../Models/studentModel");
const Admin = require("../Models/adminModel");




module.exports = function(passport) {
    passport.use("local-student",
        new LocalStrategy( { passReqToCallback: true},{ usernameField: "UserID" }, (req,UserID, password, done) => {
            // Match user
            console.log("heelllo");
            newStudentModel.findOne({
                ID: UserID
            }).then((user) => {
                console.log(user);
                if (!user) {
                    console.log("Btech karke bakri charawela")
                    req.flash('error', "Student not found");
                    return done(null, false);

                }

                console.log("function reaching here");
                // Match password
                bcrypt.compare(password, user.passwd, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        req.flash('error', "Password Incorrect");

                        return done(null, false);
                    }
                });
            });
        })
    );


    passport.use("local-admin", new LocalStrategy({ passReqToCallback: true},{ usernameField: "UserID" }, (req, UserID, password, done) => {
        Admin.findOne({ID: UserID}).then((user) => {
            if(!user) {
                console.log("Btech karke bakri charawela")
                req.flash('error', "Admin not found");
                return done(null, false);
            }

            bcrypt.compare(password, user.Passwd, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    console.log(user);
                    return done(null, user);
                } else {
                    req.flash('error', "Password Incorrect");
                    return done(null, false);
                }
            });
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, { _id: user.id, role: user.role });
    });

    passport.deserializeUser(function(id, done) {
        console.log(id.role);
        if(id.role === "student") {
            newStudentModel.findById(id).then(function(student) {
                done(null, student);
            }).catch(function(err) {
                done(err, null);
            });
        } else if(id.role === "admin") {
            Admin.findById(id).then(function(admin) {
                done(null, admin);
            }).catch(function(err) {
                done(err, null);
            });
        }
        else {
            done({ message: 'No entity found' }, null);
        }
    });
};
