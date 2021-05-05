require('dotenv').config()
const express = require( 'express' )
const app = express()
const port = process.env.PORT || 5000
const routes = require( './routes/index' )
const path = require( 'path' )
app.set( 'view engine', 'ejs' )
app.use( '/', routes )
app.set( 'views', path.join( __dirname, 'views' ) )
app.use( express.static( __dirname + '/public' ) )

app.listen( port, () => {
    console.log(`Server running on port ${ port }`)
})

//TODO include free theme link 
//https://codepen.io/colorlib/pen/rxddKy