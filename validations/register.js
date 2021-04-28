const isEmpty = require('is-empty')
const validator = require('validator')

module.exports = function validateRegister ( data ){

    let errors = []

    if ( data.name === undefined || isEmpty( data.name )) { data.name = '' }
    if ( data.email === undefined || isEmpty( data.email )){ data.email = '' }
    if ( data.password === undefined || isEmpty( data.password )){ data.password = '' }
    if ( data.password2 === undefined || isEmpty ( data.password2 )){ data.password2 = '' }

    if ( validator.isEmpty( data.name )){
        errors.push({ message : 'The name field is required' })
    }
    if ( validator.isEmpty( data.email )){
        errors.push({ message: 'The email field is required' })
    } else if ( !validator.isEmail ( data.email )){ //there's a validation on client side but still...
        errors.push({ message: 'Not a valid email address' })
    }
    if ( validator.isEmpty( data.password )){
        errors.push({ message: 'The password field is required' })
    }
    if ( validator.isEmpty( data.password2 )){
        errors.push({ message: 'The password 2 field is required' })
    }

    //check password length
    if ( !validator.isLength( data.password, { min: 10, max: 20 } )){
        errors.push({ message: 'Password must be between 10 and 20 characters'})
    }

    //do passwords match?
    if ( !validator.equals( data.password, data.password2 )){
        errors.push({ message: 'Passwords must match' })
    }

    return {
        errors, 
        isValid: isEmpty( errors )
    }
}