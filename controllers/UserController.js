const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.register_user = async (req, res, next) => {
  const { username, name, password } = req.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
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

exports.get_users = async (req, res) => {
  const users = await User.find({})
  res.json(users)
}