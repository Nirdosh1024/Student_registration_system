const bcrypt = require('bcrypt');
const Student = require('../Models/studentModel')


async function passwordGenerator(Rank,Branch){
    const password = await Rank+Branch
    
    
bcrypt.genSalt(10, function (saltError, salt) {
    if (saltError) {
      throw saltError
    } else {
      bcrypt.hash(password, salt, function(hashError, hash) {
        if (hashError) {
          throw hashError
        } return(hash)
        },)}
    }
    )}

    module.exports= { passwordGenerator}