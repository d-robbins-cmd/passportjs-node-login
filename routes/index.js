const express = require('express')
const router = express.Router()
const validateRegister = require('../validations/register')
const validateLogin = require('../validations/login.js')
router.use( express.urlencoded( { extended: false } ) )
router.use( express.json() )
const flash = require('connect-flash')

//basic page GETss
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
    res.render( 'register' )
})


router.post( '/register', ( req, res ) => {
    let result = validateRegister( req.body )
    if ( !result.isValid ){

    }
})



router.post('/login', ( req, res ) => {
    let result = validateLogin( req.body )
    console.log('result', result )
})




module.exports = router