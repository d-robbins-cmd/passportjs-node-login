const isEmpty = require('is-empty')
const validator = require('validator')

module.exports = function validateLogin( name, pass ){

    console.log('in validate ')
    console.log('name', name)
    console.log('pass', pass)

    let errors = []

    //if email is empty or undefined, empty string it 
    if ( name === undefined || isEmpty( name )){ name = '' }
    if ( pass === undefined || isEmpty( pass )){ pass = '' }

    if ( validator.isEmpty( name )){
        console.log('name is empty')
        errors.push ( 'The email field is required' )
    }
    if ( validator.isEmpty( pass )){
        console.log('pass is empty')
        errors.push ( 'The pass field is required' )
    }

    return {
        errors, 
        isValid : isEmpty ( errors )
    }


}