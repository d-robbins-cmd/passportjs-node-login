const isEmpty = require('is-empty')
const validator = require('validator')

module.exports = function validateLogin( data ){

    let errors = {}

    //if email is empty or undefined, empty string it 
    if ( data.email === undefined || isEmpty( data.email )){ data.email = '' }
    if ( data.password === undefined || isEmpty( data.password )){ data.password = '' }

    if ( !validator.isEmail ( data.email )){
        errors.email = 'The email field must be valid email'
    }

    if ( validator.isEmpty( data.email )){
        errors.email = 'The email field is required'
    }
    if ( validator.isEmpty( data.password )){
        errors.password = 'The password field is required'
    }

    return {
        errors, 
        isValid : isEmpty ( errors )
    }


}