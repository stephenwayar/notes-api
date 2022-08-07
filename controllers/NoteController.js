const Note = require('../models/Note')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

exports.get_notes = async (req, res) => {
  try{
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
    res.status(200).json(notes)
  }catch(error){
    res.status(500).end()
  }
}

exports.get_note = async (req, res, next) => {
  try{
    const note = await Note.findById(req.params.id)
    if (note){
      res.json(note)
    }else {
      res.status(404).end()
    }
  }catch(error){
    next(error)
  }
}

exports.delete_note = async (req, res, next) => {
  try{
    await Note.findByIdAndDelete(req.params.id)
    res.status(200).end()
  }catch(error){
    res.status(400).json({
      suceess: false,
      message: "Note has already been deleted from server"
    })
  }
}

exports.update_note = async (request, response, next) => {
  const { content, important } = request.body
  try{
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      { content, important },
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedNote)
  }catch(error){
    next(error)
  }
}

exports.create_note = async (req, res, next) => {
  const body = req.body

  const token = getTokenFrom(req)

  if (!token) {
    logger.info('token is missing')
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  console.log(decodedToken)

  if (!decodedToken.id) {
    console.log('token present but invalid')
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id
  })

  try{
    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  }catch(error){
    next(error)
  }
}