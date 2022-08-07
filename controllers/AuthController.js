const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.register_user = async (req, res) => {
  const { username, name, password } = req.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
}

exports.login_user = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  const passwordIsCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false

  if(!(user && passwordIsCorrect)){
    console.log(user, passwordIsCorrect)
    return res.status(401).json({
      success: false,
      message: "Username or password is incorrect"
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.status(200).send({
    token,
    username: user.username,
    name: user.name,
  })
}