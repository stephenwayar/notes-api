require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//routes

app.get('/root', (req, res, next) => {
  res.send(`<h1>App root</h1>`)
  next()
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if(note){
      res.json(note)
    }else{
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).end()
  }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const {content, important} = request.body

  Note.findByIdAndUpdate(
    request.params.id, 
    {content, important},
    { new: true, runValidators: true, context: 'query' }
  ).then(updatedNote => {
    response.json(updatedNote)
  }).catch(error => next(error))
})

app.post('/api/notes', (req, res, next) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false
  })

  note.save().then((savedNote) => {
    res.json(savedNote)
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})

// Heroku address: https://hidden-cove-28467.herokuapp.com/api/notes