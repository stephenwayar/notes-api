require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require("./database/config")
const indexRouter = require('./routes/index')
const noteRouter = require('./routes/notes')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const middleware = require('./middlewares/error')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(indexRouter)
app.use(noteRouter)
app.use(userRouter)
app.use(authRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

// Heroku address: https://hidden-cove-28467.herokuapp.com/api/notes