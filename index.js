require('dotenv').config()
const express = require( 'express' )
const app = express()
const port = process.env.PORT || 5000
const routes = require( './routes/index' )
const path = require( 'path' )
app.set( 'view engine', 'ejs' )
app.use( '/', routes )
app.set( 'views', path.join( __dirname, 'views' ) )
const mongoose = require('mongoose')
mongoose.connect( process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true } );
const db = mongoose.connection
db.once('open', function() {
    console.log('db connected')
})



app.listen( port, () => {
    console.log(`Server running on port ${ port }`)
})