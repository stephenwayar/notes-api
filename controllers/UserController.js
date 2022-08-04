const User = require('../models/User')

exports.get_users = async (req, res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 })
  res.json(users)
}