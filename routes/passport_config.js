const passport = require('passport')
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy


function initialize(passport,getUserByUserID,getUserByID,getPasswd){
    const authenicateUser = async (UserID, password, done) => {
        const user = getUserByUserID(UserID)
        if (user == null) {
            return done(null, false, { message : "No user with this Id" })
        }

        try {
            if (await bcrypt.compare(password,getPasswd)){
                return done(null,user)
            }
            else{
                return done(null, false, { message : 'Password incorrect'})
            }
        } catch(e) {
            return done(e)
        }

    } 
    passport.use(new localStrategy({ usernameField: 'UserID'}, authenicateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
       return done(null,getUserByID(id) )
    })




}

module.exports =  initialize