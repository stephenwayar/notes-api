const Note = require('../models/Note')

exports.get_notes = async (req, res) => {
  const notes = await Note.find({})
  res.status(200).json(notes)
}

exports.get_note = (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if(note){
      res.json(note)
    }else{
      res.status(404).end()
    }
  }).catch(error => next(error))
}

exports.delete_note = (req, res, next) => {
  Note.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).end()
  }).catch(error => next(error))
}

exports.update_note = (request, response, next) => {
  const { content, important } = request.body
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  ).then(updatedNote => {
    response.json(updatedNote)
  }).catch(error => next(error))
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