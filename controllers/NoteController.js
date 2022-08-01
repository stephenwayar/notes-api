const Note = require('../models/Note')

exports.get_notes = async (req, res) => {
  const notes = await Note.find({})
  res.status(200).json(notes)
}

exports.get_note = async (req, res, next) => {
  const note = await Note.findById(req.params.id)
  if (note){
    res.json(note)
  }else {
    res.status(404).end()
  }
}

exports.delete_note = async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.id)
  res.status(200).end()
}

exports.update_note = async (request, response, next) => {
  const { content, important } = request.body
  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
  response.json(updatedNote)
}

exports.create_note = async (req, res, next) => {
  const body = req.body
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  const savedNote = await note.save()
  res.status(201).json(savedNote)
}