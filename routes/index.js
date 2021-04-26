const express = require('express')
const router = express.Router()


//basic page GETss
router.get('/', ( req, res ) => {
    res.send('home route')
})
router.get( '/home', ( req, res ) => {
    res.send('home route')
})
router.get( '/login', ( req, res ) => {
    res.send('login route')
})
router.get( '/register', ( req, res ) => {
    res.send('register route')
})




module.exports = router