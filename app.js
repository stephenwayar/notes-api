require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const DB = require("./database/config")
const indexRouter = require('./routes/index')
const noteRouter = require('./routes/notes')
const middleware = require('./middlewares/middleware')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(indexRouter)
app.use(noteRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

// Heroku address: https://hidden-cove-28467.herokuapp.com/api/notes