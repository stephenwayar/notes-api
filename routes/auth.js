const express = require('express')
const Router = express.Router()
const AuthController = require('../controllers/AuthController')

Router.post('/api/auth/register', AuthController.register_user)

Router.post('/api/auth/login', AuthController.login_user)

module.exports = Router