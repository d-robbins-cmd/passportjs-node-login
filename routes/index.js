const express = require('express')
const session = require('express-session')
const router = express.Router()
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
        req.flash( 'errors', result.errors )  

        //send the form values back to the form
        const formValues = {
            name: req.body.name, 
            email: req.body.email, 
            password: req.body.password, 
            password2: req.body.password2
        }
        req.flash( 'formValues', formValues )

        res.locals.message = req.flash()
        res.render('register')
    }
})



router.post('/login', ( req, res ) => {
    let result = validateLogin( req.body )
    console.log('result', result )
})

module.exports = router