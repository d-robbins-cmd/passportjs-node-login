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
    saveUninitialized: false
}))
router.use( passport.initialize() )
router.use( passport.session() )
router.use( flash() )

//mongoose
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
}, ( username, password, done ) => {

    userModel.findOne({ email: username }, ( err, user ) => {
        if ( err ){
            return done( err, null )
        }
        if ( !user ) {
            return done( null, false, { message : 'user not found' })  
        }

        bcrypt.compare( password, user.password, ( err, isValid ) => {
            if ( err ) {
              return done( err )
            }
            if ( !isValid ) {
              return done( null, null )                  
            }
            return done( null, user )                   
          })
    })


}))

passport.serializeUser( function( user, done ) {
  done( null, user._id ) //mongo uses "_id"
})

passport.deserializeUser( function( id, done ) {
  userModel.findById( id, function( err, user ) {
    done( err, user )
  })
})

const isLoggedIn = ( req, res, next ) => {
    if ( req.isAuthenticated() ) {
        next()
    } else { 
        res.render( 'login', { authenticated: req.isAuthenticated(), uName: '' }  )
    }
}

//basic page GET
router.get('/', ( req, res ) => {
    let uName = ( req.user ) ? req.user.name : ''
    res.render( 'home', { authenticated: req.isAuthenticated(), uName: uName } )
})
router.get( '/home', ( req, res ) => {
    let uName = ( req.user ) ? req.user.name : ''
    res.render( 'home' , { authenticated: req.isAuthenticated(), uName: uName })
})
router.get( '/login', ( req, res ) => {
    let uName = ( req.user ) ? req.user.name : ''
    res.render( 'login', { authenticated: req.isAuthenticated(), uName: '' } )
})
router.get( '/register', ( req, res ) => {
    res.render( 'register', { authenticated: req.isAuthenticated(), uName:'' } )
})
router.get( '/protected', isLoggedIn, ( req, res ) => {
    let uName = ( req.user ) ? req.user.name : ''
    res.render( 'protected' , { authenticated: req.isAuthenticated(), uName: uName })
})
router.get( '/logout', function( req, res ){
    req.logout()
    res.redirect( '/' )
})
router.post( '/register', ( req, res ) => {

    let result = validateRegister( req.body )
    const { name, email, password, password2 } = req.body

    if ( !result.isValid ){ 
        const errors = result.errors
        //send errors and form values back 
        res.render( 'register', { errors, 
                                  name, 
                                  email, 
                                  password, 
                                  password2, 
                                  authenticated: req.isAuthenticated(),
                                  uName: '' } )
    }  
    else 
    {
  
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
                thisUser.password = hash
                thisUser.save(( err, result ) => {
                   if ( err ) return err
                   res.render('login', { errors: [{ message: 'User successfully registerd'}], authenticated: req.isAuthenticated(), uName: '' }  )
                })
            })
        })
   }
})
router.post('/login', 
    passport.authenticate( 'local',   
     {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }),
    ( req, res ) => {
        res.render('home')
    }
)



module.exports = router