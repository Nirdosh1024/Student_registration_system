const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const newStudentModel = require("../Models/studentModel");
const Admin = require("../Models/adminModel");


module.exports = function(passport) {
    passport.use("local-student",
        new LocalStrategy({ usernameField: "UserID" }, (UserID, password, done) => {
            // Match user
            newStudentModel.findOne({
                ID: UserID
            }).then((user) => {
                //console.log(user)
                if (!user) {
                    return done(null, false, {message: "That Id is not registered" });
                }

                // Match password
                bcrypt.compare(password, String(user.passwd).trim(), (err, isMatch) => {
                    if (err) throw err;
                    //console.log(isMatch)
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {messsage: "Password Incorrect" });
                    }
                });
            });
        })
    );




    passport.use("local-admin", new LocalStrategy({ usernameField: "UserID" }, (UserID, password, done) => {
        Admin.findOne({ID: UserID}).then((user) => {
            if(!user) {
                return done(null, false, { message: "Admin not found" });
            }

            bcrypt.compare(password, user.Passwd, (err, isMatch) => {
                
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Password Incorrect" });
                }
            });
        })
    }))

    passport.serializeUser(function(user, done) {
        if(user.role === "student") {
            done(null, { _id: user.id, role: user.role, name: user.Name, JEERoll: user.ID });
        }
        else {
            done(null, { _id: user.id, role: user.role });
        }
    });

    passport.deserializeUser(function(id, done) {
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
            done(null, false, { message: 'No entity found' });
        }
    });
};
