const express = require('express')
const Router = express.Router()
const UserController = require('../controllers/UserController')

Router.get('/api/users', UserController.get_users)

module.exports = Router