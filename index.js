require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//routes

app.get('/', (req, res) => {
  res.send(`<h1>App root</h1>`)
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
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if(body.content === undefined){
    return(
      res
        .status(400)
        .json({
          error: 'Content missing'
        })
    )    
  }

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false
  })

  note.save().then((savedNote) => {
    res.json(savedNote)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
// handler of requests with result to errors
app.use(errorHandler)

// Heroku address: https://hidden-cove-28467.herokuapp.com/api/notes
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})