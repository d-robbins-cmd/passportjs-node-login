const express = require('express')
const session = require('express-session')
const router = express.Router()
const bcrypt = require('bcryptjs')
const validateRegister = require('../validations/register')
const validateLogin = require('../validations/login.js')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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

const mongoose = require('mongoose')
const { render } = require('ejs')
mongoose.connect( process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true } );
const db = mongoose.connection
db.once('open', function() {
    console.log('db connected')
})
const userSchema = new mongoose.Schema({
    name: String,
    email: String, 
    password: String
});

const userModel = mongoose.model( 'User', userSchema )

//passport
passport.use( new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
}, ( username, password, done ) =>{
    userModel.findOne({ email: username }, ( err, user ) => {
        if ( err ) return done( err )
        if ( !user ) return done( null, null, { message : 'user not found' })
        return done( null, user )
    })
}))

passport.serializeUser( function( user, done ) {
  done( null, user._id )
})

passport.deserializeUser( function( id, done ) {
  userModel.findById( id, function( err, user ) {
    done( err, user )
  })
})


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
    const { name, email, password, password2 } = req.body

    if ( !result.isValid ){ 
        const errors = result.errors
        //send errors and form values back 
        res.render( 'register', { errors, name, email, password, password2 } )
    } else {
  
        let thisUser = new userModel({
            name: req.body.name, 
            email: req.body.email, 
            password: req.body.password
        })

        //does user already exist by email?
        userModel.findOne({ email: req.body.email }, ( err, user ) => {
            if ( user ){
                res.render('register', { errors: [{ message: 'This user has already registered' }] })
            }
        })

        bcrypt.genSalt( 10, function( err, salt ) {
            bcrypt.hash( password , salt, function( err, hash ) {
                thisUser.save(( err, result ) => {
                   res.render('login', { errors: [{ message: 'User successfully registerd'}]} )
                    
                })
            })
        })

    }
})


router.post( '/login', ( req, res ) => {
    let result = validateLogin( req.body )

    if ( !result.isValid ){
        //send form values back to the form 
        const { email, password } = req.body
        const errors = result.errors
        res.render( 'login', { errors, email, password })
    } else {


    }

})



module.exports = router