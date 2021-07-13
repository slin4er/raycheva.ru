const express = require('express')
require('./db/mongoose')
const  patientRoute = require('./routers/patientRoute')
const cookieParser = require('cookie-parser')
const path = require('path')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname, '../public/')
const partialDirectory = path.join(__dirname, './partials')

//Setting routes and views
hbs.registerPartials(partialDirectory)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(publicDirectory))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(patientRoute)

app.listen(port,() => {
    console.log('server is up on port ' + port)
})