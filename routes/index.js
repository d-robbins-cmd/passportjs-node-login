const express = require('express')
const session = require('express-session')
const router = express.Router()
const bcrypt = require('bcryptjs')
const validateRegister = require('../validations/register')
const validateLogin = require('../validations/login.js')
router.use( express.urlencoded( { extended: false } ) )
router.use( express.json() )
const flash = require('connect-flash')
router.use( session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
router.use( flash() )

//basic page GET
router.get('/', ( req, res ) => {
    res.render( 'home' )
})
router.get( '/home', ( req, res ) => {
    res.render( 'home' )
})
router.get( '/login', ( req, res ) => {
    res.render( 'login' )
})



router.get( '/register', ( req, res ) => {
    res.render('register')
})

router.post( '/register', ( req, res ) => {

    let result = validateRegister( req.body )

    if ( !result.isValid ){ 
        //send the form values back into the form
        const { name, email, password, password2 } = req.body
        const errors = result.errors
        res.render( 'register', { errors, name, email, password, password2 } )
    }

    bcrypt.genSalt( 10, function( err, salt ) {
    bcrypt.hash( password , salt, function( err, hash ) {
        
    });
}); 

})


router.post( '/login', ( req, res ) => {
    let result = validateLogin( req.body )
    if ( !result.isValid ){
        //send form values back to the form 
        const { email, password } = req.body
        const errors = result.errors
        console.log('errors', errors)
        res.render( 'login', { errors, email, password })
    }



})

module.exports = router